function reload_calendar(data){
	calendar_name		= data.name;
	static_data			= data.static_data;
	dynamic_data 		= data.dynamic_data;
}


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

function check_last_change(){

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'check_last_change', hash: hash},
		success: function(result){

			if(result){

				var new_dynamic_change = new Date(result.last_dynamic_change);
				var new_static_change = new Date(result.last_static_change);

				if(new_static_change > last_static_change){

					last_static_change = new_static_change;
					last_dynamic_change = new_dynamic_change;
					get_all_data();

				}else{

					if(new_dynamic_change > last_dynamic_change){

						last_dynamic_change = new_dynamic_change;
						get_dynamic_data();
					}

				}

				if(document.hasFocus()){
					timer = setTimeout('check_last_change()', 2500);
				}
			}
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function check_last_change_forced(){

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'check_last_change', hash: hash},
		success: function(result){

			if(result){

				var new_dynamic_change = new Date(result.last_dynamic_change);
				var new_static_change = new Date(result.last_static_change);

				if(new_static_change > last_static_change || new_dynamic_change > last_dynamic_change){

					last_static_change = new_static_change;
					last_dynamic_change = new_dynamic_change;
					get_all_data();

				}

				if(document.hasFocus()){
					timer = setTimeout('check_last_change()', 2500);
				}
			}
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

function get_dynamic_data(){

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load_dynamic', hash: hash},
		success: function(result){

			var new_dynamic_data = JSON.parse(result.dynamic_data);

			if(JSON.stringify(dynamic_data) !== JSON.stringify(new_dynamic_data)){

				if(static_data.settings.only_reveal_today){
					dynamic_data = clone(new_dynamic_data);
					rebuild_calendar('calendar', dynamic_data);
					update_current_day(true);
				}else{
					update_date(new_dynamic_data);
					if(dynamic_data.location != new_dynamic_data.location){
						dynamic_data = clone(new_dynamic_data);
						rebuild_climate();
					}
				}

			}

		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function get_all_data(){
	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load_all', hash: hash},
		success: function(result){
			var new_static_data = JSON.parse(result.static_data);
			var new_dynamic_data = JSON.parse(result.dynamic_data);
			if(JSON.stringify(static_data) !== JSON.stringify(new_static_data) || static_data.settings.only_reveal_today){
				static_data = clone(new_static_data);
				rebuild_calendar('calendar', dynamic_data);
			}else{
				update_date(new_dynamic_data);
			}
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function update_dynamic(){
	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_dynamic', dynamic_data: JSON.stringify(dynamic_data), hash: hash},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function update_all(){
	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'update_all', name: calendar_name, dynamic_data: JSON.stringify(dynamic_data), static_data: JSON.stringify(static_data), hash: hash},
		success: function(result){
			save_button.prop('disabled', true);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}