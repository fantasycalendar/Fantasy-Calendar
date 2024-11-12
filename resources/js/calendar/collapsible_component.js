export default class CollapsibleComponent {
    initialized = false;
    retrieves = {};
    changes = {};

    load(static_data) {
        if (!static_data) {
            return
        }

        for (let [localKey, globalKey] of Object.entries(this.retrieves)) {
            this[localKey] = _.get(static_data, globalKey);
        }

        this.calendar_settings = static_data.settings;

        if (!this.initialized) {
            for (let localKey of Object.keys(this.changes)) {
                this.$watch(localKey, this.changes[localKey].bind(this));
            }

            this.initialized = true;
        }

        this.loaded(static_data);
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }

    changed() {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }
}
