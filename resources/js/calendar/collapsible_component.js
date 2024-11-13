export default class CollapsibleComponent {
    initialized = false;
    loads = {};
    watchers = {};

    load(static_data) {
        if (!static_data) {
            return
        }

        for (let [localKey, globalKey] of Object.entries(this.loads)) {
            this[localKey] = _.get(static_data, globalKey);
        }

        this.calendar_settings = static_data.settings;

        if (!this.initialized) {
            for (let localKey of Object.keys(this.watchers)) {
                this.$watch(localKey, this.watchers[localKey].bind(this));
            }

            this.initialized = true;
        }

        this.loaded(static_data);
    }

    rerender(changed) {
        this.$dispatch('calendar-rerender-requested', { calendar: changed });
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }
}
