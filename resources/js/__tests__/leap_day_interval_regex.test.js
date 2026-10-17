import { describe, it, expect } from 'vitest';
import leapDaysCollapsible from '../calendar/leap_days_collapsible.js';

/**
 * The interval "wide" regex is a shared instance field. With the `g` flag,
 * `.test()` carries `lastIndex` between calls, so the same invalid interval
 * could be flagged on one validation pass and slip past it on the next.
 */
function makeComponent(intervals) {
    const component = leapDaysCollapsible();
    component.leap_days = intervals.map((interval, index) => ({
        name: `Leap ${index + 1}`,
        interval,
        timespan: 0,
    }));
    return component;
}

const INVALID = 'has an invalid interval formula.';

describe('leap day interval validation', () => {
    it('flags the same invalid interval identically on repeated validations', () => {
        const component = makeComponent(['4x']);

        const first = component.validateLeapDayIntervals();
        const second = component.validateLeapDayIntervals();

        expect(first.map(e => e.message)).toEqual([`Leap 1 ${INVALID}`]);
        expect(second).toEqual(first);
    });

    it('flags every invalid interval within a single validation', () => {
        const component = makeComponent(['4x', 'x4']);

        const messages = component.validateLeapDayIntervals().map(e => e.message);

        expect(messages).toEqual([`Leap 1 ${INVALID}`, `Leap 2 ${INVALID}`]);
    });

    it('still accepts valid intervals after an invalid one', () => {
        const component = makeComponent(['4x', '400,!100,4']);

        const messages = component.validateLeapDayIntervals().map(e => e.message);

        expect(messages).toEqual([`Leap 1 ${INVALID}`]);
    });
});
