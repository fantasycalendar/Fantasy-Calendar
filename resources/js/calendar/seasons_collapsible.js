import CollapsibleComponent from "./collapsible_component.js";
import { create_season_events } from "./calendar_presets.js";

class SeasonsCollapsible extends CollapsibleComponent {

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
        "seasons": this.evaluateSeasonLengthText,
        "settings": this.evaluateSeasonLengthText,
        "months": this.evaluateSeasonLengthText,
        "leap_days": this.evaluateSeasonLengthText,
        "locations": this.evaluateSeasonLengthText,
    }

    loaded(){
        this.evaluateSeasonLengthText();
    }

    addSeason() {
        let newSeason = {
            "name": this.season_name,
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
            }
        };

        let averageYearLength = this.$state.calendar.average_year_length;

        if(this.settings.periodic_seasons){
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
    }

    switchPeriodicSeason(){

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

    createSeasonEvents(){

        new Promise((resolve, reject) => {

            let found = false;
            for (let i in this.events) {
                if (['spring equinox', 'summer solstice', 'autumn equinox', 'winter solstice'].indexOf(this.events[i].name.toLowerCase()) > -1) {
                    found = true;
                }
            }

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

            var html = '<strong><span style="color:#4D61B3;">Simple</span></strong> season events are based on the <strong>specific start dates</strong> of the seasons.<br><br>';

            html += '<strong><span style="color:#84B356;">Complex</span></strong> season events are based on the <strong>longest and shortest day</strong> of the year.<br>';
            if (!this.clock.enabled) {
                html += '<span style="font-style:italic;font-size:0.8rem;">You need to <strong>enable the clock</strong> for this button to be enabled.</span><br>';
            }
            html += '<br>';
            html += '<span style="font-size:0.9rem;">Still unsure? <a href="https://helpdocs.fantasy-calendar.com/topic/seasons#Create_solstice_and_equinox_events" target="_blank">Read more on the Wiki (opens in a new window)</a>.</span><br>';

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
                        $(swal.getCancelButton()).prop("disabled", !this.clock.enabled);
                    }
                })
                .then((result) => {

                    if (result.dismiss === "close") return;

                    let complex = result.dismiss === "cancel";

                    this.events = this.events.concat(create_season_events(complex));


                });

        });
    }

    evaluateSeasonLengthText(){

        let validSeasons = this.seasons.length && this.settings.periodic_seasons;

        if (this.dynamic_data.custom_location) {
            let custom_location = this.locations[this.dynamic_data.location];
            this.show_location_season_warning = !custom_location.season_based_time && validSeasons;
        }

        if(!validSeasons) return;

        let total_seasons_length = this.seasons.reduce(season => season.transition_length + season.duration);
        let average_year_length = this.$store.calendar.average_year_length;

        this.show_equal_season_length = average_year_length === total_seasons_length;
        this.season_length_text = `Season length: ${total_seasons_length} / ${average_year_length} (year length)`;
        this.season_subtext = this.show_equal_season_length
            ? "The season length and year length are the same, and will not drift away from each other."
            : "The season length and year length at not the same, and will diverge over time. Use with caution.";

    }

}

export default () => new SeasonsCollapsible();
