// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { bind_calendar_events } from '../calendar/calendar_manager.js';

describe('bind_calendar_events', () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('registers the global mousemove listener only once across repeated calls', () => {
        // bind_calendar_events() is invoked from page init(); under dev HMR (or any
        // future re-init path) it could run more than once, stacking duplicate
        // anonymous mousemove listeners that can never be removed.
        const spy = vi.spyOn(window, 'addEventListener');

        bind_calendar_events();
        bind_calendar_events();
        bind_calendar_events();

        const mousemoveRegistrations = spy.mock.calls.filter(
            ([eventName]) => eventName === 'mousemove'
        );

        expect(mousemoveRegistrations.length).toBe(1);
    });
});
