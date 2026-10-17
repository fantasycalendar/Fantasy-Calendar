// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import _ from 'lodash';
import { escapeHtml } from '../escape-html.js';
import '../calendar/calendar_functions.js';
import eventEditorFactory from '../calendar-events-editor.js';

/**
 * "Test event" sends the calendar's events, with the edited event swapped in,
 * to a worker. The store must not change while a test runs, or after it
 * finishes, fails or is cancelled — it's reactive and gets saved.
 */
let workers;

class FakeWorker {
    constructor() {
        this.terminated = false;
        workers.push(this);
    }
    postMessage(payload) {
        this.payload = payload;
    }
    terminate() {
        this.terminated = true;
    }
    reply(data) {
        this.onmessage({ data });
    }
}

const eventData = (overrides = {}) => ({
    has_duration: false,
    duration: 1,
    show_first_last: false,
    limited_repeat: false,
    limited_repeat_num: 1,
    conditions: [['Month', '0', ['0']]],
    connected_events: [],
    date: [],
    search_distance: 0,
    ...overrides,
});

function makeEditor() {
    const store = {
        calendar_name: 'Test',
        static_data: { settings: { year_zero_exists: false } },
        preview_date: { year: 2026 },
        event_categories: [],
        perms: { player_at_least: () => true },
        evaluated_static_data: { epoch_data: { 0: {} } },
        events: [{ id: 1, name: 'Existing', description: '', settings: {}, data: eventData() }],
    };

    const editor = Object.assign(eventEditorFactory(), {
        $store: { calendar: store },
        $dispatch: vi.fn(),
        $nextTick: vi.fn(),
        $refs: { event_name: { focus: vi.fn() } },
        set_up_moon_data: vi.fn(),
        set_up_event_text: vi.fn(),
        populate_condition_presets: vi.fn(),
        update_every_nth_preset_labels: vi.fn(),
        apply_preset_conditions: vi.fn(),
        moons: [],
    });

    return { editor, store };
}

const busyEnded = (editor) => editor.$dispatch.mock.calls.some(([name]) => name === 'app-busy-end');

describe('event editor test runs', () => {
    beforeEach(() => {
        workers = [];
        globalThis.Worker = FakeWorker;
        window._ = _;
        window.sanitizeHtml = escapeHtml;
    });

    it('tests an edited existing event without touching the store', () => {
        const { editor, store } = makeEditor();
        const before = _.cloneDeep(store.events);

        editor.edit_event({ detail: { event_id: 0, epoch: 0 } });
        editor.working_event.data.conditions = [['Month', '0', ['5']]];
        editor.test_event(1);

        expect(store.events).toEqual(before);
        expect(workers[0].payload.events[0].data.conditions).toEqual([['Month', '0', ['5']]]);

        workers[0].reply({ occurrences: [] });
        expect(store.events).toEqual(before);
    });

    it('sends the worker absolute years (display 2026 is absolute 2025 without a year zero)', () => {
        const { editor } = makeEditor();

        editor.edit_event({ detail: { event_id: 0, epoch: 0 } });
        editor.test_event(10);

        expect(workers[0].payload).toMatchObject({ start_year: 2025, end_year: 2035 });
    });

    it('tests a new event without adding it to the store, before or after', () => {
        const { editor, store } = makeEditor();

        editor.create_new_event({ detail: { epoch: 0 } });
        editor.test_event(1);

        expect(store.events).toHaveLength(1);
        expect(workers[0].payload.events).toHaveLength(2);
        expect(workers[0].payload.event_id).toBe(1);

        workers[0].reply({ occurrences: [] });
        expect(store.events).toHaveLength(1);
    });

    it('cancelling leaves the store untouched and ends the busy state', () => {
        const { editor, store } = makeEditor();
        const before = _.cloneDeep(store.events);

        editor.create_new_event({ detail: { epoch: 0 } });
        editor.test_event(1);
        editor.cancel_event_test();

        expect(store.events).toEqual(before);
        expect(workers[0].terminated).toBe(true);
        expect(editor.worker_event_tester).toBeNull();
        expect(busyEnded(editor)).toBe(true);
    });

    it('a failure reported by the worker ends the busy state and says so', () => {
        const { editor, store } = makeEditor();
        const before = _.cloneDeep(store.events);
        const notifications = [];
        window.addEventListener('notify', (e) => notifications.push(e.detail));

        editor.edit_event({ detail: { event_id: 0, epoch: 0 } });
        editor.test_event(1);
        workers[0].reply({ error: 'boom' });

        expect(busyEnded(editor)).toBe(true);
        expect(editor.worker_event_tester).toBeNull();
        expect(workers[0].terminated).toBe(true);
        expect(store.events).toEqual(before);
        expect(notifications).toEqual([expect.objectContaining({ type: 'error' })]);
    });
});
