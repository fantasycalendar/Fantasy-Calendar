// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import _ from 'lodash';
import { escapeHtml } from '../escape-html.js';
import '../calendar/calendar_functions.js';
import eventEditorFactory from '../calendar-events-editor.js';

const eventData = (conditions, connected_events = []) => ({
    has_duration: false,
    duration: 1,
    show_first_last: false,
    limited_repeat: false,
    limited_repeat_num: 1,
    conditions,
    connected_events,
    date: [],
    search_distance: 0,
});

function makeEditor(events = []) {
    return Object.assign(eventEditorFactory(), {
        $store: { calendar: { events, evaluated_static_data: { epoch_data: { 0: {} } } } },
        $dispatch: vi.fn(),
        $nextTick: vi.fn(),
        $refs: { event_name: { focus: vi.fn() } },
        set_up_moon_data: vi.fn(),
        moons: [],
    });
}

describe('every-nth-weekday preset', () => {
    beforeEach(() => {
        window._ = _;
        window.sanitizeHtml = escapeHtml;
    });

    it('repeats on that weekday every n weeks, rather than counting back from year end', () => {
        const editor = makeEditor();
        editor.working_event = { data: eventData([]) };
        editor.epoch_data = { week_day_name: 'Friday', total_week_num: 7 };

        editor.apply_preset_conditions('every_x_weekday', 3);

        // Week condition 32 is "Every nth total week": total_week_num % n == offset.
        expect(editor.working_event.data.conditions).toEqual([
            ['Weekday', '0', ['Friday']],
            ['&&'],
            ['Week', '32', [3, 1]],
        ]);
    });
});

describe('season simulation warning', () => {
    const season = ['Season', '0', ['0']];
    const weekday = ['Weekday', '0', ['Friday']];

    beforeEach(() => {
        window._ = _;
        window.sanitizeHtml = escapeHtml;
    });

    it('is not needed for an event without season conditions', () => {
        const editor = makeEditor([{ data: eventData([weekday]) }]);
        editor.edit_event({ detail: { event_id: 0, epoch: 0 } });

        expect(editor.evaluation_has_season_event()).toBe(false);
    });

    it('does not stick after testing an event that did have one', () => {
        const editor = makeEditor([
            { data: eventData([season]) },
            { data: eventData([weekday]) },
        ]);

        editor.edit_event({ detail: { event_id: 0, epoch: 0 } });
        expect(editor.evaluation_has_season_event()).toBe(true);

        editor.close();
        editor.edit_event({ detail: { event_id: 1, epoch: 0 } });
        expect(editor.evaluation_has_season_event()).toBe(false);
    });

    it('is needed when an event the edited one depends on uses seasons', () => {
        const editor = makeEditor([
            { data: eventData([season]) },
            { data: eventData([['Events', '0', ['0', '1']]], [0]) },
        ]);

        editor.edit_event({ detail: { event_id: 1, epoch: 0 } });

        expect(editor.evaluation_has_season_event()).toBe(true);
    });

    it('follows the dependency chain through several events, and survives cycles', () => {
        const editor = makeEditor([
            { data: eventData([season]) },
            { data: eventData([['Events', '0', ['0', '1']]], ['0']) },
            { data: eventData([['Events', '0', ['0', '1']], ['&&'], ['Events', '0', ['1', '1']]], [1, 2]) },
        ]);

        editor.edit_event({ detail: { event_id: 2, epoch: 0 } });

        expect(editor.evaluation_has_season_event()).toBe(true);
    });
});
