import Timespan from "@/calendar/timespan";
import Leapday from "@/calendar/leapday";

export default class Calendar {
    constructor(calendar_attributes) {
        this.calendar_attributes = calendar_attributes;

        this.name = calendar_attributes.name;
        let static_data = JSON.parse(calendar_attributes.static_data);

        this.clock = static_data.clock;
        this.cycles = static_data.cycles;
        this.eras = static_data.eras;
        this.moons = static_data.moons;
        this.seasons = static_data.seasons;
        this.settings = static_data.settings;
        this.year_structure = static_data.year_data;

        this.dynamic_data = JSON.parse(calendar_attributes.dynamic_data);
        this.user = calendar_attributes.user;
        this.last_dynamic_change = calendar_attributes.last_dynamic_change;
        this.last_static_change = calendar_attributes.last_static_change;
        this.parent_id = calendar_attributes.parent_id;
        this.advancement_enabled = calendar_attributes.advancement_enabled;

        this.leap_days = this.buildLeapdays();
        this.timespans = this.buildTimespans();
    };

    setting(name) {
        return this.settings[name];
    }

    leapDaysFor(timespan) {
        return this.leap_days.filter((leap_day) => {
            return leap_day.timespanIs(timespan);
        });
    }

    renderStructure() {
        return this.timespans
            .filter(timespan => timespan.intersectsYear(this.currentYear()))
            .map(timespan => timespan.structureForYear(this.currentYear()));
    }

    buildTimespans() {
        return this.year_structure.timespans.map((attributes) => {
            return new Timespan(attributes, this);
        });
    }

    buildLeapdays() {
        return this.year_structure.leap_days.map((attributes) => {
            return new Leapday(attributes, this);
        });
    }

    currentYear() {
        return this.dynamic_data.year;
    }
}
