window.fcEmbedDomain = (new URL(document.currentScript.src)).origin;
window.FantasyCalendar = window.FantasyCalendar || function(params = {}) {
    return {
        config_values: {},
        onUpdate: false,
        getCurrentDateCallback: false,
        initialized: false,
        sizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
        constructor(params) {
            if(!params.hash) {
                console.error("FantasyCalendar error: No hash set.");
                return;
            }

            let domain = this.resolveDomain();

            this.config_values = {
                element: document.querySelector(params.element) ?? document.scripts[document.scripts.length - 1],
                url: new URL(domain + '/embed/' + params.hash),
                embedNow: params.embedNow ?? true
            }

            if(params.size in this.sizes) {
                this.config_values.url.searchParams.append('size', params.size);
                this.config_values.size = params.size;
            } else if(params.width || params.height) {
                this.config_values.width = params.width;
                this.config_values.height = params.height;
            } else {
                this.config_values.size = 'auto';
            }

            this.onUpdate = params.onUpdate;
            this.onLoad = params.onLoad;

            if(this.config_values.embedNow) {
                this.embed();
            }

            if(!this.initialized) {
                window.addEventListener('message', this.handleMessage.bind(this))
                this.initialized = true;
            }

            return this;
        },

        handleMessage(event) {
            if(event.origin !== this.resolveDomain()) {
                return;
            }

            console.trace()

            console.log(event.data.type);

            if(event.data.type === 'calendarLoaded') {
                this.postLoad(event.data.data);
            }

            if(event.data.type === "getCurrentDateResponse" && this.getCurrentDateCallback){
                this.getCurrentDateCallback(event.data.data);
                this.getCurrentDateCallback = false;
            }

            if(event.data.type === "calendarUpdated" && this.onUpdate){
                this.onUpdate(event.data);
            }
        },

        setCalendar(hash){
            this.config_values.url.pathname = '/embed/' + hash;
            if(this.iframe){
                this.iframe.setAttribute('src', this.config_values.url.href);
            }

            return this;
        },

        embed(replaceElement = null) {
            replaceElement = replaceElement ?? this.config_values.element ?? '#fantasy-calendar-embed';

            console.log(replaceElement);

            if(typeof replaceElement === 'string') {
                const found = document.querySelector(replaceElement);
                if(!found) {
                    throw new Error(`Invalid selector provided: '${replaceElement}'`);
                }
                replaceElement = found;
            }

            if(replaceElement !== null && !(replaceElement instanceof HTMLElement)){
                if(!this.iframe) {
                    throw new Error(`Element must be of type HTMLElement or CSS Selector`);
                }

                replaceElement = this.iframe;
            }

            if(!document.body.contains(replaceElement)){
                throw new Error("Could not find element to embed to");
            }

            if(this.iframe && this.iframe !== replaceElement) {
                this.iframe.remove();
            }

            const placementElement = document.createElement('div');
            replaceElement.parentNode.insertBefore(placementElement, replaceElement);

            console.log("We were asked to embed");
            const iframe = document.createElement('iframe');
            if(!this.sizes.includes(this.config_values.size)) {
                console.log(this.config_values.size + " not a known size, assuming auto.");
                iframe.setAttribute('width', this.config_values.width ?? replaceElement.parentElement.offsetWidth);
                iframe.setAttribute('height', this.config_values.height ?? replaceElement.parentElement.offsetHeight);
            } else {
                this.config_values.url.searchParams.set('size', this.config_values.size);
            }

            iframe.setAttribute('src', this.config_values.url.href);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('id', 'fantasy-calendar-embed')
            iframe.style.margin = 'auto';


            replaceElement.replaceWith(iframe);
            this.iframe = iframe;
            this.config('element', this.iframe);

            return this;
        },

        remoteAction(action, params) {
            this.passMessage({
                does: action,
                params: params,
                source: 'fantasy-calendar-embed-parent'
            });
        },

        passMessage(message) {
            if(this.iframe) {
                this.iframe.contentWindow.postMessage(message, '*')
            }
        },

        changeDateTime(unit, count) {
            this.remoteAction('apiRequest', {
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

        getCurrentDate(callback){
            this.remoteAction('apiRequest', {
                method: 'getCurrentDate'
            });
            if(typeof callback !== "function") return;
            this.getCurrentDateCallback = callback;
        },

        test() {
            console.log("Sending a message");
            this.remoteAction('toastify', {
                type: 'error',
                message: "This is a message"
            });

            this.remoteAction('toastify', {
                type: 'success',
                message: "This is a message"
            });

            this.remoteAction('toastify', {
                type: '',
                message: "This is a message"
            });
        },

        login_form() {
            this.remoteAction('login_form', {});
        },

        resolveDomain() {
            return window.fcEmbedDomain;
        },

        resizeIframe(height, width) {
            console.log('Image sizing:' + height + "," + width);
            this.iframe.style.height = height + 'px';
            this.iframe.style.width = width + 'px';
            this.iframe.width = width;
            this.iframe.height = height;
        },

        postLoad(loadedData) {
            if(loadedData.height && loadedData.width) {
                this.resizeIframe(loadedData.height, loadedData.width);
            }

            if(this.onLoad) {
                this.onLoad(loadedData);
            }
        },

        config(name, value = 'unset') {
            console.log("Changing config " + name + " to " + value);
            if(value === 'unset') {
                delete this.config_values[name];
                return;
            }

            if(name === 'size' && value === 'auto') {
                this.config_values.url.searchParams.delete('size');
            }

            this.config_values[name] = value;
            return value;
        }
    }.constructor(params);
}
