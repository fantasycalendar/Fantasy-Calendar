import { clone } from "./calendar_functions";

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
    return axios.post(window.baseurl + "calendars/" + window.hash, {
        _method: 'PATCH', name: window.calendar_name, hash: window.hash
    })
}

export function update_view_dynamic(calendar_hash) {

    $.ajax({
        url: window.baseurl + "calendars/" + calendar_hash,
        type: "post",
        dataType: 'json',
        data: { _method: 'PATCH', dynamic_data: JSON.stringify(window.dynamic_data) },
        success: function(result) {
            window.last_dynamic_change = new Date(result.last_changed.last_dynamic_change)
        },
        error: function(error) {
            $.notify(
                error
            );
        }
    });

}


export function update_dynamic(calendar_hash) {
    return axios.post(window.baseurl + "calendars/" + calendar_hash, {
        _method: 'PATCH',
        dynamic_data: JSON.stringify(window.dynamic_data)
    }).then(function(result) {
        window.last_dynamic_change = new Date(result.data.last_changed.last_dynamic_change)
    })
}

export async function update_all() {

    let lastChange = await check_last_change(window.hash);

    if(!lastChange) return;

    let new_static_change = new Date(lastChange.last_static_change)

    if (window.last_static_change > new_static_change) {
        if (!confirm('The calendar was updated before you saved. Do you want to override your last changes?')) {
            return;
        }
        window.last_static_change = new_static_change;
    }

    return do_update_all(window.hash);
}

export async function do_update_all(calendar_hash) {
    return axios.post(window.baseurl + "calendars/" + calendar_hash, {
        _method: 'PATCH',
        dynamic_data: JSON.stringify(window.dynamic_data),
        static_data: JSON.stringify(window.static_data),
        events: JSON.stringify(window.events),
        event_categories: JSON.stringify(window.event_categories),
        advancement: JSON.stringify(window.advancement)
    }).then(function(result) {
        window.last_dynamic_change = new Date(result.data.last_changed.last_dynamic_change)
        window.last_static_change = new Date(result.data.last_changed.last_static_change)
    });
}

export function get_all_data(calendar_hash, output) {

    $.ajax({
        url: window.apiurl + "/calendar/" + calendar_hash,
        type: "get",
        dataType: 'json',
        data: {},
        success: function(result) {
            output(result);
        },
        error: function(error) {
            $.notify(
                error
            );
        }
    });
}

export function get_dynamic_data(calendar_hash) {
    return axios.get(window.apiurl + "/calendar/" + calendar_hash + "/dynamic_data");
}

export async function submit_new_event(event_id, callback) {

    var new_event = clone(window.events[event_id]);
    new_event.calendar_id = window.calendar_id;
    new_event.sort_by = Object.keys(window.events).length;

    axios.post(window.apiurl + '/event', new_event)
        .then(function(result) {
            if (result.data.data !== undefined) {
                window.events[event_id] = result.data.data;
                $.notify(
                    "Event created.",
                    "success"
                );
                callback(true);
            } else {
                window.events.pop(); // Discard most recent event
                callback(false);
                $.notify(
                    result.data.message
                );
            }
        }).catch(function(error) {
            window.events.pop(); // Discard most recent event
            callback(false);
            $.notify(
                error
            );
        });
}

export function submit_hide_show_event(event_id) {

    var edit_event = clone(window.events[event_id]);
    edit_event.calendar_id = window.calendar_id;
    edit_event.settings.hide = !edit_event.settings.hide;

    axios.patch(window.apiurl + "/event/" + edit_event.id, edit_event)
        .then(function(result) {
            if (result.data.success) {
                window.events[event_id].settings.hide = !window.events[event_id].settings.hide;
                window.dispatchEvent(new CustomEvent("render-calendar"));
            }
            $.notify(
                result.data.message,
                result.data.success !== undefined ? "success" : false
            );

        }).catch(function(error) {
            $.notify(
                error
            );
        });
}

export function submit_edit_event(event_id, callback) {

    var edit_event = clone(window.events[event_id]);
    edit_event.calendar_id = window.calendar_id;

    axios.patch(window.apiurl + '/event/' + edit_event.id, edit_event)
        .then(function(result) {
            $.notify(
                result.data.message,
                result.data.success !== undefined ? "success" : false
            );
            callback(result.data.success !== undefined);
        }).catch(function(error) {
            callback(false);
            $.notify(
                error
            );
        });
}

export function submit_delete_event(event_id, callback) {

    $.ajax({
        url: window.apiurl + "/event/" + event_id,
        type: "post",
        dataType: 'json',
        data: { _method: 'DELETE' },
        success: function(result) {
            if (result.success) {
                callback();
            }
            $.notify(
                result.message,
                result.success ? "success" : false
            );
        },
        error: function(error) {
            $.notify(
                error
            );
        }
    });

}

export function submit_new_comment(content, event_id, callback) {

    axios.post(window.apiurl + "/eventcomment", {
        calendar_id: window.calendar_id,
        content: content,
        event_id: event_id
    })
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data.data);
            } else if (result.data == "") {
                $.notify(
                    "Error adding comment."
                );
            } else {
                $.notify(
                    result.data.message
                );
            }
        });
}

export function submit_delete_comment(comment_id, callback) {

    axios.delete(window.apiurl + "/eventcomment/" + comment_id)
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data.message);
            } else if (result.data == "") {
                $.notify(
                    "Error adding comment."
                );
            } else {
                $.notify(
                    result.data.message
                );
            }
        });

}

export async function check_last_change(calendar_hash) {
    return axios.post(window.apiurl + "/calendar/" + calendar_hash + "/last_changed");
}

export function create_calendar(callback) {

    $.ajax({
        url: window.baseurl + "calendars",
        type: "post",
        dataType: 'json',
        data: {
            name: window.calendar_name,
            dynamic_data: JSON.stringify(window.dynamic_data),
            static_data: JSON.stringify(window.static_data),
            events: JSON.stringify(window.events),
            event_categories: JSON.stringify(window.event_categories)
        },
        success: function(result) {
            localStorage.clear();
            window.location.href = window.baseurl + 'calendars/' + result.hash + '/edit';
        },
        error: function(error) {
            $.notify(
                error
            );
        }
    });

}


export function get_event_comments(event_id, callback) {

    $.ajax({
        url: window.apiurl + "/eventcomment/event/" + event_id,
        type: "get",
        dataType: "json",
        success: function(result) {
            callback(result['data']);
        },
        error: function(result) {
            callback(false);
        }
    });

}

export function get_preset_data(preset_id, callback) {

    axios.get(window.apiurl + '/preset/' + preset_id)
        .then(function(result) {
            if (!result.data.error && result.data != "") {
                callback(result.data);
            } else if (result.data == "") {
                $.notify(
                    "Error: Failed to load calendar preset - this one doesn't exist"
                );
            } else {
                $.notify(
                    result.data.message
                );
            }
        });

}
