export default class CollapsibleComponent {
    initialized = false;
    processWatchers = false;
    loads = {};
    watchers = {};
    setters = {};
    calendar_settings = {};

    load(static_data) {
        if (!static_data) {
            return
        }

        this.calendar_settings = static_data.settings;

        // We want to disable the watchers during loading stages so that we don't get recursive calendar rerender calls
        this.processWatchers = false;
        for (let [localKey, globalKey] of Object.entries(this.loads)) {
            this[localKey] = _.get(static_data, globalKey);
        }
        this.processWatchers = true;

        if (!this.initialized) {
            const collapsibleWatchers = {};

            for (let localKey of Object.keys(this.watchers)) {
                collapsibleWatchers[localKey] ??= [];
                collapsibleWatchers[localKey].push(this.watchers[localKey].bind(this));
            }

            for (let [localKey, globalKey] of Object.entries(this.setters)) {
                collapsibleWatchers[localKey] ??= [];
                collapsibleWatchers[localKey].push(() => {
                    this.rerender(globalKey, this[localKey]);
                });
            }

            for(const [localKey, methods] of Object.entries(collapsibleWatchers)){
                this.$watch(localKey, (...args) => {
                    if(!this.processWatchers) return;
                    methods.forEach((method) => method(...args));
                });
            }

            this.initialized = true;
        }

        this.loaded(static_data);
    }

    rerender(key, value) {
        this.$dispatch('calendar-rerender-requested', { calendar: { [key]: value } });
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }
}
