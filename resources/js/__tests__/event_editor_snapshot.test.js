// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import _ from 'lodash';
import { escapeHtml } from '../escape-html.js';
import '../calendar/calendar_functions.js'; // installs Object.compare
import eventEditorFactory from '../calendar-events-editor.js';

/**
 * Stored events reference other events through `data.connected_events`: an
 * `Events` condition's first value is an index into connected_events. The
 * editor works on global event indices, so it must convert when it opens an
 * event — nothing writes the conditions component's converted form back into
 * working_event, so the editor can't rely on it.
 */
function makeEditor(events) {
    return Object.assign(eventEditorFactory(), {
        $store: {
            calendar: {
                events,
                evaluated_static_data: { epoch_data: { 0: {} } },
            },
        },
        $dispatch: vi.fn(),
        $nextTick: (callback) => callback && callback(),
        $refs: { event_name: { focus: vi.fn() } },
        set_up_moon_data: vi.fn(),
        moons: [],
    });
}

const baseData = (overrides = {}) => ({
    has_duration: false,
    duration: 1,
    show_first_last: false,
    limited_repeat: false,
    limited_repeat_num: 1,
    conditions: [],
    connected_events: [],
    date: [],
    search_distance: 0,
    ...overrides,
});

// Easter Monday (index 2) is "1 day after Easter" (index 1).
const calendarEvents = () => [
    { id: 10, name: 'Paschal Full Moon', description: '', settings: {}, data: baseData() },
    { id: 11, name: 'Easter', description: '', settings: {}, data: baseData() },
    {
        id: 12,
        name: 'Easter Monday',
        description: '',
        settings: {},
        data: baseData({
            conditions: [['Events', '0', ['0', '1']]],
            connected_events: ['1'],
            search_distance: 1,
        }),
    },
];

window.history.replaceState({}, '', '/calendars/abc/edit');

describe('event editor unsaved-changes snapshot', () => {
    beforeEach(() => {
        window._ = _;
        window.sanitizeHtml = escapeHtml;
    });

    it('does not report changes for an untouched event with an Events condition', () => {
        const editor = makeEditor(calendarEvents());

        editor.edit_event({ detail: { event_id: 2, epoch: 0 } });

        expect(editor.event_has_changed()).toBe(false);
    });

    it('still reports a real change to that event', () => {
        const editor = makeEditor(calendarEvents());

        editor.edit_event({ detail: { event_id: 2, epoch: 0 } });
        editor.working_event.data.conditions[0][2][1] = '2';

        expect(editor.event_has_changed()).toBe(true);
    });

    it('opens with Events conditions referring to global event indices', () => {
        const editor = makeEditor(calendarEvents());

        editor.edit_event({ detail: { event_id: 2, epoch: 0 } });

        expect(editor.working_event.data.conditions).toEqual([['Events', '0', ['1', '1']]]);
    });

    it('saving an untouched event keeps its link to the same event', () => {
        const events = calendarEvents();
        const editor = makeEditor(events);
        editor.close = vi.fn();

        editor.edit_event({ detail: { event_id: 2, epoch: 0 } });
        editor.working_event.name = 'Easter Monday (renamed)';
        editor.save_event();

        expect(events[2].data.connected_events).toEqual([1]);
        expect(events[2].data.conditions).toEqual([['Events', '0', ['0', '1']]]);
    });

    it('cloning keeps the clone linked to the same event', () => {
        const editor = makeEditor(calendarEvents());

        editor.clone_event({ detail: { event_data: _.cloneDeep(calendarEvents()[2]), epoch: 0 } });

        expect(editor.working_event.data.conditions).toEqual([['Events', '0', ['1', '1']]]);
    });

    it('snapshots cloned events, so edits to a clone are detected', () => {
        const editor = makeEditor(calendarEvents());
        const event_data = _.cloneDeep(calendarEvents()[1]);
        event_data.name = 'Easter (clone)';

        editor.clone_event({ detail: { event_data, epoch: 0 } });
        expect(editor.event_has_changed()).toBe(false);

        editor.working_event.name = 'Renamed clone';
        expect(editor.event_has_changed()).toBe(true);
    });

    it('clears the snapshot on close', () => {
        const editor = makeEditor(calendarEvents());

        editor.edit_event({ detail: { event_id: 1, epoch: 0 } });
        editor.close();

        expect(editor.initial_working_event).toBeFalsy();
    });
});
