window.FantasyCalendar = window.FantasyCalendar || function(params = {}) {
    return {
        config: {},
        onUpdate: false,
        constructor: function(params) {
            if(!params.hash) {
                console.log("FantasyCalendar error: No hash set.");
                return;
            }

            this.count = params.count ?? 1;
            this.unit = params.unit ?? 'days';

            let replaceElement = document.getElementById(params.element) ?? document.scripts[document.scripts.length - 1];

            this.config = {
                element: replaceElement,
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
            console.log(event);

            if(event.data.source !== 'fantasy-calendar-embed-child' || !this.onUpdate) {
                console.log(this.onUpdate);

                return;
            }

            this.onUpdate(event.data);
        },

        // FantasyCalendar({}).setCalendar().embed()
        setCalendar(hash){
            this.config.url = 'https://fantasy-calendar.test/embed/' + hash;
            if(this.iframe){
                this.iframe.setAttribute('src', this.config.url);
            }

            return this;
        },

        embed: function(replaceElement = null) {
            replaceElement = replaceElement ?? this.config.element;

            if(this.iframe) {
                this.iframe.remove();
            }

            if(typeof replaceElement === 'string') {
                let found = document.querySelector(replaceElement);
                if(!found) {
                    throw new Error(`Invalid selector provided: '${replaceElement}'`);
                }

                replaceElement = found;
            }

            if(replaceElement !== null && !(replaceElement instanceof HTMLElement)){
                throw new Error(`Element must be of type HTMLElement or CSS Selector`);
            }

            if(!document.body.contains(replaceElement)){
                throw new Error("Could not find element to embed to");
            }

            let placementElement = document.createElement('div');
            replaceElement.parentNode.insertBefore(placementElement, replaceElement);

            console.log("We were asked to embed");
            let iframe = document.createElement('iframe');
            iframe.setAttribute('src', this.config.url);
            iframe.setAttribute('width', this.config.width ?? replaceElement.parentElement.offsetWidth);
            iframe.setAttribute('height', this.config.height ?? replaceElement.parentElement.offsetHeight);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');

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

        subMinutes: function(count = -1){
            this.changeDateTime("minutes", count);
        },

        addHours: function(count = 1){
            this.changeDateTime("hours", count);
        },

        subHours: function(count = -1){
            this.changeDateTime("hours", count);
        },

        addDays: function(count = 1){
            this.changeDateTime("days", count);
        },

        subDays: function(count = -1){
            this.changeDateTime("days", count);
        },

        addMonths: function(count = 1){
            this.changeDateTime("months", count);
        },

        subMonths: function(count = -1){
            this.changeDateTime("months", count);
        },

        addYears: function(count = 1){
            this.changeDateTime("years", count);
        },

        subYears: function(count = -1){
            this.changeDateTime("years", count);
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
