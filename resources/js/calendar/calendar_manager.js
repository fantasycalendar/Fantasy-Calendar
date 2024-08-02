import { error_message } from "./header";
import { execution_time } from "./calendar_functions";
import { climate_charts } from "./calendar_weather_layout";
import { Climate } from "./calendar_season_generator";
import { eval_current_time, eval_clock } from "./calendar_inputs_visitor";
import { evaluate_save_button } from "./calendar_inputs_edit";
import { $ } from 'jquery';

var utcDate1 = Date.now();

window.registered_click_callbacks = {}
window.registered_keydown_callbacks = {}
window.registered_onfocus_callbacks = {}
window.registered_onblur_callbacks = {}
window.registered_mousemove_callbacks = {}

export function bind_calendar_events() {
    document.addEventListener('keydown', function(event) {
        for (let callback_id in window.registered_keydown_callbacks) {
            window.registered_keydown_callbacks[callback_id](event);
        }
    });

    document.addEventListener('click', function(event) {
        for (let callback_id in window.registered_click_callbacks) {
            window.registered_click_callbacks[callback_id](event);
        }
    });

    window.onfocus = function(event) {
        for (let callback_id in window.registered_onfocus_callbacks) {
            window.registered_onfocus_callbacks[callback_id](event);
        }
    };

    window.onblur = function(event) {
        for (let callback_id in window.registered_onblur_callbacks) {
            window.registered_onblur_callbacks[callback_id](event);
        }
    };

    window.addEventListener('mousemove', function(event) {
        for (let callback_id in window.registered_mousemove_callbacks) {
            window.registered_mousemove_callbacks[callback_id](event);
        }
    });

    $('body').addClass('page-focused').removeClass('page-unfocused');

    window.registered_onfocus_callbacks['page_focused'] = function() {
        setTimeout(function() { $('body').addClass('page-focused').removeClass('page-unfocused'); }, 140);
    }

    window.registered_onblur_callbacks['page_unfocused'] = function() {
        $('body').addClass('page-unfocused').removeClass('page-focused');
    }

    $('#input_collapse_btn').click(function() {
        toggle_sidebar();
    });

    window.calendar_weather.tooltip.set_up();

    $('#calendar_container').on('scroll', function() {
        window.calendar_weather.tooltip.hide();
    });

    $(document).on('change', '.event-text-input', function() {

        let parent = $(this).closest('.sortable-container');

        let value_input = this;

        let output = parent.find('.event-text-output');
        let input = parent.find('.event-text-input');

        output.each(function() {

            var classes = $(this).attr('class').split(' ');

            if (classes.indexOf("hidden_event") > -1) {
                classes.length = 4;
            } else {
                classes.length = 3;
            }

            classes.push($(value_input).val());
            classes.push(input.not(value_input).val());

            classes = classes.join(' ');

            $(this).prop('class', classes);
        })
    });
}

export function eval_apply_changes(output) {
    let apply_changes_immediately = $('#apply_changes_immediately');

    if (apply_changes_immediately.length === 0) {
        output();
    } else if (!apply_changes_immediately.is(':checked')) {
        if (!window.changes_applied) {
            evaluate_save_button();
            $('#reload_background').removeClass('hidden').css('display', 'flex');
        } else {
            $('#reload_background').addClass('hidden').css('display', 'none');
            evaluate_save_button(true);
            output();
        }
    } else {
        evaluate_save_button();
        output();
    }
}

export function pre_rebuild_calendar(action, dynamic_data) {
    eval_apply_changes(function() {
        rebuild_calendar(action, dynamic_data);
    });
}

async function testCalendarAccuracy(fromYear = -100, toYear = 100) {
    execution_time.start();

    window.calendar_data_generator.static_data = window.static_data;
    window.calendar_data_generator.dynamic_data = window.dynamic_data;
    window.calendar_data_generator.owner = Perms.player_at_least('co-owner');
    window.calendar_data_generator.events = window.events;
    window.calendar_data_generator.event_categories = window.event_categories;

    let currentYear = window.calendar_data_generator.dynamic_data.year;

    window.calendar_data_generator.dynamic_data.year = fromYear;

    let result = await window.calendar_data_generator.run();

    let lastYearEndEpoch = result.year_data.end_epoch;

    let year_zero_exists = window.static_data.settings.year_zero_exists;

    fromYear++;
    for (let year = fromYear; year < toYear; year++) {

        window.calendar_data_generator.dynamic_data.year = year;
        if (!year_zero_exists && year === 0) {
            continue;
        }

        let result = await window.calendar_data_generator.run();

        let thisYearStartEpoch = result.year_data.start_epoch;

        console.log(`${year} - Last year ended on ${lastYearEndEpoch} and this year started on ${thisYearStartEpoch} - total of ${Object.keys(result.epoch_data).length}`)

        if ((year_zero_exists && year === 0) || (!year_zero_exists && year === 1)) {
            if (thisYearStartEpoch !== 0) {
                console.error(`YEAR ${year} FAILED! Expected 0, got ${thisYearStartEpoch}!`)
                window.dynamic_data.year = currentYear;
                return;
            }
        }

        if (lastYearEndEpoch !== thisYearStartEpoch - 1) {
            console.error(`YEAR ${year} FAILED! Expected ${lastYearEndEpoch + 1}, got ${thisYearStartEpoch}!`)
            window.dynamic_data.year = currentYear;
            return;
        }

        lastYearEndEpoch = result.year_data.end_epoch;

    }

    console.log("Test succeeded, calendar calculation accurate!")
    window.dynamic_data.year = currentYear;

    execution_time.end("Testing took:");
}

async function testSeasonAccuracy(fromYear = -1000, toYear = 1000) {
    if (window.static_data.seasons.data.length === 0) return;

    window.calendar_data_generator.static_data = window.static_data;
    window.calendar_data_generator.dynamic_data = window.dynamic_data;
    window.calendar_data_generator.owner = Perms.player_at_least('co-owner');
    window.calendar_data_generator.events = window.events;
    window.calendar_data_generator.event_categories = window.event_categories;

    let originalYear = window.calendar_data_generator.dynamic_data.year;

    window.calendar_data_generator.dynamic_data.year = fromYear;

    let result = await window.calendar_data_generator.run();

    let previous_year_end_season_day = result.epoch_data[result.year_data.end_epoch].season.season_day;

    for (let year = fromYear; year < toYear; year++) {

        window.calendar_data_generator.dynamic_data.year++;
        if (!window.static_data.settings.year_zero_exists && window.calendar_data_generator.dynamic_data.year === 0) {
            window.calendar_data_generator.dynamic_data.year++;
        }

        console.log(`Testing year ${window.calendar_data_generator.dynamic_data.year}...`)

        let result = await window.calendar_data_generator.run();

        let start_epoch = result.year_data.start_epoch;
        let end_epoch = result.year_data.end_epoch;

        let current_year_start_season_day = result.epoch_data[start_epoch].season.season_day;

        if (previous_year_end_season_day + 1 !== current_year_start_season_day && current_year_start_season_day !== 1) {
            console.error(`YEAR ${window.calendar_data_generator.dynamic_data.year} FAILED! Start/End Fail. Expected ${previous_year_end_season_day + 1}, got ${current_year_start_season_day}!`);
            window.dynamic_data.year = originalYear;
            return;
        }

        let prev_season_day = current_year_start_season_day;

        for (let epoch = start_epoch + 1; epoch < end_epoch; epoch++) {

            let season_day = result.epoch_data[epoch].season.season_day;

            if (prev_season_day + 1 !== season_day && season_day !== 1) {
                console.error(`YEAR ${window.calendar_data_generator.dynamic_data.year} FAILED! Inner year failed. Expected ${prev_season_day + 1}, got ${season_day}!`)
                window.dynamic_data.year = originalYear;
                return;
            }

            prev_season_day = season_day;

        }

        previous_year_end_season_day = result.epoch_data[result.year_data.end_epoch].season.season_day;

    }

    console.log(`Test succeeded, seasons are accurate across ${Math.abs(fromYear) + Math.abs(toYear)} years!`)

    window.dynamic_data.year = originalYear;
}

window.evaluated_static_data = {};

export async function rebuild_calendar(action, rebuild_data) {
    window.calendar_data_generator.static_data = window.static_data;
    window.calendar_data_generator.dynamic_data = rebuild_data;
    window.calendar_data_generator.owner = Perms.player_at_least('co-owner');
    window.calendar_data_generator.events = window.events;
    window.calendar_data_generator.event_categories = window.event_categories;

    execution_time.start();

    window.calendar_data_generator.run().then(result => {

        window.evaluated_static_data = result;

        rerender_calendar(window.evaluated_static_data);

        window.calendar_weather.epoch_data = window.evaluated_static_data.epoch_data;
        window.calendar_weather.processed_weather = window.evaluated_static_data.processed_weather;
        window.calendar_weather.start_epoch = window.evaluated_static_data.year_data.start_epoch;
        window.calendar_weather.end_epoch = window.evaluated_static_data.year_data.end_epoch;

        climate_charts.evaluate_day_length_chart();
        climate_charts.evaluate_weather_charts();

        eval_clock();

    }).catch(result => {
        if (!result?.errors) {
            console.error(result)
            return;
        }
        let errors = result.errors.map(e => { return `<li>${e}</li>` });
        error_message(`Errors:<ol>${errors.join()}</ol>`);
    });
}

export async function rebuild_climate() {
    let climate_generator = new Climate(
        window.evaluated_static_data.epoch_data,
        window.static_data,
        window.dynamic_data,
        window.dynamic_data.year,
        window.evaluated_static_data.year_data.start_epoch,
        window.evaluated_static_data.year_data.end_epoch
    );

    let prev_seasons = window.calendar_weather.processed_seasons;
    let prev_weather = window.calendar_weather.processed_weather;

    climate_generator.generate().then((result) => {

        window.calendar_weather.epoch_data = result;
        window.evaluated_static_data.epoch_data = result;

        climate_charts.evaluate_day_length_chart();
        climate_charts.evaluate_weather_charts();

        if (prev_seasons !== climate_generator.process_seasons || prev_weather !== climate_generator.process_weather) {
            rerender_calendar();
            eval_clock();
        } else {
            eval_current_time();
        }

    })
}

export function rerender_calendar(processed_data) {
    if (processed_data === undefined) {
        processed_data = window.evaluated_static_data
    };

    window.render_data_generator.create_render_data(processed_data).then((result) => {
        window.dispatchEvent(new CustomEvent('render-data-change', { detail: result }));
    }).catch((err) => {
        $.notify(err);
        console.error(err)
    });
}
