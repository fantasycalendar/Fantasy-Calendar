import CollapsibleComponent from "./collapsible_component.js";

class ErasCollapsible extends CollapsibleComponent {

    collapsible_name = "ErasCollapsible"

    era_name = "";
    deleting = -1;

    eras = [];
    season_settings = {};
    dynamic_data = {};
    event_categories = [];

    inboundProperties = {
        "eras": "static_data.eras",
        "season_settings": "static_data.seasons.global_settings",
        "dynamic_data": "dynamic_data",
        "months": "static_data.year_data.timespans",
        "event_categories": "event_categories"
    }

    outboundProperties = {
        "eras": "static_data.eras"
    }

    changeHandlers = {
        "eras": this.handleChangedEras,
    }

    validators = {
        "eras": this.validateEraDate,
        "months": this.validateEraDate
    };

    addEra() {
        this.eras.push({
            "name": this.era_name || "New Era",
            "formatting": 'Year {{year}}',
            "description": "",
            "settings": {
                "show_as_event": false,
                "use_custom_format": false,
                "starting_era": false,
                "event_category_id": -1,
                "ends_year": false,
                "restart": false
            },
            "date": {
                "year": this.dynamic_data.year,
                "timespan": this.dynamic_data.timespan,
                "day": this.dynamic_data.day,
                "epoch": this.dynamic_data.epoch
            }
        });

        this.era_name = "";
    }

    removeEra(era_index) {
        this.eras.splice(era_index, 1);
        this.deleting = -1;
    }

    getMonthsInYear(year) {
        // TODO: make this refresh when the month intervals are changed - change listener?
        return this.$store.calendar.get_timespans_in_year(year)
            .map(({ result, reason }, index) => ({
                name: this.months[index].name + (!result ? ` (${reason})` : ""),
                disabled: !result
            }));
    }

    getDaysForMonth(year, month_index) {
        return this.$store.calendar
            .get_days_in_timespan_in_year(year, month_index)
            .map((day, index) =>  `Day ${index + 1}` + (day.text ? ` - ${day.text}` : ""));
    }

    updateEraEpoch(era) {
        if (era.settings.starting_era) return;
        era.date.epoch = this.$store.calendar.evaluate_calendar_start(era.date.year, era.date.timespan, era.date.day).epoch;
    }

    canBeStartingEra(index_to_check) {
        return !this.eras
            .filter((era, index) => index != index_to_check)
            .some(era => era.settings.starting_era);
    }

    handleChangedEras() {
        for (let era of this.eras) {
            if (!era.settings.use_custom_format) {
                if (era.settings.restart) {
                    era.formatting = 'Era year {{era_year}} (year {{year}}) - {{era_name}}';
                } else {
                    era.formatting = 'Year {{era_year}} - {{era_name}}';
                }
            }
        }

        this.eras.sort((a, b) => {
            if (a.settings.starting_era) {
                return -1;
            }
            return a.date.epoch - b.date.epoch;
        });
    }

    previewEraDate(era) {
        this.$store.calendar.set_preview_date(
            era.date.year,
            era.date.timespan,
            era.date.day,
        );
    }

    validateEraDate() {
        let errors = [];
        for (let [index, era] of this.eras.entries()) {
            let does_month_appear = this.$store.calendar.does_timespan_appear(era.date.year, era.date.timespan);
            if (!does_month_appear.result) {
                if (does_month_appear.reason === "era ended") {
                    errors.push({ path: `eras.${index}.date.timespan`, message: `The date the era "${era.name}" is meant to start on doesn't exist on year ${era.date.year} due to another era ending the year prematurely.` });
                } else {
                    errors.push({ path: `eras.${index}.date.timespan`, message: `The date the era "${era.name}" is meant to start on doesn't exist on year ${era.date.year} due to the month leaping.` });
                }
                continue;
            }
            let does_day_appear = this.$store.calendar.does_day_appear(era.date.year, era.date.timespan, era.date.day);
            if (!does_day_appear.result) {
                errors.push({ path: `eras.${index}.date.timespan`, message: `The date the era "${era.name}" is meant to start on doesn't exist on year ${era.date.year} due to another era ending the year prematurely.` });
            }
        }
        return errors;
    }
}

export default () => new ErasCollapsible();
