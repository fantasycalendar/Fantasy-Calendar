import { evaluate_background_size } from "./header";
import {
    update_name,
    update_dynamic,
    update_all,
    link_child_calendar,
    unlink_child_calendar,
    get_calendar_users,
    add_calendar_user,
    update_calendar_user,
    remove_calendar_user,
    resend_calendar_invite,
    get_owned_calendars,
    delete_calendar,
    create_calendar,
} from "./calendar_ajax_functions";
import {
    escapeHtml,
    unescapeHtml,
    debounce,
    ordinal_suffix_of,
    get_current_era,
    convert_year,
    unconvert_year,
    get_timespans_in_year,
    does_timespan_appear,
    clone,
    evaluate_calendar_start,
    get_calendar_data,
} from "./calendar_functions";
import { climate_charts } from "./calendar_weather_layout";
import {
    set_up_visitor_values,
    preview_date_follow,
    update_preview_calendar,
    update_current_day,
    evaluate_settings,
    evaluate_sun,
    repopulate_timespan_select,
    repopulate_day_select,
    eval_clock,
} from "./calendar_inputs_visitor";
import { set_up_view_values } from "./calendar_inputs_view";
import { pre_rebuild_calendar, rebuild_calendar, rebuild_climate } from "./calendar_manager";
import CalendarRenderer from "../calendar-renderer";

export var changes_applied = true;

let save_button = null;
let log_in_button = null;
let create_button = null;
let calendar_container = null;
let weather_container = null;
let removing = false;

let input_container = null;
let timespan_sortable = null;
let first_day = null;
let global_week_sortable = null;
let era_list = null;
let location_list = null;
let calendar_link_select = null;
let calendar_link_list = null;
let calendar_new_link_list = null;

let previous_view_type = 'owner';
let view_type = 'owner';

export function set_up_edit_inputs() {

    window.prev_calendar_name = clone(window.calendar_name);
    window.prev_dynamic_data = clone(window.dynamic_data);
    window.prev_static_data = clone(window.static_data);
    window.prev_events = clone(window.events);
    window.prev_event_categories = clone(window.event_categories);
    window.prev_advancement = clone(window.advancement);

    window.owned_calendars = {};

    window.calendar_name_same = window.calendar_name == window.prev_calendar_name;
    window.static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
    window.dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
    window.events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
    window.event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
    window.advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.advancement);

    window.onbeforeunload = function(e) {

        window.calendar_name_same = window.calendar_name == window.prev_calendar_name;
        window.static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
        window.dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
        window.events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
        window.event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
        window.advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.prev_advancement);

        var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

        if (!not_changed) {

            var confirmationMessage = "It looks like you have unsaved changes, are you sure you want to navigate away from this page?";

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.

        }

    };

    set_up_view_inputs();

    save_button = $('#btn_save');

    save_button.click(function() {

        var text = "Saving..."

        save_button.prop('disabled', true).toggleClass('btn-secondary', true).toggleClass('btn-primary', false).toggleClass('btn-success', false).toggleClass('btn-warning', false).text(text);

        if (!events_same || !event_categories_same || !static_same || !advancement_same) {
            update_all();
        } else if (!dynamic_same) {
            update_dynamic(window.hash);
        } else if (!calendar_name_same) {
            update_name();
        }

    });

    create_button = $('#btn_create');

    create_button.click(function() {

        // Unhook before unload
        window.onbeforeunload = function() { }

        create_calendar();

    });

    log_in_button = $('.login-button');

    log_in_button.click(function() {

        // Unhook before unload
        window.onbeforeunload = function() { }

        window.location = '/login?postlogin=/calendars/create?resume=1';

    });

    save_button.prop('disabled', true);
    create_button.prop('disabled', true);

    $('#btn_delete').click(function() {
        delete_calendar(window.hash, window.calendar_name, function() { self.location = '/calendars' });
    });

    calendar_container = $('#calendar');
    weather_container = $('#weather_container');

    input_container = $('#input_container');
    timespan_sortable = $('#timespan_sortable');
    first_day = $('#first_day');
    era_list = $('#era_list');
    location_list = $('#location_list');
    calendar_link_select = $('#calendar_link_select');
    calendar_link_list = $('#calendar_link_list');
    calendar_new_link_list = $('#calendar_new_link_list');

    var previous_view_type = 'owner';
    view_type = 'owner';

    $('.view-tabs .btn').click(function() {

        view_type = $(this).attr('data-view-type');


        let owner = true;

        $('.view-tabs .btn-primary').removeClass('btn-primary').addClass('btn-secondary');

        $(this).removeClass('btn-secondary').addClass('btn-primary');

        var errors = get_errors();

        switch (view_type) {
            case "owner":
                Perms.owner = true;
                if (creation.is_done() && errors.length == 0) {
                    if (previous_view_type !== 'owner') {
                        evaluate_settings();
                        if (!window.preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', window.preview_date);
                        } else {
                            pre_rebuild_calendar('calendar', window.dynamic_data);
                            preview_date_follow();
                        }
                    }
                }
                climate_charts.active_view = false;
                calendar_container.removeClass('hidden');
                weather_container.addClass('hidden');
                $("#calendar_container").scrollTop(this.last_scroll_height);
                previous_view_type = view_type;
                break;

            case "player":
                Perms.owner = false;
                if (creation.is_done() && errors.length == 0) {
                    if (previous_view_type !== 'player') {
                        evaluate_settings();
                        if (!window.preview_date.follow) {
                            update_preview_calendar();
                            pre_rebuild_calendar('preview', window.preview_date);
                        } else {
                            pre_rebuild_calendar('calendar', window.dynamic_data);
                            preview_date_follow();
                        }
                    }
                }
                climate_charts.active_view = false;
                calendar_container.removeClass('hidden');
                weather_container.addClass('hidden');
                $("#calendar_container").scrollTop(this.last_scroll_height);
                previous_view_type = view_type;
                break;

            case "weather":
                CalendarRenderer.last_scroll_height = $("#calendar_container").scrollTop();
                if (creation.is_done() && errors.length == 0) {
                    evaluate_settings();
                    climate_charts.active_view = true;
                }
                calendar_container.addClass('hidden');
                weather_container.removeClass('hidden');
                break;

        }

        // if(isMobile() && deviceType() == "Mobile Phone") {
        //     toggle_sidebar();
        // }

    });

    /* ------------------- Dynamic and static callbacks ------------------- */

    $('#calendar_name').change(function() {
        window.calendar_name = $(this).val();
        do_error_check();
    });

    // $('#enable_clock').change(function() {
	//
    //     window.static_data.clock.enabled = $(this).is(':checked');
    //     window.static_data.clock.render = $(this).is(':checked');
    //     $('#render_clock').prop('checked', window.static_data.clock.render);
	//
    //     window.dynamic_data.hour = 0;
    //     window.dynamic_data.minute = 0;
	//
    //     evaluate_clock_inputs();
	//
    //     eval_clock();
	//
    //     window.dispatchEvent(new CustomEvent("clock-changed", { detail: { enabled: window.static_data.clock.enabled } }));
	//
    // });

    // $('#collapsible_clock').change(function() {
    //     if ($(this).is(':checked')) {
    //         $('#clock').appendTo($(this).parent().children('.collapsible-content'));
    //     } else {
    //         $('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
    //     }
    // });

    /* ------------------- Layout callbacks ------------------- */

    $(document).on('change', '.week_day_name', function() {
        populate_first_day_select(window.static_data.year_data.first_day);
    });

    $('.add_inputs.timespan .add').click(function() {
        var name = $('#timespan_name_input');
        var type = $('#timespan_type_input');
        var id = timespan_sortable.children().length;
        if (type.val() == "month") {
            var name_val = name.val() == "" ? `Month ${id + 1}` : name.val();
        } else {
            var name_val = name.val() == "" ? `Intercalary Month ${id + 1}` : name.val();
        }

        var length = 1;
        if (window.static_data.year_data.timespans.length == 0) {
            if (window.static_data.year_data.global_week.length > 0) {
                length = window.static_data.year_data.global_week.length;
            }
        } else {
            length = window.static_data.year_data.timespans[window.static_data.year_data.timespans.length - 1].length;
        }

        stats = {
            'name': name_val,
            'type': type.val(),
            'length': length,
            'interval': 1,
            'offset': 0
        };

        add_timespan_to_sortable(timespan_sortable, id, stats);
        window.static_data.year_data.timespans.push(stats);
        // timespan_sortable.sortable('refresh');
        reindex_timespan_sortable();
        name.val("");
        set_up_view_values();
    });


    $(document).on('click', '.expand', function() {
        var parent = $(this).closest('.collapsible');
        if (parent.hasClass('collapsed')) {
            $(this).removeClass('fa-caret-square-down').addClass('fa-caret-square-up');
            parent.removeClass('collapsed').addClass('expanded');
        } else {
            $(this).removeClass('fa-caret-square-up').addClass('fa-caret-square-down');
            parent.removeClass('expanded').addClass('collapsed');
        }
    });

    $(document).on('click', '.location_toggle', function() {
        var checked = $(this).is(':checked');
        $(this).parent().find('.icon').toggleClass('fa-caret-square-up', checked).toggleClass('fa-caret-square-down', !checked);
    });

    $(document).on('click', '.html_edit', function() {
        let era_id = $(this).closest('.sortable-container').attr('index') | 0;
        window.dispatchEvent(new CustomEvent('html-editor-modal-edit-html', { detail: { era_id: era_id } }));
    });

    $('#default_event_category').change(function() {
        let new_default_event_category = $(this).val();
        if (isNaN(new_default_event_category)) {
            let slug = slugify(new_default_event_category);
            window.static_data.settings.default_category = slug;
        } else {
            window.static_data.settings.default_category = new_default_event_category;
        }
        evaluate_save_button();
    });

    $(document).on('click', '.btn_remove', function() {

        if (!$(this).hasClass('disabled')) {

            var parent = $(this).parent().parent().parent();

            if ($(this).parent().parent().hasClass('expanded')) {
                $(this).parent().prev().find('.expand').click();
            }

            if (removing !== null) {
                removing.click();
            }
            removing = $(this).next();
            $(this).parent().parent().find('.main-container').addClass('hidden');
            $(this).parent().parent().find('.collapse-container').addClass('hidden');
            $(this).css('display', 'none');
            $(this).prev().css('display', 'block');
            $(this).next().css('display', 'block');
            $(this).next().next().css('display', 'block');

        }

    });

    $(document).on('click', '.btn_cancel', function() {
        $(this).parent().parent().find('.main-container').removeClass('hidden');
        $(this).parent().parent().find('.collapse-container').removeClass('hidden');
        $(this).css('display', 'none');
        $(this).prev().prev().css('display', 'none');
        $(this).prev().css('display', 'block');
        $(this).next().css('display', 'none');
        removing = null;
    });

    $(document).on('click', '.btn_accept', function() {

        var parent = $(this).closest('.sortable-container').parent();
        var type = parent.attr('id');
        var index = $(this).closest('.sortable-container').attr('index') | 0;

        var callback = false;

        switch (type) {
            case "timespan_sortable":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_timespan_sortable();
                window.dynamic_date_manager.cap_timespan();
                window.dynamic_data.timespan = window.dynamic_date_manager.timespan;
                window.dynamic_data.epoch = window.dynamic_date_manager.epoch;
                break;

            case "era_list":
                $(this).closest('.sortable-container').remove();
                // $(this).closest('.sortable-container').parent().sortable('refresh');
                reindex_era_list();
                window.dynamic_data.current_era = get_current_era(window.static_data, window.dynamic_data.epoch);
                break;

        }

        if (!callback) {

            evaluate_remove_buttons();

            do_error_check(type);

            removing = null;

            input_container.change();

        }

    });

    /* ------------------- Custom callbacks ------------------- */


    $(document).on('change', '.custom_phase', function() {

        var checked = $(this).is(':checked');

        var index = $(this).closest('.sortable-container').attr('index') | 0;

        $(this).closest('.sortable-container').find('.no_custom_phase_container').toggleClass('hidden', checked);
        $(this).closest('.sortable-container').find('.custom_phase_container').toggleClass('hidden', !checked);

        if (checked) {

            var value = "";

            for (var i = 0; i < window.static_data.moons[index].granularity - 1; i++) {
                value += `${i},`
            }

            value += `${i}`

            delete window.static_data.moons[index].cycle;
            delete window.static_data.moons[index].shift;

            $(this).closest('.sortable-container').find('.custom_cycle').val(value).change();

        } else {

            var strings = $(this).closest('.sortable-container').find('.custom_cycle').val().split(',');

            var cycle = (strings.length | 0);

            var offset = (strings[0] | 0);

            $(this).closest('.sortable-container').find('.cycle').val(cycle).change();
            $(this).closest('.sortable-container').find('.shift').val(offset).change();

            delete window.static_data.moons[index].custom_cycle;
        }

    });


    $(document).on('change', '.leap-day .timespan-list', function() {
        repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
    });

    $(document).on('change', '.adds-week-day', function() {
        var container = $(this).closest('.sortable-container');
        var checked = $(this).is(':checked');
        container.find('.week_day_select_container').toggleClass('hidden', !checked);
        container.find('.adds_week_day_data_container').toggleClass('hidden', !checked);
        container.find('.adds_week_day_data_container input, .adds_week_day_data_container select').prop('disabled', !checked);
        container.find('.week-day-select').toggleClass('inclusive', checked).prop('disabled', !checked);
        $('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
        repopulate_weekday_select($(this).closest('.sortable-container').find('.week-day-select'));
        container.find('.internal-list-name').change();
        window.dispatchEvent(new CustomEvent("events-changed"));
    });

    $('#month_overflow').change(function() {
        var checked = $(this).is(':checked');
        $('#first_week_day_container').toggleClass('hidden', !checked).find('select').prop('disabled', !checked);
    });

    $(document).on('change', '.unique-week-input', function() {
        var parent = $(this).closest('.sortable-container');
        var timespan_index = parent.attr('index');
        if ($(this).is(':checked')) {
            var element = [];
            window.static_data.year_data.timespans[timespan_index].week = [];
            for (let index = 0; index < window.static_data.year_data.global_week.length; index++) {
                window.static_data.year_data.timespans[timespan_index].week.push(window.static_data.year_data.global_week[index]);
                element.push(`<input type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${timespan_index}.week' fc-index='${index}'/>`);
            }
            parent.find(".week_list").html(element).parent().parent().removeClass('hidden');
            parent.find(".week_list").children().each(function(i) {
                $(this).val(window.static_data.year_data.global_week[i])
            });

            parent.find(".week-length").prop('disabled', false).val(window.static_data.year_data.global_week.length);
            parent.find(".weekday_quick_add").prop('disabled', false);
        } else {
            parent.find(".week_list").html('').parent().parent().addClass('hidden');
            parent.find(".week-length").prop('disabled', true).val(0);
            parent.find(".weekday_quick_add").prop('disabled', true);
            delete window.static_data.year_data.timespans[timespan_index].week;
            do_error_check();
        }

        window.dispatchEvent(new CustomEvent("events-changed"));
    });

    $(document).on('click', '.weekday_quick_add', function() {

        var container = $(this).closest('.sortable-container');
        var week_day_list = container.find('.week_list');

        var id = (container.attr('index') | 0);

        var timespan = window.static_data.year_data.timespans[id];

        swal.fire({
            title: "Weekday Names",
            text: "Each line entered below creates one week day in this month.",
            input: "textarea",
            inputValue: timespan.week.join('\n'),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "info"
        }).then((result) => {

            if (result.dismiss) return;

            if (result.value === "") {
                swal.fire({
                    title: "Error",
                    text: "You didn't enter any values!",
                    icon: "warning"
                });
            }

            var weekdays = result.value.split('\n');

            timespan.week = weekdays;

            container.find('.week-length').val(weekdays.length);

            week_day_list.empty();

            var element = [];
            for (i = 0; i < timespan.week.length; i++) {
                element.push(`<input type='text' class='form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${index}.week' fc-index='${i}'/>`);
            }

            week_day_list.append(element.join(""));
            week_day_list.children().each(function(i) {
                $(this).val(timespan.week[i])
            });

            do_error_check('calendar');

        });

    });

    $(document).on('change', '.week-length', function() {

        var parent = $(this).closest('.sortable-container');
        var week_list = parent.find('.week_list');
        var timespan_index = parent.attr('index');

        var new_val = ($(this).val() | 0);
        var current_val = (week_list.children().length | 0);

        if (new_val < 1) {
            $(this).val(current_val);
            return;
        }

        if (new_val > current_val) {
            var element = [];
            for (index = current_val; index < new_val; index++) {
                window.static_data.year_data.timespans[timespan_index].week.push(`Week day ${(index + 1)}`);
                element.push(`<input type='text' class='form-control internal-list-name custom_week_day dynamic_input' data='year_data.timespans.${index}.week' fc-index='${index}' value='Week day ${(index + 1)}'/>`);
            }
            week_list.append(element.join(""));
        } else if (new_val < current_val) {
            window.static_data.year_data.timespans[timespan_index].week = window.static_data.year_data.timespans[timespan_index].week.slice(0, new_val);
            week_list.children().slice(new_val).remove();
        }

        window.dispatchEvent(new CustomEvent("events-changed"));
    });

    $(document).on('change', '.custom_week_day', function() {

        populate_first_day_select();

    });

    $(document).on('focusin', '.timespan_occurance_input', function(e) {
        $(this).data('prev', $(this).val());
    });

    $(document).on('change', '.timespan_occurance_input', function(e) {

        var interval = $(this).closest('.sortable-container').find('.interval');
        var interval_val = interval.val() | 0;
        var offset = $(this).closest('.sortable-container').find('.offset');
        var offset_val = offset.val() | 0;

        if (interval_val === undefined || offset_val === undefined) return;

        if (interval_val > 1) {
            offset.prop('disabled', false);
        } else {
            offset.prop('disabled', true).val(0);
        }

        var data = {
            'interval': interval_val,
            'offset': offset_val
        }

        $(this).closest('.sortable-container').find('.timespan_variance_output').html(get_interval_text(true, data));

        window.dynamic_date_manager.cap_timespan();
        window.dynamic_data.timespan = window.dynamic_date_manager.timespan;
        window.dynamic_data.epoch = window.dynamic_date_manager.epoch;

    });

    $(document).on('keyup', '.leap_day_occurance_input', function() {
        var interval = $(this).closest('.sortable-container').find('.interval');
        interval.val(interval.val().replace(/[ `~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z]/g, ""));
    });

    function sorter(a, b) {
        if (a < b) return -1;  // any negative number works
        if (a > b) return 1;   // any positive number works
        return 0; // equal values MUST yield zero
    }

    $(document).on('change', '.timespan_length', function() {
        var index = $(this).closest('.sortable-container').attr('index') | 0;
        repopulate_day_select($(`.timespan-day-list`), undefined, undefined, undefined, undefined, index);
        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
        window.preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.preview_date.year), window.preview_date.timespan, window.preview_date.day).epoch;
    });

    $(document).on('change', '.year-input', function() {
        repopulate_timespan_select($(this).closest('.date_control').find('.timespan-list'));
        repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
    });

    $(document).on('change', '.timespan-list', function() {
        repopulate_day_select($(this).closest('.date_control').find('.timespan-day-list'))
    });


    $(document).on('change', '.sortable-container.leap-day', function() {

        var changed_timespan = $(this).find('.timespan-list');
        var changed_days = $(this).find('.timespan-day-list');

        $('.timespan-list').each(function() {
            repopulate_timespan_select($(this), $(this).val(), changed_timespan == $(this));
        });

        $('.timespan-day-list').each(function() {
            repopulate_day_select($(this), $(this).val(), changed_days == $(this));
        });

        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
        window.preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.preview_date.year), window.preview_date.timespan, window.preview_date.day).epoch;

    });


    $(document).on('change', '.invalid', function() {
        if ($(this).val() !== null) {
            $(this).removeClass('invalid');
        }
    });


    $('#refresh_calendar_list_select').click(function() {
        populate_calendar_lists();
    });

    $('#link_calendar').prop('disabled', true);

    calendar_link_select.change(function() {
        calendar_new_link_list.empty();
        if ($(this).val() != "None") {
            var calendar_hash = $(this).val();
            var calendar = window.owned_calendars[calendar_hash];
            add_link_to_list(calendar_new_link_list, calendar_new_link_list.children().length, false, calendar);
        }
    });

    $(document).on('click', '.link_calendar', function() {

        calendar_link_select.prop('disabled', true);

        var calendar_hash = $(this).attr('hash');

        var year = Number($(this).closest('.collapse-container').find('.year-input').val());
        year = convert_year(window.static_data, year);
        var timespan = Number($(this).closest('.collapse-container').find('.timespan-list').val());
        var day = Number($(this).closest('.collapse-container').find('.timespan-day-list').val());

        swal.fire({
            title: "Linking Calendar",
            html: "<p>Linking calendars will disable all structural inputs on both calendars (month lengths, week lengths, hours per day, minutes) so the link can be preserved. The link can be broken again at any point.</p>" +
                "<p>Are you sure you want link and save this calendar?</p>",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, link and save calendar',
            cancelButtonText: 'Leave unlinked',
            icon: "info"
        })
            .then((result) => {

                if (!result.dismiss) {

                    calendar_new_link_list.empty();

                    var date = [year, timespan, day];

                    var epoch_offset = evaluate_calendar_start(window.static_data, year, timespan, day).epoch;

                    link_child_calendar(calendar_hash, date, epoch_offset);

                } else {
                    calendar_link_select.prop('disabled', false);
                }

            })

    });

    $(document).on('click', '.unlink_calendar', function() {

        swal.fire({
            title: "Unlinking Calendar",
            html: "<p>Are you sure you want to break the link to this calendar?</p><p>This cannot be undone.</p>",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, unlink',
            cancelButtonText: 'Leave linked',
            icon: "warning"
        })
            .then((result) => {

                if (!result.dismiss) {

                    var calendar_hash = $(this).attr('hash');

                    unlink_child_calendar(populate_calendar_lists, calendar_hash);

                }
            });
    });

    window.user_list_opened = false;

    $('#collapsible_users').change(function() {
        if (!window.user_list_opened) {
            set_up_user_list();
        }
    });

    $('#refresh_calendar_users').click(function() {

        var button = $(this);
        button.prop('disabled', true);
        set_up_user_list();

        setTimeout(() => {
            button.prop('disabled', false);
        }, 2000);

    });

    $('#email_input').on('keypress', function(e) {
        $('#btn_send_invite').prop('disabled', false);

        if (e.which === 13) {
            $('#btn_send_invite').click();
        }
    });

    $('#btn_send_invite').click(function() {

        var email = $('#email_input').val();

        $(this).prop('disabled', true);

        let valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

        $('#email_input').toggleClass('invalid', !valid_email);

        if (valid_email) {
            add_calendar_user(email, function(success, text) {
                $('.email_text').text(text).parent().toggleClass('hidden', text.length === 0);
                $('#email_input').toggleClass('invalid', !success);
                $('.email_text').toggleClass('alert-danger', !success);
                $('#btn_send_invite').prop('disabled', false);
                if (success) {
                    $('#email_input').val('');
                    set_up_user_list();
                }
            });
        } else {
            $(this).prop('disabled', false);
            $('.email_text').text(!valid_email ? "This email is invalid!" : "").toggleClass('alert-danger', !valid_email).parent().toggleClass('hidden', valid_email);
        }

        setTimeout(() => {
            $('.email_text').text("").parent().toggleClass('hidden', true);
        }, 5000);

    });

    $(document).on('click', '.update_user_permissions', function() {

        var button = $(this);
        var container = button.closest('.sortable-container');
        var dropdown = container.find('.user_permissions_select');

        button.prop('disabled', true);

        var user_id = button.attr('user_id');
        var permissions = dropdown.val();

        update_calendar_user(user_id, permissions, function(success, text) {

            button.prop('disabled', success);
            button.attr('permissions_val', permissions);

            container.find('.user_permissions_text').parent().toggleClass('hidden', false);
            container.find('.user_permissions_text').parent().toggleClass('error', !success);
            container.find('.user_permissions_text').text(text);

            setTimeout(() => {
                container.find('.user_permissions_text').parent().toggleClass('hidden', true);
                container.find('.user_permissions_text').text("");
            }, 5000);

        });


    });

    $(document).on('click', '.remove_user', function() {

        var user_name = $(this).attr('username');
        var user_role = $(this).attr('role');
        var user_id = $(this).attr('user_id') | 0;

        if (user_role != "invited") {

            swal.fire({
                title: "Removing User",
                html: `<p>Are you sure you want to remove <strong>${user_name}</strong> from this calendar?</p>`,
                input: 'checkbox',
                inputPlaceholder: 'Remove all of their contributions as well',
                inputClass: "form-control",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove',
                cancelButtonText: 'Cancel',
                icon: "warning"
            })
                .then((result) => {

                    if (!result.dismiss) {

                        var remove_all = result.value == 1;

                        remove_calendar_user(user_id, remove_all, function() {
                            set_up_user_list();
                        });

                    }
                });

        } else {

            swal.fire({
                title: "Cancel Invititation",
                html: `<p>Are you sure you want to cancel the invitation for <strong>${user_name}</strong>?</p>`,
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it',
                cancelButtonText: 'Nah, leave it',
                icon: "warning"
            })
                .then((result) => {

                    if (!result.dismiss) {

                        remove_calendar_user(user_id, false, function() {
                            set_up_user_list();
                        }, user_name);

                    }
                });

        }

    });

    $(document).on('click', '.resend_invitation', function() {

        var button = $(this);
        var container = button.closest('.sortable-container');
        button.prop('disabled', true);

        var email = button.attr('user_email');

        resend_calendar_invite(email, function(success, text) {

            button.prop('disabled', success);

            container.find('.user_permissions_text').parent().toggleClass('hidden', false);
            container.find('.user_permissions_text').parent().toggleClass('error', !success);
            container.find('.user_permissions_text').text(text);

            setTimeout(() => {
                container.find('.user_permissions_text').parent().toggleClass('hidden', true);
                container.find('.user_permissions_text').text("");
            }, 5000);

        });

    });


    $('#apply_changes_btn').click(function() {

        var errors = get_errors();

        if (errors.length == 0 && $('.invalid').length == 0) {

            changes_applied = true;

            if (!window.preview_date.follow) {

                update_preview_calendar();

                pre_rebuild_calendar('preview', window.preview_date);

            } else {

                pre_rebuild_calendar('calendar', window.dynamic_data);

                preview_date_follow();

            }

        }

    });

    $('#apply_changes_immediately').change(function() {

        var checked = $(this).is(':checked');

        var errors = get_errors();

        if (errors.length > 0) {
            return;
        }

        if (checked) {

            changes_applied = false;

            $('#reload_background').addClass('hidden').css('display', 'none');
            evaluate_save_button(true);

            if (!window.preview_date.follow) {

                update_preview_calendar();

                rebuild_calendar('preview', window.preview_date);

            } else {

                rebuild_calendar('calendar', window.dynamic_data);

                preview_date_follow();

            }

        }

    });

    $('input[fc-index="allow_view"]').change(function() {
        var checked = $(this).is(':checked');
        var only_backwards = $('input[fc-index="only_backwards"]');
        only_backwards.prop('disabled', !checked);
        only_backwards.closest('.setting').toggleClass('disabled', !checked);
        var only_backwards_checked = only_backwards.is(':checked');
        if (!checked && only_backwards_checked) {
            only_backwards.prop('checked', false).change();
        }
    });

    document.addEventListener("advancement-changed", function(event) {
        advancement = event.detail.data;
        evaluate_save_button();
    });
}

function update_data(e) {
    if (block_inputs) return;

    if (e.originalEvent) {
        var target = $(e.originalEvent.target);
    } else {
        var target = $(e.target);
    }

    if (target.hasClass('invalid')) {
        return;
    }

    if (target.attr('class') !== undefined && target.attr('class').indexOf('dynamic_input') > -1) {

        var data = target.attr('data');
        var type = data.split('.');

        if (target.hasClass('category_dynamic_input')) {
            var current_calendar_data = window.event_categories[type[0]];
        } else {
            var current_calendar_data = window.static_data[type[0]];
        }

        for (var i = 1; i < type.length - 1; i++) {
            current_calendar_data = current_calendar_data[type[i]];
        }

        var key = target.attr('fc-index');

        if (type.includes('cycles') && type.includes('names')) {

            current_calendar_data[type[type.length - 1]] = [];

            target.closest('.cycle_list').children().each(function(i) {
                current_calendar_data[type[type.length - 1]][i] = $(this).val();
            });

        } else {

            var set = true;

            if (!target.is(':disabled')) {

                switch (target.attr('type')) {
                    case "number":
                        if (target.attr('step') === "any") {
                            var value = parseFloat(target.val());
                            var min = undefined;
                            var max = undefined;
                            if (target.attr('min')) {
                                var min = parseFloat(target.attr('min'));
                            }
                            if (target.attr('max')) {
                                var max = parseFloat(target.attr('max'));
                            }
                        } else {
                            var value = parseInt(target.val().split('.')[0]);
                            var min = undefined;
                            var max = undefined;
                            if (target.attr('min')) {
                                var min = parseInt(target.attr('min'));
                            }
                            if (target.attr('max')) {
                                var max = parseInt(target.attr('max'));
                            }
                        }
                        if (value < min || value > max) {
                            if (target.data('prev')) {
                                target.val(target.data('prev'));
                                return;
                            } else {
                                set = false;
                            }
                        }
                        target.val(value);
                        break;

                    case "checkbox":
                        var value = target.is(":checked");
                        break;

                    case "color":
                        var value = "#00CBFC"; // target.spectrum("get").toString();
                        break;

                    default:
                        var value = target.val();
                        break;
                }

                if (target.attr('class').indexOf('slider_input') > -1) {
                    value = value / 100;
                }

                if (type.length > 1) {
                    current_calendar_data = current_calendar_data[type[type.length - 1]];
                }

                if (set) current_calendar_data[key] = value;

            }
        }

        var refresh = target.attr('refresh') === "true" || refresh === undefined;

        do_error_check(type[0], refresh);


    } else if (target.attr('class') !== undefined && target.attr('class').indexOf('static_input') > -1) {


        var type = target.attr('data').split('.');

        var current_calendar_data = window.static_data;

        for (var i = 0; i < type.length; i++) {
            current_calendar_data = current_calendar_data[type[i]];
        }

        var key = target.attr('fc-index');
        var key2 = false;

        switch (target.attr('type')) {
            case "number":
                var value = parseFloat(target.val());
                break;

            case "checkbox":
                var value = target.is(":checked");
                break;

            case "color":
                var value = "#00CBFC"; // target.spectrum("get").toString();
                break;

            default:
                value = escapeHtml(target.val());
                break;
        }

        current_calendar_data[key] = value;

        var refresh = target.attr('refresh');
        refresh = refresh === "true" || refresh === undefined;

        if (type.includes('clock')) {
            // evaluate_clock_inputs();
        }

        if (key == "year_zero_exists") {
            refresh_interval_texts();
            set_up_view_values();
            set_up_visitor_values();
            window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
            window.preview_date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.preview_date.year), window.preview_date.timespan, window.preview_date.day).epoch;
        }

        if (target.attr('refresh') == "clock") {
            eval_clock();
            evaluate_save_button();
        }

        evaluate_settings();

        do_error_check(type[0], refresh);
    }

    window.dispatchEvent(new CustomEvent('calendar-structure-changed'));
}

function add_timespan_to_sortable(parent, key, data) {
    if (key == 0) $('.timespan_sortable_header').removeClass('hidden');

    const weekBase64 = btoa(encodeURIComponent(JSON.stringify(data.week ?? [])));

    var element = $(
        `<div class='sortable-container list-group-item ${data.type} collapsed collapsible' type='${data.type}' index='${key}' x-data="{ type: '${data.type}', week: JSON.parse(decodeURIComponent(atob('${weekBase64}'))) }">
            <div class='main-container' x-data="{ deleting: false }">
			<div class='handle fa fa-bars' x-show="reordering && !deleting"></div>
			<div class='expand fa fa-caret-square-down' x-show="!reordering && !deleting"></div>
			<div class='name-container input-group' x-show="!deleting">
                <input value="${data.name}" type='text' step='1.0' tabindex='${(100 + key)}' class='flex-grow-1 name-input small-input form-control dynamic_input pr-0' data='year_data.timespans.${key}' fc-index='name'/>
                <input @blur="if ((!$event.target.value) || $event.target.value < 1) { $event.target.value = 1; } else { console.log($event.target.value) }" type='number' min='1' class='flex-shrink-1 length-input form-control dynamic_input timespan_length' data='year_data.timespans.${key}' fc-index='length' tabindex='${(100 + key)}' value='${data.length}'/>
			</div>
            <div class='d-flex align-items-center justify-content-between full' :class="{ 'hidden': !deleting }">
                <div class='pl-1'>Are you sure?</div>
                <div class='d-flex align-items-center'>
                    <div @click='deleting = false' class='btn btn-danger fa fa-xmark mx-1'></div>
                    <div class='btn_accept btn btn-success fa fa-check d-block'></div>
                </div>
            </div>
            <div @click='deleting = true' class='btn btn-danger fa fa-trash ml-1' x-show="reordering && !deleting"></div>
		</div>

		<div class='collapse-container container pb-2'>

			<div class='row no-gutters'>
                <div class='col'>Type: ${(data.type == "month" ? "Month" : "Intercalary month")}</div>
			</div>

			<div class='row no-gutters mt-1'>
				<div class='col-6 pr-1'>
					<div>Leap interval:</div>
				</div>

				<div class='col-6 pl-1'>
					<div>Leap offset:</div>
				</div>
			</div>

			<div class='row no-gutters mb-1'>
				<div class='col-6 pr-1'>
					<input type='number' step="1" min='1' class='form-control timespan_occurance_input interval dynamic_input small-input' data='year_data.timespans.${key}' fc-index='interval' value='${data.interval}' />
				</div>

				<div class='col-6 pl-1'>
					<input type='number' step="1" min='0' class='form-control timespan_occurance_input offset dynamic_input small-input' min='0' data='year_data.timespans.${key}' fc-index='offset' value='${data.interval === 1 ? 0 : data.offset}'
					${data.interval === 1 ? " disabled" : ""}
					/>
				</div>
			</div>

			<div class='row no-gutters my-1'>
				<div class='col-12 italics-text timespan_variance_output'>
					${get_interval_text(true, data)}
				</div>
			</div>

            <div x-show="type === 'month'">
                <div class='row no-gutters my-1'>
                    <div class='col-12'><div class='separator'></div></div>
                </div>

                <div class='row no-gutters my-1'>
                    <div class='form-check col-12 py-2 border rounded'>
                        <input type='checkbox' id='${key}_custom_week' class='form-check-input unique-week-input'
                        ${data.week ? "checked" : ""}
                        />
                        <label for='${key}_custom_week' class='form-check-label ml-1'>
                            Use custom week
                        </label>
                    </div>
                </div>

                <div class='custom-week-container ${(!data.week ? "hidden" : "")}'>

                    <div class='row no-gutters my-1'>
                        <div class='col-12'>
                            Custom week length:
                        </div>
                    </div>

                    <div class='row no-gutters mb-1'>
                        <div class='input-group'>
                            <input @blur="do_error_check('calendar')" type='number' min='1' step="1" class='form-control week-length small-input' ${(!data.week ? "disabled" : "")} value='${(data.week ? data.week.length : 0)}'/>
                            <div class="input-group-append">
                                <button type='button' class='full btn btn-primary weekday_quick_add' ${(!data.week ? "disabled" : "")}>Quick add</button>
                            </div>
                        </div>
                    </div>

                    <div class='row no-gutters border'>
                        <div class='week_list col-12 p-1'>
                            <template x-for='(day, index) in week' :key='index'>
                                <input :value='day' type='text' class='form-control internal-list-name dynamic_input custom_week_day' data='year_data.timespans.${key}.week' :fc-index='index'/>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>`);

    if (data.week) {
        element.find('.week_list').children().each(function(i) {
            $(this).val(data.week[i]);
        });
    }

    parent.append(element);
}


function add_link_to_list(parent, key, locked, calendar) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item collapsible ${locked ? "collapsed" : "expanded"}' index='${key}'>`);
    element.push("<div class='main-container'>");
    element.push(`<div class='expand icon-${locked ? "expand" : "collapse"} ml-2'></div>`);
    element.push("<div class='name-container'>");
    element.push(`<div><a href="${window.baseurl}calendars/${calendar.hash}/edit" target="_blank">${calendar.name}</a></div>`);
    element.push(`</div>`);
    element.push("</div>");

    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row my-1 bold-text'>");

    element.push("<div class='col'>");

    element.push("Relative Start Date:");

    element.push(`<div class='date_control'>`);
    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<input type='number' step="1.0" class='date form-control small-input year-input' ${(locked ? 'disabled' : '')}>`);
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-list' ${(locked ? 'disabled' : '')}>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");

    element.push(`<div class='row my-2'>`);
    element.push("<div class='col'>");
    element.push(`<select type='number' class='date custom-select form-control timespan-day-list' ${(locked ? 'disabled' : '')}>`);
    element.push("</select>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-1'>");
    if (locked) {
        element.push(`<button type='button' class='btn btn-danger full unlink_calendar' hash='${calendar.hash}'>Unlink</button>`);
    } else {
        element.push(`<button type='button' class='btn btn-primary full link_calendar' hash='${calendar.hash}'>Link</button>`);
    }
    element.push("</div>");

    element.push("</div>");

    var element = $(element.join(""));

    parent.append(element);

    if (locked) {
        var parent_link_date = JSON.parse(calendar.parent_link_date);
    } else {
        var parent_link_date = [0, 0, 1];
    }

    element.find('.year-input').val(unconvert_year(window.static_data, Number(parent_link_date[0])));
    repopulate_timespan_select(element.find('.timespan-list'), Number(parent_link_date[1]), false)
    repopulate_day_select(element.find('.timespan-day-list'), Number(parent_link_date[2]), false)

    return element;
}

function add_user_to_list(parent, key, data) {

    var element = [];

    element.push(`<div class='sortable-container list-group-item' index='${key}'>`);

    element.push("<div class='collapse-container container mb-2'>");

    element.push("<div class='row no-gutters my-2'>");
    element.push("<div class='col-md'>");
    element.push(`<h4 class='m-0'>${data.username}</h4>`);
    element.push("</div>");
    element.push("<div class='col-md-auto'>");
    element.push(`<button type='button' class='btn btn-sm btn-danger full remove_user' role='${data.user_role}' username='${data.username}' user_id='${data.id}'><i class='fas fa-trash'></i></button>`);
    element.push("</div>");
    element.push("</div>");

    element.push("<div class='row no-gutters my-2'>");
    element.push("<div class='col'>");
    element.push("<div class='separator'></div>");
    element.push("</div>");
    element.push("</div>");

    if (data.user_role != "invited") {

        element.push("<div class='row no-gutters mt-1'>");
        element.push(`<p class='m-0'>Permissions:</p>`);
        element.push("</div>");

        element.push("<div class='row no-gutters mb-1'>");
        element.push("<div class='col-md'>");
        element.push("<select class='form-control user_permissions_select' onchange='user_permissions_select(this)'>");
        element.push(`<option ${data.user_role == 'observer' ? "selected" : ""} value='observer'>Observer</option>`);
        element.push(`<option ${data.user_role == 'player' ? "selected" : ""} value='player'>Player</option>`);
        element.push(`<option ${data.user_role == 'co-owner' ? "selected" : ""} value='co-owner'>CO-GM</option>`);
        element.push("</select>");
        element.push("</div>");
        element.push("<div class='col-md-auto'>");
        element.push(`<button type='button' class='btn btn btn-primary full update_user_permissions' disabled permissions_val='${data.user_role}' user_id='${data.id}'>Update</button>`);
        element.push("</div>");
        element.push("</div>");

    } else {

        element.push("<div class='row no-gutters my-1'>");
        element.push(`<p class='m-0'>We've sent them an invitation to your calendar, and now we're just waiting for them to accept it!</p>`);
        element.push("</div>");

        element.push("<div class='row no-gutters my-2'>");
        element.push(`<button type="button" class="btn btn-primary resend_invitation" user_email='${data.username}'>Resend invitation email</button>`);
        element.push("</div>");

    }

    element.push("<div class='row no-gutters my-1 hidden'>");
    element.push(`<p class='m-0 user_permissions_text'></p>`);
    element.push("</div>");

    element.push("</div>");

    element.push("</div>");

    var element = $(element.join(""));

    parent.append(element);

    return element;
}

function get_errors() {

    var errors = [];

    if (window.calendar_name == "") {
        errors.push("The calendar name cannot be empty.")
    }

    if (window.static_data.year_data.timespans.length != 0) {
        for (var era_i = 0; era_i < window.static_data.eras.length; era_i++) {
            var era = window.static_data.eras[era_i];
            if (window.static_data.year_data.timespans[era.date.timespan]) {
                var appears = does_timespan_appear(window.static_data, convert_year(window.static_data, era.date.year), era.date.timespan);
                if (!appears.result) {
                    if (appears.reason == 'era ended') {
                        errors.push(`Era <i>${era.name}</i> is on a date that doesn't exist due to a previous era ending the year. Please move it to another year.`);
                    } else {
                        errors.push(`Era <i>${era.name}</i> is currently on a month that is leaping on that year. Please change its year or move it to another month.`);
                    }
                }
            } else {
                errors.push(`Era <i>${era.name}</i> doesn't have a valid month.`);
            }
        }

        for (var era_i = 0; era_i < window.static_data.eras.length - 1; era_i++) {
            var curr = window.static_data.eras[era_i];
            var next = window.static_data.eras[era_i + 1];
            if (!curr.settings.starting_era && !next.settings.starting_era) {
                if (curr.year == next.date.year && curr.settings.ends_year && next.settings.ends_year) {
                    errors.push(`Eras <i>${curr.name}</i> and <i>${next.name}</i> both end the same year. This is not possible.`);
                }
                if (curr.date.year == next.date.year && curr.date.timespan == next.date.timespan && curr.date.day == next.date.day) {
                    errors.push(`Eras <i>${window.static_data.eras[era_i].name}</i> and <i>${window.static_data.eras[era_i + 1].name}</i> both share the same date. One has to come after another.`);
                }
            }
        }
    }

    if (window.static_data.year_data.timespans.length != 0) {

        if (window.static_data.seasons.global_settings.periodic_seasons) {
            for (var season_i = 0; season_i < window.static_data.seasons.data.length; season_i++) {
                var season = window.static_data.seasons.data[season_i];
                if (window.static_data.seasons.global_settings.periodic_seasons) {
                    if (season.transition_length == 0) {
                        errors.push(`Season <i>${season.name}</i> can't have 0 transition length.`);
                    }
                } else {
                    if (window.static_data.year_data.timespans[season.timespan].interval != 1) {
                        errors.push(`Season <i>${season.name}</i> can't be on a leaping month.`);
                    }
                }
            }
        } else {

            for (var season_i = 0; season_i < window.static_data.seasons.data.length - 1; season_i++) {
                var curr_season = window.static_data.seasons.data[season_i];
                var next_season = window.static_data.seasons.data[season_i + 1];
                if (curr_season.timespan == next_season.timespan && curr_season.day == next_season.day) {
                    errors.push(`Season <i>${curr_season.name}</i> and <i>${next_season.name}</i> cannot be on the same month and day.`);
                }
            }
        }
    }

    if (window.static_data.clock.enabled) {

        if (window.static_data.clock.hours === 0) {
            errors.push(`If the clock is enabled, you need to have more than 0 hours per day.`);
        }

        if (window.static_data.clock.minutes === 0) {
            errors.push(`If the clock is enabled, you need to have more than 0 minutes per hour.`);
        }

    }

    return errors;

}

export const creation = {

    text: [],
    current_step: 1,
    steps: 3,

    is_done: function() {

        if (this.current_step > this.steps) {
            return true;
        }

        this.text = [];

        if (this.current_step >= 1) {
            if (window.calendar_name == "") {
                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> Your calendar must have a name</span>.`)
                this.current_step = 1;
            } else {
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> Your calendar has a name!</span>`);
                this.current_step = 2;
            }
        }

        if (this.current_step >= 2) {
            if (window.static_data.year_data.global_week.length == 0) {
                $("#collapsible_globalweek").prop("checked", true);

                $("#calendar_name").blur();
                setTimeout(function() { $('#weekday_name_input').focus() }, 200);

                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> You need at least one week day.</span>`);
            } else {
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> You have at least one week day!</span>`);
                this.current_step = 3;
            }
        }

        if (this.current_step >= 3) {
            if (window.static_data.year_data.timespans.length == 0) {
                $("#collapsible_timespans").prop("checked", true);

                this.text.push(`<span><i class="mr-2 fas fa-calendar"></i> You need at least one month.</span>`);
            } else {
                $("#collapsible_globalweek").prop("checked", false);
                this.text.push(`<span style="opacity: 0.4;"><i class="mr-2 fas fa-calendar-check"></i> You have at least one month!</span>`);
                this.current_step = 4;
            }
        }

        return this.current_step > this.steps;
    }
}

export var do_error_check = debounce(function(type, rebuild) {
    evaluate_save_button();

    if (!creation.is_done()) {

        evaluate_background_size();

        $('#generator_container').removeClass();
        $('#generator_container').addClass('step-' + (creation.current_step));

    } else {

        $('#generator_container').removeClass();

        var errors = get_errors();

        if (errors.length == 0 && $('.static_input.invalid').length == 0 && $('.dynamic_input.invalid').length == 0) {

            error_check(type, rebuild);

        }

    }
}, 150);

function error_check(parent, rebuild) {

    changes_applied = false;

    if (parent === "eras") {
        for (var i = 0; i < window.static_data.eras.length; i++) {
            window.static_data.eras[i].date.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.static_data.eras[i].date.year), window.static_data.eras[i].date.timespan, window.static_data.eras[i].date.day).epoch;
        }
    }
    if (rebuild === undefined || rebuild) {

        if (!window.preview_date.follow) {

            update_preview_calendar();

            pre_rebuild_calendar('preview', window.preview_date);

        } else {

            pre_rebuild_calendar('calendar', window.dynamic_data);

            preview_date_follow();

        }

    } else {

        if (parent !== undefined && (parent === "seasons")) {
            rebuild_climate();
        } else {
            pre_rebuild_calendar('calendar', window.dynamic_data);
            update_current_day(true);
            evaluate_sun();
        }
    }

}

function evaluate_remove_buttons() {
    $('.month .btn_remove, .week_day .btn_remove').each(function() {
        $(this).toggleClass('disabled', $(this).closest('.sortable').children().length == 1);
    });
}

export function populate_first_day_select(val) {
    var custom_week = false;
    timespan_sortable.children().each(function() {
        if ($(this).find('.unique-week-input').is(':checked')) {
            custom_week = true;
        }
    });

    var i = 0;

    var timespan = false;

    if (custom_week) {
        while (true) {
            var timespans = get_timespans_in_year(window.static_data, i, true);
            if (timespans.length > 0) {
                if (window.static_data.year_data.timespans[timespans[0].id].week !== undefined) {
                    timespan = timespans[0].id;
                }
                break;
            }
            if (i > 1000) break;
            i++;
        }
    }

    var week = timespan === false ? window.static_data.year_data.global_week : window.static_data.year_data.timespans[timespan].week;

    var html = [];

    for (var i = 0; i < week.length; i++) {

        html.push(`<option value='${i + 1}'>${week[i]}</option>`);

    }

    if (val !== undefined) {
        var selected_first_day = val;
    } else {
        var selected_first_day = first_day.val() ? first_day.val() : 1;
    }

    first_day.html(html.join('')).val(selected_first_day);
}

function repopulate_weekday_select(elements, value, change) {
    change = change === undefined ? true : change;

    elements.each(function() {

        var timespan = $(this).attr('timespan') | 0;

        var inclusive = $(this).hasClass('inclusive');

        if (timespan === undefined) {

            var week = window.static_data.year_data.global_week;

        } else {

            var week = window.static_data.year_data.timespans[timespan].week ? window.static_data.year_data.timespans[timespan].week : window.static_data.year_data.global_week;

        }

        var selected = value === undefined ? $(this).val() | 0 : value;

        selected = selected > week.length ? week.length - 1 : selected;

        var html = [];

        if (inclusive) {
            html.push(`<option value='0'>Before ${week[0]}</option>`);
        } else {
            selected = selected == 0 ? 1 : selected;
        }

        for (var i = 0; i < week.length; i++) {

            html.push(`<option value='${i + 1}'>${week[i]}</option>`);

        }

        $(this).html(html.join('')).val(selected);

        if (change) {
            $(this).change();
        }
    });
}

function reindex_timespan_sortable() {
    var tabindex = 100;

    timespan_sortable.children().each(function(i) {

    });

    window.static_data.year_data.timespans = [];

    var previous_indexes = [];

    timespan_sortable.children().each(function(i) {

        $('.dynamic_input', this).each(function() {
            $(this).attr('data', $(this).attr('data').replace(/[0-9]+/g, i));
        });

        let previous_index = $(this).attr('index');

        previous_indexes.push(previous_index)

        $(this).attr('index', i);

        $(this).find('.name-input').prop('tabindex', tabindex + 1)
        tabindex++;
        $(this).find('.length-input').prop('tabindex', tabindex + 1)
        tabindex++;

        window.static_data.year_data.timespans[i] = {
            'name': $(this).find('.name-input').val(),
            'type': $(this).attr('type'),
            'length': Number($(this).find('.length-input').val()),
            'interval': Number($(this).find('.interval').val()),
            'offset': Number($(this).find('.offset').val())
        };

        $(this).find('.unique-week-input').prop('id', i + '_custom_week')
        $(this).find('.unique-week-input').next().prop('for', i + '_custom_week')

        if ($(this).find('.unique-week-input').is(':checked')) {
            window.static_data.year_data.timespans[i].week = [];
            $(this).find('.week_list').children().each(function(j) {
                window.static_data.year_data.timespans[i].week[j] = $(this).val();
            });
        }

    });

    repopulate_timespan_select();

    do_error_check();

    evaluate_remove_buttons();

    window.dispatchEvent(new CustomEvent("events-changed"));
}


export function adjustInput(element, target, int) {
    var target = $(target);
    target.val((target.val() | 0) + int).change();
}

export function calendar_saved() {
    var text = "Saved!"

    save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', true).toggleClass('btn-primary', false).toggleClass('btn-warning', false).toggleClass('btn-danger', false).text(text);

    setTimeout(evaluate_save_button, 3000);
}

export function calendar_save_failed() {
    var text = "Failed to save!"

    save_button.prop('disabled', true).toggleClass(['btn-secondary', 'btn-primary', 'btn-danger'], false).toggleClass(['btn-success', 'btn-warning'], true).text(text);
    setInterval(function() {
        evaluate_save_button(true);
    }, 10000);
}

export function evaluate_save_button(override) {
    if (!creation.is_done()) {
        return;
    }

    var errors = get_errors();

    if ($('#btn_save').length) {

        if (errors.length > 0 || $('.static_input.invalid').length > 0 || $('.dynamic_input.invalid').length > 0) {

            var text = "Calendar has errors - can't save"

            save_button.prop('disabled', true).toggleClass('btn-secondary', false).toggleClass('btn-success', false).toggleClass('btn-primary', false).toggleClass('btn-warning', false).toggleClass('btn-danger', true).text(text);

        } else {

            calendar_name_same = window.calendar_name == window.prev_calendar_name;
            static_same = JSON.stringify(window.static_data) === JSON.stringify(window.prev_static_data);
            dynamic_same = JSON.stringify(window.dynamic_data) === JSON.stringify(window.prev_dynamic_data);
            events_same = JSON.stringify(window.events) === JSON.stringify(window.prev_events);
            event_categories_same = JSON.stringify(window.event_categories) === JSON.stringify(window.prev_event_categories);
            advancement_same = JSON.stringify(window.advancement) === JSON.stringify(window.prev_advancement);

            var not_changed = static_same && dynamic_same && calendar_name_same && events_same && event_categories_same && advancement_same;

            var text = not_changed ? "No changes to save" : "Save calendar";

            var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

            if (!apply_changes_immediately && !override) {

                var text = not_changed ? "No changes to save" : "Apply changes to save";

                save_button.prop('disabled', true);

            } else {

                save_button.prop('disabled', not_changed);

            }

            save_button.toggleClass('btn-secondary', false).toggleClass('btn-success', not_changed).toggleClass('btn-primary', !not_changed).toggleClass('btn-warning', false).toggleClass('btn-danger', false).text(text);

            return not_changed;

        }

    } else if ($('#btn_create').length) {

        var invalid = errors.length > 0;

        var text = invalid ? "Cannot create yet" : "Save Calendar";

        var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

        if (!apply_changes_immediately && !override && !invalid) {

            var text = "Apply changes to create";

            create_button.prop('disabled', true);

        } else {

            create_button.prop('disabled', invalid);

        }

        autosave();

        create_button.toggleClass('btn-danger', invalid).toggleClass('btn-success', !invalid).text(text);

    } else if ($('.login-button').length) {

        var invalid = errors.length > 0;

        var apply_changes_immediately = $('#apply_changes_immediately').is(':checked');

        if (!apply_changes_immediately && !override && !invalid) {

            log_in_button.prop('disabled', true);

        } else {

            log_in_button.prop('disabled', invalid);

        }

        autosave();

    }
}

function populate_calendar_lists() {
    get_owned_calendars(function(calendars) {

        window.owned_calendars = calendars;

        calendar_link_list.html('');

        for (var calendar_hash in window.owned_calendars) {

            var calendar = window.owned_calendars[calendar_hash];

            if (calendar.hash == window.hash) {

                for (var index in calendar.children) {

                    var child_hash = calendar.children[index];
                    var child = window.owned_calendars[child_hash];

                    add_link_to_list(calendar_link_list, index, true, child);

                }

            }

        }

        var html = [];

        html.push(`<option>None</option>`);

        for (var calendar_hash in window.owned_calendars) {

            var child_calendar = window.owned_calendars[calendar_hash];

            if (child_calendar.hash != window.hash) {

                if (child_calendar.parent_hash) {

                    var calendar_owner = clone(window.owned_calendars[child_calendar.parent_hash]);

                    if (calendar_owner.hash == window.hash) {
                        calendar_owner.name = "this calendar";
                    }

                } else {

                    var calendar_owner = false;

                }

                html.push(`<option ${calendar_owner ? "disabled" : ""} value="${child_calendar.hash}">${child_calendar.name}${calendar_owner ? ` | Linked to ${calendar_owner.name}` : ""}</option>`);
            }
        }

        calendar_link_select.html(html.join(''));
        calendar_link_select.prop('disabled', false);

    });
}

// export function evaluate_clock_inputs() {
//     $('.clock_inputs :input, .clock_inputs :button, .render_clock').not('[clocktype]').prop('disabled', !window.static_data.clock.enabled);
//     $('.clock_inputs, .render_clock').toggleClass('hidden', !window.static_data.clock.enabled);
//
//     $('.do_render_clock :input, .do_render_clock :button').prop('disabled', !window.static_data.clock.render);
//     $('.do_render_clock').toggleClass('hidden', !window.static_data.clock.render);
//
//     $('.hour_input').each(function() {
//         $(this).prop('min', 0).prop('max', window.static_data.clock.hours).not('[clocktype]').prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
//     });
//     $('.minute_input').each(function() {
//         $(this).prop('min', 1).prop('max', window.static_data.clock.minutes - 1).not('[clocktype]').prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
//     });
//
//     $('input[clocktype="timezone_hour"]').each(function() {
//         $(this).prop('min', window.static_data.clock.hours * -0.5).prop('max', window.static_data.clock.hours * 0.5).prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
//     });
//     $('input[clocktype="timezone_minute"]').each(function() {
//         $(this).prop('min', window.static_data.clock.minutes * -0.5).prop('max', window.static_data.clock.minutes * 0.5).prop('disabled', !window.static_data.clock.enabled).toggleClass('hidden', !window.static_data.clock.enabled);
//     });
//
//     $('#create_season_events').prop('disabled', window.static_data.seasons.data.length == 0 && !window.static_data.clock.enabled);
// }

var block_inputs = false;

export function set_up_edit_values() {
    block_inputs = true;

    $('#calendar_name').val(window.calendar_name);

    $('.static_input').each(function() {

        var data = $(this).attr('data');
        var key = $(this).attr('fc-index');

        var current_calendar_data = get_calendar_data(data);

        if (current_calendar_data[key] !== undefined) {

            switch ($(this).attr('type')) {
                case "checkbox":
                    $(this).prop("checked", current_calendar_data[key]);
                    break;

                case "color":
                    // $(this).spectrum("set", current_calendar_data[key]);
                    break;

                default:
                    $(this).val(unescapeHtml(current_calendar_data[key]));
                    break;
            }
        }

    });

    $('input[fc-index="only_backwards"]').prop('disabled', !window.static_data.settings.allow_view);
    $('input[fc-index="only_backwards"]').closest('.setting').toggleClass('disabled', !window.static_data.settings.allow_view);

    let custom_week = window.static_data.year_data.timespans.filter(t => t?.week?.length > 0).length > 0
        || window.static_data.year_data.leap_days.filter(l => l.adds_week_day).length > 0;

    if (custom_week) {
        $('#month_overflow').prop('checked', !custom_week);
        window.static_data.year_data.overflow = false;
    }

    $('#month_overflow').prop('disabled', custom_week);
    $('.month_overflow_container').toggleClass("hidden", custom_week)
    $('#overflow_explanation').toggleClass('hidden', !custom_week);

    populate_first_day_select(window.static_data.year_data.first_day);
    $('#first_week_day_container').toggleClass('hidden', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0).find('select').prop('disabled', !window.static_data.year_data.overflow || window.static_data.year_data.global_week.length == 0);
    // global_week_sortable.sortable('refresh');

    if (window.static_data.year_data.timespans.length > 0) {

        for (var i = 0; i < window.static_data.year_data.timespans.length; i++) {
            add_timespan_to_sortable(timespan_sortable, i, window.static_data.year_data.timespans[i]);
        }
        // timespan_sortable.sortable('refresh');

    }

    // if ($('#collapsible_clock').is(':checked')) {
    //     $('#clock').appendTo($('#collapsible_clock').parent().children('.collapsible-content'));
    // } else {
    //     $('#clock').prependTo($('#collapsible_date').parent().children('.collapsible-content'));
    // }

    if (window.location.pathname != '/calendars/create') {

        populate_calendar_lists();

        if ($("#collapsible_users").is(":checked")) {
            set_up_user_list();
        }

    }

    evaluate_remove_buttons();

    block_inputs = false;
}

export function get_category(search) {
    if (window.event_categories.length == 0) {
        return { id: -1 };
    }

    if (isNaN(search)) {
        var results = window.event_categories.filter(function(element) {
            return slugify(element.name) == search;
        });
    } else {
        var results = window.event_categories.filter(function(element) {
            return element.id == search;
        });
    }

    if (results.length < 1) {
        return { id: -1 };
    }

    return results[0];
}

export function empty_edit_values() {
    timespan_sortable.empty()
    first_day.empty()
    global_week_sortable.empty()
    era_list.empty()
    location_list.empty()
    calendar_link_select.empty()
    calendar_link_list.empty()
    calendar_new_link_list.empty()
}


function autosave() {
    var saved_data = JSON.stringify({
        calendar_name: window.calendar_name,
        static_data: window.static_data,
        dynamic_data: window.dynamic_data,
        events: window.events,
        event_categories: window.event_categories
    })

    localStorage.setItem('autosave', saved_data);
}

export function query_autoload() {
    if (localStorage.getItem('autosave')) {

        swal.fire({
            title: "Load unsaved calendar?",
            text: "It looks like you started a new calendar and didn't save it. Would you like to continue where you left off?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue',
            cancelButtonText: 'Start Over',
            icon: "info"
        })
            .then((result) => {

                if (!result.dismiss) {

                    autoload(true);

                } else {

                    localStorage.clear();

                }

            });

    }
}

export function autoload(popup) {
    let saved_data = localStorage.getItem('autosave');

    if (saved_data) {

        var data = JSON.parse(saved_data);
        window.prev_calendar_name = "";
        window.prev_dynamic_data = {};
        window.prev_static_data = {};
        window.prev_events = {};
        window.prev_event_categories = {};
        window.calendar_name = data.calendar_name;
        window.static_data = data.static_data;
        window.dynamic_data = data.dynamic_data;
        window.events = data.events;
        window.event_categories = data.event_categories;
        window.dynamic_data.epoch = evaluate_calendar_start(window.static_data, convert_year(window.static_data, window.dynamic_data.year), window.dynamic_data.timespan, window.dynamic_data.day).epoch;
        empty_edit_values();
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();

        do_error_check("calendar", true);

        if (popup) {
            swal.fire({
                icon: "success",
                title: "Loaded!",
                text: "The calendar " + window.calendar_name + " has been loaded."
            });
        }

        window.dispatchEvent(new CustomEvent("events-changed"));
    }
}

function refresh_interval_texts() {
    timespan_sortable.children().each(function(index) {

        var timespan = window.static_data.year_data.timespans[index];

        $(this).find('.timespan_variance_output').text(get_interval_text(true, timespan));

    });
}


function get_interval_text(timespan, data) {
    var text = "";

    if (timespan) {

        text = "This timespan will appear every";

        if (data.interval > 1) {
            text += " " + ordinal_suffix_of(data.interval)
        }

        text += " year";

        if (data.interval > 1) {

            if (data.interval == 1) {
                data.offset = 0;
            }

            var original_offset = ((data.interval + data.offset) % data.interval);
            if (original_offset === 0) {
                var start_year = data.interval;
            } else {
                var start_year = original_offset;
            }
            text += ", starting year " + start_year + `. (${window.static_data.settings.year_zero_exists && original_offset == 0 ? "year 0," : "year"} ${start_year}, ${data.interval + start_year}, ${(data.interval * 2) + start_year}...)`;

        }

        text += ".";

    }

    return text;
}

export function linked_popup() {
    var html = [];
    html.push("<p>As you've noticed, some options are missing. Nothing is broken! We promise. This calendar just has its date <strong>linked with another.</strong></p>");
    html.push("<p>Things like month lengths, weekdays, leap days, hours, minutes, and eras are structural to a calendar, and changing them while two calendars are linked would be like changing the wheels on a moving car.</p>");
    html.push("<p>To change this calendar's structure, simply unlink it from any other calendar(s).</p>");

    swal.fire({
        title: "Linked Calendar",
        html: html.join(''),
        icon: "info"
    });
}

function set_up_user_list() {
    if ($('#calendar_user_list').length) {

        $('#calendar_user_list').empty();

        get_calendar_users(function(userlist) {

            for (var index in userlist) {
                var user = userlist[index];
                add_user_to_list($('#calendar_user_list'), index, user)
            }

            window.user_list_opened = true;

        });
    }
}

function user_permissions_select(select) {
    var button = $(select).closest('.sortable-container').find('.update_user_permissions');

    var new_value = $(select).val();
    var curr_value = button.attr('permissions_val');

    button.prop('disabled', new_value === curr_value);
}
