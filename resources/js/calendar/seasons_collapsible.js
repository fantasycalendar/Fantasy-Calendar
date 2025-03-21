import CollapsibleComponent from "./collapsible_component.js";
import { create_season_events } from "./calendar_presets.js";
import _ from "lodash";
import { fract, get_colors_for_season, lerp } from "./calendar_functions.js";

class SeasonsCollapsible extends CollapsibleComponent {

    collapsible_name = "SeasonsCollapsible"

    deleting = -1;

    season_name = "";

    seasons = [];
    settings = {};
    events = [];

    locations = [];
    months = [];
    leap_days = [];
    clock = {};
    eras = {};
    dynamic_data = {};

    season_length_text = ""
    season_subtext = ""
    show_equal_season_length = true;
    show_location_season_warning = false;
    presetSeasons = [];

    expandedSeasons = [];

    inboundProperties = {
        "seasons": "static_data.seasons.data",
        "settings": "static_data.seasons.global_settings",
        "events": "events",
        "locations": "static_data.seasons.locations",
        "months": "static_data.year_data.timespans",
        "leap_days": "static_data.year_data.leap_days",
        "clock": "static_data.clock",
        "eras": "static_data.eras",
        "dynamic_data": "dynamic_data",
    }

    outboundProperties = {
        "seasons": "static_data.seasons.data",
        "settings": "static_data.seasons.global_settings",
        "events": "events"
    }

    changeHandlers = {
        "seasons": this.handleSeasonsChanged,
        "settings": this.evaluateSeasonLengthText,
        "months": this.evaluateSeasonLengthText,
        "leap_days": this.evaluateSeasonLengthText,
        "locations": this.evaluateSeasonLengthText,
    }

    validators = {
        "seasons": this.validateSeasons,
        "months": this.validateSeasons
    };

    draggableRef = "seasons-sortable";
    reordering = false;

    reorderSortable(start, end) {
        const elem = this.seasons.splice(start, 1)[0];
        this.seasons.splice(end, 0, elem);
    }

    loaded() {
        this.migrateSeasonTypes();
        this.handleSeasonsChanged();
    }

    handleSeasonsChanged() {
        this.evaluateSeasonLengthText();
        this.sortSeasons();
    }

    isCollapsed(index) {
        return !this.expandedSeasons.includes(index);
    }

    toggleCollapsed(index) {
        if (this.expandedSeasons.includes(index)) {
            this.expandedSeasons.splice(this.expandedSeasons.indexOf(index), 1);
        } else {
            this.expandedSeasons.push(index)
        }
    }

    addSeason() {
        let newSeason = {
            "name": this.season_name || "New season",
            "color": [
                "#" + Math.floor(Math.random() * 16777215).toString(16).toString(),
                "#" + Math.floor(Math.random() * 16777215).toString(16).toString()
            ],
            "time": {
                "sunrise": {
                    "hour": 6,
                    "minute": 0
                },
                "sunset": {
                    "hour": 18,
                    "minute": 0
                }
            },
            "type": null,
        };

        let averageYearLength = this.$store.calendar.average_year_length;

        if (this.settings.periodic_seasons) {
            if (this.seasons.length === 0) {
                newSeason.transition_length = averageYearLength;
            } else {
                if (this.seasons.length > 0) {
                    this.seasons.forEach((season) => {
                        let totalSeasonLength = season.transition_length + season.duration;
                        if (totalSeasonLength === (averageYearLength / this.seasons.length)) {
                            season.transition_length = averageYearLength / (this.seasons.length + 1);
                        }
                    })
                }
                newSeason.transition_length = averageYearLength / (this.seasons.length + 1);
            }

            newSeason.duration = 0;
        } else {
            if (this.seasons.length === 0) {
                newSeason.timespan = 0;
                newSeason.day = 1;
            } else {
                newSeason.timespan = Math.floor(this.months.length / (this.seasons.length + 1))
                newSeason.day = 1;
            }
        }

        this.seasons.push(newSeason);

        this.season_name = "";

        this.determineAutomaticSeasonMapping();
    }

    removeSeason(index) {
        this.seasons.splice(index, 1);
        this.deleting = -1;

        this.determineAutomaticSeasonMapping();
    }

    seasonColorChanged() {
        if (!this.seasons.length) {
            return;
        }

        // Currently, we have to do this round-about way because the season data structure may not have colors defined
        // so if we turn it on before they exist, we risk having Alpine try to access data that may not exist
        // let seasonColorEnabled = !this.settings.color_enabled;

        // if (!seasonColorEnabled) {
        //     this.settings.color_enabled = false;
        // }

        let seasons = _.cloneDeep(this.seasons);

        let colors = []
        for (let index = 0; index < seasons.length; index++) {
            if (!this.settings.color_enabled) {
                delete seasons[index].color;
                continue;
            }
            colors.push([])
            if (index === 0) {
                colors[index][0] = get_colors_for_season(seasons[index].name);
                colors[index][1] = get_colors_for_season(seasons[index + 1].name);
            } else if (index === seasons.length - 1) {
                colors[index][0] = _.cloneDeep(colors[index - 1][1]);
                colors[index][1] = _.cloneDeep(colors[0][0]);
            } else {
                colors[index][0] = _.cloneDeep(colors[index - 1][1])
                colors[index][1] = get_colors_for_season(seasons[index + 1].name);
            }

            seasons[index].color = _.cloneDeep(colors[index]);
        }

        this.seasons = _.cloneDeep(seasons);

        // if (seasonColorEnabled) {
        //     this.settings.color_enabled = true;
        // }
    }

    switchPeriodicSeason() {
        let eraEndsYear = this.eras.some(era => era.settings.ends_year);

        if (eraEndsYear) {
            swal.fire({
                title: "Error!",
                text: `You have eras that end years - you cannot switch to dated seasons with year-ending eras as the dates might disappear, and that kinda defeats the whole purpose.`,
                icon: "error"
            });
            return;
        }

        let type = !this.settings.periodic_seasons ? "PERIODIC" : "DATED";
        let explanation = !this.settings.periodic_seasons
            ? "Periodic seasons are based on a fixed length of days, so leaping months and days can cause seasons to drift."
            : "Dated seasons start and end on specific dates, regardless of leaping months and days."

        swal.fire({
            title: "Are you sure?",
            html: `<p>Are you sure you want to switch to ${type} seasons? ${explanation}</p><p>Your current seasons will be deleted so you can re-create them.</p>`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "warning",
        })
            .then((result) => {
                if (result.dismiss) return;
                this.seasons = [];
                this.settings.periodic_seasons = !this.settings.periodic_seasons;
            });
    }

    createSeasonEvents() {
        new Promise((resolve, reject) => {

            let found = this.events.some(event => {
                return ['spring equinox', 'summer solstice', 'autumn equinox', 'winter solstice'].indexOf(event.name.toLowerCase()) > 1;
            });

            if (found) {
                swal.fire({
                    title: `Season events exist!`,
                    text: "You already have solstice and equinox events, are you sure you want to create another set?",
                    showCloseButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    icon: "warning"
                })
                    .then((result) => {
                        if (result.dismiss === "close" || result.dismiss === "cancel") {
                            reject();
                        } else {
                            resolve();
                        }
                    });

            } else {
                resolve();
            }

        }).then(() => {
            let html = '<strong><span style="color:#4D61B3;">Simple</span></strong> season events are based on the <strong>specific start <i>dates</i></strong> of the seasons.<br><br>';

            html += '<strong><span style="color:#84B356;">Complex</span></strong> season events are based on the <strong>longest and shortest day</strong> of the year.<br>';
            if (!this.clock.enabled) {
                html += '<span style="font-style:italic;font-size:0.8rem;">You need to <strong>enable the clock</strong> for this button to be enabled.</span><br>';
            }
            html += '<br>';
            html += '<span style="font-size:0.9rem;">Still unsure? <a href="https://helpdocs.fantasy-calendar.com/topic/seasons#Create_solstice_and_equinox_events" target="_blank">Read more on the Wiki (opens in a new window)</a>.</span><br>';

            let clockEnabled = this.clock.enabled;
            swal.fire({
                title: `Simple or Complex?`,
                html: html,
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonColor: '#4D61B3',
                cancelButtonColor: this.clock.enabled ? '#84B356' : '#999999',
                confirmButtonText: 'Simple',
                cancelButtonText: 'Complex',
                icon: "question",
                onOpen: function() {
                    $(swal.getCancelButton()).prop("disabled", !clockEnabled);
                }
            })
                .then((result) => {
                    if (result.dismiss === "close") return;
                    let complex = result.dismiss === "cancel";
                    this.events = this.events.concat(create_season_events(complex));
                });

        });
    }

    interpolateSeasonTimes(season_index) {
        let prev_id = ((season_index + this.seasons.length) - 1) % this.seasons.length
        let next_id = (season_index + 1) % this.seasons.length;

        let season_ratio;

        if (this.settings.periodic_seasons) {
            let season_length = this.seasons[prev_id].duration + this.seasons[prev_id].transition_length + this.seasons[season_index].duration + this.seasons[season_index].transition_length;
            let target = this.seasons[prev_id].duration + this.seasons[prev_id].transition_length;
            season_ratio = target / season_length;
        } else {
            let prev_season = this.seasons[prev_id];
            let curr_season = this.seasons[season_index];
            let next_season = this.seasons[next_id];

            let prev_year = 2;
            if (prev_id > season_index) {
                prev_year--;
            }

            let next_year = 2;
            if (next_id < season_index) {
                next_year++;
            }

            let prev_day = this.$store.calendar.evaluate_calendar_start(prev_year, prev_season.timespan, prev_season.day).epoch;
            let curr_day = this.$store.calendar.evaluate_calendar_start(2, curr_season.timespan, curr_season.day).epoch - prev_day;
            let next_day = this.$store.calendar.evaluate_calendar_start(next_year, next_season.timespan, next_season.day).epoch - prev_day;

            season_ratio = curr_day / next_day;
        }

        let prev_season = this.seasons[prev_id];
        let next_season = this.seasons[next_id];

        if (this.clock.enabled) {
            let prev_sunrise = Number(prev_season.time.sunrise.hour) + (Number(prev_season.time.sunrise.minute) / this.clock.minutes);
            let next_sunrise = Number(next_season.time.sunrise.hour) + (Number(next_season.time.sunrise.minute) / this.clock.minutes);

            let middle_sunrise = lerp(prev_sunrise, next_sunrise, season_ratio)

            let sunrise_h = Math.floor(middle_sunrise)
            let sunrise_m = Math.floor(fract(middle_sunrise) * this.clock.minutes)

            this.seasons[season_index].time.sunrise.hour = sunrise_h;
            this.seasons[season_index].time.sunrise.minute = sunrise_m;


            let prev_sunset = Number(prev_season.time.sunset.hour) + (Number(prev_season.time.sunset.minute) / this.clock.minutes);
            let next_sunset = Number(next_season.time.sunset.hour) + (Number(next_season.time.sunset.minute) / this.clock.minutes);

            let middle_sunset = lerp(prev_sunset, next_sunset, season_ratio)

            let sunset_h = Math.floor(middle_sunset)
            let sunset_m = Math.floor(fract(middle_sunset) * this.clock.minutes)

            this.seasons[season_index].time.sunset.hour = sunset_h;
            this.seasons[season_index].time.sunset.minute = sunset_m;
        }
    }

    evaluateSeasonLengthText() {
        let validSeasons = this.seasons.length && this.settings.periodic_seasons;

        if (this.dynamic_data.custom_location) {
            let custom_location = this.locations[this.dynamic_data.location];
            this.show_location_season_warning = !custom_location.season_based_time && validSeasons;
        }

        if (!validSeasons) return;

        let total_seasons_length = this.seasons.reduce((acc, season) => acc + season.transition_length + season.duration, 0);
        let average_year_length = this.$store.calendar.average_year_length;

        this.show_equal_season_length = average_year_length === total_seasons_length;
        this.season_length_text = `Season length: ${total_seasons_length} / ${average_year_length} (year length)`;
        this.season_subtext = this.show_equal_season_length
            ? "The season length and year length are the same, and will not drift away from each other."
            : "The season length and year length at not the same, and will diverge over time. Use with caution.";
    }

    resetSeasonTypes() {
        this.seasons.forEach(season => season.type = null);
    }

    determineAutomaticSeasonMapping() {
        if (![2, 4].includes(this.seasons.length)) {
            this.resetSeasonTypes();

            return false;
        }

        let preset_seasons = this.seasons.length === 4
            ? ['winter', 'spring', 'summer', 'autumn']
            : ['winter', 'summer'];

        let unmatched = this.seasons.filter(
            season => !preset_seasons.includes(season.name.toLowerCase())
                && season.name.toLowerCase() !== 'fall'
        );

        if (unmatched.length) {
            this.seasons.forEach(season => season.type = preset_seasons.pop());

            return;
        }


        this.seasons.forEach(season =>
            season.type = (season.name.toLowerCase() === "fall")
                ? "autumn"
                : season.name.toLowerCase()
        );
    }

    sortSeasons() {
        if (this.settings.periodic_seasons) return;
        if (this.seasons.length <= 1) return;

        let oldExpandedSeasons = _.clone(this.expandedSeasons)
            .filter(value => value < this.seasons.length)
            .reduce((acc, index) => ({
                ...acc,
                [this.seasons[index].name + this.seasons[index].timespan + this.seasons[index].day]: index
            }), {});

        this.seasons.sort((a, b) => {
            return (a.timespan === b.timespan)
                ? a.day - b.day
                : a.timespan - b.timespan;
        });

        this.expandedSeasons = this.seasons.reduce((acc, value, index) => {
            if (oldExpandedSeasons[this.seasons[index].name + this.seasons[index].timespan + this.seasons[index].day] >= 0) {
                acc.push(index);
            }

            return acc;
        }, [])
    }

    ensureMutualTypeExclusivity(selectedType, season_index) {
        let changedSeason = this.seasons[season_index];
        let conflictingSeason = this.seasons.find(season => season.type === selectedType);

        conflictingSeason.type = changedSeason.type;
        changedSeason.type = selectedType;
    }

    validateSeasons() {
        let errors = [];

        for (let season_index = 0; season_index < this.seasons.length; season_index++) {
            let season = this.seasons[season_index];
            if (this.settings.periodic_seasons) {
                if (season.transition_length === 0) {
                    errors.push({
                        path: `seasons.data.${season_index}.transition_length`,
                        message: `Season <i>${season.name}</i> can't have 0 transition length.`
                    });
                }
            } else if (season.timespan >= this.months.length) {
                errors.push({
                    path: `seasons.data.${season_index}.timespan`,
                    message: `Season <i>${season.name}</i> is now on a non-existent month!`
                });
            } else {
                if (this.months[season.timespan].interval !== 1) {
                    errors.push({
                        path: `seasons.data.${season_index}.timespan`,
                        message: `Season <i>${season.name}</i> can't be on a leaping month.`
                    });
                }

                if (this.seasons.length > 1) {
                    let clashingSeason = this.seasons[(season_index + 1) % this.seasons.length];
                    if (season.timespan === clashingSeason.timespan && season.day === clashingSeason.day) {
                        errors.push({
                            path: `seasons.data.${season_index}.timespan`,
                            message: `Season <i>${season.name}</i> and <i>${clashingSeason.name}</i> cannot be on the same month and day.`
                        });
                    }
                }
            }
        }

        return errors;
    }

    migrateSeasonTypes() {
        if (!this.settings.preset_order?.length) {
            return;
        }

        if (this.seasons.length === 2) {
            this.seasons.forEach((season, index) => season.type = [
                'winter',
                'summer',
            ][this.settings.preset_order[index]]);
        }

        if (this.seasons.length === 4) {
            this.seasons.forEach((season, index) => season.type = [
                'winter',
                'spring',
                'summer',
                'autumn',
            ][this.settings.preset_order[index]]);
        }

        this.settings.preset_order = false;
    }
}

export default () => new SeasonsCollapsible();
