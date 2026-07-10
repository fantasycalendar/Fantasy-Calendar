import _ from "lodash";

export default class CollapsibleComponent {
    initialized = false;

    inboundProperties = {};
    changeHandlers = {};
    outboundProperties = {};

    draggableRef = null;
    draggable = null;

    validators = {};
    errors = [];
    calendar_settings = {};
    is_valid = true;
    collapsible_name = "Not set on the individual component?!?";

    init() {
        if (this.draggableRef && this.$refs[this.draggableRef]) {
            this.draggable = Sortable.create(this.$refs[this.draggableRef], {
                animation: 150,
                handle: ".handle",
                onEnd: (event) => {
                    this.dropped(event.oldIndex, event.newIndex);
                }
            });
        }
    }


    dropped(start, end) {
        if (start === end) return;

        // We've essentially gotta make Alpine aware of the change in key order
        // First we get the keys of all the elements in the <template>,
        // then we call `.shift()` to remove the <template> tag itself.
        let order = this.draggable.toArray();
        order.shift()

        this.reorderSortable(start, end);

        this.$refs[this.draggableRef + "-template"]._x_prevKeys = order;
    }

    load() {
        this.calendar_settings = this.$store.calendar.static_data.settings;

        for (let [localKey, globalKey] of Object.entries(this.inboundProperties)) {
            let storeValue = _.get(this.$store.calendar, globalKey);

            // Backfill stable ids onto the STORE objects before cloning, so the
            // cloned local copy carries the same ids. This keeps store and local
            // `_.isEqual` (no perpetual reclone) and gives list rows a `:key`
            // that survives the cloneDeep round-trip (so the open row doesn't
            // collapse on every edit).
            this.ensureStableIds(storeValue);

            let incoming = _.cloneDeep(storeValue);
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

    // Assigns a stable synthetic `_id` to each object element of an array, in
    // place. Used for static_data list items (eras/months/leap_days/seasons)
    // which have no real database id. No-op for non-arrays and primitive
    // elements (e.g. weekday name strings).
    ensureStableIds(value) {
        if (!Array.isArray(value)) return;

        for (let item of value) {
            if (item !== null && typeof item === 'object' && item._id === undefined) {
                item._id = _.uniqueId('row');
            }
        }
    }

    setupWatchers() {
        this.initialized = true;

        const componentProperties = Array.from(new Set(
            Object.keys(this.changeHandlers)
                .concat(Object.keys(this.outboundProperties))
                .concat(Object.keys(this.validators))
        ));

        for (let localKey of componentProperties) {
            this.setupWatcher(localKey);
        }
    }

    setupWatcher(localKey) {
        this.$watch(localKey, (newValue, oldValue) => {
            let validationResult = this.validate.bind(this)();

            if (!validationResult) {
                return this.validationFailed();
            }

            this.validationSucceeded();

            if (!this.is_valid) {
                return;
            }

            if (this.changeHandlers[localKey]) {
                this.changeHandlers[localKey].bind(this)(newValue, oldValue);
            }

            if (this.outboundProperties[localKey]) {
                this.rerender(this.outboundProperties[localKey], newValue);
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
        const uniqueValidators = Object.values(this.validators).reduce((acc, validator) => {
            if (acc.indexOf(validator) > -1) {
                return acc;
            }
            acc.push(validator)
            return acc;
        }, [])
        for (let validator of uniqueValidators) {
            this.errors = this.errors.concat(validator.bind(this)());
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

    reorderSortable() {
        // Nop
    }
}
