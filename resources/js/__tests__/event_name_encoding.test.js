// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import _ from 'lodash';
import { escapeHtml, unescapeHtml } from '../escape-html.js';
import eventEditorFactory from '../calendar-events-editor.js';
import eventsManagerFactory from '../events-manager.js';

/**
 * Event names are plain text. The server strips tags and every sink renders
 * them via x-text or escapes at render time — so the editor must NOT
 * entity-encode them on the way into the store. Doing so (with a
 * non-idempotent encoder) compounded on every save:
 *   "Rock & Roll" -> "Rock &amp; Roll" -> "Rock &amp;amp; Roll" -> ...
 */

describe('escapeHtml', () => {
    it('passes non-strings through untouched', () => {
        expect(escapeHtml(undefined)).toBe(undefined);
        expect(escapeHtml(3)).toBe(3);
    });

    it('round-trips through unescapeHtml', () => {
        const original = `Rock & Roll <"O'Brien">`;
        expect(unescapeHtml(escapeHtml(original))).toBe(original);
    });
});

describe('event editor does not encode names into the store', () => {
    let editor;
    let store;

    beforeEach(() => {
        window._ = _;
        window.sanitizeHtml = escapeHtml;
        store = { events: [{ name: 'Existing', data: {}, settings: {} }] };
        editor = Object.assign(eventEditorFactory(), {
            $store: { calendar: store },
            $dispatch: vi.fn(),
            create_event_data: () => ({ conditions: [] }),
            close: vi.fn(),
        });
        // save_event's "edit/create page" branch skips the network call.
        window.history.replaceState({}, '', '/calendars/abc/edit');
    });

    it('saves "Rock & Roll" verbatim, and again unchanged on a second save', () => {
        editor.event_id = 0;
        editor.working_event = { name: 'Rock & Roll', data: {}, settings: {} };

        editor.save_event();
        expect(store.events[0].name).toBe('Rock & Roll');

        editor.working_event = { ...store.events[0] };
        editor.save_event();
        expect(store.events[0].name).toBe('Rock & Roll');
    });

    it('still defaults an empty name to "New Event"', () => {
        editor.event_id = 0;
        editor.working_event = { name: '', data: {}, settings: {} };

        editor.save_event();

        expect(store.events[0].name).toBe('New Event');
    });

    it('clones with a verbatim name', async () => {
        const fired = Promise.resolve({ dismiss: undefined });
        window.swal = { isVisible: () => false, fire: vi.fn(() => fired) };
        editor.working_event = { name: 'Tom & Jerry', data: {}, settings: {} };

        editor.confirm_clone();
        await fired;
        await Promise.resolve();

        expect(editor.$dispatch).toHaveBeenCalledWith(
            'event-editor-modal-clone-event',
            expect.objectContaining({
                event_data: expect.objectContaining({ name: 'Tom & Jerry (clone)' }),
            }),
        );
    });
});

describe('events manager highlight_match', () => {
    let manager;

    beforeEach(() => {
        window.sanitizeHtml = escapeHtml;
        manager = Object.assign(eventsManagerFactory(), { search: '' });
    });

    it('escapes a raw name for its x-html sink', () => {
        expect(manager.highlight_match('Rock & Roll')).toBe('Rock &amp; Roll');
    });

    it('extracts text without assigning innerHTML (which fires handlers even on detached nodes)', () => {
        const setter = vi.spyOn(HTMLElement.prototype, 'innerHTML', 'set');

        const result = manager.highlight_match('<p>Hello <img src=x onerror="alert(1)">world</p>');

        expect(setter).not.toHaveBeenCalled();
        expect(result).toBe('Hello world');
        setter.mockRestore();
    });
});
