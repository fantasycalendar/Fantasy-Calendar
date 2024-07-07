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

export function update_name(){
	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', name: calendar_name, hash: hash},
		success: function( result ){
			prev_calendar_name = calendar_name;
			document.title = calendar_name + " - Fantasy Calendar";
			calendar_saved();
		},
		error: function ( error )
		{
			$.notify(
				error
			);
			calendar_save_failed();
		}
	});
}

export function update_view_dynamic(calendar_hash){

	$.ajax({
		url:window.baseurl+"calendars/"+calendar_hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', dynamic_data: JSON.stringify(dynamic_data)},
		success: function ( result ){
			last_dynamic_change = new Date(result.last_changed.last_dynamic_change)
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});

}


export function update_dynamic(calendar_hash, callback){

	$.ajax({
		url:window.baseurl+"calendars/"+calendar_hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', dynamic_data: JSON.stringify(dynamic_data)},
		success: function ( result ){

			if(!dynamic_same){
				prev_dynamic_data = clone(dynamic_data);
			}

			calendar_saved();

			last_dynamic_change = new Date(result.last_changed.last_dynamic_change)

            if(callback) {
                callback();
            }

		},
		error: function ( error )
		{
			$.notify(
				error
			);
			calendar_save_failed();
		}
	});

}

export function update_all(){

	check_last_change(hash, function(output){

		var new_static_change = new Date(output.last_static_change)

		if(last_static_change > new_static_change){

			if(!confirm('The calendar was updated before you saved. Do you want to override your last changes?')){
				return;
			}

			last_static_change = new_static_change;

		}

		do_update_all(hash);

	});
}

export function do_update_all(calendar_hash, success_callback, failure_callback){

	$.ajax({
		url:window.baseurl+"calendars/"+calendar_hash,
		type: "post",
		dataType: 'json',
		data: {
		    _method: 'PATCH',
            dynamic_data: JSON.stringify(dynamic_data),
            static_data: JSON.stringify(static_data),
            events: JSON.stringify(events),
            event_categories: JSON.stringify(event_categories),
            advancement: JSON.stringify(advancement)
        },
		success: function(result){

			if(!calendar_name_same){
				prev_calendar_name = clone(calendar_name);
				document.title = calendar_name + " - Fantasy Calendar";
			}

			if(!static_same){
				prev_static_data = clone(static_data);
			}

			if(!dynamic_same){
				prev_dynamic_data = clone(dynamic_data);
			}

			if(!events_same){
				prev_events = clone(events);
			}

			if(!event_categories_same){
				prev_event_categories = clone(event_categories);
			}

			if(!advancement_same){
				prev_advancement = clone(advancement);
			}

			last_dynamic_change = new Date(result.last_changed.last_dynamic_change)
			last_static_change = new Date(result.last_changed.last_static_change)

			calendar_saved();

            if(success_callback) success_callback();

		},
		error: function ( error )
		{
			if(failure_callback !== undefined){
				failure_callback();
			}else{
				calendar_save_failed();
			}
		}
	});
}

export function get_all_data(calendar_hash, output){

	$.ajax({
		url:window.apiurl+"/calendar/"+calendar_hash,
		type: "get",
		dataType: 'json',
		data: {},
		success: function(result){
			output(result);
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});
}

export function get_dynamic_data(calendar_hash, output){

	$.ajax({
		url:window.apiurl+"/calendar/"+calendar_hash+"/dynamic_data",
		type: "get",
		dataType: 'json',
		data: {},
		success: function(result){

			output(result);

		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});

}

export function link_child_calendar(child_hash, parent_link_date, parent_offset){

	show_loading_screen();

$.ajax({
    url:window.baseurl+"calendars/"+child_hash,
    type: "post",
    dataType: 'json',
    data: {
        _method: "PATCH",
        parent_hash: hash,
        parent_link_date: parent_link_date,
        parent_offset: parent_offset
    },
    success: function(result){
        update_dynamic(hash, () => {
            window.location.reload();
        });
    },
    error: function ( error )
    {
        hide_loading_screen();
    }
});
}

export function unlink_child_calendar(output, child_hash){

	show_loading_screen();

    $.ajax({
        url:window.baseurl+"calendars/"+child_hash,
        type: "post",
        dataType: 'json',
        data: {
            _method: "PATCH",
            parent_hash: "",
            parent_link_date: "",
            parent_offset: "",
        },
        success: function(result){
            update_dynamic(hash, () => {
                window.location.reload();
            });
        },
        error: function ( error )
        {
            $.notify(
                error
            );
        }
    });
}

export function get_calendar_users(callback) {
    $.ajax({
        url: window.apiurl+"/calendar/"+hash+"/users",
        type: "get",
        dataType: "json",
        success: function (result) {
            callback(result);
        },
        error: function ( result ){
            callback(false);
        }
    })
}

export function add_calendar_user(email, output){
    axios.post(window.apiurl+"/calendar/"+hash+"/inviteUser", {email: email})
        .then(function(result) {
            output(true, `Sent email to ${email}!`);
        })
        .catch(function(error){
            output(false, error.response.data.errors.email[0]);
        });
}

export function update_calendar_user(user_id, permission, output){

    axios.post(window.apiurl+"/calendar/"+hash+"/changeUserRole", {user_role: permission, user_id: user_id})
        .then(function(result) {
            output(true, 'Updated permissions!');
        })
        .catch(function(error){
            output(false, error.response.data.message);
        });
}

export function remove_calendar_user(user_id, remove_all, callback, email = null){

    let userdata = {user_id: user_id, remove_all: remove_all};
    if(email) {
        userdata.email = email;
    }

    axios.post(window.apiurl+"/calendar/"+hash+"/removeUser", userdata)
        .then(function(result){
            callback();
        })
        .catch(function(error){
            $.notify(
                error.response.data.message
            );
        });
}

export function resend_calendar_invite(email, output){

    axios.post(window.apiurl+"/calendar/"+hash+"/resend_invite", {email: email})
        .then(function(result){
            output(true, 'Resent invitation');
        })
        .catch(function(error){
            output(false, error.response.data.message);
            $.notify(
                error.response.data.message
            );
        });
}

export async function submit_new_event(event_id, callback){

	var new_event = clone(events[event_id]);
	new_event.calendar_id = calendar_id;
	new_event.sort_by = Object.keys(events).length;

	axios.post(window.apiurl+'/event', new_event)
        .then(function (result){
            if(result.data.data !== undefined) {
				events[event_id] = result.data.data;
				$.notify(
					"Event created.",
					"success"
				);
				callback(true);
            } else {
				events.pop(); // Discard most recent event
				callback(false);
				$.notify(
					result.data.message
				);
            }
        }).catch(function(error) {
			events.pop(); // Discard most recent event
			callback(false);
			$.notify(
				error
			);
    });
}

export function submit_hide_show_event(event_id){

	var edit_event = clone(events[event_id]);
	edit_event.calendar_id = calendar_id;
	edit_event.settings.hide = !edit_event.settings.hide;

	axios.patch(window.apiurl+"/event/"+edit_event.id, edit_event)
        .then(function(result) {
            if(result.data.success) {
				events[event_id].settings.hide = !events[event_id].settings.hide;
				rerender_calendar();
				evaluate_save_button();
			}
			$.notify(
				result.data.message,
				result.data.success !== undefined ? "success" : false
			);

        }).catch(function(error){
			$.notify(
				error
			);
    });
}

export function submit_edit_event(event_id, callback){

	var edit_event = clone(events[event_id]);
	edit_event.calendar_id = calendar_id;

	axios.patch(window.apiurl+'/event/'+edit_event.id, edit_event)
        .then(function(result) {
			$.notify(
				result.data.message,
				result.data.success !== undefined ? "success" : false
			);
			callback(result.data.success !== undefined);
        }).catch(function(error){
			callback(false);
			$.notify(
				error
			);
    });
}

export function submit_delete_event(event_id, callback){

	$.ajax({
		url:window.apiurl+"/event/"+event_id,
		type: "post",
		dataType: 'json',
		data: {_method: 'DELETE'},
		success: function(result){
			if(result.success){
				callback();
			}
			$.notify(
				result.message,
				result.success ? "success" : false
			);
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});

}

export function submit_new_comment(content, event_id, callback) {

    axios.post(window.apiurl+"/eventcomment", {
        calendar_id: calendar_id,
        content: content,
        event_id: event_id
    })
        .then(function (result){
            if(!result.data.error && result.data != "") {
                callback(result.data.data);
            } else if(result.data == ""){
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

export function submit_delete_comment(comment_id, callback){

    axios.delete(window.apiurl+"/eventcomment/"+comment_id)
        .then(function (result){
            if(!result.data.error && result.data != "") {
                callback(result.data.message);
            } else if(result.data == ""){
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


export function get_owned_calendars(output){
	$.ajax({
		url:window.apiurl+"/calendar/"+hash+"/owned",
		type: "get",
		dataType: 'json',
		data: {},
		success: function(result){
			output(result);
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});
}

export function check_last_change(calendar_hash, output){
	$.ajax({
		url:window.apiurl+"/calendar/"+calendar_hash+"/last_changed",
		type: "post",
		dataType: 'json',
		data: {},
		success: function(result){
			output(result);
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});
}

export function delete_calendar(calendar_hash, calendar_name, callback){

    swal.fire({
        text: "If you're sure about deleting this calendar, please type '" + calendar_name + "' below:",
        input: "text",
        icon: "warning",
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Delete',
        dangerMode: true
    })
        .then(result => {

        	if(result.dismiss || !result.value) throw null;

            if (result.value !== calendar_name) throw `Sorry! "${result.value}" isn't the same as "${calendar_name}"`;

            return axios.delete(window.apiurl + '/calendar/' + calendar_hash);

        })
        .then(results => {
            if(results.data.error) {
                throw "Error: " + results.data.message;
            }

            swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The calendar " + calendar_name + " has been deleted.",
                button: true
            })
                .then(success => {
                    callback();
                })
        })
        .catch(err => {
            if(err) {
                swal.fire("Oh no!", err, "error");
            } else {
                swal.hideLoading();
                swal.close();
            }
        });

}

export function create_calendar(callback){

	$.ajax({
		url:window.baseurl+"calendars",
		type: "post",
		dataType: 'json',
		data: {
		    name: calendar_name,
            dynamic_data: JSON.stringify(dynamic_data),
            static_data: JSON.stringify(static_data),
            events: JSON.stringify(events),
            event_categories: JSON.stringify(event_categories)
        },
		success: function ( result ){
			localStorage.clear();
			window.location.href = window.baseurl+'calendars/'+result.hash+'/edit';
		},
		error: function ( error )
		{
			$.notify(
				error
			);
		}
	});

}


export function get_event_comments(event_id, callback){

	$.ajax({
		url: window.apiurl+"/eventcomment/event/"+event_id,
		type: "get",
		dataType: "json",
		success: function ( result ) {
			callback(result['data']);
		},
		error: function ( result ) {
			callback(false);
		}
	});

}

export function get_preset_data(preset_id, callback){

	axios.get(window.apiurl+'/preset/'+preset_id)
		.then(function (result){
			if(!result.data.error && result.data != "") {
				callback(result.data);
			} else if(result.data == ""){
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
