// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CollapsibleComponent from '../calendar/collapsible_component.js';

/**
 * Stable synthetic ids for static_data list items (eras, months, leap_days,
 * seasons). These items have no real database id, so `load()` backfills a stable
 * `_id` (via `ensureStableIds`) onto both the store objects and the local copy.
 *
 * The `:key` bindings use `item._id`, so identity survives `load()`'s cloneDeep
 * round-trip and Alpine no longer tears down/rebuilds the rows on every edit
 * (which was collapsing the open row).
 *
 * THE CRITICAL INVARIANT: because `load()` skips replacement only when
 * `_.isEqual(incoming, current)`, the `_id` MUST be present identically on the
 * store object AND the local copy — otherwise the arrays never compare equal and
 * `load()` reclones on every tick (an infinite reactive loop). We backfill into
 * the store object BEFORE cloning to guarantee this.
 */

// A minimal concrete component with one array inbound property.
class TestCollapsible extends CollapsibleComponent {
    items = [];
    inboundProperties = { items: 'static_data.items' };
}

function makeComponent(storeItems) {
    const component = new TestCollapsible();
    component.$store = {
        calendar: {
            static_data: { settings: {}, items: storeItems },
        },
    };
    // load() calls setupWatchers() on first run; stub it out (needs Alpine $watch).
    component.setupWatchers = vi.fn();
    return component;
}

describe('CollapsibleComponent.ensureStableIds', () => {
    let component;

    beforeEach(() => {
        component = new TestCollapsible();
    });

    it('assigns a stable _id to each object in the array', () => {
        const items = [{ name: 'A' }, { name: 'B' }];
        component.ensureStableIds(items);

        expect(items[0]._id).toBeTruthy();
        expect(items[1]._id).toBeTruthy();
        expect(items[0]._id).not.toBe(items[1]._id);
    });

    it('does not overwrite an existing _id', () => {
        const items = [{ name: 'A', _id: 'keep-me' }];
        component.ensureStableIds(items);

        expect(items[0]._id).toBe('keep-me');
    });

    it('is a no-op for non-arrays and primitive elements', () => {
        expect(() => component.ensureStableIds(undefined)).not.toThrow();
        expect(() => component.ensureStableIds(['a', 'b'])).not.toThrow(); // string weekdays
    });
});

describe('CollapsibleComponent.load stable-id symmetry', () => {
    it('backfills _id onto the STORE objects (so store and local match)', () => {
        const storeItems = [{ name: 'A' }, { name: 'B' }];
        const component = makeComponent(storeItems);

        component.load();

        // The store's own objects must have gained _id (not just the local clone).
        expect(storeItems[0]._id).toBeTruthy();
        expect(storeItems[1]._id).toBeTruthy();
    });

    it('does NOT replace the local array on a second load() (no reclone / no loop)', () => {
        const storeItems = [{ name: 'A' }, { name: 'B' }];
        const component = makeComponent(storeItems);

        component.load();
        const afterFirst = component.items;

        component.load();
        const afterSecond = component.items;

        // Second load must find store == local (both carry the same _id) and
        // therefore NOT reassign — same array reference, same item identities.
        expect(afterSecond).toBe(afterFirst);
        expect(afterSecond[0]).toBe(afterFirst[0]);
    });

    it('local items carry the same _id values as the store items', () => {
        const storeItems = [{ name: 'A' }];
        const component = makeComponent(storeItems);

        component.load();

        expect(component.items[0]._id).toBe(storeItems[0]._id);
    });
});
