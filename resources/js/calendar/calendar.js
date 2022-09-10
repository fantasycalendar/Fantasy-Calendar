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
    };

    output() {
        console.log('here we are in ' + this.name);

        console.log(this.year_structure);

        return this.calendar_attributes;
    }
}
