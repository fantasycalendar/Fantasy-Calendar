window.FantasyCalendar = window.FantasyCalendar || function(params = {}) {
    return {
        config: {},
        constructor: function(params) {
            if(!params.hash) {
                console.log("FantasyCalendar error: No hash set.");
                return;
            }

            let replaceElement = document.getElementById(params.element) ?? document.scripts[document.scripts.length - 1];

            this.config = {
                element: replaceElement,
                url: 'https://fantasy-calendar.test/embed/' + params.hash,
                width: params.width ?? replaceElement.parentElement.offsetWidth,
                height: params.height ?? replaceElement.parentElement.offsetHeight,
                embedNow: params.embedNow ?? true
            }

            if(this.config.embedNow) {
                this.embed();
            }

            return this;
        },

        embed: function() {
            if(this.iframe) {
                console.log("Already embedded");

                return;
            }

            let placementElement = document.createElement('div');
            let replaceElement = this.config.element
            replaceElement.parentNode.insertBefore(placementElement, replaceElement);



            console.log("We were asked to embed");
            let iframe = document.createElement('iframe');
            iframe.setAttribute('src', this.config.url);
            iframe.setAttribute('width', this.config.width);
            iframe.setAttribute('height', this.config.height);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');

            this.config.element.replaceWith(iframe);
            this.iframe = iframe;
        },

        remoteAction: function(action, params) {
            this.passMessage({
                does: action,
                params: params,
                source: 'fantasy-calendar-embed'
            });
        },

        passMessage: function(message) {
            if(this.iframe) {
                this.iframe.contentWindow.postMessage(message, '*')
            }
        },

        apitest: function() {
            this.remoteAction('apiRequest', {
                method: 'changeDate',
                data: {
                    unit: 'days',
                    count: 5
                }
            })
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
