import EpochsCollection from "../Collections/EpochsCollection.js";

export default class Processor {

    constructor(calendar, state) {
        this.state = state;
        this.epochs = new EpochsCollection();
        this.calendar = calendar;
    }

    processYear() {
        return this.processUntilDate(this.calendar.year + 1)
                   .filter(epoch => epoch.yearIs(this.calendar.year));
    }

    processUntil(untilCondition) {

        while(!untilCondition(this)){
            this.stepForward();
        }

        this.epochs.insertFromArray(this.state.toArray());

        return this.getEpochs();

    }

    processUntilDate(year, month = 0, day = 1) {

        return this.processUntil((processor) => {

            if(processor.state.year >= year && processor.state.monthIndexOfYear > month) {
                throw new Error(`Tried to generate past ${year}-${month}-${day} - Was an invalid date provided?`)
            }

            return processor.state.year === year
                && processor.state.monthIndexOfYear === month
                && processor.state.day === day;
        });

    }

    getEpochs() {
        return this.epochs.keyBy('slug');
    }

    stepForward() {
        this.epochs.insertFromArray(this.state.toArray());

        this.state.stepFoward();
    }


}
