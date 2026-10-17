import { describe, it, expect } from 'vitest';
import { _process_fantasycalendar_for_testing as process_fantasycalendar } from '../calendar/preset_parsers';

// ============================================================================
// process_fantasycalendar event-settings copy: print + hide_full
//
// These tests exercise the event-settings copy block (preset_parsers.js
// ~lines 1120-1152). Two confirmed bugs live there:
//   - I37: the `print` block reads `current_event.print` and writes
//          `event.print` instead of `current_event.settings.print` /
//          `event.settings.print`.
//   - hide_full: the else-branch writes `current_event.settings.hide_full`
//          (the SOURCE) instead of `event.settings.hide_full` (the DEST).
//
// The fixture below is the MINIMAL `calendar` that passes every throw-gate
// on the path from the top of process_fantasycalendar to the event-settings
// block. It was derived by reading each gate, not by guessing:
//   - static_data.year_data.{global_week,timespans,leap_days}: empty arrays
//     skip all their loops/throws.
//   - static_data.moons: empty array skips the moon loop.
//   - static_data.clock: present -> defaults applied, no throws.
//   - static_data.seasons: OMITTED entirely (the whole block is guarded by
//     `if (calendar.static_data.seasons !== undefined)`), avoiding the
//     global_settings throw-gates.
//   - static_data.eras / cycles: OMITTED (optional).
//   - static_data.settings: must exist ({} is enough; every field has an
//     else default).
//   - categories: required non-empty-capable array; each needs name +
//     category_settings{hide,player_usable booleans} + event_settings
//     {color,text,hide,print}.
//   - events: required array; each needs name, description, event_category_id,
//     settings{color,text,...}, data{has_duration,duration,limited_repeat,
//     limited_repeat_num,show_first_last,date:[],connected_events:[],
//     conditions:[]}. date:[] (length 0) is accepted and skips condition
//     parsing; conditions:[] passes event_condition_check (empty -> true).
//   - dynamic_data: must be an object (its fields are read at the end).
// ============================================================================

// Fresh template objects equivalent to what parse_json builds and passes in
// (preset_parsers.js lines 10-75). process_fantasycalendar mutates these, so
// each test gets its own copy.
function makeTemplates() {
    const dynamic_data = {
        year: 1,
        timespan: 0,
        day: 1,
        epoch: 0,
        custom_location: false,
        location: 'Equatorial',
    };

    const static_data = {
        year_data: {
            first_day: 1,
            overflow: true,
            global_week: [],
            timespans: [],
            leap_days: [],
        },
        moons: [],
        clock: {
            enabled: false,
            render: false,
            hours: 24,
            minutes: 60,
            offset: 0,
            crowding: 0,
        },
        seasons: {
            data: [],
            locations: [],
            global_settings: {
                season_offset: 0,
                weather_offset: 0,
                seed: 0,
                temp_sys: 'metric',
                wind_sys: 'metric',
                cinematic: false,
                enable_weather: false,
                periodic_seasons: false,
            },
        },
        eras: [],
        settings: {
            layout: 'grid',
            show_current_month: false,
            add_month_number: false,
            add_year_day_number: false,
            allow_view: true,
            only_backwards: true,
            only_reveal_today: false,
            hide_moons: false,
            hide_clock: false,
            hide_events: false,
            hide_eras: false,
            hide_all_weather: false,
            hide_future_weather: false,
            hide_weather_temp: false,
            hide_wind_velocity: false,
            hide_weekdays: false,
            default_category: -1,
            comments: false,
        },
        cycles: {
            format: '',
            data: [],
        },
    };

    return { dynamic_data, static_data };
}

function makeCalendar(eventSettingsOverride) {
    return {
        name: 'Test Calendar',
        static_data: {
            year_data: {
                first_day: 1,
                overflow: true,
                global_week: [],
                timespans: [],
                leap_days: [],
            },
            moons: [],
            clock: {},
            settings: {},
        },
        dynamic_data: {},
        categories: [
            {
                name: 'Test Category',
                category_settings: {
                    hide: false,
                    player_usable: false,
                },
                event_settings: {
                    color: 'Dragon Green',
                    text: 'auto',
                    hide: false,
                    print: true,
                },
            },
        ],
        events: [
            {
                name: 'Test Event',
                description: 'A test event',
                event_category_id: 0,
                settings: {
                    color: 'Dragon Green',
                    text: 'auto',
                    hide: false,
                    ...eventSettingsOverride,
                },
                data: {
                    has_duration: false,
                    duration: 0,
                    limited_repeat: false,
                    limited_repeat_num: 0,
                    show_first_last: false,
                    date: [],
                    connected_events: [],
                    conditions: [],
                },
            },
        ],
    };
}

describe('process_fantasycalendar event print/hide_full settings', () => {

    it('copies event.settings.print = true when input has settings.print true (I37)', () => {
        // Bug I37: code writes `event.print = current_event.print` (both wrong),
        // so event.settings.print is never set -> undefined, not true.
        const calendar = makeCalendar({ print: true, hide_full: true });
        const { dynamic_data, static_data } = makeTemplates();

        const result = process_fantasycalendar(calendar, dynamic_data, static_data);

        expect(result.success).toBe(true);
        expect(result.events[0].settings.print).toBe(true);
    });

    it('defaults event.settings.hide_full = false when input omits hide_full (else-branch typo)', () => {
        // Bug hide_full: the else-branch writes `current_event.settings.hide_full = false`
        // (the SOURCE), leaving event.settings.hide_full undefined instead of false.
        const calendar = makeCalendar({ print: true /* hide_full omitted */ });
        const { dynamic_data, static_data } = makeTemplates();

        const result = process_fantasycalendar(calendar, dynamic_data, static_data);

        expect(result.success).toBe(true);
        expect(result.events[0].settings.hide_full).toBe(false);
    });

    it('copies event.settings.hide_full = true when input has settings.hide_full true', () => {
        const calendar = makeCalendar({ print: true, hide_full: true });
        const { dynamic_data, static_data } = makeTemplates();

        const result = process_fantasycalendar(calendar, dynamic_data, static_data);

        expect(result.success).toBe(true);
        expect(result.events[0].settings.hide_full).toBe(true);
    });
});
