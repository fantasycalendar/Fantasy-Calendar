import { ordinal_suffix_of, get_cycle } from "./calendar/calendar_functions";

export default () => ({
    static_data: undefined,
    eras: undefined,
    dynamic_data: undefined,
    preview_date: undefined,
    epoch_data: undefined,
    show_current_month: false,

    update() {
        this.static_data = this.$store.calendar.static_data;
        this.cycles = this.static_data.cycles;
        this.eras = this.static_data.eras;
        this.dynamic_data = this.$store.calendar.dynamic_data;
        this.preview_date = this.$store.calendar.preview_date;
        this.epoch_data = this.$store.calendar.evaluated_static_data.epoch_data;
        this.show_current_month = this.$store.calendar.setting('show_current_month');
    },

    get year_header_text() {
        if (!this.static_data) return "";

        const currentEra = this.get_epoch_data()?.era ?? -1;

        if (currentEra !== -1) {
            let era = this.eras[currentEra];

            if (!this.static_data.settings.hide_eras || Perms.player_at_least('co-owner')) {

                let format = era.settings.restart
                    ? `Era year {{era_year}} (year {{year}}) - {{era_name}}`
                    : `Year {{year}} - {{era_name}}`;

                if (era.settings.use_custom_format && era.formatting) {
                    format = era.formatting.replace(/{{/g, '{{{').replace(/}}/g, '}}}');
                }

                return this.render_year_mustache(format, era.name)

            }
        }

        return this.render_year_mustache(`Year {{year}}`);
    },

    render_year_mustache(inFormat, eraName = false) {
        const epochData = this.get_epoch_data();

        // TODO: FIXIT
        let mustacheData = {
            "year": epochData?.year ?? "{PLACEHOLDER year}",
            "nth_year": ordinal_suffix_of(epochData?.year ?? "{PLACEHOLDER year}"),
            "abs_year": Math.abs(epochData?.year ?? "{PLACEHOLDER year}"),
            "abs_nth_year": ordinal_suffix_of(Math.abs(epochData?.year ?? "{PLACEHOLDER year}")),
            "era_year": epochData?.era_year ?? "{PLACEHOLDER era_year}",
            "era_nth_year": ordinal_suffix_of(epochData?.era_year ?? "{PLACEHOLDER era_year}"),
            "abs_era_nth_year": ordinal_suffix_of(Math.abs(epochData?.era_year ?? "{PLACEHOLDER era_year}"))
        };

        if (eraName) {
            mustacheData["era_name"] = eraName;
        }

        return Mustache.render(
            inFormat,
            mustacheData
        );
    },

    get cycle_header_text() {
        if (!this.cycles?.data?.length) return "";
        if (!this.get_epoch_data()) return "";

        return Mustache.render(
            this.cycles.format.replace(/{{/g, '{{{').replace(/}}/g, '}}}'),
            get_cycle(this.static_data, this.get_epoch_data()).text
        );
    },

    get_epoch_data() {
        return this.epoch_data?.[this.epoch];
    },

    get epoch() {
        return this.preview_date.epoch !== this.dynamic_data.epoch && !this.preview_date.follow
            ? this.preview_date.epoch
            : this.dynamic_data.epoch;
    },

    get is_selected_date_ahead() {
        return !this.preview_date?.follow && this.preview_date?.epoch > this.dynamic_data?.epoch;
    },

    get is_selected_date_behind() {
        return !this.preview_date?.follow && this.preview_date?.epoch < this.dynamic_data?.epoch;
    },

    select_next_year() {
        this.$store.calendar.increment_selected_year(false);
    },

    select_previous_year() {
        this.$store.calendar.decrement_selected_year(false);
    },

    select_next_month() {
        this.$store.calendar.increment_selected_month(false);
    },

    select_previous_month() {
        this.$store.calendar.decrement_selected_month(false);
    },

    go_to_current_date() {
        this.$store.calendar.set_selected_date_active(false);
    }
})
