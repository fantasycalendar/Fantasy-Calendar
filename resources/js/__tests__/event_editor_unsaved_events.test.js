// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import _ from 'lodash';
import { escapeHtml } from '../escape-html.js';
import eventEditorFactory from '../calendar-events-editor.js';

/**
 * On the create page events have no DB id, so the events manager addresses
 * them by a synthetic `new-${index}` id. Edit and delete from the manager must
 * resolve that back to the array index, the same way the viewer does.
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
        $nextTick: vi.fn(),
        $refs: { event_name: { focus: vi.fn() } },
        set_up_moon_data: vi.fn(),
        create_event_data: () => ({ conditions: [] }),
    });
}

const unsavedEvents = () => [
    { name: 'First', description: '', data: { connected_events: [] }, settings: {} },
    { name: 'Second', description: '', data: { connected_events: [] }, settings: {} },
];

describe('event editor with unsaved (create page) events', () => {
    beforeEach(() => {
        window._ = _;
        window.sanitizeHtml = escapeHtml;
        window.swal = { fire: vi.fn(() => new Promise(() => {})) };
    });

    it('edits an unsaved event addressed by new-${index}', () => {
        const editor = makeEditor(unsavedEvents());

        editor.edit_event({ detail: { event_db_id: 'new-1', epoch: 0 } });

        expect(editor.event_id).toBe(1);
        expect(editor.working_event.name).toBe('Second');
    });

    it('still edits a saved event by its DB id', () => {
        const events = unsavedEvents();
        events[0].id = 42;
        const editor = makeEditor(events);

        editor.edit_event({ detail: { event_db_id: 42, epoch: 0 } });

        expect(editor.event_id).toBe(0);
    });

    it('confirms deletion of an unsaved event addressed by new-${index}', () => {
        const editor = makeEditor(unsavedEvents());

        editor.confirm_delete_event({ detail: { event_db_id: 'new-1' } });

        expect(window.swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({ html: expect.stringContaining('"Second"') }),
        );
    });

    it('does nothing for an id that matches no event', () => {
        const editor = makeEditor(unsavedEvents());

        expect(() => editor.edit_event({ detail: { event_db_id: 999, epoch: 0 } })).not.toThrow();
        expect(() => editor.confirm_delete_event({ detail: { event_db_id: 999 } })).not.toThrow();
        expect(editor.open).toBeFalsy();
        expect(window.swal.fire).not.toHaveBeenCalled();
    });
});
