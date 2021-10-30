window.FantasyCalendar = window.FantasyCalendar || function FantasyCalendarEmbed(params = []) {
    let FC = class {
        constructor(params) {
            if(!params.hash) {
                console.log("FantasyCalendar error: No hash set.");
                return;
            }

            let placementElement = document.createElement('div');
            let callingScriptTag = document.scripts[document.scripts.length - 1];
            callingScriptTag.parentNode.insertBefore(placementElement, callingScriptTag);

            let replaceElement = document.getElementById(params.element) ?? callingScriptTag

            let config = {
                element: replaceElement,
                url: 'http://fantasy-calendar.test:9980/embed/' + params.hash,
                width: params.width ?? replaceElement.parentElement.offsetWidth,
                height: params.height ?? replaceElement.parentElement.offsetHeight,
            }

            let iframe = document.createElement('iframe');
            iframe.setAttribute('src', config.url);
            iframe.setAttribute('width', config.width);
            iframe.setAttribute('height', config.height);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');

            config.element.replaceWith(iframe);
        }
    }

    return new FC(params);
}
