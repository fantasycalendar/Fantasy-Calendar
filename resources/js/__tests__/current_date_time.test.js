// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import currentDateCollapsibleFactory from '../calendar/current_date_collapsible.js';

/**
 * A newly-created calendar's `dynamic_data` may omit `hour`/`minute`. The
 * current-time inputs bind to `current_hour`/`current_minute`, so those getters
 * must default to 0 rather than returning undefined (which renders as an empty
 * input once the clock is enabled).
 */
describe('CurrentDateCollapsible current time getters', () => {
    it('defaults hour and minute to 0 when dynamic_data omits them', () => {
        const component = currentDateCollapsibleFactory();
        component.current_date = { year: 1, timespan: 0, day: 1 }; // no hour/minute

        expect(component.current_hour).toBe(0);
        expect(component.current_minute).toBe(0);
    });

    it('returns the stored hour and minute when present', () => {
        const component = currentDateCollapsibleFactory();
        component.current_date = { year: 1, timespan: 0, day: 1, hour: 13, minute: 45 };

        expect(component.current_hour).toBe(13);
        expect(component.current_minute).toBe(45);
    });

    it('preserves a legitimate 0 hour/minute', () => {
        const component = currentDateCollapsibleFactory();
        component.current_date = { hour: 0, minute: 0 };

        expect(component.current_hour).toBe(0);
        expect(component.current_minute).toBe(0);
    });
});
