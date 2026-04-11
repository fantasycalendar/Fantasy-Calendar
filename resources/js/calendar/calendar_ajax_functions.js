import { clone, notify } from "./calendar_functions";
import _ from "lodash";
import Alpine from 'alpinejs';

function calendarStore() { return Alpine.store('calendar'); }

export function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (var i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

export function update_name() {
    const store = calendarStore();
    return axios.post(store.baseurl + "calendars/" + store.hash, {
        _method: 'PATCH', name: store.calendar_name, hash: store.hash
    })
}

export function update_view_dynamic(calendar_hash) {
    const store = calendarStore();

    axios.post(store.baseurl + "calendars/" + calendar_hash, {
        _method: 'PATCH',
        dynamic_data: JSON.stringify(store.dynamic_data)
    }).then(function(result) {
        store.last_dynamic_change = new Date(result.data.last_changed.last_dynamic_change)
    }).catch(function(error) {
        notify(error);
    });

}


export function _update_dynamic(calendar_hash) {
    const store = calendarStore();
    return axios.post(store.baseurl + "calendars/" + calendar_hash, {
        _method: 'PATCH',
        dynamic_data: JSON.stringify(store.dynamic_data)
    }).then(function(result) {
        store.last_dynamic_change = new Date(result.data.last_changed.last_dynamic_change)
    })
}

export const update_dynamic = _.debounce(_update_dynamic, 300);

export async function update_all() {
    const store = calendarStore();

    let lastChange = await check_last_change(store.hash);

    if (!lastChange) return;

    let new_static_change = new Date(lastChange.data.last_static_change)

    if (new_static_change > store.last_static_change) {
        if (!confirm('The calendar was updated before you saved. Do you want to override your last changes?')) {
            return;
        }
        store.last_static_change = new_static_change;
    }

    return do_update_all(store.hash);
}

export async function do_update_all(calendar_hash) {
    const store = calendarStore();
    return axios.post(store.baseurl + "calendars/" + calendar_hash, {
        _method: 'PATCH',
        dynamic_data: JSON.stringify(store.dynamic_data),
        static_data: JSON.stringify(store.static_data),
        events: JSON.stringify(store.events),
        event_categories: JSON.stringify(store.event_categories),
        advancement: JSON.stringify(store.advancement)
    }).then(function(result) {
        store.last_dynamic_change = new Date(result.data.last_changed.last_dynamic_change)
        store.last_static_change = new Date(result.data.last_changed.last_static_change)
    });
}

export function get_all_data(calendar_hash, output) {

    axios.get(calendarStore().apiurl + "/calendar/" + calendar_hash)
        .then(function(result) {
            output(result.data);
        }).catch(function(error) {
            notify(error);
        });
}

export function get_dynamic_data(calendar_hash) {
    return axios.get(calendarStore().apiurl + "/calendar/" + calendar_hash + "/dynamic_data");
}

export async function submit_new_event(event_id, callback) {
    const store = calendarStore();

    var new_event = clone(store.events[event_id]);
    new_event.calendar_id = store.id;
    new_event.sort_by = Object.keys(store.events).length;

    axios.post(store.apiurl + '/event', new_event)
        .then(function(result) {
            if (result.data.data !== undefined) {
                store.events[event_id] = result.data.data;
                notify("Event created.", "success");
                callback(true);
            } else {
                store.events.pop(); // Discard most recent event
                callback(false);
                notify(result.data.message);
            }
        }).catch(function(error) {
            store.events.pop(); // Discard most recent event
            callback(false);
            notify(error);
        });
}

export function submit_hide_show_event(event_id) {
    const store = calendarStore();

    var edit_event = clone(store.events[event_id]);
    edit_event.calendar_id = store.id;
    edit_event.settings.hide = !edit_event.settings.hide;

    axios.patch(store.apiurl + "/event/" + edit_event.id, edit_event)
        .then(function(result) {
            if (result.data.success) {
                store.events[event_id].settings.hide = !store.events[event_id].settings.hide;
                window.dispatchEvent(new CustomEvent("render-calendar"));
            }
            notify(
                result.data.message,
                result.data.success !== undefined ? "success" : false
            );

        }).catch(function(error) {
            notify(error);
        });
}

export function submit_edit_event(event_id, callback) {
    const store = calendarStore();

    var edit_event = clone(store.events[event_id]);
    edit_event.calendar_id = store.id;

    axios.patch(store.apiurl + '/event/' + edit_event.id, edit_event)
        .then(function(result) {
            notify(result.data.message, result.data.success !== undefined ? "success" : false);
            callback(result.data.success !== undefined);
        }).catch(function(error) {
            callback(false);
            notify(error);
        });
}

export function submit_delete_event(event_id, callback) {

    axios.delete(calendarStore().apiurl + "/event/" + event_id)
        .then(function(result) {
            if (result.data.success) {
                callback();
            }
            notify(result.data.message, result.data.success ? "success" : false);
        }).catch(function(error) {
            notify(error);
        });

}

export function submit_new_comment(content, event_id, callback) {
    const store = calendarStore();

    axios.post(store.apiurl + "/eventcomment", {
        calendar_id: store.id,
        content: content,
        event_id: event_id
    })
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data.data);
            } else if (result.data == "") {
                notify( "Error adding comment.");
            } else {
                notify( result.data.message);
            }
        });
}

export function submit_delete_comment(comment_id, callback) {

    axios.delete(calendarStore().apiurl + "/eventcomment/" + comment_id)
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data.message);
            } else if (result.data == "") {
                notify( "Error adding comment.");
            } else {
                notify( result.data.message);
            }
        });

}

export async function check_last_change(calendar_hash) {
    return axios.post(calendarStore().apiurl + "/calendar/" + calendar_hash + "/last_changed");
}

export function create_calendar() {
    const store = calendarStore();
    return axios.post(store.baseurl + "calendars", {
        name: store.calendar_name,
        dynamic_data: JSON.stringify(store.dynamic_data),
        static_data: JSON.stringify(store.static_data),
        events: JSON.stringify(store.events),
        event_categories: JSON.stringify(store.event_categories)
    }).then((result) => {
        localStorage.clear();
        window.location.href = store.baseurl + 'calendars/' + result.data.hash + '/edit';
    })
}


export function get_event_comments(event_id, callback) {

    axios.get(calendarStore().apiurl + "/eventcomment/event/" + event_id)
        .then(function(result) {
            callback(result.data['data']);
        }).catch(function(error) {
            callback(false);
        });

}

export function get_preset_data(preset_id, callback) {

    axios.get(calendarStore().apiurl + '/preset/' + preset_id)
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data);
            } else if (result.data == "") {
                notify( "Error: Failed to load calendar preset - this one doesn't exist");
            } else {
                notify( result.data.message);
            }
        });

}
