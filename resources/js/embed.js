window.FantasyCalendar = window.FantasyCalendar || function(params = []) {
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
                url: 'http://fantasy-calendar.test:9980/embed/' + params.hash,
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
        },

        passMessage: function(message) {
            window.postMessage(message, '*')
        }
    }.constructor(params);
}
