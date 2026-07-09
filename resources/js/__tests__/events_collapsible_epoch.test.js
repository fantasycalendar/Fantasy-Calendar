// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import eventsCollapsibleFactory from '../calendar/events_collapsible.js';

/**
 * The sidebar "add event" button dispatches the new-event editor with the
 * epoch of the currently-viewed date via `get_current_epoch()`. (Previously it
 * used `this.dynamic_data.epoch` inside an inline Alpine expression, where
 * `this.` does not reach class fields — undefined → crash.)
 *
 * `get_current_epoch()` must return the current date's epoch when following the
 * current date, and the selected/preview date's epoch otherwise — matching the
 * edit button's behaviour so a new event lands on the viewed date.
 */
describe('EventsCollapsible.get_current_epoch', () => {
    it('returns the current-date epoch when following the current date', () => {
        const component = eventsCollapsibleFactory();
        component.dynamic_data = { epoch: 100 };
        component.preview_date = { follow: true, epoch: 250 };

        expect(component.get_current_epoch()).toBe(100);
    });

    it('returns the selected-date epoch when not following the current date', () => {
        const component = eventsCollapsibleFactory();
        component.dynamic_data = { epoch: 100 };
        component.preview_date = { follow: false, epoch: 250 };

        expect(component.get_current_epoch()).toBe(250);
    });

    it('defaults to following (current-date epoch) when follow is unset', () => {
        const component = eventsCollapsibleFactory();
        component.dynamic_data = { epoch: 100 };
        component.preview_date = {};

        expect(component.get_current_epoch()).toBe(100);
    });
});
