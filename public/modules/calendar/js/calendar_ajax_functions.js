function update_date(new_date){
	if(dynamic_data.year != new_date.year){
		dynamic_data.day = new_date.day;
		dynamic_data.timespan = new_date.timespan;
		dynamic_data.year = new_date.year;
		rebuild_calendar('calendar', dynamic_data);
		update_current_day(true);
	}else if(dynamic_data.timespan != new_date.timespan){
		if(static_data.settings.show_current_month){
			rebuild_calendar('calendar', dynamic_data);
			update_current_day(true);
		}else{
			dynamic_data.day = new_date.day;
			dynamic_data.timespan = new_date.timespan;
			update_current_day(true);
		}
	}else if(dynamic_data.day != new_date.day){
		dynamic_data.epoch += (new_date.day-dynamic_data.day);
		dynamic_data.day = new_date.day;
		update_current_day(false);
	}else{
		dynamic_data.day = new_date.day;
		dynamic_data.timespan = new_date.timespan;
		dynamic_data.year = new_date.year;
	}
}



function getUrlParameter(sParam) {
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

function update_name(){
	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', name: calendar_name, hash: hash},
		success: function( result ){
			prev_calendar_name = calendar_name;
			evaluate_save_button();
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function update_dynamic(){

	check_last_change(function(output){

		/*var new_dynamic_change = new Date(output.last_dynamic_change)

		if(new_dynamic_change > last_dynamic_change){

			alert('The calendar was updated before your data was saved. Refreshing now.');
			location.reload();
			
		}*/

		do_update_dynamic();

	});
}

function do_update_dynamic(){

	//escapeAllHtml(dynamic_data);

	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', dynamic_data: JSON.stringify(dynamic_data)},
		success: function ( result ){

			if(!dynamic_same){
				prev_dynamic_data = clone(dynamic_data);
			}

			evaluate_save_button();

			update_children_dynamic_data();

		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function update_all(){

	check_last_change(function(output){

		var new_static_change = new Date(output.last_static_change)

		if(last_static_change > new_static_change){

			if(!confirm('The calendar was updated before you saved. Do you want to override your last changes?')){
				return;
			}

			last_static_change = new_static_change;

		}

		do_update_all();

	});
}

function do_update_all(){

	//escapeAllHtml(dynamic_data);
	
	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', dynamic_data: JSON.stringify(dynamic_data), static_data: JSON.stringify(static_data)},
		success: function(result){

			if(!calendar_name_same){
				prev_calendar_name = clone(calendar_name);
			}

			if(!static_same){
				prev_static_data = clone(static_data);
			}

			if(!dynamic_same){
				prev_dynamic_data = clone(dynamic_data);
			}

			update_children_dynamic_data();

			evaluate_save_button();

		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function update_hashes(child_hash){

	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', children: JSON.stringify(link_data.children)},
		success: function( result ){

			$.ajax({
				url:window.baseurl+"calendars/"+child_hash,
				type: "post",
				dataType: 'json',
				data: {_method: 'PATCH', hash: child_hash, master_hash: hash},
				success: function( result ){
					populate_calendar_lists();
				},
				error: function ( log )
				{
					console.log(log);
				}
			});

		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}
function remove_hashes(child_hash){

	$.ajax({
		url:window.baseurl+"calendars/"+hash,
		type: "post",
		dataType: 'json',
		data: {_method: 'PATCH', children: JSON.stringify(link_data.children)},
		success: function( result ){

			$.ajax({
				url:window.baseurl+"calendars/"+child_hash,
				type: "post",
				dataType: 'json',
				data: {method: 'PATCH', master_hash: ''},
				success: function( result ){
					populate_calendar_lists();
				},
				error: function ( log )
				{
					console.log(log);
				}
			});

		},
		error: function ( log )
		{
			console.log(log);
		}
	});
	
}



function get_all_data(output){

	$.ajax({
		url:window.apiurl+hash,
		type: "post",
		dataType: 'json',
		data: {},
		success: function(result){
			
			output(result);

		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function get_dynamic_data(output){

	$.ajax({
		url:window.apiurl+hash+"/dynamic_data",
		type: "post",
		dataType: 'json',
		data: {},
		success: function(result){

			output(result);

		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}


function get_owned_calendars(output){
	$.ajax({
		url:window.apiurl+"owned",
		type: "post",
		dataType: 'json',
		data: {},
		success: function(result){
			output(result);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}


function update_children_dynamic_data(){

	$.ajax({
		url:window.apiurl+hash+"/children",
		type: "post",
		dataType: 'json',
		data: {hash: hash},
		success: function(result){

			for(var i = 0; i < result.length; i++){

				var child_hash = result[i].hash;
				var child_static_data = JSON.parse(result[i].static_data);
				var child_dynamic_data = JSON.parse(result[i].dynamic_data);
				var converted_date = date_converter.get_date(static_data, child_static_data, dynamic_data.epoch);
				child_dynamic_data.year = converted_date.year;
				child_dynamic_data.timespan = converted_date.timespan;
				child_dynamic_data.day = converted_date.day;
				child_dynamic_data.epoch = converted_date.epoch;

				$.ajax({
					url:window.baseurl+"calendars/"+child_hash,
					type: "post",
					dataType: 'json',
					data: {_method: 'PATCH', dynamic_data: JSON.stringify(child_dynamic_data)},
					error: function ( log )
					{
						console.log(log);
					}
				});

			}

		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}


function check_last_change(output){
	$.ajax({
		url:window.apiurl+hash+"/last_changed",
		type: "post",
		dataType: 'json',
		data: {},
		success: function(result){
			output(result);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function delete_calendar(){

	$.ajax({
		url:window.apiurl+hash+"/delete",
		type: "post",
		dataType: 'json',
		data: {action: 'delete', hash: hash},
		success: function ( result ){
			window.location.href = '/calendars';
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function create_calendar(){

	$.ajax({
		url:window.baseurl+"calendars",
		type: "post",
		dataType: 'json',
		data: {name: calendar_name, dynamic_data: JSON.stringify(dynamic_data), static_data: JSON.stringify(static_data)},
		success: function ( result ){
			window.location.href = window.baseurl+'calendars/'+result.hash+'/edit';
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function create_event(list, event, callback) {
	// event = Object.assign({_method: 'store'}, event);

	$.ajax({
		url: window.baseurl+"api/eventcategory",
		type: "post",
		dataType: "json",
		data: event,
		success: function ( result ) {
			static_data.event_data.categories[result.id] = result;
			repopulate_event_category_lists();
			callback(list, result.id, result);
		},
		error: function ( log ) {
			console.log(log);
		}
	});
}

function get_event_comments(event_id, callback){

	$.ajax({
		url: window.baseurl+"api/eventcomment/event/"+event_id,
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