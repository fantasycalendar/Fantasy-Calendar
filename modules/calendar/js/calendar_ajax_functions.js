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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_name', name: calendar_name, hash: hash},
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

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_dynamic', dynamic_data: JSON.stringify(dynamic_data), hash: hash},
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

		if(new_static_change > last_static_change){

			if(!confirm('The calendar was updated before you saved. Do you want to override your last changes?')){
				return;
			}

		}

		do_update_all();

	});
}

function do_update_all(){
	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_all', dynamic_data: JSON.stringify(dynamic_data), static_data: JSON.stringify(static_data), hash: hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_children_hashes', hash: hash, children_hashes: JSON.stringify(link_data.children)},
		success: function( result ){

			$.ajax({
				url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
				type: "post",
				dataType: 'json',
				proccessData: false,
				data: {action: 'update_master_hash', hash: child_hash, master_hash: hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_children_hashes', hash: hash, children_hashes: JSON.stringify(link_data.children)},
		success: function( result ){

			$.ajax({
				url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
				type: "post",
				dataType: 'json',
				proccessData: false,
				data: {action: 'remove_master_hash', hash: child_hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load_all', hash: hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load_dynamic', hash: hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'list'},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'list_children_calendars', hash: hash},
		success: function(result){

			for(var i = 0; i < result.length; i++){

				var child_hash = result[i].hash;
				var child_static_data = JSON.parse(result[i].static_data);
				var child_dynamic_data = JSON.parse(result[i].dynamic_data);
				var converted_date = date_converter.get_date(static_data, child_static_data, dynamic_data.epoch);
				child_dynamic_data.year = converted_date.year;
				child_dynamic_data.internal_year = converted_date.year > 0 ? converted_date.year-1 : converted_date.year;
				child_dynamic_data.timespan = converted_date.timespan;
				child_dynamic_data.day = converted_date.day;
				child_dynamic_data.epoch = converted_date.epoch;

				$.ajax({
					url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
					type: "post",
					dataType: 'json',
					proccessData: false,
					data: {action: 'update_dynamic', dynamic_data: JSON.stringify(child_dynamic_data), hash: child_hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'check_last_change', hash: hash},
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
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'delete', hash: hash},
		success: function ( result ){
			window.location.href = '';
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}