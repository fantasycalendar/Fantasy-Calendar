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

var hash = getUrlParameter('id');
var inc_calendar;
var external_view = false;
var showcase_view = false;
var owned;


$(document).ready(function(){

	timeoutID = window.setTimeout(load_calendar, 150);

	$('#edit_button_container').append("<a href='calendar.php?action=view&id="+hash+"'><button id='view_button' class='btn btn-sm btn-success btn-block'>Go to view</button></a>");

});

function load_calendar(){
	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		dataType: 'json',
		proccessData: false,
		data: {action: 'load', hash: hash},
		success: function(data){
			inc_calendar = $.parseJSON(data['result']['data']);
			$('body').css('display', 'block');
			owned = data['owned'];
			json_load(inc_calendar);
			$('html, body').animate({
				scrollTop: $(".current_day").parent().parent().offset().top-45
			}, 0);
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}


function save_calendar(){

	var json = JSON.stringify(calendar);
	
	$('#btn_save').prop('disabled', true);

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		data: {action: 'edit', hash: hash, name: $('#calendar_name').val(), data: json},
		success: function(result){
			window.onbeforeunload = null;
			inc_calendar = json;
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}

function delete_calendar(){
	window.onbeforeunload = null;
	if (confirm('Are you sure you want to delete this calendar?')) {
		$.ajax({
			url:window.baseurl+"ajax/ajax_calendar",
			type: "post",
			data: {action: 'delete', hash: hash},
			success: function( result ){
				window.location.href = '';
			},
			error: function ( log )
			{
				console.log(log);
			}
		});	
	}else{
		window.onbeforeunload = function() {
			return true;
		};
	}
}