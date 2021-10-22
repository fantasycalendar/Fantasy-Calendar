import * as utils from "../../utils.js";

export default {

    addMinutes(minutes = 1) {

        if(!this.clockEnabled) return this;

        const hoursAdded = (this.dynamic_data['minute'] + minutes) / this.clock['minutes'];
        let daysAdded = (this.dynamic_data['hour'] + hoursAdded) / this.clock['hours'];

        let currentHour = (daysAdded % 1) * this.clock['hours'];

        if(currentHour < 0) {
            currentHour += this.clock['hours'];
        }

        let currentMinute = Math.round((currentHour % 1) * this.clock['minutes']);

        currentHour = Math.floor(currentHour);

        if(currentMinute === this.clock['minutes']) {
            currentHour++;
            currentMinute = 0;
            if(currentHour === this.clock['hours']) {
                daysAdded++;
                currentHour = 0;
            }
        }

        this.dynamic({
            'hour': currentHour,
            'minute': currentMinute
        })

        return this.addDays(Math.floor(daysAdded));

    },

    addHours(hours = 1) {

        if(!this.clockEnabled) return this;

        const minutes = hours * this.clock['minutes'];

        return this.addMinutes(minutes);

    },

    addDays(days = 1) {
        return (days === 0)
            ? this
            : this.setDateFromEpoch(EpochFactory.incrementDays(days, this));
    },

    addMonths(months = 1) {

        let targetMonth = this.monthIndex + months;
        if(this.months[targetMonth]){
            return this.setDate(this.year, this.months[targetMonth].id);
        }

        let targetMonthCount = this.epoch.numberTimespans + months;
        let guessYear = Math.floor(targetMonthCount / this.averageMonthsCount) + this.yearZeroExists + 1;
        let foundTargetMonth = false;

        do {
            const guessYearMonthCounts = EpochFactory.forCalendarYear(this.clone().setDate(guessYear))
                .keyBy('numberTimespans')
                .map(epoch => {
                    return { [Object.keys(epoch)[0]]: Object.values(epoch)[0].monthId };
                })
                .unique();

            if(!guessYearMonthCounts.find(epoch => Number(Object.keys(epoch)[0]) === guessYearMonthCounts)) {

                const lower = Math.min(...guessYearMonthCounts.map(epoch => Number(Object.keys(epoch)[0])));

                if(guessYearMonthCounts < lower) {
                    guessYear--;
                    continue;
                }

                guessYear++
                continue;
            }

            foundTargetMonth = guessYearMonthCounts
                .find(epoch => Number(Object.keys(epoch)[0]) === guessYearMonthCounts)[guessYearMonthCounts];

        } while(foundTargetMonth === false);

        return this.setDate(guessYear, foundTargetMonth)

    },

    addYears(years = 1) {
        return this.setDate(this.year + years);
    },

    setDate(targetYear, monthId, day) {
        const targetMonth = monthId ?? this.dynamic('timespan');
        const targetDay = day ?? this.dynamic('day');
        const targetHour = hour ?? this.dynamic('hour');
        const targetMinute = minute ?? this.dynamic('minute');

        this.dynamic('year', this.findNearestValidYear(targetYear));
        this.dynamic('timespan', this.findNearestValidMonth(targetMonth));
        this.dynamic('day', this.findNearestValidDay(targetDay));
        this.dynamic('hour', targetHour);
        this.dynamic('minute', targetMinute);

        return this;
    },

    findNearestValidYear(targetYear) {

        if(this.year === targetYear) return this.year;

        const yearSearchDirection = targetYear < this.year
            ? -1
            : 1;

        while(!this.yearIsValid(targetYear)){
            targetYear += yearSearchDirection;
        }

        return targetYear;

    },

    findNearestValidMonth(monthId){

        if(this.months.hasId(monthId)) return monthId;

        let foundValidMonth = false;
        let targetMonthId = this.monthId;
        let monthSearchDirection = targetMonthId === 0
            ? 1
            : -1;

        do {

            targetMonthId += monthSearchDirection;

            if((targetMonthId -1) > this.timespans.length) throw new Error("OH NOES");

            if(targetMonthId){
                monthSearchDirection = 1;
                targetMonthId = this.monthId + 1;
            }

            if(!this.months.hasId(targetMonthId)){
                continue;
            }

            foundValidMonth = true;

        } while(foundValidMonth === false);

        return targetMonthId;

    },

    findNearestValidDay(day){
        return utils.clamp(day, 1, this.month.daysInYear.length);
    },

    setDateFromEpoch(epoch){
        return this.setDate(epoch.year, epoch.monthId, epoch.day);
    }
};
