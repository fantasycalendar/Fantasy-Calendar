import * as utils from "../utils.js";
import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Interval {

    constructor(interval, offset) {
        if(typeof interval === "number") interval = interval.toString();
        this.intervalString = interval;
        this.interval = Number(interval.replace("!", "").replace("+", ""));
        this.subtracts = interval.includes("!");
        this.internalIntervals = new IntervalsCollection();

        // If this interval is not 1 and does not ignore offset, normalize offset to the interval
        const ignoresOffset = interval.includes('+');
        this.offset = this.interval === 1 || ignoresOffset ? 0 : (this.interval + offset) % this.interval;
    }

    static make(data){
        const newInterval = new Interval(data.interval.toString(), data.offset);
        newInterval.subtracts = data.subtracts;
        newInterval.internalIntervals = new IntervalsCollection(data.internalIntervals.map(i => Interval.make(i)))
        return newInterval;
    }

    clone(){
        return Interval.make(this.getData())
    }

    getData(){
        return {
            interval: this.interval,
            subtracts: this.subtracts,
            offset: this.offset,
            internalIntervals: this.internalIntervals.map(i => i.getData())
        }
    }

    toJsons() {
        return JSON.stringify({
            interval: this.interval,
            subtracts: this.subtracts,
            offset: this.offset
        });
    }

    voteOnYear(year, yearZeroExist){

        let mod = year - this.offset;

        if(!yearZeroExist && year < 0){
            mod++;
        }

        if(mod % this.interval === 0){
            return this.subtracts ? 'deny' : 'allow';
        }

        return 'abstain';

    }

    clearInternalIntervals(){
        this.internalIntervals = new IntervalsCollection();
        return this;
    }

    isEqual(interval){
        return this.interval === interval.interval
            && this.offset ===  interval.offset
            && this.subtracts === interval.subtracts;
    }

    mergeInternalIntervals(intervals){
        this.internalIntervals = this.internalIntervals.concat(collect([...intervals]));
        return this;
    }

    isRedundant(){
        return this.internalIntervals
            .reject(interval => interval.willCollideWith(this))
                .length
            && !this.internalIntervals.length;
    }

    avoidDuplicates(toCheck){
        if(toCheck instanceof Interval){
            return this.avoidDuplicateCollisionsOnInternal(toCheck);
        }

        return toCheck.map(interval => this.avoidDuplicateCollisionsOnInternal(interval));
    }

    avoidDuplicateCollisionsOnInternal(suspectedCollision){

        if(!utils.lcmo_bool(this, suspectedCollision)){
            return suspectedCollision;
        }

        this.internalIntervals.cancelOutCollision(this, suspectedCollision);

        return suspectedCollision;

    }

    attributesAre(interval, offset, subtracts = false){
        return this.isEqual({ interval, offset, subtracts });
    }

    willCollideWith(interval){
        return utils.lcmo_bool(this, interval) || this.subtracts === interval.subtracts;
    }

    occurrences(year, yearZeroExists){

        if(year === 0) return 0;

        const isPositiveYear = year >= 0;

        const roundingMethod = isPositiveYear ? Math.floor : Math.ceil;

        const outerOffset = this.offset % this.interval;

        year -= outerOffset;
        if(!yearZeroExists && !isPositiveYear){
            year++;
            if (outerOffset === 0) {
                year -= this.interval;
            }
        }else if(isPositiveYear){
            if(yearZeroExists){
                year--;
            }
            if(outerOffset > 0) {
                year += this.interval;
            }
        }

        const result = roundingMethod(year / this.interval);

        return this.subtracts ? result * -1 : result;

    }

    get fraction(){
        return (this.subtracts ? -1 : 1) / this.interval;
    }

}
