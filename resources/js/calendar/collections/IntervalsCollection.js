import Interval from "@/calendar/interval";
import {lcmo} from "@/helpers";
import { Collection } from 'collect.js'

const intervalCache = {

    _cache: {},

    get(intervals, offset){
        return this._cache[`${intervals}-${offset}`];
    },

    set(intervalsCollection, intervals, offset, cyclic){
        this._cache[`${intervals}-${offset}-${cyclic ? "yes" : "no"}`] = intervalsCollection;
        return intervalsCollection;
    }

}

export default class IntervalsCollection extends Collection{

    static fromIntervalString(intervalString, offset) {

        const cachedIntervalsCollection = intervalCache.get(intervalString, offset);
        if (cachedIntervalsCollection) return cachedIntervalsCollection;

        const intervals = intervalString.toString()
            .split(',')
            .map(interval => new Interval(interval, offset));

        if (intervals.length === 0) {
            throw new Error("An invalid value was provided for the interval of a leap day.")
        }

        const intervalsCollection = new IntervalsCollection(intervals)
            .reverse()
            .skipWhile(interval => interval.subtracts)
            .reverse()
            .normalize();

        return intervalCache.set(intervalsCollection, intervalString, offset, false);
    }

    static fromCycleString(cycleString, length) {

        length = Math.max(length, Math.min(...cycleString.split(",").map(n => Number(n))));

        const cachedIntervalsCollection = intervalCache.get(cycleString, length);
        if (cachedIntervalsCollection) return cachedIntervalsCollection;

        const intervals = cycleString.toString()
            .split(',')
            .map(offset => new Interval(length, offset));

        const intervalsCollection = new IntervalsCollection(intervals).normalize();

        return intervalCache.set(intervalsCollection, cycleString, length, true);

    }

    static make(object) {

        if (object.cyclic_interval) {
            return this.fromCycleString(object.interval, object.offset);
        }

        return this.fromIntervalString(object.interval, object.offset);

    }

    toJson() {
        return JSON.stringify(this.map(interval => interval.toJson()));
    }

    clone() {
        return new IntervalsCollection(this.map(interval => interval.clone()));
    }

    avoidDuplicateCollisions(intervals) {

        intervals = intervals.clone();

        if (intervals.count() === 1) {
            return intervals;
        }

        const first = intervals.shift();

        let suspectedCollisions = intervals.avoidDuplicateCollisions(intervals);

        return suspectedCollisions.map(interval => {

            if (!interval.subtracts) {
                first.avoidDuplicates(interval);
            }

            interval.internalIntervals = first.avoidDuplicates(interval.internalIntervals);

            return interval;

        }).prepend(first);

    }

    normalize() {
        return (this.count() === 1)
            ? this
            : this.cleanUp()
                .avoidDuplicateCollisions(this)
                .flattenIntervals();
    }

    fillDescendants() {
        return this.map((interval, index) => {
            return interval.mergeInternalIntervals(this.slice(index + 1));
        })
    }

    cleanUp() {
        return this.clone()
            .fillDescendants()
            .reject(interval => interval.isRedundant())
            .map(interval => interval.clearInternalIntervals())
    }

    flattenIntervals() {
        return this.map(interval => interval.internalIntervals)
            .push(this.reject(interval => interval.subtracts))
            .flatten(1)
            .map(interval => interval.clearInternalIntervals())
            .sortByDesc("interval");
    }

    cancelOutCollision(examinedInterval, knownCollision) {
        const collidingInterval = lcmo(examinedInterval, knownCollision);
        const foundInterval = this.first((interval) => {
            return interval.attributesAre(collidingInterval.interval, collidingInterval.offset, knownCollision.subtracts)
        });

        if (foundInterval) {
            const foundKey = Array.from(this).indexOf(foundInterval);
            this.splice(foundKey, 1);
        } else {
            collidingInterval.subtracts = !knownCollision.subtracts;
            this.push(collidingInterval)
        }
    }

    get totalFraction() {
        return this.sum('fraction');
    }

    intersectsYear(year, yearZeroExists) {
        // We need to un-normalize the year as otherwise 0 month occurrences results in leap day appearing
        year = year >= 0 && !yearZeroExists
            ? year + 1
            : year;

        const votes = this.map(interval => interval.voteOnYear(year, yearZeroExists));

        return !!votes.reduce((acc, item) => {
            switch (item) {
                case "abstain":
                    return acc;
                case "allow":
                    return acc + 1;
                case "deny":
                    return acc - 1;
                default:
                    console.log("BRUH WHAT");
                    return acc;
            }
        }, 0);
    }

    occurrences(year, yearZeroExists) {
        return this.sum((interval) => interval.occurrences(year, yearZeroExists))
            + this.addOneForYearZero(year, yearZeroExists);
    }

    addOneForYearZero(year, yearZeroExists) {
        return year > 0 && yearZeroExists && this.bumpsYearZero() ? 1 : 0;
    }

    bumpsYearZero() {
        let foundInterval = this.reject(interval => interval.offset).sortByDesc('interval').shift();

        if(foundInterval) return !foundInterval.subtracts;

        return false;
    }

}
