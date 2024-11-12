export default class CollapsibleComponent {
    initialized = false;
    key = 'invalid-component';

    load(static_data) {
        if (!static_data) {
            return
        }

        this[this.key] = static_data[this.key];
        this.calendar_settings = static_data.settings;

        if (!this.initialized) {
            this.$watch(this.key, this.changed.bind(this));

            this.initialized = true;
        }
    }

    changed() {
        throw new Error(`The component ${this.key} must implement 'changed()'!`);
    }
}
