import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { calendar_data_generator, event_evaluator } from '../calendar/calendar_workers';

/**
 * Load and parse a JSON file, returning null if the file doesn't exist.
 */
function loadJSON(filepath) {
    if (!existsSync(filepath)) return null;
    return JSON.parse(readFileSync(filepath, 'utf-8'));
}

const seederDir = resolve(__dirname, '../../../database/seeders/presets');
const submoduleDir = resolve(__dirname, '../../../setup/extra-preset-jsons/presets');

// Always available: the seeder version
const gregorian = loadJSON(resolve(seederDir, 'gregorian.json'));
const gregorianEvents = loadJSON(resolve(seederDir, 'gregorian-events.json'));

// May be available if the submodule is initialised
const submoduleGregorian = loadJSON(resolve(submoduleDir, '106-gregorian_calendar.json'));
const submoduleGregorianEvents = loadJSON(resolve(submoduleDir, '106-gregorian_calendar-events.json'));

describe('calendar_data_generator.run_future', () => {

    it('returns start/end epochs within the epoch_data range', async () => {

        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const result = await calendar_data_generator.run_future(startYear, endYear, false);

        expect(result.success).toBe(true);

        const allEpochs = Object.keys(result.epoch_data).map(Number).sort((a, b) => a - b);
        const dataMin = allEpochs[0];
        const dataMax = allEpochs[allEpochs.length - 1];

        // The returned start/end must fall within the epoch_data range
        expect(result.start_epoch).toBeGreaterThanOrEqual(dataMin);
        expect(result.end_epoch).toBeLessThanOrEqual(dataMax);
    });

    it('epoch_data extends beyond start_epoch by at least pre_search', async () => {

        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const result = await calendar_data_generator.run_future(startYear, endYear, false);

        const allEpochs = Object.keys(result.epoch_data).map(Number).sort((a, b) => a - b);
        const dataMin = allEpochs[0];

        // The seeder Gregorian preset has Paschal Full Moon with
        // limited_repeat_num=200, which makes pre_search=200.
        // The epoch_data must extend at least that far before start_epoch.
        expect(result.start_epoch - dataMin).toBeGreaterThanOrEqual(200);
    });

    it('does not crash event_evaluator with seeder Gregorian events', async () => {

        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Easter (event 10) depends on Paschal Full Moon (event 9) via
        // connected_events.  The chain assigns lookback/lookahead that
        // extend the loop range.  Before the fix, this would throw:
        //   "can't access property 'year', event_evaluator.epoch_data[epoch] is undefined"
        expect(() => {
            event_evaluator.init(
                structuredClone(gregorian.static_data),
                structuredClone(gregorian.dynamic_data),
                structuredClone(gregorianEvents),
                [],
                calendarData.epoch_data,
                10,  // Easter
                calendarData.start_epoch,
                calendarData.end_epoch,
                true,
                false  // callback=false, skip postMessage progress path
            );
        }).not.toThrow();
    });
});

describe('Easter occurrence evaluation (seeder Gregorian)', () => {

    it('Paschal Full Moon finds valid epochs in the evaluated range', async () => {

        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;  // 2020
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Evaluate Paschal Full Moon (event 9) first — it's Easter's dependency
        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            9,  // Paschal Full Moon
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        const pfmEpochs = eventData.valid[9] || [];
        expect(pfmEpochs.length).toBeGreaterThan(0);

        // Each valid epoch should have data in epoch_data
        for (const epoch of pfmEpochs) {
            expect(calendarData.epoch_data[epoch]).toBeDefined();
        }
    });

    it('Easter finds valid epochs when evaluated via event chain', async () => {

        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Evaluate Easter (event 10) — this triggers the connected event
        // chain which first evaluates Paschal Full Moon (event 9)
        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            10,  // Easter
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        const easterEpochs = eventData.valid[10] || [];

        // Diagnostic: also check what Paschal Full Moon found
        const pfmEpochs = eventData.valid[9] || [];

        // Easter should occur ~once per year across 10 years
        expect(easterEpochs.length, `Easter found ${easterEpochs.length} epochs (PFM found ${pfmEpochs.length})`).toBeGreaterThan(0);
    });

    it('all epochs in the event evaluator loop range have epoch_data entries', async () => {

        // This verifies that the callback=true path (which accesses
        // epoch_data[epoch].year for progress messages) won't crash.
        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Compute the event evaluator's full loop range for Easter (event 10)
        // by checking what begin_epoch/last_epoch would be.
        // Easter has connected_events=[9], and evaluate_pre_post gives
        // search_distance=200 to all events. check_event_chain propagates
        // lookback/lookahead through the chain.
        //
        // Rather than replicating the logic, we can just verify that every
        // epoch from (start_epoch - 200) to (end_epoch + 200) has data.
        const maxSearchDistance = 200;  // from Paschal Full Moon limited_repeat_num
        const loopStart = calendarData.start_epoch - maxSearchDistance;
        const loopEnd = calendarData.end_epoch + maxSearchDistance;

        const missingEpochs = [];
        for (let epoch = loopStart; epoch <= loopEnd; epoch++) {
            if (calendarData.epoch_data[epoch] === undefined) {
                missingEpochs.push(epoch);
            }
        }

        expect(missingEpochs.length, `Found ${missingEpochs.length} missing epochs in range [${loopStart}, ${loopEnd}]. First missing: ${missingEpochs[0]}, last missing: ${missingEpochs[missingEpochs.length-1]}`).toBe(0);
    });

    it('Easter occurrences survive the year-range filter', async () => {

        // This replicates the full worker_event_tester.js flow
        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = gregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            10,
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        // Replicate worker_event_tester.js lines 27-45
        const occurrences = eventData.valid[10] || [];
        const validOccurrences = [];

        for (const epoch of occurrences) {
            const epochData = calendarData.epoch_data[epoch];
            if (epochData && epochData.year >= startYear && epochData.year < endYear) {
                validOccurrences.push({
                    year: epochData.year,
                    timespan: epochData.timespan_index,
                    day: epochData.day,
                });
            }
        }

        expect(validOccurrences.length, `Expected ~10 Easter occurrences in years ${startYear}-${endYear}, got ${validOccurrences.length}. Raw epochs: ${occurrences.length}`).toBeGreaterThan(0);
    });
});

// Extra tests using the submodule preset data (has search_distance > 0 events)
const describeSubmodule = submoduleGregorian ? describe : describe.skip;

describeSubmodule('calendar_data_generator.run_future (submodule Gregorian)', () => {

    it('epoch_data extends beyond start and end by at least search_distance', async () => {

        calendar_data_generator.static_data = structuredClone(submoduleGregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(submoduleGregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(submoduleGregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = submoduleGregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const result = await calendar_data_generator.run_future(startYear, endYear, false);

        const allEpochs = Object.keys(result.epoch_data).map(Number).sort((a, b) => a - b);
        const dataMin = allEpochs[0];
        const dataMax = allEpochs[allEpochs.length - 1];

        // The submodule Gregorian preset has Paschal Full Moon with
        // search_distance=60, making both pre_search=60 and post_search=60.
        expect(result.start_epoch - dataMin).toBeGreaterThanOrEqual(60);
        expect(dataMax - result.end_epoch).toBeGreaterThanOrEqual(60);
    });

    it('does not crash event_evaluator on events with search_distance', async () => {

        calendar_data_generator.static_data = structuredClone(submoduleGregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(submoduleGregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(submoduleGregorianEvents);
        calendar_data_generator.event_categories = [];

        const startYear = submoduleGregorian.dynamic_data.year;
        const endYear = startYear + 10;

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Test the events that originally crashed: Spring Equinox (2),
        // Christmas (4), Paschal Full Moon (5), Easter (6)
        for (const eventId of [2, 4, 5, 6]) {
            expect(() => {
                event_evaluator.init(
                    structuredClone(submoduleGregorian.static_data),
                    structuredClone(submoduleGregorian.dynamic_data),
                    structuredClone(submoduleGregorianEvents),
                    [],
                    calendarData.epoch_data,
                    eventId,
                    calendarData.start_epoch,
                    calendarData.end_epoch,
                    true,
                    false
                );
            }).not.toThrow();
        }
    });
});
