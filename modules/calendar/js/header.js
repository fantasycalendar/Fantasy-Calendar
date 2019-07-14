$(document).ready(function(){

	$(window).on('resize', function(){
		evaluate_error_background_size();
	});

	warning_message = {

		background: $('#warnings_background'),

		init: function(){

			this.button_ok = $('#warnings_ok');
			this.button_cancel = $('#warnings_cancel');

			this.button_ok.click(function(){
				warning_message.callback(true);
				warning_message.hide();
			});
			this.button_cancel.click(function(){
				warning_message.callback(false);
				warning_message.hide();
			});

			this.content = this.background.children().first().children().first();

		},

		show: function(html, callback){

			this.callback = callback;

			this.content.html(html);

			var width = this.background.parent().width();

			this.background.css('display', 'flex');

			evaluate_error_background_size();

		},

		hide: function(){

			this.background.css('display', 'none');

			this.content.html('');

		}

	}

	warning_message.init();

});

function evaluate_error_background_size(){
	var width = $('#errors_background').parent().width();
	$('#errors_background').width(width);
	var width = $('#warnings_background').parent().width();
	$('#warnings_background').width(width);
}

function error_message(message){

	var width = $('#errors_background').parent().width();

	$('#error_text').empty().append(message);
	$('#errors_background').removeClass().addClass('error').css('display', 'flex');

	evaluate_error_background_size();

}


function close_error_message(){

	$('#errors_background').removeClass().css('display', 'none');

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
	`Generating wibbly wobbly timey wimey calendar stuff...`,
	`Figuring out issues with Easter...`,
];

function show_loading_screen(){
	$('#loading_text').text(loading_screen_texts[Math.floor(Math.random()*loading_screen_texts.length)]);
	$('#loading_background').removeClass('hidden');
}

function hide_loading_screen(){
	$('#loading_background').addClass('hidden');
}