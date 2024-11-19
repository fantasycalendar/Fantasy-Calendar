export default class CollapsibleComponent {
    initialized = false;
    processWatchers = false;

    inboundProperties = {};
    changeHandlers = {};
    outboundProperties = {};

    validators = {};
    errors = {};
    calendar_settings = {};
    is_valid = true;

    load(static_data) {
        console.log('Load called on ', this.constructor.prototype.name);
        if (!static_data) {
            return
        }

        this.calendar_settings = static_data.settings;

        // We want to disable the changeHandlers during loading stages so that we don't get recursive calendar rerender calls
        // TODO: Figure out why this doesn't _actually_ work.
        this.processWatchers = false;
        for (let [localKey, globalKey] of Object.entries(this.inboundProperties)) {
            this[localKey] = _.get(static_data, globalKey);
        }
        this.processWatchers = true

        this.loaded(static_data);
    }

    init() {
        const componentProperties = Array.from(new Set(
            Object.keys(this.changeHandlers).concat(Object.keys(this.outboundProperties))
        ));

        for (let localKey of componentProperties) {
            this.setupWatcher(localKey);
        }
    }

    setupWatcher(localKey) {
        this.$watch(localKey, (...args) => {
            if (!this.validate()) {
                console.log("Didn't validate", localKey, args);
                return this.validationFailed();
            }

            if (!this.is_valid) {
                return;
            }

            if (!this.processWatchers) {
                return;
            }

            console.log("Running change handlers for " + localKey, JSON.parse(JSON.stringify(args)));

            if (this.changeHandlers[localKey]) {
                this.changeHandlers[localKey].bind(this)(...args);
            }

            console.log("Running outbound properties " + localKey);

            if (this.outboundProperties[localKey]) {
                this.rerender(this.outboundProperties[localKey], this[localKey]);
            }
        });
    }

    rerender(key, value) {
        this.$dispatch('calendar-rerender-requested', { calendar: { [key]: value } });
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }

    validate() {
        for (let [localKey, validator] of Object.entries(this.validators)) {
            let { error, message } = validator.bind(this)(localKey);
            if (error) {
                this.errors[localKey] = message;
            } else if (this.errors?.[localKey]) {
                // TODO: Remove error dispatch?
                delete this.errors[localKey];
            }
        }

        this.is_valid = !Object.keys(this.errors).length;

        return this.is_valid;
    }

    validationFailed() {
        this.$dispatch("calendar-validation-failed", {
            key: this.constructor.prototype.name,
            errors: Object.values(this.errors)
        })
    }

    getError(path) {

    }

    hasError(path) {

    }
}
