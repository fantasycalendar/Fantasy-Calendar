$(document).ready(function(){

	$(window).on('resize', function(){
		evaluate_error_background_size();
	});

});

function evaluate_error_background_size(){
	var width = $('#calendar_errors_background').parent().width();
	$('#calendar_errors_background').width(width);
}

function calendar_error_message(message){

	var width = $('#calendar_errors_background').parent().width();

	$('#calendar_error_text').empty().append(message);
	$('#calendar_errors_background').removeClass().addClass('error').css('display', 'flex');

	evaluate_error_background_size();

}

function calendar_warning_message(message){

	var width = $('#calendar_errors_background').parent().width();

	$('#calendar_error_text').empty().append(message);
	$('#calendar_errors_background').removeClass().addClass('warning').css('display', 'flex');

	evaluate_error_background_size();

}

function close_calendar_message(){

	$('#calendar_errors_background').removeClass().css('display', 'none');

}