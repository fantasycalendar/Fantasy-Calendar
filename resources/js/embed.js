window.fcEmbedDomain = (new URL(document.currentScript.src)).origin;
window.FantasyCalendar = window.FantasyCalendar || function(params = {}) {
    return {
        _initialized: false,
        // Browser-side config
        _configuration: {
            embedNow: true,
            hash: '',
            element: null,
            selector: null,
        },
        // Configs passed to embed
        _embed_settings: {
            size: 'auto',
            onUpdate: null,
            onLoad: null,
            onGetDate: null,
            width: null,
            height: null,
        },
        get url() {
            const url = new URL(fcEmbedDomain + '/embed/' + this._config('hash'));

            for (let [setting, value] of Object.entries(this.setting())) {
                url.searchParams.set(setting, value);
            }

            return url;
        },

        // PUBLIC
        embed(){
            this._config('element', this._buildIframe());
        },
        loginForm(){
            this._remoteAction('loginForm')
        },
        setting(name = null, value = null) {
            if(!name) {
                return this._embed_settings;
            }

            if(!value) {
                return this._embed_settings[name];
            }

            if(value === this._embed_settings[name]) {
                return value;
            }

            this._embed_settings[name] = value;
            if(!['size', 'height', 'width'].includes(name)) {
                this._remoteAction('updateSetting', {
                    name, value
                });
            }
            return value;
        },
        changeDateTime(unit, count) {
            this._remoteAction('apiRequest', {
                method: 'changeDate',
                data: {
                    unit,
                    count
                }
            });
        },

        addMinutes(count = 1){
            this.changeDateTime("minutes", count);
        },

        subMinutes(count = 1){
            this.changeDateTime("minutes", count * -1);
        },

        addHours(count = 1){
            this.changeDateTime("hours", count);
        },

        subHours(count = 1){
            this.changeDateTime("hours", count * -1);
        },

        addDays(count = 1){
            this.changeDateTime("days", count);
        },

        subDays(count = 1){
            this.changeDateTime("days", count * -1);
        },

        addMonths(count = 1){
            this.changeDateTime("months", count);
        },

        subMonths(count = 1){
            this.changeDateTime("months", count * -1);
        },

        addYears(count = 1){
            this.changeDateTime("years", count);
        },

        subYears(count = 1){
            this.changeDateTime("years", count * -1);
        },

        getCurrentDate(){
            this._remoteAction('apiRequest', {
                method: 'getCurrentDate'
            });
        },

        // PRIVATE
        _constructor(params) {
            this._initialize();
            this._validateParameters(params);
            this._setSettings(params);
            this._config('element', this._determineReplaceElement());

            (this._config('embedNow') === false) || this.embed();

            return this;
        },
        _remoteAction(action, params = {}) {
            this._passMessage({
                does: action,
                params: params,
                source: 'fantasy-calendar-embed-parent'
            });
        },

        _passMessage(message) {
            if(this._config('element')) {
                this._config('element').contentWindow.postMessage(message, '*')
            }
        },
        _determineSizing() {
            this.setting('height', this._config('element').parentElement.offsetHeight);
            this.setting('width', this._config('element').parentElement.offsetWidth);
        },
        _validateParameters(params) {
            // Gotta have a calendar hash. Unless we want to have a placeholder?
            if(!params.hash) {
                 throw new Error("You must provide a calendar hash! You can find one in the URL bar of any calendar page on FC, like 'https://app.fantasy-calendar.com/calendars/[HASH]'");
            }

            if(typeof params.size === 'string' && !['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'auto'].includes(params.size)) {
                throw new Error("Invalid size specified. Options are ")
            }

            if(typeof params.size === 'object' && !(params.size.height || params.size.width)) {
                throw new Error("If you're gonna give me an object for size, you must provide at least a height and/or width! Like { height: 400, width: 600 }")
            }

            // Element is not required, as we will auto-resolve to the calling script
            if(params.selector) {
                if(typeof params.selector !== 'string') {
                    throw new Error("You must provide a valid CSS selector for us to embed to.");
                }

                if(!document.querySelector(params.selector)) {
                    throw new Error(`Could not find selector: '${params.selector}'`);
                }
            }

            if(params.onUpdate) {
                if(!['[object Function]', '[object AsyncFunction]'].includes({}.toString.call(params.onUpdate))) {
                    throw new Error("onUpdate was specified as something that wasn't a function. ಠ_ಠ");
                }
            }

            if(params.onLoad) {
                if(!['[object Function]', '[object AsyncFunction]'].includes({}.toString.call(params.onLoad))) {
                    throw new Error("onLoad was specified as something that wasn't a function. ಠ_ಠ");
                }
            }
        },
        _buildIframe() {
            if(this.setting('size') === 'auto') {
                this._determineSizing();
            }

            const iframe = document.createElement('iframe');

            if(this.setting('height')) {
                iframe.setAttribute('height', this.setting('height'));
            }

            if(this.setting('width')) {
                iframe.setAttribute('width', this.setting('width'));
            }

            iframe.setAttribute('src', this.url.href);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('id', 'fantasy-calendar-embed')
            iframe.style.margin = 'auto';

            this._config('element').replaceWith(iframe);
            return iframe;
        },
        _determineReplaceElement() {
            if(!this._config('selector')) {
                return document.scripts[document.scripts.length - 1];
            }

            return document.querySelector(this._config('selector'));
        },

        _handleMessage(event) {
            if(event.origin !== window.fcEmbedDomain) {
                return;
            }

            if(event.data.type === 'calendarLoaded') {
                this._resize(event.data.data.width, event.data.data.height);
                if(this.setting('onLoad')) {
                    this.setting('onLoad')();
                }
            }

            if(event.data.type === "getCurrentDateResponse" && this.setting('getDate')){
                this.setting('getDate')(event.data.data);
            }

            if(event.data.type === "calendarUpdated" && this.setting('onUpdate')){
                this.setting('onUpdate')(event.data);
            }
        },

        _resize(width, height){
            let iframe = this._config('element');

            iframe.style.height = height + 'px';
            iframe.style.width = width + 'px';
            iframe.width = width;
            iframe.height = height;
        },

        _initialize() {
            if(this._initialized) return;

            window.addEventListener('message', this._handleMessage.bind(this))
            this.initialized = true;
        },
        _config(name = null, value = null) {
            if(!name) {
                return this._configuration;
            }

            if(!value) {
                return this._configuration[name];
            }

            this._configuration[name] = value;
            return value;
        },
        _setSettings(params) {
            if(params.settings) {
                for (let setting of Object.keys(this.setting())) {
                    if(params.settings.hasOwnProperty(setting)) {
                        this.setting(setting, params.settings[setting]);
                    }
                }
            }

            for (let config of Object.keys(this._config())) {
                if(params.hasOwnProperty(config)) {
                    this._config(config, params[config]);
                }
            }
        }
    }._constructor(params);
}
