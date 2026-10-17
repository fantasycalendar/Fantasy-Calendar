import { describe, it, expect } from 'vitest';
import { eventHasChanged } from '../calendar/event_change_detection.js';

/**
 * `eventHasChanged(initial, current)` compares an event against its snapshot,
 * treating two UI-driven normalizations as no-ops:
 *
 *   - the Quill editor re-serializing the `description` HTML, and
 *   - the category binding coercing an uncategorized `event_category_id` from
 *     `null` to `-1`,
 *
 * while still flagging genuine edits to any meaningful field.
 *
 * `current.data` is the (idempotent) output of `create_event_data()`, matching
 * how `event_has_changed()` builds the comparison.
 */

// The real "New Year's Day" event from the Gregorian preset
// (setup/extra-preset-jsons/presets/106-gregorian_calendar-events.json).
// It has no connected events and a description ending in `<br></p>`, which is
// exactly the markup Quill re-serializes (it drops the trailing <br>).
// `event_category_id` is a numeric id here, matching the resolved runtime
// shape (the preset JSON stores a "secular-holidays" slug that is resolved to
// a real category id on import).
function baseEvent() {
    return {
        name: "New Year's Day",
        description:
            "<p>New Year's Day marks the start of a new year on the Gregorian Calendar. It starts when the clock strikes midnight and is often celebrated with fireworks, champagne and kissing.<br></p>",
        event_category_id: 611,
        data: {
            has_duration: false,
            duration: 1,
            show_first_last: false,
            limited_repeat: false,
            limited_repeat_num: 1,
            conditions: [
                ['Month', '0', ['0']],
                ['&&'],
                ['Day', '0', ['1']],
            ],
            connected_events: [],
            date: [],
            search_distance: 0,
            overrides: { moons: {} },
        },
        settings: {
            color: 'Blue',
            text: 'text',
            hide: false,
            print: false,
            hide_full: false,
        },
    };
}

describe('eventHasChanged()', () => {
    it('returns false when nothing changed', () => {
        const initial = baseEvent();
        const current = baseEvent();
        expect(eventHasChanged(initial, current)).toBe(false);
    });

    it('ignores Quill re-serialization of an unchanged description', () => {
        const initial = baseEvent();
        const current = baseEvent();
        // Quill canonicalizes the description, dropping the trailing <br>
        // inside the <p>.
        current.description =
            "<p>New Year's Day marks the start of a new year on the Gregorian Calendar. It starts when the clock strikes midnight and is often celebrated with fireworks, champagne and kissing.</p>";
        expect(eventHasChanged(initial, current)).toBe(false);
    });

    it('ignores the null -> -1 category coercion for uncategorized events', () => {
        const initial = baseEvent();
        initial.event_category_id = null;
        const current = baseEvent();
        current.event_category_id = -1;
        expect(eventHasChanged(initial, current)).toBe(false);
    });

    it('detects a genuine description change (more than whitespace/markup noise)', () => {
        const initial = baseEvent();
        const current = baseEvent();
        current.description = '<p>A completely different message</p>';
        expect(eventHasChanged(initial, current)).toBe(true);
    });

    it('detects a genuine name change', () => {
        const initial = baseEvent();
        const current = baseEvent();
        current.name = "New Year's Eve";
        expect(eventHasChanged(initial, current)).toBe(true);
    });

    it('detects a genuine category change', () => {
        const initial = baseEvent();
        const current = baseEvent();
        current.event_category_id = 7;
        expect(eventHasChanged(initial, current)).toBe(true);
    });

    it('detects a genuine settings change', () => {
        const initial = baseEvent();
        const current = baseEvent();
        current.settings.print = true;
        expect(eventHasChanged(initial, current)).toBe(true);
    });

    it('detects a genuine data (conditions) change', () => {
        const initial = baseEvent();
        const current = baseEvent();
        current.data.conditions = [['Date', '0', ['0', '0', '2']]];
        current.data.date = [0, 0, 2];
        expect(eventHasChanged(initial, current)).toBe(true);
    });

    it('returns false when there is no snapshot yet', () => {
        const current = baseEvent();
        expect(eventHasChanged(undefined, current)).toBe(false);
    });
});
