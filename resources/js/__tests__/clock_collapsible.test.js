// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import clockCollapsibleFactory from '../calendar/clock_collapsible.js';

/**
 * Enabling the clock should also turn on clock rendering, so the clock becomes
 * visible immediately (users almost always want to see the clock they just
 * enabled; hiding it is still possible by turning render off separately).
 *
 * The render coupling only fires on the enabled false->true transition, so it
 * never fights a user who deliberately turns render off while the clock stays
 * enabled.
 */
function makeComponent() {
    const component = clockCollapsibleFactory();
    component.$dispatch = vi.fn();
    return component;
}

describe('ClockCollapsible render coupling', () => {
    it('turns render on when the clock is enabled', () => {
        const component = makeComponent();
        component.clock = { enabled: false, render: false };

        // Simulate the user enabling the clock, then the watcher firing.
        component.clock.enabled = true;
        component.changed(component.clock);

        expect(component.clock.render).toBe(true);
    });

    it('does not force render back on while the clock stays enabled', () => {
        const component = makeComponent();
        component.clock = { enabled: false, render: false };

        // Enable the clock (render couples on).
        component.clock.enabled = true;
        component.changed(component.clock);
        expect(component.clock.render).toBe(true);

        // User turns render off while the clock stays enabled.
        component.clock.render = false;
        component.changed(component.clock);

        expect(component.clock.render).toBe(false);
    });

    it('does not enable render when the clock is disabled', () => {
        const component = makeComponent();
        component.clock = { enabled: true, render: false };

        // Disable the clock.
        component.clock.enabled = false;
        component.changed(component.clock);

        expect(component.clock.render).toBe(false);
    });

    it('does not force render on for an already-enabled clock loaded with render off', () => {
        const component = makeComponent();
        // A calendar loaded with the clock already enabled but render off.
        component.clock = { enabled: true, render: false };
        component.loaded();

        // User makes an unrelated clock change (e.g. adjusts hours).
        component.clock.hours = 12;
        component.changed(component.clock);

        expect(component.clock.render).toBe(false);
    });
});
