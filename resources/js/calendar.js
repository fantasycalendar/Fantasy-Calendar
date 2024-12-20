// TODO: ABSOLUTELY rewrite this
export default class Calendar {

    update(incomingChanges) {
        let structuralKeys = [
            "static_data.year_data",
        ];
        let structureChanged = false;

        for (const [key, value] of Object.entries(incomingChanges)) {
            _.set(this, key, _.cloneDeep(value));

            console.log(key);
            structureChanged = structureChanged || structuralKeys.some(structuralKey => key.startsWith(structuralKey));
        }

        // First of many rules, I'm sure.
        this.static_data.year_data.overflow = this.static_data.year_data.overflow
            && !this.static_data.year_data.leap_days.some(leapDay => leapDay.adds_week_day)
            && !this.static_data.year_data.timespans.some(month => month?.week?.length);

        return structureChanged;
    }

    set static_data(value) {
        window.static_data = value;
    }

    set event_categories(value) {
        window.event_categories = value;

        window.event_categories
            .forEach(category => {
                window.events
                    .filter(event => event.event_category_id == category.id)
                    .forEach(event => {
                        event.settings = {
                            ...event.settings,
                            ...category.event_settings,
                        };
                    })
            })
    }

    set advancement(value) {
        window.advancement = value;
    }

    get static_data() {
        return window.static_data;
    }

    get dynamic_data() {
        return window.dynamic_data;
    }

    get events() {
        return window.events;
    }

    get event_categories() {
        return window.event_categories;
    }

    get id() {
        return window.calendar_id;
    }

    get advancement() {
        return window.advancement;
    }
}
