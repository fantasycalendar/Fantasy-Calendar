import { describe, it, expect, beforeEach } from 'vitest';
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

/**
 * Find the index of an event by name in an events array.
 * Throws if the event is not found, so tests fail clearly.
 */
function findEventIndex(events, name) {
    const index = events.findIndex(e => e.name === name);
    if (index === -1) {
        throw new Error(`Event "${name}" not found in events array. Available: ${events.map(e => e.name).join(', ')}`);
    }
    return index;
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

    let startYear, endYear;

    beforeEach(() => {
        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        startYear = gregorian.dynamic_data.year;
        endYear = startYear + 10;
    });

    it('returns start/end epochs within the epoch_data range', async () => {

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

        const result = await calendar_data_generator.run_future(startYear, endYear, false);

        const allEpochs = Object.keys(result.epoch_data).map(Number).sort((a, b) => a - b);
        const dataMin = allEpochs[0];

        // The seeder Gregorian preset has Paschal Full Moon with
        // limited_repeat_num=200, which makes pre_search=200.
        // The epoch_data must extend at least that far before start_epoch.
        expect(result.start_epoch - dataMin).toBeGreaterThanOrEqual(200);
    });

    it('does not crash event_evaluator with seeder Gregorian events', async () => {

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        const easterIndex = findEventIndex(gregorianEvents, 'Easter');

        // Easter depends on Paschal Full Moon via connected_events.
        // The chain assigns lookback/lookahead that extend the loop range.
        // Before the fix, this would throw:
        //   "can't access property 'year', event_evaluator.epoch_data[epoch] is undefined"
        expect(() => {
            event_evaluator.init(
                structuredClone(gregorian.static_data),
                structuredClone(gregorian.dynamic_data),
                structuredClone(gregorianEvents),
                [],
                calendarData.epoch_data,
                easterIndex,
                calendarData.start_epoch,
                calendarData.end_epoch,
                true,
                false  // callback=false, skip postMessage progress path
            );
        }).not.toThrow();
    });
});

describe('Easter occurrence evaluation (seeder Gregorian)', () => {

    let startYear, endYear;

    beforeEach(() => {
        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];

        startYear = gregorian.dynamic_data.year;  // 2020
        endYear = startYear + 10;
    });

    it('Paschal Full Moon finds valid epochs in the evaluated range', async () => {

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        const pfmIndex = findEventIndex(gregorianEvents, 'Paschal Full Moon');

        // Evaluate Paschal Full Moon first — it's Easter's dependency
        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            pfmIndex,
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        const pfmEpochs = eventData.valid[pfmIndex] || [];
        expect(pfmEpochs.length).toBe(10);

        // Each valid epoch should have data in epoch_data
        for (const epoch of pfmEpochs) {
            expect(calendarData.epoch_data[epoch]).toBeDefined();
        }
    });

    it('Easter finds valid epochs when evaluated via event chain', async () => {

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        const easterIndex = findEventIndex(gregorianEvents, 'Easter');
        const pfmIndex = findEventIndex(gregorianEvents, 'Paschal Full Moon');

        // Evaluate Easter — this triggers the connected event
        // chain which first evaluates Paschal Full Moon
        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            easterIndex,
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        const easterEpochs = eventData.valid[easterIndex] || [];
        const pfmEpochs = eventData.valid[pfmIndex] || [];

        // Easter should occur exactly once per year across 10 years
        expect(easterEpochs.length, `Easter found ${easterEpochs.length} epochs (PFM found ${pfmEpochs.length})`).toBe(10);
    });

    it('all epochs in the event evaluator loop range have epoch_data entries', async () => {

        // This verifies that the callback=true path (which accesses
        // epoch_data[epoch].year for progress messages) won't crash.
        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Compute the event evaluator's full loop range for Easter
        // by checking what begin_epoch/last_epoch would be.
        // Easter has connected_events pointing to Paschal Full Moon,
        // and evaluate_pre_post gives search_distance=200 to all events.
        // check_event_chain propagates lookback/lookahead through the chain.
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
        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        const easterIndex = findEventIndex(gregorianEvents, 'Easter');

        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            easterIndex,
            calendarData.start_epoch,
            calendarData.end_epoch,
            true,
            false
        );

        // Replicate worker_event_tester.js lines 27-45
        const occurrences = eventData.valid[easterIndex] || [];
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

        // The calendar's current date is Sep 20, 2020 — after Easter 2020.
        // run_future generates from that point forward, so we get Easters
        // for 2021-2030 (10 raw), but the year < endYear filter excludes
        // 2030, leaving 9.
        expect(validOccurrences.length, `Expected 9 Easter occurrences in years ${startYear}-${endYear}, got ${validOccurrences.length}. Raw epochs: ${occurrences.length}`).toBe(9);
    });
});

describe('Easter via run() + evaluate-all path (replicates calendar UI)', () => {

    beforeEach(() => {
        calendar_data_generator.static_data = structuredClone(gregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(gregorianEvents);
        calendar_data_generator.event_categories = [];
    });

    it('Easter is found when evaluating all events against run() output', async () => {

        // This replicates the exact flow used by the calendar UI:
        // 1. calendar_data_generator.run() produces epoch data for the display year
        // 2. event_evaluator.init() with event_id=undefined evaluates ALL events
        // 3. The render_data_generator reads valid[event_index] for each event
        const calendarData = await calendar_data_generator.run({
            static_data: structuredClone(gregorian.static_data),
            dynamic_data: structuredClone(gregorian.dynamic_data),
            owner: true,
            events: structuredClone(gregorianEvents),
            event_categories: [],
        });

        // Evaluate ALL events (event_id=undefined), just like the UI does
        const eventData = event_evaluator.init(
            structuredClone(gregorian.static_data),
            structuredClone(gregorian.dynamic_data),
            structuredClone(gregorianEvents),
            [],
            calendarData.epoch_data,
            undefined,  // evaluate all events
            calendarData.year_data.start_epoch,
            calendarData.year_data.end_epoch,
            true,
            false
        );

        const pfmIndex = findEventIndex(gregorianEvents, 'Paschal Full Moon');
        const easterIndex = findEventIndex(gregorianEvents, 'Easter');

        // Build diagnostic summary lazily for error messages
        const diagnosticSummary = () => {
            const results = {};
            for (let i = 0; i < gregorianEvents.length; i++) {
                const epochs = eventData.valid[i] || [];
                results[`${i}: ${gregorianEvents[i].name}`] = epochs.length;
            }
            return JSON.stringify(results);
        };

        // Paschal Full Moon should have exactly 1 occurrence in a single year
        const pfmEpochs = eventData.valid[pfmIndex] || [];
        expect(pfmEpochs.length, `PFM found ${pfmEpochs.length} epochs. All results: ${diagnosticSummary()}`).toBe(1);

        // Easter should have exactly 1 occurrence in a single year
        const easterEpochs = eventData.valid[easterIndex] || [];
        expect(easterEpochs.length, `Easter found ${easterEpochs.length} epochs. All results: ${diagnosticSummary()}`).toBe(1);
    });
});

// Extra tests using the submodule preset data (has search_distance > 0 events)
const describeSubmodule = submoduleGregorian ? describe : describe.skip;

describeSubmodule('calendar_data_generator.run_future (submodule Gregorian)', () => {

    let startYear, endYear;

    beforeEach(() => {
        calendar_data_generator.static_data = structuredClone(submoduleGregorian.static_data);
        calendar_data_generator.dynamic_data = structuredClone(submoduleGregorian.dynamic_data);
        calendar_data_generator.owner = true;
        calendar_data_generator.events = structuredClone(submoduleGregorianEvents);
        calendar_data_generator.event_categories = [];

        startYear = submoduleGregorian.dynamic_data.year;
        endYear = startYear + 10;
    });

    it('epoch_data extends beyond start and end by at least search_distance', async () => {

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

        const calendarData = await calendar_data_generator.run_future(startYear, endYear, false);

        // Test the events that originally crashed
        const crashEvents = ['Spring Equinox', 'Christmas', 'Paschal Full Moon', 'Easter'];
        for (const eventName of crashEvents) {
            const eventIndex = findEventIndex(submoduleGregorianEvents, eventName);
            expect(() => {
                event_evaluator.init(
                    structuredClone(submoduleGregorian.static_data),
                    structuredClone(submoduleGregorian.dynamic_data),
                    structuredClone(submoduleGregorianEvents),
                    [],
                    calendarData.epoch_data,
                    eventIndex,
                    calendarData.start_epoch,
                    calendarData.end_epoch,
                    true,
                    false
                );
            }).not.toThrow();
        }
    });
});
