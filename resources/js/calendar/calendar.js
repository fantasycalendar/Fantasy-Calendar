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

    renderStructure() {
        let rendered_timespans = [];

        this.year_structure.timespans.forEach((timespan) => {
            let weekdays = [];
            if(timespan.type === 'intercalary') {
                weekdays = Array(timespan.length).fill('');
            } else {
                weekdays = timespan.weekdays ?? this.year_structure.global_week
            }

            let rowCount = Math.ceil(timespan.length / weekdays.length);
            let days = Array(timespan.length)
                .fill(null)
                .map((day, index) => {
                    let intercalaryDay = ((index + 1) > timespan.length);

                    return {
                        number: intercalaryDay ? null : index + 1,
                        name: weekdays[index % weekdays.length],
                        type: intercalaryDay ? "overflow" : "day",
                        events: [],
                    };
                });

            let rows = [];
            for (let i = 0; i < days.length; i += weekdays.length) {
                rows.push(days.slice(i, i + weekdays.length));
            }

            let short_weekdays = weekdays.map((weekday) => weekday.substring(0, 3));

            rendered_timespans.push({
                name: timespan.name,
                show_title: true,
                weekdays,
                short_weekdays,
                show_weekdays: true,
                rows: rows,
                rowCount,
            })
        })

        return rendered_timespans;
    }
}
