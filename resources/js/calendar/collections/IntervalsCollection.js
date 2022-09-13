import Interval from "@/calendar/interval";
import _ from "lodash";
import {lcmo} from "@/helpers";

export default class IntervalsCollection {
    constructor(intervalString = null, offset = null) {
        if(!intervalString || !offset) {
            this.items = [];
            return this;
        }

        this.items = this.splitFromString(intervalString, offset);
        this.items = this.removeUselessSubtracts();
    }

    splitFromString(intervalString, offset) {
        return intervalString
            .split(',')
            .map((item) => new Interval(item, offset));
    }

    bumpsYearZero() {
        let first_valid_interval = [...this.items]
            .filter((interval) => !interval.offset)
            .sort((interval) => interval.interval)[0] ?? null;

        return (first_valid_interval)
            ? !first_valid_interval.subtracts
            : false;
    }

    normalize() {
        return (this.items.length === 1)
            ? this
            : this.cleanUp()
                  .avoidDuplicateCollisions(this.items)
                  .flattenIntervals()
    }

    avoidDuplicateCollisions(intervals, topLevel = false) {
        intervals = [...intervals.items];

        if(intervals.length === 1) {
            return intervals;
        }

        let first = intervals.shift();

        let suspected_collisions = this.avoidDuplicateCollisions(intervals);

        let items = suspected_collisions.map((interval) => {
            if(interval.subtracts) {
                first.avoidDuplicates(interval);
            }

            interval.internalIntervals = first.avoidDuplicates(interval.internalIntervals);

            return interval;
        }).unshift(first);

        if(!topLevel) {
            return items;
        }

        this.items = items;

        return this;
    }

    unshift(item) {
        this.items.unshift(item);

        return this;
    }

    shift() {
        return this.items.shift();
    }

    cleanUp() {
        return _.clone(this)
            .fillDescendants()
            .filter((interval) => !interval.isRedundant())
            .map((interval) => interval.clearInternalIntervals())
    }

    filter(closure) {
        let copy =  _.clone(this);

        copy.items = copy.items.filter(closure);

        return copy;
    }

    map(closure) {
        let copy = _.clone(this);

        copy.items = copy.items.map(closure);

        return copy;
    }

    sum(closure) {
        return this.items.reduce((a, b) => {
            return a + closure(b);
        }, 0);
    }

    merge(intervals) {
        this.items = [
            ...this.items,
            ...intervals
        ];

        return this;
    }

    fillDescendants() {
        this.items = this.items.map((interval, index) => interval.mergeInternalIntervals(
            this.items.slice(index + 1)
        ));

        return this;
    }

    flattenIntervals() {
        return [...this.items.map((interval) => interval.internalIntervals), ...this.items.filter((interval) => !interval.subtracts)]
            .flat()
            .map((interval) => interval.clearInternalIntervals())
            .sort((a, b) => (a.interval > b.interval) ? 1 : -1);
    }

    cancelOutCollision(examined_interval, known_collision) {
        let colliding_interval = lcmo(examined_interval, known_collision);
        let found_interval = this.items.find(
            (interval) => interval.attributesAre(colliding_interval.interval, colliding_interval.offset, known_collision.subtracts)
        ) ?? false;

        if(found_interval) {
            this.items.splice(found_interval, 1);
        } else {
            colliding_interval.subtractes = !known_collision.subtracts;

            this.items.push(colliding_interval);
        }
    }

    occurrences(year, year_zero_exists) {
        return this.addOneForYearZero(year, year_zero_exists)
            + this.items.reduce((sum, interval) => {
                return sum + interval.occurrences(year, year_zero_exists);
            }, 0);
    }

    addOneForYearZero(year, year_zero_exists) {
        return (year > 0 && year_zero_exists && this.bumpsYearZero())
            ? 1
            : 0;
    }

    // TODO: Make this do something.
    removeUselessSubtracts() {
        return this.items;
    }
}
