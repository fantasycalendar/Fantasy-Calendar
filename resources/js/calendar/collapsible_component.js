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
        if (!static_data) {
            return
        }

        this.calendar_settings = static_data.settings;

        // We want to disable the changeHandlers during loading stages so that we don't get recursive calendar rerender calls
        this.processWatchers = false;
        for (let [localKey, globalKey] of Object.entries(this.inboundProperties)) {
            this[localKey] = _.get(static_data, globalKey);
        }
        this.processWatchers = true;

        if (!this.initialized) {
            this.setupWatchers();
            this.initialized = true;
        }

        this.loaded(static_data);
    }

    setupWatchers(){

        const componentProperties = Array.from(new Set(
            Object.keys(this.changeHandlers).concat(Object.keys(this.outboundProperties))
        ));

        for(let localKey of componentProperties){
            this.$watch(localKey, (...args) => {

                let isValid = this.validate();
                if(!isValid){
                    if(this.is_valid){
                        this.is_valid = false;
                    }
                    return this.validationFailed();
                }

                if(!this.is_valid) {
                    return
                }

                if(!this.processWatchers) return;

                if(this.changeHandlers[localKey]){
                    this.changeHandlers[localKey](...args);
                }

                if(this.outboundProperties[localKey]){
                    this.rerender(this.outboundProperties[localKey], this[localKey]);
                }

            });
        }
    }

    rerender(key, value) {
        this.$dispatch('calendar-rerender-requested', { calendar: { [key]: value } });
    }

    loaded(static_data) {
        // throw new Error(`The component ${this.prototype.constructor.name} must implement 'changed()'!`);
    }

    validate() {
        this.errors = {};
        let isValid = true;
        for(let [localKey, validator] of Object.entries(this.validators)){
            let { error, message } = validator(localKey);
            if(error){
                this.errors[localKey] = message;
                isValid = false;
            }
        }
        return isValid;
    }

    validationFailed() {

    }

    getError() {

    }

    hasError() {

    }
}
