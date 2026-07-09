// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import eventViewerFactory from '../calendar-events-viewer.js';

/**
 * Regression test: opening an event from the events manager on the CREATE page
 * must not crash.
 *
 * On the create page, events have no DB id, so the manager assigns a synthetic
 * string id `new-${index}` (for Alpine `:key`) and dispatches it as
 * `event_db_id`. `view_event` then did
 * `store.events.findIndex(item => item.id === "new-0")` → -1 →
 * `clone(store.events[-1])` (undefined) → `this.data.id` throws.
 *
 * The viewer must resolve the synthetic id to the correct event (and never
 * dereference an undefined event).
 */
function makeViewer(events) {
    return Object.assign(eventViewerFactory(), {
        $store: {
            calendar: {
                events,
                static_data: { eras: [] },
                perms: {
                    user_can_comment: () => false,
                    can_modify_event: () => true,
                },
            },
        },
        $dispatch: vi.fn(),
        get_event_comments: vi.fn(),
    });
}

describe('CalendarEventViewer.view_event', () => {
    it('opens an unsaved event addressed by a synthetic new-${index} id', () => {
        const events = [
            { name: 'Saved', description: 'x', id: 42 },
            { name: 'Unsaved', description: 'y', id: 'new-1' },
        ];
        const viewer = makeViewer(events);

        expect(() =>
            viewer.view_event({ detail: { event_db_id: 'new-1', epoch: 0 } })
        ).not.toThrow();

        expect(viewer.open).toBe(true);
        expect(viewer.data.name).toBe('Unsaved');
    });

    it('opens a saved event addressed by its real DB id (edit page path)', () => {
        const events = [
            { name: 'Saved', description: 'x', id: 42 },
            { name: 'Other', description: 'y', id: 43 },
        ];
        const viewer = makeViewer(events);

        viewer.view_event({ detail: { event_db_id: 43, epoch: 0 } });

        expect(viewer.open).toBe(true);
        expect(viewer.data.name).toBe('Other');
    });

    it('does not crash when the id cannot be resolved at all', () => {
        const viewer = makeViewer([{ name: 'Saved', description: 'x', id: 42 }]);

        expect(() =>
            viewer.view_event({ detail: { event_db_id: 'new-9', epoch: 0 } })
        ).not.toThrow();
    });
});
