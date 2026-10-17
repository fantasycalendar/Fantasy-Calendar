import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { calendar_data_generator } from '../calendar/calendar_workers';
import { convert_year, evaluate_calendar_start } from '../calendar/calendar_functions';

/**
 * run_future(start, end) takes 0-based ("absolute") years — what convert_year()
 * returns — and must generate exactly [start, end), with any padding years
 * following on without gaps. epoch_data reports display years.
 *
 * Calendars without a year zero are the interesting case: display years skip
 * 0, so display 2026 is absolute 2025 and display -1, 1 are absolute -1, 0.
 */
const presets = resolve(__dirname, '../../../database/seeders/presets');
const gregorian = JSON.parse(readFileSync(resolve(presets, 'gregorian.json'), 'utf-8'));
const gregorianEvents = JSON.parse(readFileSync(resolve(presets, 'gregorian-events.json'), 'utf-8'));

function setUp({ year_zero_exists = false, events = [] } = {}) {
    const static_data = structuredClone(gregorian.static_data);
    static_data.settings.year_zero_exists = year_zero_exists;

    calendar_data_generator.static_data = static_data;
    calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
    calendar_data_generator.owner = true;
    calendar_data_generator.events = structuredClone(events);
    calendar_data_generator.event_categories = [];

    return static_data;
}

const dateOf = (result, epoch) => {
    const day = result.epoch_data[epoch];
    return [day.year, day.timespan_index, day.day];
};

describe('run_future year range', () => {
    it('covers exactly the requested display year on a calendar without year zero', async () => {
        const static_data = setUp();
        const start = convert_year(static_data, 2026);

        const result = await calendar_data_generator.run_future(start, start + 1, false);

        expect(dateOf(result, result.start_epoch)).toEqual([2026, 0, 1]);
        expect(dateOf(result, result.end_epoch)).toEqual([2026, 11, 31]);
    });

    it('covers exactly the requested year on a calendar with year zero', async () => {
        const static_data = setUp({ year_zero_exists: true });
        const start = convert_year(static_data, 2026);

        const result = await calendar_data_generator.run_future(start, start + 1, false);

        expect(dateOf(result, result.start_epoch)).toEqual([2026, 0, 1]);
        expect(dateOf(result, result.end_epoch)).toEqual([2026, 11, 31]);
    });

    it('covers display years -1 and 1 for a two-year range crossing zero', async () => {
        const static_data = setUp();
        const start = convert_year(static_data, -1);

        const result = await calendar_data_generator.run_future(start, start + 2, false);

        expect(dateOf(result, result.start_epoch)).toEqual([-1, 0, 1]);
        expect(dateOf(result, result.end_epoch)).toEqual([1, 11, 31]);
    });

    it('does not add display year 1 to a range ending at absolute year 0', async () => {
        setUp();

        const result = await calendar_data_generator.run_future(-1, 0, false);

        expect(dateOf(result, result.end_epoch)).toEqual([-1, 11, 31]);
    });

    it('pads with the years right after the range, correctly dated', async () => {
        // Paschal Full Moon's limited repeat gives every event ~200 days of
        // padding on both sides.
        const static_data = setUp({ events: gregorianEvents });
        const start = convert_year(static_data, 2026);

        const result = await calendar_data_generator.run_future(start, start + 1, false);

        const epochs = Object.keys(result.epoch_data).map(Number).sort((a, b) => a - b);
        const years = [...new Set(epochs.map((epoch) => result.epoch_data[epoch].year))];
        expect(years).toEqual([2025, 2026, 2027]);

        const jan1st2027 = evaluate_calendar_start(static_data, convert_year(static_data, 2027)).epoch;
        expect(dateOf(result, jan1st2027)).toEqual([2027, 0, 1]);
    });
});

describe('event tester worker year range', () => {
    beforeAll(async () => {
        globalThis.onmessage = null;
        globalThis.postMessage = vi.fn();
        await import('../webworkers/worker_event_tester.js');
    });

    beforeEach(() => {
        globalThis.postMessage.mockClear();
    });

    it('finds Easter Monday in the requested display year', async () => {
        const static_data = setUp({ events: gregorianEvents });
        const start_year = convert_year(static_data, 2026);

        await globalThis.onmessage({
            data: {
                calendar_name: 'Test',
                static_data,
                dynamic_data: structuredClone(gregorian.dynamic_data),
                events: structuredClone(gregorianEvents),
                event_categories: [],
                owner: true,
                start_year,
                end_year: start_year + 1,
                callback: false,
                event_id: gregorianEvents.findIndex((event) => event.name === 'Easter Monday'),
                build_seasons: false,
            },
        });

        expect(globalThis.postMessage).toHaveBeenLastCalledWith({
            occurrences: [{ year: 2026, timespan: 3, day: 6, intercalary: false }],
        });
    });
});
