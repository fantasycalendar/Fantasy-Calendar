window.registered_mousemove_callbacks = {}

export function bind_calendar_events() {

    window.addEventListener('mousemove', function(event) {
        for (let callback_id in window.registered_mousemove_callbacks) {
            window.registered_mousemove_callbacks[callback_id](event);
        }
    });

}
