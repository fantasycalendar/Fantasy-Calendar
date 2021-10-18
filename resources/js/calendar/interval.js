class SuperArray extends Array{

    reverse(){
        super.reverse();
        return this;
    }

    unshift(elem){
        super.unshift(elem);
        return this;
    }

    push(elem){
        super.push(elem);
        return this;
    }

    sort(callback){
        super.sort(callback);
        return this;
    }

    reject(callback){
        return this.filter(elem => !callback(elem));
    }

}

class IntervalsCollection extends SuperArray{

    unitTest(){

        const unitTests = [
            {
                interval: "400,!100,4",
                offset: 0,
                truth: '["{\\"interval\\":400,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":100,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "!1000,746,!373,!5,4",
                offset: 0,
                truth: '["{\\"interval\\":373000,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":7460,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1492,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":746,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":20,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":0}"]'
            },
            {
                interval: "!2203,!400,+!100,4,!2",
                offset: 1,
                truth: '["{\\"interval\\":881200,\\"subtracts\\":false,\\"offset\\":1}","{\\"interval\\":8812,\\"subtracts\\":true,\\"offset\\":1}","{\\"interval\\":400,\\"subtracts\\":true,\\"offset\\":1}","{\\"interval\\":4,\\"subtracts\\":false,\\"offset\\":1}"]'
            },
            {
                interval: "233,!144,+89,55,!34,+21,13,+!8,!5,3,2",
                offset: 0,
                truth: '["{\\"interval\\":254074700880,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":36296385840,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":19544207760,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14945570640,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10586445870,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4619540016,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3849616680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2854771920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2135081520,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1149659280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1090449360,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":962404170,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":814341990,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":769923336,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":659934288,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":504116470,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":407824560,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":355349232,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":311366055,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":296124360,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":271737648,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":226448040,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":219597840,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":183315080,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":167927760,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":164237040,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":155778480,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":118948830,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":83880720,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":74031090,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":64144080,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":59224872,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":51904944,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45828770,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":45435390,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45289608,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":43254120,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":38819664,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":36663016,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":28306005,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":23989680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":23951235,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":20902896,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":19826352,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":17419080,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":16521960,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":14826955,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14101160,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12917520,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12252240,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":10813530,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10783240,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9163440,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9149910,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8650824,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8087430,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":7414992,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":5664230,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4934160,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4130490,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":4043715,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3992688,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3525290,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3498495,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3495030,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3483816,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3327240,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3304392,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3053232,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2986128,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2832336,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2820232,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2695810,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2544360,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2177385,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2163590,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2156648,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2059720,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1845360,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1750320,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1617486,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1525104,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1336335,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1270920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1166256,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1140535,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":971880,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":942480,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":831810,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":829480,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":808743,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":786760,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":720720,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":705058,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":704880,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":665448,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":622110,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":539162,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":514930,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":510510,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":508872,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":436176,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":411944,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":318045,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":317730,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":311055,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":269581,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":269115,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":254184,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":234864,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":222768,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":207370,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":196690,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":195720,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":194376,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":185640,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":166608,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":166595,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":165896,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":158440,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":157352,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":124422,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":121485,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":121160,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":102960,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":102795,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":90870,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":89712,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":74760,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":63635,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":62211,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":60520,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":55440,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":46410,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":46280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":45435,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":41474,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39610,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":39270,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39144,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":37128,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":34710,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":31824,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":31688,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":30290,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":24465,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":24310,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":24232,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":20737,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":18174,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":17355,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":17136,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":15130,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":15015,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":14952,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":14280,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":13104,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":12816,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12815,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":12104,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":11570,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":10920,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":9345,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9320,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9256,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":9087,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":8840,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":7922,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":7920,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6990,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6942,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6058,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":4895,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3570,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3560,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3495,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3471,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":3029,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3026,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2856,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2670,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2330,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2314,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2210,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":2184,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1872,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1864,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1768,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1398,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1365,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1335,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":1157,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1155,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":1008,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":890,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":840,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":715,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":712,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":699,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":680,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":534,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":520,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":466,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":390,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":267,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":233,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":195,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":178,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":170,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":168,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":136,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":130,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":105,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":104,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":89,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":78,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":55,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":40,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":39,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":34,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":30,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":26,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":21,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":21,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":15,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":13,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":10,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":8,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":6,\\"subtracts\\":true,\\"offset\\":0}","{\\"interval\\":3,\\"subtracts\\":false,\\"offset\\":0}","{\\"interval\\":2,\\"subtracts\\":false,\\"offset\\":0}"]'
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

        for(const unitTest of unitTests){

            let intervals = IntervalsCollection.fromString(unitTest.interval, unitTest.offset);

            let string = intervals.normalize().toJsons();

            if(unitTest.truth !== string) throw new Error(`${unitTest.interval} failed the test`)

        }

        console.log("All tests passed!")

    }

    static fromString(intervalString, offset){

        let items = IntervalsCollection.splitFromString(intervalString, offset);

        if(items.length === 0){
            throw new Error("An invalid value was provided for the interval of a leap day.")
        }

        let done = false;
        return new IntervalsCollection(...items)
            .reverse()
            .filter(interval => {
                if(!interval.subtracts) done = true;
                return done || !interval.subtracts;
            })
            .reverse();

    }

    static splitFromString(intervalString, offset){
        return intervalString.split(',').map(interval => new Interval(interval, offset));
    }

    toJsons(){
        return JSON.stringify(this.map(interval => interval.toJsons()));
    }

    clone(){
        return new IntervalsCollection(...this.map(interval => interval.clone()));
    }

    bumpsYearZero(){
        return this.reject(interval => interval.offset)
            .sort((a, b) => b.interval - a.interval)
            .reject(interval => interval.subtracts)?.[0] ?? false;
    }

    avoidDuplicateCollisions(intervals){

        intervals = intervals.clone();

        if(intervals.length === 1){
            return intervals;
        }

        const first = intervals.shift();

        let suspectedCollisions = intervals.avoidDuplicateCollisions(intervals);

        return suspectedCollisions.map(interval => {

            if(!interval.subtracts) {
                first.avoidDuplicates(interval);
            }

            interval.internalIntervals = first.avoidDuplicates(interval.internalIntervals);

            return interval;

        }).unshift(first);

    }

    normalize(){
        return (this.length === 1)
            ? this
            : this.cleanUp()
                .avoidDuplicateCollisions(this)
                .flattenIntervals();
    }

    fillDescendants(){
        return this.map((interval, index) => {
            return interval.mergeInternalIntervals(this.slice(index+1));
        })
    }

    cleanUp(){
        return this.clone()
            .fillDescendants()
            .reject(interval => interval.isRedundant())
            .map(interval => interval.clearInternalIntervals())
    }

    flattenIntervals(){
        return this.map(interval => interval.internalIntervals)
            .push(this.reject(interval => interval.subtracts))
            .flat()
            .map(interval => interval.clearInternalIntervals())
            .sort((a, b) => b.interval - a.interval);
    }

    cancelOutCollision(examinedInterval, knownCollision) {
        const collidingInterval = lcmo_quick(examinedInterval, knownCollision);
        const foundInterval = this.find((interval) => {
            return interval.attributesAre(collidingInterval.interval, collidingInterval.offset, knownCollision.subtracts)
        });

        if (foundInterval) {
            const foundKey = this.indexOf(foundInterval);
            this.splice(foundKey, 1);
        } else {
            collidingInterval.subtracts = !knownCollision.subtracts;
            this.push(collidingInterval)
        }
    }

    occurrences(year, yearZeroExists){
        return this.reduce((sum, interval) => sum + interval.occurrences(year, yearZeroExists), 0)
            + this.addOneForYearZero(year, yearZeroExists);
    }

    addOneForYearZero(year, yearZeroExists) {
        return year > 0 && yearZeroExists && this.bumpsYearZero() ? 1 : 0;
    }

}

class Interval {

    constructor(interval, offset) {
        this.intervalString = interval;
        this.interval = Number(interval.replace("!", "").replace("+", ""));
        this.subtracts = interval.includes("!");
        this.internalIntervals = new IntervalsCollection();

        // If this interval is not 1 and does not ignore offset, normalize offset to the interval
        const ignoresOffset = interval.includes('+');
        this.offset = this.interval === 1 || ignoresOffset ? 0 : (this.interval + offset) % this.interval;

        this.bumpsYearZero = (this.offset === 0 && !this.subtracts);
    }

    static make(data){
        const newInterval = new Interval(data.interval.toString(), data.offset);
        newInterval.subtracts = data.subtracts;
        newInterval.internalIntervals = new IntervalsCollection(...data.internalIntervals.map(i => Interval.make(i)))
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

    voteOnYear(year){

        let mod = year - this.offset;

        if(year < 0) {
            mod++;
        }

        if(mod % this.interval === 0){
            return this.subtracts ? 'deny' : 'allow';
        }

        return 'abstain'

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
        this.internalIntervals = this.internalIntervals.concat(intervals);
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
        return toCheck.map((interval) => {
            return this.avoidDuplicateCollisionsOnInternal(interval);
        });
    }

    avoidDuplicateCollisionsOnInternal(suspectedCollision){

        if(!lcmo_bool_quick(this, suspectedCollision)){
            return suspectedCollision;
        }

        this.internalIntervals.cancelOutCollision(this, suspectedCollision);

        return suspectedCollision;

    }

    attributesAre(interval, offset, subtracts = false){
        return this.isEqual({ interval, offset, subtracts });
    }

    willCollideWith(interval){
        return lcmo_bool_quick(this, interval)
            || this.subtracts === interval.subtracts;
    }

    occurrences(year, yearZeroExists){

        if(year === 0) return 0;

        if(year > 0){

            year = this.offset > 0 ? year - this.offset + this.interval : year;

            year = yearZeroExists ? year - 1 : year;

            const result = year / this.interval;

            return this.subtracts ? Math.floor(result) * -1 : Math.floor(result);

        }

        const outerOffset = this.offset % this.interval;

        let result = (year - (outerOffset-1)) / this.interval;

        if(outerOffset === 0){
            result--;
        }

        return this.subtracts ? Math.ceil(result) * -1 : Math.ceil(result);

    }

    fraction(){
        return (this.subtracts ? -1 : 1) / this.interval;
    }

}


/**
 * Greatest common divisor is the largest positive integer that divides each of the integers.
 *
 * @param  {int}    x   The first number
 * @param  {int}    y   The second number
 * @return {int}        The greatest common divisor
 */
function gcd(x, y){
    return x ? gcd(y % x, x) : y;
}


/**
 * Least Common Multiple is the smallest positive integer that is divisible by both x and y.
 *
 * @param  {int}    x   The first number
 * @param  {int}    y   The second number
 * @return {int}        The least common multiple
 */
function lcm(x, y){
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

/**
 * Least Common Multiple Offset (bool) will calculate whether two intervals with individual offsets will ever collide
 *
 * @param  {int}    x   The first interval
 * @param  {int}    y   The second interval
 * @param  {int}    a   The first interval's offset
 * @param  {int}    b   The second interval's offset
 * @return {bool}       Whether these two intervals will ever collide
 */
function lcmo_bool(x, y, a, b){
    return Math.abs(a - b) === 0 || Math.abs(a - b) % gcd(x, y) === 0;
}

/**
 * Least Common Multiple Offset will calculate whether two intervals with individual offsets will ever collide,
 * and return an object containing the starting point of their repitition and how often they repeat
 *
 * @param  {int}    x   The first interval
 * @param  {int}    y   The second interval
 * @param  {int}    a   The first interval's offset
 * @param  {int}    b   The second interval's offset
 * @return {object}		An object with the interval's  starting point and LCM
 */
function lcmo(x, y, a, b){

    // If they never repeat, return false
    if(!lcmo_bool(x, y, a, b)){
        return false;
    }

    // Store the respective interval's starting points
    x_start = (Math.abs(x + a) % x)
    y_start = (Math.abs(y + b) % y)

    // If the starts aren't the same, then we need to search for the first instance the intervals' starting points line up
    if(x_start !== y_start){

        // Until the starting points line up, keep increasing them until they do
        while(x_start !== y_start){

            while(x_start < y_start){
                x_start += x;
            }

            while(y_start < x_start){
                y_start += y;
            }

        }
    }

    return {
        "offset": x_start,
        "interval": lcm(x, y)
    }

}

function lcmo_bool_quick(a, b){
    return lcmo_bool(a.interval, b.interval, a.offset, b.offset);
}

function lcmo_quick(a, b){
    const interval = lcmo(a.interval, b.interval, a.offset, b.offset);
    return new Interval(interval.interval.toString(), interval.offset);
}

module.exports = {
    IntervalsCollection,
    Interval
}
