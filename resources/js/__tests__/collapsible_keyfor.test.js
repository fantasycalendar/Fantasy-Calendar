// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import CollapsibleComponent from '../calendar/collapsible_component.js';

/**
 * TDD test for the base-class `keyFor(item)` mechanism (I24).
 *
 * `keyFor(item)` returns a STABLE synthetic id for an item that has no real
 * stable id of its own (months, seasons, leap_days, eras). The id is stored in
 * a WeakMap keyed by the item's object identity, so:
 *   - The id follows the OBJECT, not its position in the array.
 *   - The id is NEVER written onto the item object, so it can never pollute the
 *     persisted `static_data`.
 *
 * This is the core invariant for the stable-key fix: when a sortable list is
 * reordered (splice in place, preserving object identity), `keyFor` returns the
 * SAME value for each object, so Alpine's `:key` stays stable.
 */
describe('CollapsibleComponent.keyFor()', () => {
    let component;

    beforeEach(() => {
        component = new CollapsibleComponent();
    });

    it('returns the same value when called twice with the same object reference (stable per-object)', () => {
        const item = { name: 'January' };

        const first = component.keyFor(item);
        const second = component.keyFor(item);

        expect(second).toBe(first);
    });

    it('returns different keys for two different item objects (distinct per-object)', () => {
        const a = { name: 'January' };
        const b = { name: 'February' };

        expect(component.keyFor(a)).not.toBe(component.keyFor(b));
    });

    it('returns the same key for each object after a reorder splice (identity preserved)', () => {
        const a = { name: 'January' };
        const b = { name: 'February' };
        const c = { name: 'March' };
        const items = [a, b, c];

        const keyA = component.keyFor(a);
        const keyB = component.keyFor(b);
        const keyC = component.keyFor(c);

        // Reorder in place to [b, c, a] (splice preserves object identity).
        const elem = items.splice(0, 1)[0]; // remove a
        items.splice(2, 0, elem); // insert a at the end -> [b, c, a]
        expect(items).toEqual([b, c, a]);

        // keyFor still returns the SAME captured values for each object.
        expect(component.keyFor(items[0])).toBe(keyB);
        expect(component.keyFor(items[1])).toBe(keyC);
        expect(component.keyFor(items[2])).toBe(keyA);
    });

    it('does not mutate the item (no new own-enumerable properties)', () => {
        const item = { name: 'January', length: 31 };
        const keysBefore = Object.keys(item);

        component.keyFor(item);

        expect(Object.keys(item)).toEqual(keysBefore);
        expect(item).not.toHaveProperty('_key');
    });
});
