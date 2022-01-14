window.FantasyCalendar = window.FantasyCalendar || function(params = {}) {
    return {
        config: {},
        onUpdate: false,
        getCurrentDateCallback: false,
        constructor: function(params) {
            if(!params.hash) {
                console.error("FantasyCalendar error: No hash set.");
                return;
            }

            this.config = {
                element: document.getElementById(params.element) ?? document.scripts[document.scripts.length - 1],
                url: 'https://fantasy-calendar.test/embed/' + params.hash,
                width: params.width,
                height: params.height,
                embedNow: params.embedNow ?? true
            }

            this.onUpdate = params.onUpdate;

            if(this.config.embedNow) {
                this.embed();
            }

            window.addEventListener('message', this.handleMessage.bind(this))

            return this;
        },

        handleMessage(event) {
            if(event.data.source !== 'fantasy-calendar-embed-child') {
                return;
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
            this.config.url = 'https://fantasy-calendar.test/embed/' + hash;
            if(this.iframe){
                this.iframe.setAttribute('src', this.config.url);
            }

            return this;
        },

        embed: function(replaceElement = null) {
            replaceElement = replaceElement ?? this.config.element;

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
            iframe.setAttribute('src', this.config.url);
            iframe.setAttribute('width', this.config.width ?? replaceElement.parentElement.offsetWidth);
            iframe.setAttribute('height', this.config.height ?? replaceElement.parentElement.offsetHeight);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('id', 'fantasy-calendar-embed')

            replaceElement.replaceWith(iframe);
            this.iframe = iframe;

            return this;
        },

        remoteAction: function(action, params) {
            this.passMessage({
                does: action,
                params: params,
                source: 'fantasy-calendar-embed-parent'
            });
        },

        passMessage: function(message) {
            if(this.iframe) {
                this.iframe.contentWindow.postMessage(message, '*')
            }
        },

        changeDateTime: function(unit, count) {
            this.remoteAction('apiRequest', {
                method: 'changeDate',
                data: {
                    unit,
                    count
                }
            });
        },

        addMinutes: function(count = 1){
            this.changeDateTime("minutes", count);
        },

        subMinutes: function(count = 1){
            this.changeDateTime("minutes", count * -1);
        },

        addHours: function(count = 1){
            this.changeDateTime("hours", count);
        },

        subHours: function(count = 1){
            this.changeDateTime("hours", count * -1);
        },

        addDays: function(count = 1){
            this.changeDateTime("days", count);
        },

        subDays: function(count = 1){
            this.changeDateTime("days", count * -1);
        },

        addMonths: function(count = 1){
            this.changeDateTime("months", count);
        },

        subMonths: function(count = 1){
            this.changeDateTime("months", count * -1);
        },

        addYears: function(count = 1){
            this.changeDateTime("years", count);
        },

        subYears: function(count = 1){
            this.changeDateTime("years", count * -1);
        },

        getCurrentDate: function(callback){
            this.remoteAction('apiRequest', {
                method: 'getCurrentDate'
            });
            if(typeof callback !== "function") return;
            this.getCurrentDateCallback = callback;
        },

        test: function() {
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

        login_form: function() {
            this.remoteAction('login_form', {});
        }
    }.constructor(params);
}
