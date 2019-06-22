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


var loading_screen_texts = [
	`Calculating start of the next war...`,
	`Preparing "Kill All Players" event...`,
	`Nerfing the moon...`,
	`Writing history...`,
	`Strapping lasers to Tarrasque...`,
	`Calculating airspeed velocity of an unladen swallow...`,
	`Calculating world-ending weather...`,
	`Preparing for the weekend...`,
	`Worshipping the master calendar...`,
	`Creating new and unusual seasons...`,
	`Comforting lunatics...`,
	`Buying new dice...`,
	`Hiding from the Ides of March...`,
	`Securing ropes to limit seasonal drift...`,
	`Making seasons kinder to wasps...`,
	`Adding leap months...`,
	`Rolling to seduce the sun...`,
	`Deciding between solar, lunar, or lunisolar calendars...`,
	`Teaching days to leap...`,
	`Shouting "NO!" at Aecius...`,
	`Selling soul for 1d10 cantrip... `,
	`Implementing niche event conditions...`,
	`Planting dates...`,
	`Converting epochs...`,
	`Defining an era...`,
	`Waking up after a nightmare about leap months with leap days...`,
	`Breaking moon phases...`,
	`Disciplining child calendars...`,
	`Calculating epoch of year 3 billion...`,
	`Making Mondays leap...`,
	`Locating phased moons...`,
	`Ignoring worldbuilding...`,
	`Stocking taverns with hooded strangers...`,
	`Breaking wasp...`,
];

function show_loading_screen(){
	$('#loading_text').text(loading_screen_texts[Math.floor(Math.random()*loading_screen_texts.length)]);
	$('#loading_background').removeClass('hidden');
}

function hide_loading_screen(){
	$('#loading_background').addClass('hidden');
}