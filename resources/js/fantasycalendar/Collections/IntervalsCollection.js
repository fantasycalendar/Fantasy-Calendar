import * as utils from "../../utils.js";
import Interval from "../Interval.js";
import { Collection } from 'collect.js'

const intervalCache = {

    _cache: {},

    get(intervals, offset){
        return this._cache[`${intervals}-${offset}`];
    },

    set(intervalsCollection, intervals, offset){
        this._cache[`${intervals}-${offset}`] = intervalsCollection;
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

        return intervalCache.set(intervalsCollection, intervalString, offset);
    }

    static fromCycleString(cycleString, length) {

        const cachedIntervalsCollection = intervalCache.get(cycleString, length);
        if (cachedIntervalsCollection) return cachedIntervalsCollection;

        const intervals = cycleString.toString()
            .split(',')
            .map(offset => new Interval(length, offset));

        const intervalsCollection = new IntervalsCollection(intervals).normalize();

        return intervalCache.set(intervalsCollection, cycleString, length);

    }

    static make(object) {

        if (object.cycleLength) {
            return this.fromCycleString(object.cycleIntervals, object.cycleLength);
        }

        return this.fromIntervalString(object.interval, object.offset);

    }

    toJsons() {
        return JSON.stringify(this.map(interval => interval.toJsons()));
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
        const collidingInterval = utils.lcmo(examinedInterval, knownCollision);
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

        const votes = this.map(interval => interval.voteOnYear(year));

        for (let vote of votes) {
            if (vote === 'allow') return true;
            if (vote === 'deny') return false;
        }

        return false;
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

    // Temporary
    static unitTest() {

        const unitTests = [
            {
                interval: "!1000,746,!373,!5,4",
                offset: 0,
                truth: '["{\\"interval\\":373000,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":7460,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1492,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":746,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":20,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "400,!100,4",
                offset: 0,
                truth: '["{\\"interval\\":400,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":100,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "!2203,!400,+!100,4,!2",
                offset: 1,
                truth: '["{\\"interval\\":881200,\\"subtracts\\":false,\\"offset\\":1}","{\\"interval\\":8812,\\"subtracts\\":true,\\"offset\\":1}","{\\"interval\\":400,\\"subtracts\\":true,\\"offset\\":1}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":1}"]'
            },
            {
                interval: "233,!144,+89,55,!34,+21,13,+!8,!5,3,2",
                offset: 0,
                truth: '["{\\"interval\\":254074700880,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":36296385840,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":19544207760,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14945570640,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10586445870,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4619540016,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3849616680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2854771920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2135081520,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1149659280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1090449360,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":962404170,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":814341990,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":769923336,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":659934288,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":504116470,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":407824560,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":355349232,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":311366055,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":296124360,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":271737648,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":226448040,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":219597840,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":183315080,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":167927760,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":164237040,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":155778480,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":118948830,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":83880720,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":74031090,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":64144080,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":59224872,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":51904944,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45828770,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":45435390,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45289608,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":43254120,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":38819664,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":36663016,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":28306005,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":23989680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":23951235,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":20902896,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":19826352,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":17419080,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":16521960,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":14826955,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14101160,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12917520,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12252240,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":10813530,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10783240,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9163440,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9149910,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8650824,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8087430,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":7414992,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":5664230,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4934160,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4130490,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4043715,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3992688,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3525290,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3498495,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3495030,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3483816,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3327240,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3304392,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3053232,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2986128,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2832336,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2820232,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2695810,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2544360,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2177385,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2163590,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2156648,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2059720,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1845360,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1750320,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1617486,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1525104,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1336335,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1270920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1166256,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1140535,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":971880,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":942480,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":831810,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":829480,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":808743,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":786760,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":720720,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":705058,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":704880,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":665448,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":622110,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":539162,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":514930,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":510510,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":508872,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":436176,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":411944,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":318045,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":317730,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":311055,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":269581,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":269115,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":254184,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":234864,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":222768,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":207370,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":196690,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":195720,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":194376,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":185640,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":166608,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":166595,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":165896,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":158440,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":157352,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":124422,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":121485,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":121160,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":102960,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":102795,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":90870,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":89712,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":74760,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":63635,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":62211,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":60520,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":55440,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":46410,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":46280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45435,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":41474,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39610,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":39270,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39144,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":37128,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":34710,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":31824,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":31688,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":30290,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":24465,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":24310,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":24232,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":20737,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":18174,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":17355,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":17136,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":15130,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":15015,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":14952,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":13104,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":12816,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12815,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12104,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":11570,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10920,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":9345,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9320,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9256,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9087,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":8840,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":7922,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":7920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6990,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6942,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6058,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":4895,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3570,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3560,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3495,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3471,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3029,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3026,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2856,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2670,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2330,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2314,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2210,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2184,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1872,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1864,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1768,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1398,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1365,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1335,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1157,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1155,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1008,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":890,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":840,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":715,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":712,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":699,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":534,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":520,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":466,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":390,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":267,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":233,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":195,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":178,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":170,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":168,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":136,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":130,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":105,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":104,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":89,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":78,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":55,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":40,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":34,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":30,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":26,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":21,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":21,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":15,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":13,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":10,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "!300,!180,150,90",
                offset: 3,
                truth: '["{\\"interval\\":900,\\"subtracts\\":false,\\"offset\\":3}","{\\"interval\\":450,\\"subtracts\\":true,\\"offset\\":3}","{\\"interval\\":300,\\"subtracts\\":true,\\"offset\\":3}","{\\"interval\\":180,\\"subtracts\\":true,\\"offset\\":3}","{\\"interval\\":150,\\"subtracts\\":false,\\"offset\\":3}","{\\"interval\\":90,\\"subtracts\\":false,\\"offset\\":3}"]'
            },
            {
                interval: "!165105,!2500,9,2",
                offset: 50,
                truth: '["{\\"interval\\":82552500,\\"subtracts\\":false,\\"offset\\":50}","{\\"interval\\":165105,\\"subtracts\\":true,\\"offset\\":50}","{\\"interval\\":2500,\\"subtracts\\":true,\\"offset\\":50}","{\\"interval\\":18,\\"subtracts\\":true,\\"offset\\":14}","{\\"interval\\":9,\\"subtracts\\":false,\\"offset\\":5}","{\\"interval\\":2,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "!100,15,10,4",
                offset: 15,
                truth: '["{\\"interval\\":100,\\"subtracts\\":true,\\"offset\\":15}","{\\"interval\\":30,\\"subtracts\\":true,\\"offset\\":15}","{\\"interval\\":20,\\"subtracts\\":true,\\"offset\\":15}","{\\"interval\\":15,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":10,\\"subtracts\\":false,\\"offset\\":5}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":3}"]'
            },
            {
                interval: "+50,4",
                offset: 4,
                truth: '["{\\"interval\\":100,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":50,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":0}"]'
            }
        ]

        for (const unitTest of unitTests) {

            let intervals = IntervalsCollection.fromIntervalString(unitTest.interval, unitTest.offset);

            let string = intervals.toJsons();

            if (unitTest.truth !== string){
                console.log(unitTest.truth)
                console.log(string)
                throw new Error(`${unitTest.interval} failed the parity test`)
            }

        }

        console.log("Parity achieved!")
    }

}
