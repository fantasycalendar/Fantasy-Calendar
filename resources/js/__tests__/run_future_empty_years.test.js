import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { calendar_data_generator } from '../calendar/calendar_workers';
import { unconvert_year } from '../calendar/calendar_functions';

/**
 * Years can have no months at all (every timespan's interval skips them).
 * run_future must still work when the first or last requested year is one.
 *
 * run_future takes 0-based years (it unconverts them); get_timespans_in_year
 * and epoch_data use display years.
 */
const gregorian = JSON.parse(readFileSync(
    resolve(__dirname, '../../../database/seeders/presets/gregorian.json'),
    'utf-8',
));

// Every month only exists every other year.
function everyOtherYearCalendar() {
    const static_data = structuredClone(gregorian.static_data);
    for (const timespan of static_data.year_data.timespans) {
        timespan.interval = 2;
        timespan.offset = 0;
    }
    static_data.year_data.leap_days = [];
    return static_data;
}

describe('run_future with month-less years', () => {
    let emptyYear;
    let fullYear;

    beforeEach(() => {
        calendar_data_generator.static_data = everyOtherYearCalendar();
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = [];
        calendar_data_generator.event_categories = [];

        const display = (year) => unconvert_year(calendar_data_generator.static_data, year);
        const has_months = (year) => calendar_data_generator.get_timespans_in_year(display(year)).length > 0;
        emptyYear = has_months(2020) ? 2021 : 2020;
        fullYear = emptyYear + 1;
        expect(has_months(emptyYear)).toBe(false);
        expect(has_months(fullYear)).toBe(true);
    });

    it('works when the first requested year has no months', async () => {
        const result = await calendar_data_generator.run_future(emptyYear, emptyYear + 3, false);

        expect(result.success).toBe(true);
        expect(result.start_epoch).toBeLessThanOrEqual(result.end_epoch);
        expect(result.epoch_data[result.start_epoch].year).toBe(unconvert_year(calendar_data_generator.static_data, fullYear));
    });

    it('works when the last requested year has no months', async () => {
        const result = await calendar_data_generator.run_future(fullYear, fullYear + 2, false);

        expect(result.success).toBe(true);
        expect(result.epoch_data[result.end_epoch].year).toBe(unconvert_year(calendar_data_generator.static_data, fullYear));
    });

    it('rejects, rather than throwing, when no requested year has months', async () => {
        await expect(calendar_data_generator.run_future(emptyYear, emptyYear + 1, false))
            .rejects.toMatchObject({ success: false });
    });
});
