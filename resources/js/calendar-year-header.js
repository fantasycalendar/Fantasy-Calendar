import { ordinal_suffix_of, get_cycle } from "./calendar/calendar_functions";

export default () => ({
    static_data: undefined,
    eras: undefined,
    dynamic_data: undefined,
    preview_date: undefined,
    epoch_data: undefined,
    year_element: undefined,
    cycle_element: undefined,

    update: function(static_data, dynamic_data, preview_date, epoch_data) {

        this.static_data = static_data;
        this.cycles = this.static_data.cycles;
        this.eras = this.static_data.eras;
        this.dynamic_data = dynamic_data;
        this.preview_date = preview_date;
        this.epoch_data = epoch_data;

        if (!this.year_element) {
            this.year_element = $('#top_follower_content').find(".year");
        }

        if (!this.cycle_element) {
            this.cycle_element = $('#top_follower_content').find(".cycle");
        }

        this.updateYearText();
        this.updateCycleText();

    },

    updateYearText() {
        this.year_element.text(this.getYearText());
    },

    getYearText() {

        const currentEra = this.getCurrentEra();

        if (currentEra !== -1) {

            let era = this.eras[currentEra];

            if (!this.static_data.settings.hide_eras || Perms.player_at_least('co-owner')) {

                let format = era.settings.restart
                    ? `Era year {{era_year}} (year {{year}}) - {{era_name}}`
                    : `Year {{year}} - {{era_name}}`;

                if (era.settings.use_custom_format && era.formatting) {
                    format = era.formatting.replace(/{{/g, '{{{').replace(/}}/g, '}}}');
                }

                return this.renderYearMustache(format, era.name)

            }

        }

        return this.renderYearMustache(`Year {{year}}`);

    },

    renderYearMustache(inFormat, eraName = false) {

        const epochData = this.getEpochData();

        let mustacheData = {
            "year": epochData.year,
            "nth_year": ordinal_suffix_of(epochData.year),
            "abs_year": Math.abs(epochData.year),
            "abs_nth_year": ordinal_suffix_of(Math.abs(epochData.year)),
            "era_year": epochData.era_year,
            "era_nth_year": ordinal_suffix_of(epochData.era_year),
            "abs_era_nth_year": ordinal_suffix_of(Math.abs(epochData.era_year))
        };

        if (eraName) {
            mustacheData["era_name"] = eraName;
        }

        return Mustache.render(
            inFormat,
            mustacheData
        );

    },

    getCurrentEra() {
        return this.getEpochData().era ?? -1;
    },

    updateCycleText() {

        const cycleText = this.getCycleText();

        this.cycle_element
            .html(sanitizeHtml(cycleText))
            .removeClass('hidden')
            .toggleClass('smaller', cycleText.includes("<br>"));

    },

    getCycleText() {

        if (!this.cycles.data.length) return "";

        return Mustache.render(
            this.cycles.format.replace(/{{/g, '{{{').replace(/}}/g, '}}}'),
            this.getCycle()
        );

    },

    getCycle() {
        return get_cycle(this.static_data, this.getEpochData()).text;
    },

    getEpochData() {
        return this.epoch_data?.[this.epoch];
    },

    get epoch() {
        return this.preview_date.epoch !== this.dynamic_data.epoch && !this.preview_date.follow
            ? this.preview_date.epoch
            : this.dynamic_data.epoch;
    },

})
