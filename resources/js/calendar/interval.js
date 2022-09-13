import IntervalsCollection from "@/calendar/collections/IntervalsCollection";
import {lcm, lcmo, lcmo_bool} from "@/helpers";
import _, {isString} from "lodash";

export default class Interval {
    constructor(interval, offset) {
        this.interval_string = interval;
        this.interval = parseInt(interval.replace('!', ''));
        this.offset = offset;
        this.subtracts = interval.includes('!');

        let ignores_offset = interval.includes('+');
        this.offset = (this.interval === 1 || ignores_offset)
            ? 0
            : ((this.interval + offset) % this.interval);

        this.bumps_year_zero = (this.offset === 0 && !this.subtracts);

        this.internal_intervals = new IntervalsCollection();
    }

    voteOnYear(year) {
        let mod = year - this.offset;

        if(year < 0) {
            mod++;
        }

        if(mod % this.interval === 0) {
            return this.subtracts ? 'deny' : 'allow';
        }

        return 'abstain';
    }

    isEqual(interval) {
        return this.interval === interval;
    }

    occurrences(year, year_zero_exists) {
        if(year === 0) {
            return 0;
        }

        if(year > 0) {
            year = this.offset > 0 ? year - this.offset + this.interval : year;

            year = year_zero_exists ? year - 1 : year;

            let result = year / this.interval;

            return this.subtracts ? Math.floor(result) * -1 : Math.floor(result);
        }

        let outer_offset = this.offset % this.interval;

        let result = (year - (outer_offset-1)) / this.interval;

        if(outer_offset === 0){
            result--;
        }

        return this.subtracts ? Math.ceil(result) * -1 : Math.ceil(result);
    }

    clearInternalIntervals() {
        this.internal_intervals = new IntervalsCollection(this.interval_string, this.offset);
        return this;
    }

    mergeInternalIntervals(intervals) {
        this.internal_intervals.merge(intervals);

        return this;
    }

    isRedundant() {
        return this.internal_intervals
            .filter((interval) => !interval.willCollideWith(this))
            .length
        && !this.internal_intervals.length;
    }

    willCollideWith(interval) {
        return lcmo_bool(this, interval) || this.subtracts === interval.subtracts;
    }

    avoidDuplicates(to_check) {
        if(to_check instanceof Interval) {
            return this.avoidDuplicateCollisionsOnInternal(to_check);
        }

        return to_check.map((interval) => {
            return this.avoidDuplicateCollisionsOnInternal(interval);
        });
    }

    fraction() {
        return ((this.subtracts) ? -1 : 1) / this.interval;
    }

    avoidDuplicateCollisionsOnInternal(suspected_collision) {
        if(!lcmo_bool(this, suspected_collision)) {
            return suspected_collision;
        }

        this.internal_intervals.cancelOutCollision(this, suspected_collision);

        return suspected_collision;
    }

    attributesAre(interval, offset, subtracts) {
        return (this.interval === interval
            && this.offset === offset
            && this.subtracts === subtracts
        )
    }

    clone() {
        return _.clone(this);
    }

    matchesCollisionWith(internalInterval) {
        let colliding_interval = lcmo(this, internalInterval);

        return this.attributesAre(
            colliding_interval.interval,
            colliding_interval.offset,
            internalInterval.subtracts
        )
    }
}
