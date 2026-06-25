// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import CollapsibleComponent from '../calendar/collapsible_component.js';

/**
 * Characterization test for the dropped() / _x_prevKeys / data-id / :key coupling.
 *
 * Context (I24):
 * The base class `dropped()` reads SortableJS's `toArray()` (the `data-id` values in the
 * NEW visual order), shifts off the <template> tag's own entry, reorders the underlying
 * array via the subclass's `reorderSortable()`, then assigns those data-id values to
 * Alpine's internal `_x_prevKeys` on the x-for template ref.
 *
 * Alpine then compares the NEW `:key` values (re-evaluated from the reordered array)
 * against `_x_prevKeys`. If they match, Alpine concludes "the DOM is already in the right
 * order" and does NOT re-move nodes (and therefore does NOT mis-rebind nested per-item
 * `x-data` state).
 *
 * THE INVARIANT this test locks in:
 *   After dropped(), `_x_prevKeys` MUST deep-equal `reorderedArray.map(item => item[keyField])`.
 *
 * This holds IFF `data-id` and the caller's `:key` both reference the SAME stable per-item
 * identity (e.g. `category.id`). dropped() itself is fully generic — it never references
 * `index` or any particular key field — so NO base-class change is needed. The fix lives
 * entirely in the blades (supplying a stable `data-id`/`:key`). This is therefore a
 * CHARACTERIZATION test proving the mechanism already works once the blades supply stable
 * keys, not a red→green test of a change to dropped().
 */

// Minimal concrete subclass mirroring EventCategoriesCollapsible.reorderSortable():
// it splices the underlying array into the new order. (We omit the sort_by bookkeeping —
// it's irrelevant to the _x_prevKeys invariant.)
class TestCollapsible extends CollapsibleComponent {
    constructor(items) {
        super();
        this.categories = items;
        this.draggableRef = 'test-sortable';
    }

    reorderSortable(start, end) {
        const elem = this.categories.splice(start, 1)[0];
        this.categories.splice(end, 0, elem);
    }
}

/**
 * Build an instance wired with the stubs dropped() needs:
 *  - this.draggable.toArray() -> returns the data-id values in the post-drag VISUAL order,
 *    INCLUDING the leading <template> entry that SortableJS reports (dropped() shifts it off).
 *  - this.$refs[ref + "-template"] -> a plain object so _x_prevKeys is assignable.
 */
function makeInstance(items, toArrayResult) {
    const instance = new TestCollapsible(items);
    instance.draggable = { toArray: () => toArrayResult.slice() };
    instance.$refs = {
        [instance.draggableRef + '-template']: {},
    };
    return instance;
}

describe('CollapsibleComponent.dropped() / _x_prevKeys coupling', () => {
    let items;

    beforeEach(() => {
        items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    });

    it('is a no-op when start === end', () => {
        const instance = makeInstance(items, ['__template__', 'a', 'b', 'c']);

        instance.dropped(1, 1);

        // Array untouched, no _x_prevKeys assigned.
        expect(instance.categories.map((i) => i.id)).toEqual(['a', 'b', 'c']);
        expect(instance.$refs['test-sortable-template']._x_prevKeys).toBeUndefined();
    });

    it('STABLE keys: _x_prevKeys deep-equals the reordered array stable ids (Alpine sees DOM as correct)', () => {
        // Drag item 0 ('a') to position 2 (the end).
        // With data-id = stable id, SortableJS toArray() reports the data-ids in new visual
        // order, with the <template> entry first: ['__template__', 'b', 'c', 'a'].
        const instance = makeInstance(items, ['__template__', 'b', 'c', 'a']);

        instance.dropped(0, 2);

        // 1. The underlying array was reordered correctly.
        expect(instance.categories).toEqual([{ id: 'b' }, { id: 'c' }, { id: 'a' }]);

        // 2. THE INVARIANT: _x_prevKeys === reorderedArray.map(item => item.id).
        const prevKeys = instance.$refs['test-sortable-template']._x_prevKeys;
        expect(prevKeys).toEqual(['b', 'c', 'a']);
        expect(prevKeys).toEqual(instance.categories.map((item) => item.id));
    });

    it('STABLE keys: invariant holds for a middle-to-front move too', () => {
        // Drag item 2 ('c') to position 0 (the front): toArray() -> ['__tpl__', 'c', 'a', 'b'].
        const instance = makeInstance(items, ['__template__', 'c', 'a', 'b']);

        instance.dropped(2, 0);

        expect(instance.categories).toEqual([{ id: 'c' }, { id: 'a' }, { id: 'b' }]);

        const prevKeys = instance.$refs['test-sortable-template']._x_prevKeys;
        expect(prevKeys).toEqual(instance.categories.map((item) => item.id));
    });

    it('CONTRAST — index keys: _x_prevKeys does NOT match the reordered array keys (the bug)', () => {
        // With data-id = index and :key = index, dragging item 0 to the end makes SortableJS
        // report the OLD indices in new visual order: ['__template__', '1', '2', '0'].
        const instance = makeInstance(items, ['__template__', '1', '2', '0']);

        instance.dropped(0, 2);

        const prevKeys = instance.$refs['test-sortable-template']._x_prevKeys;

        // dropped() faithfully stores what toArray() returned: the OLD indices in new order.
        expect(prevKeys).toEqual(['1', '2', '0']);

        // But after the splice, the array's :key="index" values re-evaluate to [0,1,2] again
        // (indices follow position, not item identity). _x_prevKeys is ['1','2','0'].
        const indexKeysAfterReorder = instance.categories.map((_, index) => String(index));
        expect(indexKeysAfterReorder).toEqual(['0', '1', '2']);

        // MISMATCH: this is precisely what forces Alpine to re-move nodes and can mis-bind
        // the nested per-item x-data state. Stable keys avoid this.
        expect(prevKeys).not.toEqual(indexKeysAfterReorder);
    });
});
