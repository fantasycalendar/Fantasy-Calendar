import EpochFactory from "./EpochService/EpochFactory.js";

export default class Era {

    constructor(attributes) {
        this.name = attributes['name'];
        this.description = attributes['description'];
        this.formatting = attributes['formatting'];
        this.settings = attributes['settings'];
        this.date = attributes['date'];
        this.year = this.date.year;
        this.month = this.date.timespan;
        this.day = this.date.day;
    }

    /**
     * Determines the data that is missing from the era ending the year early, and calculates
     * the differences from a normal year so that the state of the epoch is kept accurate
     *
     * @param calendar
     * @return Collection
     */
    getEpochSubtractables(calendar){

        const eraEpoch = new EpochFactory().forEra(this);

        const eraFreeCalendar = calendar.clone()
            .setDate(this.year+1)
            .startOfYear();

        const eraFreeEpoch = InitialState.generateFor(eraFreeCalendar);

        const timespanCounts = eraFreeEpoch.get('timespanCounts').map((timespanCount, index) => {
            return timespanCount - eraEpoch.timespanCounts.get(index);
        });

        return collect({
            'timespanCounts': timespanCounts,
            'epoch': eraFreeEpoch.get('epoch') - eraEpoch.epoch - 1,
            'historicalIntercalaryCount': eraFreeEpoch.get('historicalIntercalaryCount') - eraEpoch.historicalIntercalaryCount,
            'numberTimespans': eraFreeEpoch.get('numberTimespans') - eraEpoch.numberTimespans
        });

    }

    get restartsYearCount(){
        return this.getSetting("restart", false) !== false;
    }

    beforeYear(year){
        return year > this.year;
    }

    beforeYearInclusive(year){
        return year >= this.year;
    }

    get endsYear() {
        return this.getSetting("ends_year", false) !== false;
    }

    endsGivenYear(year) {
        return this.endsYear && year === this.year;
    }

    getSetting(name, fallback = false) {
        return this.settings[name] ?? fallback;
    }


}
