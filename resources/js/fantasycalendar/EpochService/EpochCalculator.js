import EpochFactory from "./EpochFactory.js";

export default class EpochCalculator{

    constructor(calendar) {
        this.calendar = calendar;
    }

    static forCalendar(calendar){
        return new this(calendar);
    }

    calculate(epoch) {

        this.averageYearLength = this.calendar.averageYearLength;

        this.targetMetric = epoch;

        let guessYear = Math.floor(epoch / this.averageYearLength) + this.calendar.yearZeroExists + 1;

        const year = this.resolveYear(guessYear);

        this.calendar.setDate(year);

        const epochFactory = new EpochFactory();

        const yearStartEpoch = epochFactory.forCalendarYear(this.calendar).first();
        const diff = epoch - yearStartEpoch.epoch;

        return epochFactory.incrementDays(diff, this.calendar, yearStartEpoch);
    }

    resolveYear(guessYear){

        const calendar = this.calendar.clone();

        let lowerGuess;
        let higherGuess;

        do {
            calendar.setDate(guessYear);

            lowerGuess = InitialStateWithEras.generateFor(calendar).get('epoch');
            higherGuess = InitialStateWithEras.generateFor(calendar.addYear()).get('epoch');

            guessYear += this.refinedEstimationDistance(lowerGuess, higherGuess);

        } while(lowerGuess > this.targetMetric || higherGuess <= this.targetMetric);

        return guessYear;

    }

    refinedEstimationDistance(lowerGuess, higherGuess){

        if(lowerGuess <= this.targetMetric && higherGuess > this.targetMetric) return 0;

        let distance = Math.abs(lowerGuess - this.targetMetric);
        let offByYears = distance / this.averageYearLength;

        if(offByYears <= 1){
            return 1;
        }

        if(higherGuess <= this.targetMetric){
            return Math.floor(offByYears);
        }

        return -Math.ceil(offByYears);

    }

}
