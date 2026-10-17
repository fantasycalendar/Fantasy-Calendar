// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import contextMenuFactory from '../context-menu.js';

/**
 * Regression test: right-clicking an ERA event must not crash the context menu.
 *
 * Eras are rendered as pseudo-events whose `index` refers to
 * `static_data.eras`, NOT `store.events`. The "Hide event"/"Show event" item is
 * hidden for eras, but its `name` was evaluated eagerly as
 * `store.events[calendar_event.index].settings.hide ? ...`, which throws for an
 * era because `store.events[eraIndex]` is undefined.
 */
function makeComponent() {
    // Start from the real component (so `this.activate` etc. resolve), then
    // layer in the minimal Alpine-ish context it reads from.
    const component = Object.assign(contextMenuFactory(), {
        $store: {
            calendar: {
                events: [
                    { settings: { hide: false } }, // a real event at index 0
                ],
                perms: {
                    can_modify_event: () => true,
                    user_is_owner: () => true,
                    player_at_least: () => true,
                },
                static_data: { settings: { allow_view: true } },
            },
        },
        $dispatch: vi.fn(),
        $nextTick: vi.fn(),
    });

    return { component };
}

describe('context_menu.activate_for_event with an era', () => {
    it('does not throw when the right-clicked pseudo-event is an era', () => {
        const { component } = makeComponent();

        // Era index refers to static_data.eras; it does NOT index store.events
        // (here store.events has a single entry, so index 3 is undefined).
        const activateEvent = {
            detail: {
                calendar_event: { index: 3, era: true },
                day: { epoch: 100 },
                click: { clientX: 5, clientY: 5 },
            },
        };

        expect(() =>
            component.activate_for_event(activateEvent)
        ).not.toThrow();

        // Sanity: the items array was built and attached.
        expect(Array.isArray(activateEvent.detail.items)).toBe(true);
    });

    it('still builds a valid Hide/Show label for a regular (non-era) event', () => {
        const { component } = makeComponent();

        const activateEvent = {
            detail: {
                calendar_event: { index: 0, era: false },
                day: { epoch: 100 },
                click: { clientX: 5, clientY: 5 },
            },
        };

        component.activate_for_event(activateEvent);

        const hideItem = activateEvent.detail.items.find(
            (i) => i.name === 'Hide event' || i.name === 'Show event'
        );
        expect(hideItem).toBeDefined();
        expect(hideItem.name).toBe('Hide event'); // settings.hide === false
    });
});
