import EpochsCollection from "../Collections/EpochsCollection.js";
import State from "./Processor/State.js";
import Processor from "./Processor.js";
import EpochCalculator from "./EpochCalculator.js";

export default class EpochFactory {

    forCalendar(calendar){

        this.calendar = calendar.clone();
        this.epochs = new EpochsCollection({});

        return this;

    }

    forCalendarYear(calendar) {
        this.forCalendar(calendar)
            .processYear();

        return this.epochs.whereYear(calendar.year)
            .keyBy("slug");
    }

    forCalendarMonth(calendar) {
        return this.forCalendarYear(calendar)
            .whereMonthIndexOfYear(calendar.monthId);
    }

    forCalendarDay(calendar) {
        return this.forCalendarYear(calendar)
            .getByDate(calendar.year, calendar.monthId, calendar.day);
    }

    forDate(year, month, day) {

        if(this.needsDate(year, month, day)){

            const epochs = this.generateForDate(year, month, day);

            this.rememberEpochs(epochs);

        }

        return this.getByDate(year, month, day);

    }

    forEra(era){

        const calendar = this.calendar.clone()
            .setDate(era.year)
            .startOfYear();

        return this.processor(calendar, false)
            .processUntilDate(era.year, era.month, era.day)
            .last();

    }

    forEpoch(epochNumber) {

        const epoch = this.epochs.find(epoch => epoch.epoch === epochNumber);

        if(epoch) return epoch;

        return EpochCalculator.forCalendar(this.calendar.clone()).calculate(epochNumber);

    }

    incrementDay(calendar, epoch = null){
        return this.incrementDays(1, calendar, epoch);
    }

    incrementDays(days, calendar, epoch = null) {
        epoch = epoch ?? calendar.epoch;
        return this.forEpoch(epoch.epoch + days);
    }

    processYear() {
        this.rememberEpochs(this.processor().processYear());
    }

    rememberEpochs(epochs){
        this.epochs = new EpochsCollection({
            ...this.epochs.all(),
            ...epochs.all()
        })
        return this;
    }

    needsDate(year, month, day) {
        return !this.hasDate(year, month, day);
    }

    hasDate(year, month, day) {
        return this.epochs.hasDate(year, month, day);
    }

    getByDate(year, month, day) {
        return this.epochs.getByDate(year, month, day);
    }

    generateForDate(year, month, day){
        const calendar = this.calendar
            .clone()
            .setDate(year, month, day);

        return this.processor(calendar).processUntilDate(year, month, day);
    }

    processor(calendar = null, withEras = true){

        calendar = calendar ?? this.calendar.clone().startOfYear()
        let state = new State(calendar);
        if(!withEras){
            state.disableEras();
        }

        state.initialize();

        return new Processor(calendar, state);

    }


}
