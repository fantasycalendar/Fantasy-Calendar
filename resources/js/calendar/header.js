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
				if(warning_message.callback){
					warning_message.callback(true);
				}
				warning_message.hide();
			});
			this.button_cancel.click(function(){
				if(warning_message.callback){
					warning_message.callback(false);
				}
				warning_message.hide();
			});

			this.content = this.background.children().first().children().first();

		},

		show: function(html, callback){

			if(callback !== undefined){
				this.callback = callback;
			}else{
				this.callback = false;
				this.button_cancel.hide();
			}

			this.content.html(html);

			var width = this.background.parent().width();

			this.background.css('display', 'flex');

			evaluate_error_background_size();

		},

		hide: function(){

			this.button_cancel.show();

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
	`Calculating start of the next war`,
	`Preparing "Kill All Players" event`,
	`Nerfing the moon`,
	`Writing history`,
	`Strapping lasers to Tarrasque`,
	`Calculating airspeed velocity of an unladen swallow`,
	`Calculating world-ending weather`,
	`Preparing for the weekend`,
	`Worshipping the master calendar`,
	`Creating new and unusual seasons`,
	`Comforting lunatics`,
	`Buying new dice`,
	`Hiding from the Ides of March`,
	`Securing ropes to limit seasonal drift`,
	`Making seasons kinder to wasps`,
	`Adding leap months`,
	`Rolling to seduce the sun`,
	`Deciding between solar, lunar, or lunisolar calendars`,
	`Teaching days to leap`,
	`Shouting "NO!" at Aecius`,
	`Selling soul for 1d10 cantrip`,
	`Implementing niche event conditions`,
	`Planting dates`,
	`Converting epochs`,
	`Defining an era`,
	`Waking up after a nightmare about leap months with leap days`,
	`Breaking moon phases`,
	`Disciplining child calendars`,
	`Calculating epoch of year 3 billion`,
	`Making Mondays leap`,
	`Locating phased moons`,
	`Ignoring worldbuilding`,
	`Stocking taverns with hooded strangers`,
	`Breaking wasp`,
	`Generating wibbly wobbly timey wimey calendar stuff`,
	`Figuring out issues with Easter`,
	`Grinding bones to make bread`,
	`Computing the wood chucking capabilities of a woodchuck`,
	`Optimizing the electromagnetic pathways to the nuclear bubble terminal`,
	`Establishing warp vector`,
	`Realigning the temporal buffer`,
	`Coming up with new loading screen messages`,
	`Screening now loading screen messages`,
	`Loading newly screened loading screen messages`,
	`I really should be getting back to work`,
	`Playing TCGs with velociraptors`,
	`Bothering Axel`,
	`Bothering Wasp`,
	`Deciding on optimal window for defenestration`,
	`Zapping the hamster`,
	`Spinning that wheel up there to look busy`,
	`Anti-re-un-de-scrambling the dates`,
	`Lacing the sloth`,
	`Thinking of unsolicited worldbuilding advice`,
	`Looking for better fools`,
	`Looking for the droids we are looking for`,
	`Motivating the historians`,
	`Applying alliteration after almanac attack`,
	`Realigning megascope lenses`,
	`Removing donkeys from swamp`,
	`Cleaning up the adventurers' mess... again`,
	`Disbarring rules lawyers`,
	`Preparing obscure historical anecdotes`,
	`Aligning moons`,
	`Deterministically simulating galactic impracticalities`,
	`Railroading adventure beats`,
	`Adding and removing (we hope) subtle inconsistencies`,
	`Trying to forget mondays`,
	`Finishing 34-page backstory`,
	`Deciding on this week's snack list`,
	`Forgetting your password so you don't have to remember it`,
	`Randomly adding leap seconds and leap frogs`,
	`Stealing leaps from frogs`,
	`Randomly deleting some other user's calendar`,
	`Adding intercalary cheat day`,
	`Moving moons from one calendar to another`,
	`Providing sensation of deja vu... Didn't we do this before?`,
	`Calculating spare time`,
	`Bringing calendar home from fancy date`,
	`Stealing dates from fruit bowls`,
	`Trying to remember what you named everything`,
	`DROP TABLE calendar_data; --`,
	`Measuring voltage of current year`,
	`Reclassifying Fantasy Calendar as a dating app`,
	`Finding you some dates`,
	`Sorting events by color`,
	`Asking party members their birthdays`,
	`Determining whether it's Thursday yet`,
	`Telling days they're numbered`,
	`Applying time skip`,
	`Doing the time warp again`,
	`Sorting intercalaries by carb content`,
	`Killing time`,
	`Accurately discounting Nostradamus`,
	`Moving sundial to get more time`,
	`Skipping our long rest`,
	`Distinguishing time from thyme`,
	`Doing things according to schedule`,
	`Bundling octagonal diminutive quiescence`,
	`Skipping a beat and breaking time`
];

function show_loading_screen(){
	$('#loading_text').text(loading_screen_texts[Math.floor(Math.random()*loading_screen_texts.length)] + "...");
	$('#loading_background').removeClass('hidden');
}

function hide_loading_screen(){
	$('#loading_background').addClass('hidden');
}

function slugify(string) {
	const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
	const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
	const p = new RegExp(a.split('').join('|'), 'g')

	return string.toString().toLowerCase()
	  .replace(/\s+/g, '-') // Replace spaces with -
	  .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
	  .replace(/&/g, '-and-') // Replace & with 'and'
	  .replace(/[^\w\-]+/g, '') // Remove all non-word characters
	  .replace(/\-\-+/g, '-') // Replace multiple - with single -
	  .replace(/^-+/, '') // Trim - from start of text
	  .replace(/-+$/, '') // Trim - from end of text
}
