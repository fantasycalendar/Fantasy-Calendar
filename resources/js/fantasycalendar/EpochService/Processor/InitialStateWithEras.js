import InitialState from "./InitialState.js";

export default class InitialStateWithEras extends InitialState {

    generateInitialProperties() {
        return (this.hasApplicableEras())
            ? this.takeErasIntoAccount()
            : super.generateInitialProperties();
    }

    takeErasIntoAccount() {

        const values = super.generateInitialProperties().collect();
        const eraSubtractables = this.getSubtractables();

        values.put('timespanCounts', this._calculateTimespanCounts(values, eraSubtractables));
        values.put('epoch', values.get('epoch') - eraSubtractables.sum('epoch'));
        values.put('historicalIntercalaryCount', values.get('historicalIntercalaryCount') - eraSubtractables.sum('historicalIntercalaryCount'));
        values.put('numberTimespans', values.get('numberTimespans') - eraSubtractables.sum('numberTimespans'));
        values.put('weekdayIndex', this.determineWeekdayIndex(values.get('epoch'), values.sum('historicalIntercalaryCount')));

        return values;

    }

    _calculateTimespanCounts(state, eraSubtractables) {
        return state.get('timespanCounts').map(function(timespanCount, timespanIndex) {
            return timespanCount - eraSubtractables.sum(function(era){
                return era.get('timespanCounts').get(timespanIndex);
            });
        });
    }

    getSubtractables()
    {
        return this.calendar.eras
            .filter(era => era.endsYear)
            .filter(era => era.beforeYear(this.year))
            .map(era => era.getEpochSubtractables(this.calendar));
    }

    hasApplicableEras()
    {
        return this.calendar.eras
            .filter(era => era.endsYear)
            .filter(era => era.beforeYear(this.year))
            .count();
    }

}
