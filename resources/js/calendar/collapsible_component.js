import _ from "lodash";

export default class CollapsibleComponent {
    initialized = false;
    processWatchers = false;

    inboundProperties = {};
    changeHandlers = {};
    outboundProperties = {};

    validators = {};
    errors = [];
    calendar_settings = {};
    is_valid = true;
    collapsible_name = "Not set on the individual component?!?";

    load() {
        this.calendar_settings = this.$store.calendar.static_data.settings;

        for (let [localKey, globalKey] of Object.entries(this.inboundProperties)) {
            let incoming = _.get(this.$store.calendar, globalKey);
            let current = this[localKey];

            if (!_.isEqual(incoming, current)) {
                this[localKey] = incoming;
            }
        }

        this.loaded(this.$store.calendar.static_data);

        if (!this.initialized) {
            this.setupWatchers();
        }
    }

    setupWatchers() {
        this.initialized = true;

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
            this.$dispatch('calendar-updating', { calendar: { [key]: value } });
        }
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }

    validate() {
        this.errors = [];
        for (let [localKey, validator] of Object.entries(this.validators)) {
            this.errors = this.errors.concat(validator.bind(this)(localKey));
        }

        this.is_valid = !this.errors.length;

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
            errors: this.errors.map(error => error.message)
        })
    }

    getErrorMessage(path) {
        return this.errors.find(error => error.path === path)?.message ?? "";
    }

    hasError(path) {
        return this.errors.some(error => error.path === path);
    }

    debug() {
        console.log(JSON.parse(JSON.stringify(this)));
    }
}
