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
    collapsible_name = "Not set on the individual component?!?";

    load(static_data) {
        if (!static_data) {
            return
        }

        this.calendar_settings = static_data.settings;

        for (let [localKey, globalKey] of Object.entries(this.inboundProperties)) {
            let incoming = _.get(static_data, globalKey);
            let current = this[localKey];

            if (!_.isEqual(incoming, current)) {
                this[localKey] = incoming;
            }
        }

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
            let validationResult = this.validate.bind(this)();

            if (!validationResult) {
                return this.validationFailed();
            }

            this.validationSucceeded();

            if (!this.is_valid) {
                return;
            }

            if (this.changeHandlers[localKey]) {
                this.changeHandlers[localKey].bind(this)(...args);
            }

            if (this.outboundProperties[localKey]) {
                this.rerender(this.outboundProperties[localKey], this[localKey]);
            }
        });
    }

    rerender(key, value) {
        if (this.is_valid) {
            this.$dispatch('calendar-rerender-requested', { calendar: { [key]: value } });
        }
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

    validationSucceeded() {
        this.$dispatch("calendar-validation-succeeded", {
            key: this.collapsible_name,
        });
    }

    validationFailed() {
        this.$dispatch("calendar-validation-failed", {
            key: this.collapsible_name,
            errors: Object.values(this.errors)
        })
    }

    getError(path) {

    }

    hasError(path) {

    }
}
