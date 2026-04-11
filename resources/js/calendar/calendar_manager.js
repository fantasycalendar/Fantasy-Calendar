const registeredCallbacks = {};

export function registerMousemoveCallback(id, callback) {
    registeredCallbacks[id] = callback;
}

export function bind_calendar_events() {

    window.addEventListener('mousemove', function(event) {
        for (let callback_id in registeredCallbacks) {
            registeredCallbacks[callback_id](event);
        }
    });

}
