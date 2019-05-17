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

function check_last_date_changed(){

	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'check_last_date_update', hash: hash},
		success: function(result){
			if(result){
				var new_date = new Date(result.last_date_changed);
				if(new_date > last_date_changed){
					last_date_changed = new_date;
					get_current_date();
				}else{
					if(document.hasFocus()){
						timer = setTimeout('check_last_date_changed()', 2500);
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

function get_current_date(){
	$.ajax({
		url:window.baseurl+"modules/calendar/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load_date', hash: hash},
		success: function(result){
			update_date(JSON.parse(result.base));
			timer = setTimeout('check_last_date_changed()', 2500);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}