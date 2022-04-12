import IntervalsCollection from "./Collections/IntervalsCollection.js";

export default class Calendar{

    constructor(hash, name, static_data, dynamic_data, events, event_categories, link_data) {
        this.hash = hash;
        this.name = name;
        this.static_data = static_data;
        this.dynamic_data = dynamic_data;
        this.preview_date = clone(dynamic_data);
        this.preview_date.follow = true;
        this.events = events;
        this.event_categories = event_categories;
        this.link_data = link_data;
        this.cacheCalendarData();
    }

    cacheCalendarData(){
        this.old_name = this.name;
        this.old_static_data = clone(this.static_data);
        this.old_dynamic_data = clone(this.dynamic_data);
        this.old_preview_date = clone(this.preview_date);
        this.old_events = clone(this.events);
        this.old_event_categories = clone(this.event_categories);
    }

    hasDataChanged(){
        return this.name !== this.old_name ||
               JSON.stringify(this.static_data) !== JSON.stringify(this.old_static_data) ||
               JSON.stringify(this.dynamic_data) !== JSON.stringify(this.old_dynamic_data) ||
               JSON.stringify(this.events) !== JSON.stringify(this.old_events) ||
               JSON.stringify(this.event_categories) !== JSON.stringify(this.old_event_categories);
    }

    render(){
        rebuild_calendar();
    }

    goToPreviewDate(){

        this.preview_date.follow = false;

        this.preview_date.epoch = this.getEpochForDate(this.preview_date.year, this.preview_date.timespan, this.preview_date.day).epoch;
        let rerender = this.preview_date.year !== this.old_preview_date.year || (this.preview_date.timespan !== this.old_preview_date.timespan && window.calendar.static_data.settings.show_current_month);
        this.old_preview_date = clone(this.preview_date);

        if(rerender){
            return this.render();
        }

        window.dispatchEvent(new CustomEvent('update-epochs', {detail: {
            current_epoch: this.dynamic_data.epoch,
            preview_epoch: this.preview_date.follow ? this.dynamic_data.epoch : this.preview_date.epoch
        }}));
    }

    goToCurrentDate(){
        this.preview_date = clone(this.dynamic_data);
        this.preview_date.follow = true;
        this.calendarChanged();
    }

    calendarChanged(forceRerender = false) {

        this.dynamic_data.epoch = this.getEpochForDate(this.dynamic_data.year, this.dynamic_data.timespan, this.dynamic_data.day).epoch;

        if (this.preview_date.follow) {
            this.preview_date = clone(this.dynamic_data);
            this.preview_date.follow = true;
        }

        const rerender = (this.dynamic_data.year !== this.old_dynamic_data.year)
            || (this.dynamic_data.timespan !== this.old_dynamic_data.timespan && this.static_data.settings.show_current_month);

        this.old_dynamic_data = clone(this.dynamic_data);

        if(rerender || forceRerender){
            return this.render();
        }

        window.dispatchEvent(new CustomEvent('update-epochs', {detail: {
            current_epoch: this.dynamic_data.epoch,
            preview_epoch: this.preview_date.follow ? this.dynamic_data.epoch : this.preview_date.epoch
        }}));
    }

    getEpochForDate(year, timespan = 0, day = 1){
        return evaluate_calendar_start(
            this.static_data,
            convert_year(this.static_data, year),
            timespan,
            day
        );
    }

    formatYearNumber(year){
        return !this.static_data.settings.year_zero_exists && year >= 0
            ? year
            : year-1;
    }

    getTimespansInYear(year){
        return this.static_data.year_data.timespans.map((timespan, index) => {
            timespan.index = index;
            return timespan;
        }).filter(timespan => {
            return IntervalsCollection.make(timespan).intersectsYear(year);
        });
    }

    getDaysForTimespanInYear(year, timespan_index){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const timespanOccurrences = IntervalsCollection.make(timespan).occurrences(year, this.static_data.settings.year_zero_exists);

        const numDays = this.getLeapDaysForTimespan(timespan_index).reduce((acc, leap_day) => {
            return acc + IntervalsCollection.make(leap_day).intersectsYear(timespanOccurrences);
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `${num+1}`);

    }

    getNonLeapingDaysInTimespan(timespan_index){

        const timespan = this.static_data.year_data.timespans[timespan_index];

        const numDays = this.getLeapDaysForTimespan(timespan_index).reduce((acc, leap_day) => {
            return acc + (leap_day.interval === "1")
        }, timespan.length);

        return Array.from(Array(numDays).keys()).map(num => `Day ${num+1}`);

    }

    getLeapDaysForTimespan(index){
        return this.static_data.year_data.leap_days
            .filter(leap_day => leap_day.timespan === index || leap_day.timespan === index.toString());
    }

    getAverageYearLength(){

        let avg_length = 0;

        for(let timespan of this.static_data.year_data.timespans){
            avg_length += timespan.length * IntervalsCollection.make(timespan).totalFraction;
        }

        for(let leap_day of this.static_data.year_data.leap_days){
            avg_length += IntervalsCollection.make(leap_day).totalFraction;
        }

        return precisionRound(avg_length, 10);

    }

    getAverageMonthLength(){
        return precisionRound(this.getAverageYearLength() / this.static_data.year_data.timespans.length, 10);
    }

    getErrors(){

        const errors = [];

        if(this.name === ""){
            errors.push("The calendar name cannot be empty.")
        }

        if(this.static_data.year_data.timespans.length !== 0){
            for(let era_i = 0; era_i < this.static_data.eras.length; era_i++){
                let era = this.static_data.eras[era_i];
                if(this.static_data.year_data.timespans[era.date.timespan]){
                    let appears = does_timespan_appear(this.static_data, convert_year(this.static_data, era.date.year), era.date.timespan);
                    if(!appears.result){
                        if(appears.reason === 'era ended'){
                            errors.push(`Era <i>${era.name}</i> is on a date that doesn't exist due to a previous era ending the year. Please move it to another year.`);
                        }else{
                            errors.push(`Era <i>${era.name}</i> is currently on a month that is leaping on that year. Please change its year or move it to another month.`);
                        }
                    }
                }else{
                    errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
                }
            }

            for(let era_i = 0; era_i < this.static_data.eras.length-1; era_i++){
                let curr = this.static_data.eras[era_i];
                let next = this.static_data.eras[era_i+1];
                if(!curr.settings.starting_era && !next.settings.starting_era){
                    if(curr.year === next.date.year && curr.settings.ends_year && next.settings.ends_year){
                        errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
                    }
                    if(curr.date.year === next.date.year && curr.date.timespan === next.date.timespan && curr.date.day === next.date.day){
                        errors.push(`Eras <i>${this.static_data.eras[era_i].name}</i> and <i>${this.static_data.eras[era_i+1].name}</i> both share the same date. One has to come after another.`);
                    }
                }
            }
        }

        if(this.static_data.year_data.timespans.length !== 0){

            if(this.static_data.seasons.global_settings.periodic_seasons){
                for(let season_i = 0; season_i < this.static_data.seasons.data.length; season_i++){
                    let season = this.static_data.seasons.data[season_i];
                    if(this.static_data.seasons.global_settings.periodic_seasons){
                        if(season.transition_length === 0){
                            errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
                        }
                    }else{
                        if(this.static_data.year_data.timespans[season.timespan].interval !== 1){
                            errors.push(`Season <i>${season.name}</i> can't be on a leaping month.`);
                        }
                    }
                }
            }else{

                for(let season_i = 0; season_i < this.static_data.seasons.data.length-1; season_i++){
                    let curr_season = this.static_data.seasons.data[season_i];
                    let next_season = this.static_data.seasons.data[season_i+1];
                    if(curr_season.timespan === next_season.timespan && curr_season.day === next_season.day){
                        errors.push(`Season <i>${curr_season.name}</i> and <i>${next_season.name}</i> cannot be on the same month and day.`);
                    }
                }
            }
        }

        if(this.static_data.clock.enabled){

            if(this.static_data.clock.hours === 0){
                errors.push(`If the clock is enabled, you need to have more than 0 hours per day.`);
            }

            if(this.static_data.clock.minutes === 0){
                errors.push(`If the clock is enabled, you need to have more than 0 minutes per hour.`);
            }

        }

        return errors;

    }

    get_category(search) {

        if(this.event_categories.length === 0){
            return {id: -1};
        }

        const results = isNaN(search) ? this.event_categories.filter(function(element) {
            return slugify(element.name) === search;
        }) :  this.event_categories.filter(function(element) {
            return element.id === search;
        });

        if(results.length < 1) {
            return {id: -1};
        }

        return results[0];
    }

    getSeasonInterpolation(season_index){

        let prev_index = (season_index-1)%this.static_data.seasons.data.length
        if(prev_index < 0) prev_index += this.static_data.seasons.data.length;
        const prev_season = this.static_data.seasons.data[prev_index];

        const curr_season = this.static_data.seasons.data[season_index];

        const next_index = (season_index+1)%this.static_data.seasons.data.length;
        const next_season = this.static_data.seasons.data[next_index];

        if(this.static_data.seasons.global_settings.periodic_seasons) {

            const season_length = prev_season.duration + prev_season.transition_length + curr_season.duration + curr_season.transition_length;
            const target = prev_season.duration + prev_season.transition_length;

            return {
                prev_index,
                next_index,
                interpolationPercentage: target / season_length
            };

        }

        const prev_year = prev_index > season_index ? 1 : 2;
        const next_year = next_index < season_index ? 3 : 2;

        const prev_day = window.calendar.getEpochForDate(prev_year, prev_season.timespan, prev_season.day);
        const curr_day = window.calendar.getEpochForDate(2, curr_season.timespan, curr_season.day)-prev_day;
        const next_day = window.calendar.getEpochForDate(next_year, next_season.timespan, next_season.day)-prev_day;

        return {
            prev_index,
            next_index,
            interpolationPercentage: curr_day/next_day
        };

    }

}
