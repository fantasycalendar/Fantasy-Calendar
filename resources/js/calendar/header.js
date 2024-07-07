import $ from 'jquery';

export function header_initialize() {
    $(window).on('resize', function() {
        evaluate_background_size();
    });

    evaluate_background_size();

    loading_bar = new ProgressBar.Line('.loading_bar', {
        strokeWidth: 2,
        easing: 'easeInOut',
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
        }
    });
};

export function evaluate_background_size() {
    var width = $('.flexible_background').first().parent().width();
    $('.flexible_background').width(width);
}

export function error_message(message) {
    $('#modal_text').empty().append(message);
    $('#modal_background').removeClass().addClass('flexible_background').css('display', 'flex');
    $('#modal').removeClass().addClass('error');

    evaluate_background_size();
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
    `Selling soul for 1d10 cantrip...`,
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
    `Grinding bones to make bread...`,
    `Computing the wood chucking capabilities of a woodchuck...`,
    `Optimizing the electromagnetic pathways to the nuclear bubble terminal...`,
    `Establishing warp vector...`,
    `Realigning the temporal buffer...`,
    `Coming up with new loading screen messages...`,
    `Screening now loading screen messages...`,
    `Loading newly screened loading screen messages...`,
    `I really should be getting back to work...`,
    `Playing TCGs with velociraptors...`,
    `Bothering Axel...`,
    `Bothering Wasp...`,
    `Deciding on optimal window for defenestration...`,
    `Zapping the hamster...`,
    `Animating progress to look busy...`,
    `Anti-re-un-de-scrambling the dates...`,
    `Lacing the sloth...`,
    `Thinking of unsolicited worldbuilding advice...`,
    `Looking for better fools...`,
    `Looking for the droids we are looking for...`,
    `Motivating the historians...`,
    `Applying alliteration after almanac attack...`,
    `Realigning megascope lenses...`,
    `Removing donkeys from swamp...`,
    `Cleaning up the adventurers' mess... again...`,
    `Disbarring rules lawyers...`,
    `Preparing obscure historical anecdotes...`,
    `Aligning moons...`,
    `Deterministically simulating galactic impracticalities...`,
    `Railroading adventure beats...`,
    `Adding and removing (we hope) subtle inconsistencies...`,
    `Trying to forget mondays...`,
    `Finishing 34-page backstory...`,
    `Deciding on this week's snack list...`,
    `Forgetting your password so you don't have to remember it...`,
    `Randomly adding leap seconds and leap frogs...`,
    `Stealing leaps from frogs...`,
    `Randomly deleting some other user's calendar...`,
    `Adding intercalary cheat day...`,
    `Moving moons from one calendar to another...`,
    `Providing sensation of deja vu... Didn't we do this before?`,
    `Calculating spare time...`,
    `Bringing calendar home from fancy date...`,
    `Stealing dates from fruit bowls...`,
    `Trying to remember what you named everything...`,
    `DROP TABLE calendar_data; --`,
    `Measuring voltage of current year...`,
    `Reclassifying Fantasy Calendar as a dating app...`,
    `Finding you some dates...`,
    `Sorting events by color...`,
    `Asking party members their birthdays...`,
    `Determining whether it's Thursday yet...`,
    `Telling days they're numbered...`,
    `Applying time skip...`,
    `Doing the time warp again...`,
    `Sorting intercalaries by carb content...`,
    `Killing time...`,
    `Accurately discounting Nostradamus...`,
    `Moving sundial to get more time...`,
    `Skipping our long rest...`,
    `Distinguishing time from thyme...`,
    `Doing things according to schedule...`,
    `Bundling octagonal diminutive quiescence...`,
    `Skipping a beat and breaking time...`,
    `404 Year not found`,
    `Debating the existance of year 0...`,
    `Stealing events from other people's calendars...`,
];


var loading_screen_timer;
var loading_screen_text_timer;

export function show_loading_screen_buffered(loading_bar, cancel_button_callback) {
    loading_screen_timer = setTimeout(function() {
        show_loading_screen_timed(loading_bar, cancel_button_callback)
    }, 100);
}

export function show_loading_screen_timed(loading_bar, cancel_button_callback) {

    // Prevents infinite loading screen in case the buffered loading screen shows up
    // JUST at the right time to avoid being cleared by hide_loading_screen
    if (loading_screen_timer === undefined) return;

    show_loading_screen(loading_bar, cancel_button_callback);

}

export function show_loading_screen(loading_bar, cancel_button_callback, object) {

    $('#loading_background').removeClass('hidden');

    clearTimeout(loading_screen_text_timer)
    set_loading_screen_text(loading_screen_texts.slice(0));

    if (loading_bar !== undefined) {
        $('.loading_spinner').addClass('hidden');
        $('.loading_bar').removeClass('hidden');
    }

    if (cancel_button_callback !== undefined) {
        $('.loading_cancel_button').removeClass('hidden').click(function() {
            cancel_button_callback(object);
        });
    }

}

export function hide_loading_screen() {
    clearTimeout(loading_screen_timer);
    loading_screen_timer = undefined;
    clearTimeout(loading_screen_text_timer);
    loading_screen_text_timer = undefined;
    loading_bar.set(0)
    $('#loading_background').addClass('hidden');
    $('.loading_spinner').removeClass('hidden');
    $('.loading_bar').addClass('hidden');
    $('.loading_cancel_button').addClass('hidden');
    $('#loading_information_text').addClass("hidden");
}

export function set_loading_screen_text(array) {

    if (array.length == 0) {
        array = loading_screen_texts.slice(0);
    }

    var int = Math.floor(Math.random() * array.length)
    var text = array[int];
    array.splice(int, 1);

    $('#loading_text').text(text)

    loading_screen_text_timer = setTimeout(function() {
        set_loading_screen_text(array)
    }, 6000)

}

var progress = 0;

export function slugify(string) {
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

export function toggle_sidebar(force = null) {
    if (force === true) {
        $("#input_container").addClass('inputs_collapsed');
        $("#calendar_container").addClass('inputs_collapsed');
        $('#input_collapse_btn').removeClass('is-active');
    } else if (force === false) {
        $("#input_container").removeClass('inputs_collapsed');
        $("#calendar_container").removeClass('inputs_collapsed');
        $('#input_collapse_btn').addClass('is-active');
    } else {
        $("#input_container").toggleClass('inputs_collapsed');
        $("#calendar_container").toggleClass('inputs_collapsed');
        $('#input_collapse_btn').toggleClass('is-active');
    }

    window.localStorage.setItem('inputs_collapsed', $("#input_container").hasClass('inputs_collapsed'));

    if(typeof window.static_data !== 'undefined' && typeof window.static_data.clock !== 'undefined' && window.static_data.clock.enabled && window.static_data.clock.render && !isNaN(window.static_data.clock.hours) && !isNaN(window.static_data.clock.minutes) && !isNaN(window.static_data.clock.offset)){
        window.Clock.size = $('#clock').width();
    }

    evaluate_background_size();
}
