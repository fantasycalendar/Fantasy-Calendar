export default () => ({
    overflow_weekdays: false,
    new_weekday_name: '',
    weekdays: [],
    show_custom_week_warning: false,
    load(static_data) {
        this.refreshWeekdays(static_data);
        this.customWeekWarningCheck(static_data);
    },
    refreshWeekdays(static_data) {
        this.weekdays = static_data.year_data.global_week;
    },
    customWeekWarningCheck(static_data) {
        this.show_custom_week_warning = static_data.year_data.timespans.some(timespan => timespan.week !== undefined)
            || static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day);
    }
});
