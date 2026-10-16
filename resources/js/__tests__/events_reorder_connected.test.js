import { describe, it, expect } from 'vitest';
import eventsCollapsible from '../calendar/events_collapsible.js';

/**
 * `connected_events` holds the array indices of events another event's
 * conditions refer to. Reordering the events list must remap those indices to
 * the events' new positions.
 */
function makeEvents(names, overrides = {}) {
    const component = eventsCollapsible();
    component.events = names.map((name, index) => ({
        name,
        sort_by: index,
        data: { connected_events: overrides[name] ?? [] },
    }));
    return component;
}

const indexOf = (component, name) => component.events.findIndex(e => e.name === name);
const linkedNames = (component, name) =>
    component.events[indexOf(component, name)].data.connected_events.map(i => component.events[i]?.name);

describe('events reorder', () => {
    it('remaps numeric connected_events to the new positions', () => {
        const component = makeEvents(['A', 'B', 'C', 'D'], { D: [0, 2] });

        component.reorderSortable(0, 3);

        expect(component.events.map(e => e.name)).toEqual(['B', 'C', 'D', 'A']);
        expect(linkedNames(component, 'D')).toEqual(['A', 'C']);
    });

    it('remaps legacy string connected_events instead of turning them into -1', () => {
        const component = makeEvents(['A', 'B', 'C', 'D'], { D: ['0', '2'] });

        component.reorderSortable(3, 0);

        expect(linkedNames(component, 'D')).toEqual(['A', 'C']);
        expect(component.events[indexOf(component, 'D')].data.connected_events).not.toContain(-1);
    });

    it('does not depend on sort_by matching the array index', () => {
        const component = makeEvents(['A', 'B', 'C'], { C: [0] });
        component.events.forEach(e => { e.sort_by = undefined; });

        component.reorderSortable(0, 1);

        expect(linkedNames(component, 'C')).toEqual(['A']);
    });

    it('leaves dangling and null references alone', () => {
        const component = makeEvents(['A', 'B', 'C'], { C: [7, null] });

        component.reorderSortable(0, 2);

        expect(component.events[indexOf(component, 'C')].data.connected_events).toEqual([7, null]);
    });

    it('renumbers sort_by to the new order', () => {
        const component = makeEvents(['A', 'B', 'C']);

        component.reorderSortable(2, 0);

        expect(component.events.map(e => e.sort_by)).toEqual([0, 1, 2]);
    });
});
