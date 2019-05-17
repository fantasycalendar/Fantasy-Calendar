var getUrlParameter = function getUrlParameter(sParam) {
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


$(document).ready(function(){

	timer = setTimeout('load_calendar()', 100);

});

function check_loaded(){
	console.log(typeof set_inputs !== "function")
}

var hash = getUrlParameter('id');
var external_view = true;
var showcase_view = false;
var owned = false;
var display_calendar = {};
var timer;
var last_changed;

$(window).focus(function() {
	if(!timer)
		timer = setTimeout('check_calendar()', 2500);
});

$(window).blur(function() {
	clearTimeout(timer);
	timer = 0;
});

function convertDate(str){
	dateStr=str; //returned from mysql timestamp/datetime field
	a=dateStr.split(" ");
	d=a[0].split("-");
	t=a[1].split(":");
	return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
}

function check_calendar(){
	$.ajax({
		url:"https://fantasy-calendar.com/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		
		data: {action: 'check', hash: hash},
		success: function(data){
			newchanged = convertDate(data['result']['last_changed']);
			if (newchanged.getTime() > last_changed.getTime()){
				load_calendar();
			}else{
				timer = setTimeout('check_calendar()', 2500);
			}
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function load_calendar(){
	$.ajax({
		url:"https://fantasy-calendar.com/ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		data: {action: 'load', hash: hash},
		success: function(data){
			calendar = $.parseJSON(data['result']['data']);
			last_changed = convertDate(data['result']['last_changed']);
			set_display_calendar();
			display = calendar['clock_enabled'] ? 'table-cell' : 'none';
			$('#left_container').css('display', display);
			build_clock();
			build_calendar();
			$('html, body').animate({
				scrollTop: $(".current_day").parent().parent().offset().top-45
			}, 0);
			timer = setTimeout('check_calendar()', 2500);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}
function set_display_calendar(){

	display_calendar = $.extend( true, {}, calendar );

	if(display_calendar['year_leap'] != 0 && display_calendar['year'] % display_calendar['year_leap'] === 0){
		display_calendar['month_len'][display_calendar['month_leap']-1] = calendar['month_len'][display_calendar['month_leap']-1] + 1;
		display_calendar['year_len'] = calendar['year_len'] + 1;
	}

	if(display_calendar['solstice_enabled']){

		display_calendar['summer_year_day'] = 0;
		display_calendar['winter_year_day'] = 0;
		display_calendar['year_day'] = 0;

		var total = 1;
		for(var month = 1; month <= display_calendar['n_months']; month++)
		{
			for(var day = 1; day <= display_calendar['month_len'][month-1]; day++)
			{
				if(month == display_calendar["summer_month"] && day == display_calendar["summer_day"])
				{
					display_calendar['summer_year_day'] = total;
				}

				if(month == display_calendar["winter_month"] && day == display_calendar["winter_day"])
				{
					display_calendar['winter_year_day'] = total;
				}

				if(month == display_calendar['month'] && day == display_calendar['day'])
				{
					display_calendar['year_day'] = total;
				}

				total++;
			}
		}

		if(display_calendar['summer_year_day'] > display_calendar['winter_year_day'])
		{
			higher = display_calendar['summer_year_day'];
			lower = display_calendar['winter_year_day'];
			higher_len = display_calendar['year_len'] - higher +  lower;
			lower_len = higher - lower;
			lower_to_higher = Math.floor(lower_len/2)+lower
			higher_to_lower = Math.floor(higher_len/2)+higher > display_calendar['year_len'] ? Math.floor(higher_len/2)+higher-display_calendar['year_len'] : Math.floor(higher_len/2)+higher;

			display_calendar['summer_length'] = higher_len;
			display_calendar['winter_length'] = lower_len;

			display_calendar['autumn_equinox'] = higher_to_lower;
			display_calendar['spring_equinox'] = lower_to_higher;
		}
		else
		{
			higher = display_calendar['winter_year_day'];
			lower = display_calendar['summer_year_day'];
			higher_len = display_calendar['year_len'] - higher +  lower;
			lower_len = higher - lower;
			lower_to_higher = Math.floor(lower_len/2)+lower
			higher_to_lower = Math.floor(higher_len/2)+higher > display_calendar['year_len'] ? Math.floor(higher_len/2)+higher-display_calendar['year_len'] : Math.floor(higher_len/2)+higher;

			display_calendar['winter_length'] = higher_len;
			display_calendar['summer_length'] = lower_len;

			display_calendar['autumn_equinox'] = lower_to_higher;
			display_calendar['spring_equinox'] = higher_to_lower;
		}
	}
}