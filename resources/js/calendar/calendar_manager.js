const registeredCallbacks = {};
let eventsBound = false;

export function registerMousemoveCallback(id, callback) {
    registeredCallbacks[id] = callback;
}

export function bind_calendar_events() {

    // Guard against binding the global mousemove listener more than once.
    // bind_calendar_events() is called from page init(); a re-init path (e.g.
    // dev HMR) would otherwise stack duplicate anonymous listeners that can
    // never be removed.
    if (eventsBound) return;
    eventsBound = true;

    window.addEventListener('mousemove', function(event) {
        for (let callback_id in registeredCallbacks) {
            registeredCallbacks[callback_id](event);
        }
    });

}
