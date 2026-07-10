// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import erasCollapsibleFactory from '../calendar/eras_collapsible.js';

/**
 * `handleChangedEras()` sorts the eras. The comparator MUST be valid and
 * idempotent: the starting era comes first, then eras are ordered by epoch.
 *
 * The original comparator only inspected `a.settings.starting_era` (never b's),
 * so when the starting era's epoch was not the minimum, cmp(A,B) and cmp(B,A)
 * could both be negative — a broken comparator that oscillated between orderings
 * on every pass. Combined with the collapsible load() round-trip, that produced
 * an infinite reactive loop that froze the browser (and collapsed the open era).
 */
function eraNamed(name, epoch, starting = false) {
    return {
        name,
        settings: {
            starting_era: starting,
            use_custom_format: true, // skip the formatting mutation in handleChangedEras
            restart: false,
        },
        date: { epoch },
    };
}

function makeComponent(eras) {
    const component = erasCollapsibleFactory();
    component.eras = eras;
    return component;
}

const order = (component) => component.eras.map((e) => e.name);

describe('ErasCollapsible.handleChangedEras sort', () => {
    it('puts the starting era first, then orders by epoch', () => {
        const component = makeComponent([
            eraNamed('Third', 300),
            eraNamed('Start', 999, true), // starting era, but NOT the min epoch
            eraNamed('First', 100),
            eraNamed('Second', 200),
        ]);

        component.handleChangedEras();

        expect(order(component)).toEqual(['Start', 'First', 'Second', 'Third']);
    });

    it('is idempotent — sorting again does not change the order', () => {
        const component = makeComponent([
            eraNamed('Third', 300),
            eraNamed('Start', 999, true),
            eraNamed('First', 100),
            eraNamed('Second', 200),
        ]);

        component.handleChangedEras();
        const first = order(component);

        component.handleChangedEras();
        const second = order(component);

        expect(second).toEqual(first);
    });

    it('does not oscillate when the starting era is not the min epoch (regression)', () => {
        const component = makeComponent([
            eraNamed('Serpents', 1723282, true), // starting era, large epoch
            eraNamed('Darkness', 1000),
        ]);

        component.handleChangedEras();
        const a = order(component);
        component.handleChangedEras();
        const b = order(component);
        component.handleChangedEras();
        const c = order(component);

        expect(b).toEqual(a);
        expect(c).toEqual(a);
        expect(a).toEqual(['Serpents', 'Darkness']);
    });
});
