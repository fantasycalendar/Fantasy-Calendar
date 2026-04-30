import { describe, it, expect, vi } from 'vitest';
import {
    pick_from_table,
    get_cycle,
    get_days_in_timespan,
    get_timespans_in_year,
    ordinal_suffix_of,
    truncate_weekdays,
    escapeHtml,
    unescapeHtml,
    fract,
    lerp,
    clamp,
    mid,
    norm,
    precisionRound,
    get_moon_granularity,
    slugify,
    is_leap_simple,
    get_timespan_occurrences,
    convert_year,
    unconvert_year,
} from '../calendar/calendar_functions';

// ─────────────────────────────────────────────────────────────
// Helpers: minimal static_data structures used across tests
// ─────────────────────────────────────────────────────────────

/**
 * Build a minimal static_data for calendar tests.
 * year_zero_exists defaults to true so convert_year is a no-op.
 */
function makeStaticData(overrides = {}) {
    return {
        settings: { year_zero_exists: true, ...overrides.settings },
        year_data: {
            timespans: overrides.timespans ?? [
                { name: 'Month1', length: 30, interval: 1, offset: 0, type: 'month' },
            ],
            leap_days: overrides.leap_days ?? [],
            global_week: overrides.global_week ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            overflow: overrides.overflow ?? false,
            first_day: overrides.first_day ?? 0,
        },
        eras: overrides.eras ?? [],
        cycles: overrides.cycles ?? null,
    };
}


// =============================================================
// 1. pick_from_table
// =============================================================
describe('pick_from_table', () => {

    // --- grow=false (non-cumulative) ---

    it('returns the first entry whose value >= chance (grow=false)', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(5, table, false);
        expect(result).toEqual({ index: 0, key: 'rain', value: 10 });
    });

    it('returns the matching entry when chance equals the value exactly', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(10, table, false);
        expect(result).toEqual({ index: 0, key: 'rain', value: 10 });
    });

    it('skips entries whose values are below chance (grow=false)', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(15, table, false);
        expect(result).toEqual({ index: 1, key: 'snow', value: 20 });
    });

    it('returns the last entry when chance equals it (grow=false)', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(30, table, false);
        expect(result).toEqual({ index: 2, key: 'sun', value: 30 });
    });

    // --- grow=true (cumulative) ---

    it('accumulates values when grow=true', () => {
        // Running total: rain=10, snow=10+20=30, sun=30+30=60
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(25, table, true);
        expect(result).toEqual({ index: 1, key: 'snow', value: 20 });
    });

    it('returns first entry when chance fits in first bucket (grow=true)', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        const result = pick_from_table(10, table, true);
        expect(result).toEqual({ index: 0, key: 'rain', value: 10 });
    });

    it('returns last entry when chance equals cumulative total (grow=true)', () => {
        const table = { 'rain': 10, 'snow': 20, 'sun': 30 };
        // cumulative: 10, 30, 60
        const result = pick_from_table(60, table, true);
        expect(result).toEqual({ index: 2, key: 'sun', value: 30 });
    });

    // --- grow defaults to false when omitted ---

    it('defaults grow to false when the parameter is omitted', () => {
        const table = { 'a': 5, 'b': 15 };
        // If grow were true, cumulative would be 5, 20 → chance 10 hits 'b' at 20
        // With grow=false, chance=10 > 5 but <= 15 → hits 'b' at value 15
        const result = pick_from_table(10, table);
        expect(result).toEqual({ index: 1, key: 'b', value: 15 });
    });

    // --- The parameter shadowing pattern ---
    // `var grow = grow !== undefined ? grow : false;`
    // This works because var hoists the declaration but the RHS `grow` still
    // references the *parameter* (they share the same binding with `var`).
    // If this were rewritten with `let`, it would hit a TDZ error.

    it('grow=true actually takes effect (tests var parameter shadowing)', () => {
        const table = { 'x': 3, 'y': 3, 'z': 3 };
        // grow=false: targets are 3, 3, 3 → chance 7 exceeds all → false
        // grow=true:  targets are 3, 6, 9 → chance 7 hits z at 9
        const result = pick_from_table(7, table, true);
        expect(result).toEqual({ index: 2, key: 'z', value: 3 });
    });

    it('grow=false explicitly passed works identically to default', () => {
        const table = { 'x': 3, 'y': 3, 'z': 3 };
        const resultDefault = pick_from_table(3, table);
        const resultExplicit = pick_from_table(3, table, false);
        expect(resultDefault).toEqual(resultExplicit);
    });

    // --- returns false when no match ---

    it('returns false when chance exceeds all values (grow=false)', () => {
        const table = { 'rain': 10, 'snow': 20 };
        expect(pick_from_table(25, table, false)).toBe(false);
    });

    it('returns false when chance exceeds cumulative total (grow=true)', () => {
        const table = { 'rain': 10, 'snow': 20 };
        // cumulative: 10, 30
        expect(pick_from_table(31, table, true)).toBe(false);
    });

    // --- edge cases ---

    it('returns false for an empty object', () => {
        expect(pick_from_table(1, {}, false)).toBe(false);
    });

    it('works with a single-entry object', () => {
        const table = { 'only': 50 };
        expect(pick_from_table(50, table, false)).toEqual({ index: 0, key: 'only', value: 50 });
        expect(pick_from_table(51, table, false)).toBe(false);
    });

    it('works with string keys preserving key names', () => {
        const table = { 'first key': 10, 'second-key': 20 };
        const result = pick_from_table(15, table, false);
        expect(result.key).toBe('second-key');
    });
});


// =============================================================
// 2. get_cycle
// =============================================================
describe('get_cycle', () => {

    it('returns empty array when static_data.cycles is falsy', () => {
        const sd = makeStaticData({ cycles: null });
        const result = get_cycle(sd, { year: 0 });
        expect(result.array).toEqual([]);
        expect(result.text).toEqual({ n: '<br>' });
    });

    it('returns empty array when static_data.cycles is undefined', () => {
        const sd = makeStaticData();
        delete sd.cycles;
        const result = get_cycle(sd, { year: 0 });
        expect(result.array).toEqual([]);
    });

    it('computes correct cycle index for a simple 4-name cycle (type=year)', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'year',
                    length: 1,    // period of 1 — every year moves to next name
                    offset: 0,
                    names: ['Rat', 'Ox', 'Tiger', 'Rabbit'],
                }],
            },
        });
        // year_zero_exists=true so convert_year is no-op: converted year = 0
        // cycle_num = floor(0 / 1) = 0, cycle_index = (0 + floor(0/1)) % 4 = 0
        const result = get_cycle(sd, { year: 0 });
        expect(result.array).toEqual([0]);
        expect(result.text['1']).toBe('Rat');
    });

    it('wraps around correctly at boundaries', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'year',
                    length: 1,
                    offset: 0,
                    names: ['A', 'B', 'C'],
                }],
            },
        });
        // year 3 → convert_year(sd, 3) = 3, cycle_num = floor(3/1) = 3
        // cycle_index = 3 % 3 = 0 → wraps back to 'A'
        const result = get_cycle(sd, { year: 3 });
        expect(result.array).toEqual([0]);
        expect(result.text['1']).toBe('A');
    });

    it('handles cycle type "day" — decrements epoch_data', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'day',
                    length: 1,
                    offset: 0,
                    names: ['Dawn', 'Dusk'],
                }],
            },
        });
        // For "day" type, cycle_epoch_data = epoch_data['day'] - 1
        // epoch_data['day'] = 2 → cycle_epoch_data = 1
        // cycle_num = floor(1/1) = 1, cycle_index = 1 % 2 = 1
        const result = get_cycle(sd, { day: 2 });
        expect(result.array).toEqual([1]);
        expect(result.text['1']).toBe('Dusk');
    });

    it('handles cycle type "year day" — decrements epoch_data', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'year day',
                    length: 1,
                    offset: 0,
                    names: ['X', 'Y'],
                }],
            },
        });
        // "year day" → cycle_epoch_data = epoch_data['year day'] - 1 = 3 - 1 = 2
        // cycle_num = floor(2/1) = 2, cycle_index = 2 % 2 = 0
        const result = get_cycle(sd, { 'year day': 3 });
        expect(result.array).toEqual([0]);
        expect(result.text['1']).toBe('X');
    });

    it('defaults to type "year" when cycle.type is falsy', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: '',   // falsy
                    length: 1,
                    offset: 0,
                    names: ['Alpha', 'Beta'],
                }],
            },
        });
        // Should treat as "year" type
        // convert_year(sd, 5) = 5 (year_zero_exists=true)
        // cycle_num = floor(5/1) = 5, cycle_index = 5 % 2 = 1
        const result = get_cycle(sd, { year: 5 });
        expect(result.array).toEqual([1]);
        expect(result.text['1']).toBe('Beta');
    });

    it('multiple cycles produce independent indices', () => {
        const sd = makeStaticData({
            cycles: {
                data: [
                    { type: 'year', length: 1, offset: 0, names: ['A', 'B', 'C'] },
                    { type: 'year', length: 2, offset: 0, names: ['X', 'Y'] },
                ],
            },
        });
        // year = 4, both use "year" type
        // Cycle 1: convert_year(sd,4)=4, cycle_num=floor(4/1)=4, index=4%3=1 → 'B'
        // Cycle 2: convert_year(sd,4)=4, cycle_num=floor(4/2)=2, index=2%2=0 → 'X'
        const result = get_cycle(sd, { year: 4 });
        expect(result.array).toEqual([1, 0]);
        expect(result.text['1']).toBe('B');
        expect(result.text['2']).toBe('X');
    });

    it('handles negative years with the correction logic', () => {
        const sd = makeStaticData({
            settings: { year_zero_exists: false },
            cycles: {
                data: [{
                    type: 'year',
                    length: 1,
                    offset: 0,
                    names: ['A', 'B', 'C'],
                }],
            },
        });
        // year_zero_exists=false, year=-1 → convert_year(sd, -1) = -1
        // cycle_epoch_data = convert_year(sd, -1) = -1
        // cycle_num = floor(-1 / 1) = -1
        // Since cycle_num < 0: cycle_num += ceil(abs(-1) / 3) * 3 = ceil(1/3)*3 = 1*3 = 3
        // cycle_num = -1 + 3 = 2
        // cycle_index = (2 + floor(0/1)) % 3 = 2
        const result = get_cycle(sd, { year: -1 });
        expect(result.array).toEqual([2]);
        expect(result.text['1']).toBe('C');
    });

    it('applies offset to shift the cycle', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'year',
                    length: 1,
                    offset: 2,   // offset of 2
                    names: ['A', 'B', 'C', 'D'],
                }],
            },
        });
        // year=0, convert_year(sd,0)=0
        // cycle_num = floor(0/1) = 0
        // cycle_index = (0 + floor(2/1)) % 4 = 2 % 4 = 2 → 'C'
        const result = get_cycle(sd, { year: 0 });
        expect(result.array).toEqual([2]);
        expect(result.text['1']).toBe('C');
    });

    it('text keys are string indices starting at "1"', () => {
        const sd = makeStaticData({
            cycles: {
                data: [
                    { type: 'year', length: 1, offset: 0, names: ['Alpha'] },
                    { type: 'year', length: 1, offset: 0, names: ['Beta'] },
                    { type: 'year', length: 1, offset: 0, names: ['Gamma'] },
                ],
            },
        });
        const result = get_cycle(sd, { year: 0 });
        expect(result.text).toHaveProperty('1');
        expect(result.text).toHaveProperty('2');
        expect(result.text).toHaveProperty('3');
        expect(result.text).toHaveProperty('n', '<br>');
    });

    it('handles cycle.length > names.length (period differs from name count)', () => {
        const sd = makeStaticData({
            cycles: {
                data: [{
                    type: 'year',
                    length: 3,    // period of 3 years per step
                    offset: 0,
                    names: ['A', 'B'],  // only 2 names
                }],
            },
        });
        // year=6, convert_year(sd,6)=6
        // cycle_num = floor(6/3) = 2
        // cycle_index = (2 + floor(0/3)) % 2 = 2 % 2 = 0 → 'A'
        const r1 = get_cycle(sd, { year: 6 });
        expect(r1.text['1']).toBe('A');

        // year=3, cycle_num = floor(3/3) = 1
        // cycle_index = 1 % 2 = 1 → 'B'
        const r2 = get_cycle(sd, { year: 3 });
        expect(r2.text['1']).toBe('B');
    });
});


// =============================================================
// 3. get_days_in_timespan
// =============================================================
describe('get_days_in_timespan', () => {

    it('returns an array of normal_day objects for a simple timespan', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [],
        });
        const days = get_days_in_timespan(sd, 0, 0);
        expect(days).toHaveLength(5);
        expect(days.every(d => d.normal_day === true)).toBe(true);
    });

    it('returns empty array for non-existent timespan_index', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
        });
        const days = get_days_in_timespan(sd, 0, 99);
        expect(days).toEqual([]);
    });

    it('returns only regular days when no_leaps=true', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [{
                name: 'Leap Day',
                timespan: 0,
                intercalary: false,
                day: 3,
                interval: '1',
                offset: 0,
                not_numbered: false,
                cyclic_interval: false,
            }],
        });
        const days = get_days_in_timespan(sd, 0, 0, false, true);
        expect(days).toHaveLength(5);
        expect(days.every(d => d.normal_day === true)).toBe(true);
    });

    it('adds a non-intercalary leap day as extra normal day at end', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [{
                name: 'Leap Day',
                timespan: 0,
                intercalary: false,
                day: 5,
                interval: '1',
                offset: 0,
                not_numbered: false,
                cyclic_interval: false,
            }],
        });
        const days = get_days_in_timespan(sd, 0, 0);
        // 5 normal days + 1 leap day pushed to end = 6
        expect(days.length).toBe(6);
        // All should be normal_day: true (non-intercalary leaps add normal days)
        expect(days[5].normal_day).toBe(true);
    });

    it('inserts an intercalary leap day at the correct position', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [{
                name: 'Festival',
                timespan: 0,
                intercalary: true,
                day: 3,
                interval: '1',
                offset: 0,
                not_numbered: true,
                cyclic_interval: false,
            }],
        });
        const days = get_days_in_timespan(sd, 0, 0);
        // 5 normal + 1 intercalary inserted at position 3 = 6 total
        expect(days.length).toBe(6);
        // Find the intercalary day
        const intercalaryDay = days.find(d => d.normal_day === false);
        expect(intercalaryDay).toBeDefined();
        expect(intercalaryDay.text).toBe('Festival');
        expect(intercalaryDay.not_numbered).toBe(true);
    });

    it('does not include a leap day that does not appear this year', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [{
                name: 'Rare Day',
                timespan: 0,
                intercalary: false,
                day: 5,
                interval: '4',      // Only appears every 4th occurrence
                offset: 0,
                not_numbered: false,
                cyclic_interval: false,
            }],
        });
        // Year 1 (year_zero_exists=true): timespan_occurrences via get_timespan_occurrences(sd, 1, 1, 0) = 1
        // IntervalsCollection.make({interval:'4', offset:0, cyclic_interval:false}).intersectsYear(1, true)
        // Interval(4, 0): year 1 → un-normalized year = 1+1 = 2. 2 - 0 = 2 → 2 % 4 != 0 → abstain → false
        // So the leap day should NOT appear at year 1.
        const days = get_days_in_timespan(sd, 1, 0);
        expect(days).toHaveLength(5);
    });

    it('includes a leap day that does appear this year', () => {
        const sd = makeStaticData({
            timespans: [{ name: 'January', length: 5, interval: 1, offset: 0, type: 'month' }],
            leap_days: [{
                name: 'Rare Day',
                timespan: 0,
                intercalary: false,
                day: 5,
                interval: '4',
                offset: 0,
                not_numbered: false,
                cyclic_interval: false,
            }],
        });
        // At year 4 (year_zero_exists=true): timespan_occurrences = 4
        // intersectsYear(4, true): year stays 4 (yearZeroExists=true, no un-normalization)
        // Interval(4,0).voteOnYear(4, true): mod = 4-0=4, 4%4=0 → allow → truthy
        // So leap day SHOULD appear → 6 days total (5 normal + 1 extra)
        const days = get_days_in_timespan(sd, 4, 0);
        expect(days).toHaveLength(6);
    });
});


// =============================================================
// 4. get_timespans_in_year
// =============================================================
describe('get_timespans_in_year', () => {

    it('returns all timespans when all have interval=1', () => {
        const sd = makeStaticData({
            timespans: [
                { name: 'Jan', length: 30, interval: 1, offset: 0, type: 'month' },
                { name: 'Feb', length: 28, interval: 1, offset: 0, type: 'month' },
                { name: 'Mar', length: 31, interval: 1, offset: 0, type: 'month' },
            ],
        });
        const results = get_timespans_in_year(sd, 0, false);
        expect(results).toHaveLength(3);
        expect(results.every(r => r.result === true)).toBe(true);
    });

    it('each result has an id field matching the timespan index', () => {
        const sd = makeStaticData({
            timespans: [
                { name: 'Jan', length: 30, interval: 1, offset: 0, type: 'month' },
                { name: 'Feb', length: 28, interval: 1, offset: 0, type: 'month' },
            ],
        });
        const results = get_timespans_in_year(sd, 0, false);
        expect(results[0].id).toBe(0);
        expect(results[1].id).toBe(1);
    });

    it('hides a leaping timespan (interval=2) on non-matching years', () => {
        const sd = makeStaticData({
            timespans: [
                { name: 'Regular', length: 30, interval: 1, offset: 0, type: 'month' },
                { name: 'Leaper', length: 10, interval: 2, offset: 0, type: 'month' },
            ],
        });
        // year=0, year_zero_exists=true → unconvert_year(sd, 0) = 0
        // is_leap_simple: interval=2, cleanYear=0, mod = 0 - (0%2) = 0, 0%2=0 → true
        const resultsYear0 = get_timespans_in_year(sd, 0, false);
        expect(resultsYear0).toHaveLength(2);

        // year=1 → unconvert_year(sd, 1) = 1
        // is_leap_simple: interval=2, cleanYear=1, mod = 1 - 0 = 1, 1%2 != 0 → false
        const resultsYear1 = get_timespans_in_year(sd, 1, false);
        expect(resultsYear1).toHaveLength(1);
        expect(resultsYear1[0].id).toBe(0); // Only 'Regular'
    });

    it('inclusive=true includes non-appearing timespans with result=false', () => {
        const sd = makeStaticData({
            timespans: [
                { name: 'Regular', length: 30, interval: 1, offset: 0, type: 'month' },
                { name: 'Leaper', length: 10, interval: 2, offset: 0, type: 'month' },
            ],
        });
        // year=1: Leaper doesn't appear
        const results = get_timespans_in_year(sd, 1, true);
        expect(results).toHaveLength(2);
        expect(results[0].result).toBe(true);
        expect(results[1].result).toBe(false);
        expect(results[1].reason).toBe('leaping');
    });

    it('era that ends the year hides timespans after era date', () => {
        const sd = makeStaticData({
            timespans: [
                { name: 'Jan', length: 30, interval: 1, offset: 0, type: 'month' },
                { name: 'Feb', length: 28, interval: 1, offset: 0, type: 'month' },
                { name: 'Mar', length: 31, interval: 1, offset: 0, type: 'month' },
            ],
            eras: [{
                settings: { starting_era: false, ends_year: true, restart: false },
                date: { year: 5, timespan: 0, day: 15, epoch: 0 },
            }],
        });
        // year_zero_exists=true, so convert_year(sd, 5) = 5
        // year=5: era ends at timespan 0 → timespans 1 and 2 (> 0) should not appear
        const results = get_timespans_in_year(sd, 5, false);
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe(0);
    });
});


// =============================================================
// 5. ordinal_suffix_of
// =============================================================
describe('ordinal_suffix_of', () => {

    const cases = [
        [1, '1st'],
        [2, '2nd'],
        [3, '3rd'],
        [4, '4th'],
        [5, '5th'],
        [9, '9th'],
        [10, '10th'],
        [11, '11th'],
        [12, '12th'],
        [13, '13th'],
        [14, '14th'],
        [20, '20th'],
        [21, '21st'],
        [22, '22nd'],
        [23, '23rd'],
        [24, '24th'],
        [100, '100th'],
        [101, '101st'],
        [102, '102nd'],
        [103, '103rd'],
        [111, '111th'],
        [112, '112th'],
        [113, '113th'],
        [121, '121st'],
        [122, '122nd'],
        [123, '123rd'],
        [0, '0th'],
        [1000, '1000th'],
        [1001, '1001st'],
    ];

    it.each(cases)('ordinal_suffix_of(%i) → %s', (input, expected) => {
        expect(ordinal_suffix_of(input)).toBe(expected);
    });
});


// =============================================================
// 6. truncate_weekdays
// =============================================================
describe('truncate_weekdays', () => {

    it('truncates single-word names to first 2 characters', () => {
        expect(truncate_weekdays(['Monday', 'Tuesday'])).toEqual(['Mo', 'Tu']);
    });

    it('truncates multi-word names to first char of each word', () => {
        expect(truncate_weekdays(['Good Friday'])).toEqual(['GF']);
    });

    it('keeps numeric strings as-is', () => {
        expect(truncate_weekdays(['1', '2', '3'])).toEqual(['1', '2', '3']);
    });

    it('keeps roman numerals as-is', () => {
        expect(truncate_weekdays(['IV', 'VII', 'XII'])).toEqual(['IV', 'VII', 'XII']);
    });

    it('returns empty array for empty input', () => {
        expect(truncate_weekdays([])).toEqual([]);
    });

    it('handles mixed content', () => {
        const result = truncate_weekdays(['Monday', 'Good Friday', '3', 'IX']);
        expect(result).toEqual(['Mo', 'GF', '3', 'IX']);
    });

    it('handles single-character names', () => {
        // substring(0, 2) on a 1-char string just returns the char
        expect(truncate_weekdays(['A'])).toEqual(['A']);
    });

    it('handles multi-word with more than 2 words (only uses first 2 words)', () => {
        // The code does: name.split(' ')[0].substring(0,1) + name.split(' ')[1].substring(0,1)
        // So it only uses the first two words regardless of how many there are
        const result = truncate_weekdays(['Day Of Rest']);
        expect(result).toEqual(['DO']);
    });
});


// =============================================================
// 7. escapeHtml / unescapeHtml
// =============================================================
describe('escapeHtml', () => {

    it('escapes ampersands', () => {
        expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('escapes angle brackets', () => {
        expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    });

    it('escapes double quotes', () => {
        expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
    });

    it('escapes single quotes', () => {
        expect(escapeHtml("it's")).toBe("it&#039;s");
    });

    it('handles a string with all special characters', () => {
        expect(escapeHtml('<a href="x" title=\'y\'>&')).toBe(
            '&lt;a href=&quot;x&quot; title=&#039;y&#039;&gt;&amp;'
        );
    });
});

describe('unescapeHtml', () => {

    it('unescapes all entities', () => {
        expect(unescapeHtml('&lt;a href=&quot;x&quot;&gt;&amp;&#039;')).toBe('<a href="x">&\'');
    });

    it('returns numbers as-is (short-circuit)', () => {
        expect(unescapeHtml(42)).toBe(42);
    });
});

describe('escapeHtml / unescapeHtml round-trip', () => {

    it('round-trips correctly', () => {
        const original = '<script>alert("XSS & more\'s")</script>';
        expect(unescapeHtml(escapeHtml(original))).toBe(original);
    });
});


// =============================================================
// 8. fract
// =============================================================
describe('fract', () => {

    it('returns fractional part of positive float', () => {
        expect(fract(3.75)).toBeCloseTo(0.75);
    });

    it('returns 0 for an integer', () => {
        expect(fract(5)).toBe(0);
    });

    it('returns fractional part of negative float', () => {
        // Math.floor(-1.25) = -2, so fract = -1.25 - (-2) = 0.75
        expect(fract(-1.25)).toBeCloseTo(0.75);
    });

    it('returns 0 for zero', () => {
        expect(fract(0)).toBe(0);
    });
});


// =============================================================
// 9. lerp
// =============================================================
describe('lerp', () => {

    it('returns p0 when t=0', () => {
        expect(lerp(10, 20, 0)).toBe(10);
    });

    it('returns p1 when t=1', () => {
        expect(lerp(10, 20, 1)).toBe(20);
    });

    it('returns midpoint when t=0.5', () => {
        expect(lerp(10, 20, 0.5)).toBe(15);
    });

    it('extrapolates beyond 0-1 range', () => {
        expect(lerp(0, 10, 2)).toBe(20);
    });
});


// =============================================================
// 10. clamp
// =============================================================
describe('clamp', () => {

    it('clamps below minimum', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps above maximum', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    it('returns value when in range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('returns min when value equals min', () => {
        expect(clamp(0, 0, 10)).toBe(0);
    });

    it('returns max when value equals max', () => {
        expect(clamp(10, 0, 10)).toBe(10);
    });
});


// =============================================================
// 11. mid
// =============================================================
describe('mid', () => {

    it('returns average of two values', () => {
        expect(mid(10, 20)).toBe(15);
    });

    it('returns same value when both inputs are equal', () => {
        expect(mid(5, 5)).toBe(5);
    });

    it('handles negative values', () => {
        expect(mid(-10, 10)).toBe(0);
    });
});


// =============================================================
// 12. norm
// =============================================================
describe('norm', () => {

    it('returns 0 when v equals min', () => {
        expect(norm(0, 0, 10)).toBe(0);
    });

    it('returns 1 when v equals max', () => {
        expect(norm(10, 0, 10)).toBe(1);
    });

    it('returns 0.5 for midpoint', () => {
        expect(norm(5, 0, 10)).toBe(0.5);
    });

    it('can return values outside 0-1 if v is outside range', () => {
        expect(norm(20, 0, 10)).toBe(2);
    });
});


// =============================================================
// 13. precisionRound
// =============================================================
describe('precisionRound', () => {

    it('rounds to 2 decimal places', () => {
        expect(precisionRound(1.2345, 2)).toBe(1.23);
    });

    it('rounds to 0 decimal places', () => {
        expect(precisionRound(1.5, 0)).toBe(2);
    });

    it('rounds negative numbers', () => {
        expect(precisionRound(-1.555, 2)).toBe(-1.55);
    });

    it('handles very high precision', () => {
        expect(precisionRound(1.123456789, 7)).toBe(1.1234568);
    });
});


// =============================================================
// 14. get_moon_granularity
// =============================================================
describe('get_moon_granularity', () => {

    it('returns 40 for cycle >= 40', () => {
        expect(get_moon_granularity(40)).toBe(40);
        expect(get_moon_granularity(100)).toBe(40);
    });

    it('returns 24 for cycle >= 24 and < 40', () => {
        expect(get_moon_granularity(24)).toBe(24);
        expect(get_moon_granularity(39)).toBe(24);
    });

    it('returns 16 for cycle >= 16 and < 24', () => {
        expect(get_moon_granularity(16)).toBe(16);
        expect(get_moon_granularity(23)).toBe(16);
    });

    it('returns 8 for cycle >= 8 and < 16', () => {
        expect(get_moon_granularity(8)).toBe(8);
        expect(get_moon_granularity(15)).toBe(8);
    });

    it('returns 4 for cycle < 8', () => {
        expect(get_moon_granularity(7)).toBe(4);
        expect(get_moon_granularity(1)).toBe(4);
        expect(get_moon_granularity(0)).toBe(4);
    });
});


// =============================================================
// 15. slugify
// =============================================================
describe('slugify', () => {

    it('replaces spaces with hyphens', () => {
        expect(slugify('hello world')).toBe('hello-world');
    });

    it('lowercases the string', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });

    it('replaces special accented characters', () => {
        expect(slugify('café résumé')).toBe('cafe-resume');
    });

    it('replaces & with -and-', () => {
        expect(slugify('foo & bar')).toBe('foo-and-bar');
    });

    it('removes non-word characters', () => {
        expect(slugify('hello!@#$%^*()world')).toBe('helloworld');
    });

    it('collapses multiple hyphens', () => {
        expect(slugify('foo---bar')).toBe('foo-bar');
    });

    it('trims hyphens from start and end', () => {
        expect(slugify(' -hello- ')).toBe('hello');
    });

    it('handles completely numeric input', () => {
        expect(slugify('123')).toBe('123');
    });

    it('replaces slashes and underscores', () => {
        // '/' and '_' are in the special characters list
        expect(slugify('hello/world_test')).toBe('hello-world-test');
    });
});


// =============================================================
// 16. is_leap_simple
// =============================================================
describe('is_leap_simple', () => {

    const sdYZ = { settings: { year_zero_exists: true } };
    const sdNoYZ = { settings: { year_zero_exists: false } };

    it('returns true when interval is 1 (always appears)', () => {
        expect(is_leap_simple(sdYZ, 0, 1, 0)).toBe(true);
        expect(is_leap_simple(sdYZ, 999, 1, 0)).toBe(true);
    });

    it('alternates for interval=2 with offset=0 (year_zero_exists=true)', () => {
        // cleanYear = unconvert_year(sdYZ, year) = year
        // mod = cleanYear - (0 % 2) = cleanYear
        // year 0 → mod=0 → 0%2=0 → true
        // year 1 → mod=1 → 1%2=1 → false
        // year 2 → mod=2 → 2%2=0 → true
        expect(is_leap_simple(sdYZ, 0, 2, 0)).toBe(true);
        expect(is_leap_simple(sdYZ, 1, 2, 0)).toBe(false);
        expect(is_leap_simple(sdYZ, 2, 2, 0)).toBe(true);
    });

    it('offset shifts the leap pattern', () => {
        // interval=2, offset=1
        // cleanYear=0, mod = 0 - (1%2) = 0 - 1 = -1, -1%2 = -1 → false
        // cleanYear=1, mod = 1 - 1 = 0, 0%2 = 0 → true
        expect(is_leap_simple(sdYZ, 0, 2, 1)).toBe(false);
        expect(is_leap_simple(sdYZ, 1, 2, 1)).toBe(true);
    });

    it('works with negative years (year_zero_exists=false)', () => {
        // cleanYear = unconvert_year(sdNoYZ, -1) = -1
        // mod = -1 - (0 % 2) = -1
        // Since cleanYear < 0 && !year_zero_exists: mod++ → mod = 0
        // 0 % 2 = 0 → true
        expect(is_leap_simple(sdNoYZ, -1, 2, 0)).toBe(true);
    });

    it('works with interval=4 (like real-world leap years)', () => {
        // year_zero_exists=true, offset=0
        expect(is_leap_simple(sdYZ, 0, 4, 0)).toBe(true);
        expect(is_leap_simple(sdYZ, 1, 4, 0)).toBe(false);
        expect(is_leap_simple(sdYZ, 2, 4, 0)).toBe(false);
        expect(is_leap_simple(sdYZ, 3, 4, 0)).toBe(false);
        expect(is_leap_simple(sdYZ, 4, 4, 0)).toBe(true);
    });
});


// =============================================================
// 17. get_timespan_occurrences
// =============================================================
describe('get_timespan_occurrences', () => {

    const sdYZ = { settings: { year_zero_exists: true } };
    const sdNoYZ = { settings: { year_zero_exists: false } };

    it('returns year directly when interval is 1', () => {
        expect(get_timespan_occurrences(sdYZ, 5, 1, 0)).toBe(5);
        expect(get_timespan_occurrences(sdYZ, -3, 1, 0)).toBe(-3);
    });

    it('calculates occurrences with interval=2, offset=0, year_zero_exists=true', () => {
        // year_zero_exists=true: ceil((year - boundOffset) / interval)
        // year=4, boundOffset=0: ceil(4/2) = 2
        expect(get_timespan_occurrences(sdYZ, 4, 2, 0)).toBe(2);
        // year=5: ceil(5/2) = 3
        expect(get_timespan_occurrences(sdYZ, 5, 2, 0)).toBe(3);
    });

    it('handles offset correctly', () => {
        // interval=4, offset=2, year_zero_exists=true
        // boundOffset = 2 % 4 = 2
        // year=10: ceil((10 - 2) / 4) = ceil(8/4) = 2
        expect(get_timespan_occurrences(sdYZ, 10, 4, 2)).toBe(2);
    });

    it('handles negative years without year zero', () => {
        // year=-2, interval=2, offset=0, year_zero_exists=false
        // boundOffset = 0, year < 0 path
        // ceil((-2 - (0 - 1)) / 2) = ceil((-2 + 1) / 2) = ceil(-1/2) = ceil(-0.5) = 0
        // boundOffset === 0 → timespan_occurrences-- → -1
        expect(get_timespan_occurrences(sdNoYZ, -2, 2, 0)).toBe(-1);
    });

    it('handles positive years without year zero and offset > 0', () => {
        // year=3, interval=2, offset=1, year_zero_exists=false
        // boundOffset = 1 % 2 = 1
        // year >= 0, boundOffset > 0 path:
        // floor((3 + 2 - 1) / 2) = floor(4/2) = 2
        expect(get_timespan_occurrences(sdNoYZ, 3, 2, 1)).toBe(2);
    });

    it('handles positive years without year zero and offset=0', () => {
        // year=4, interval=2, offset=0, year_zero_exists=false
        // boundOffset = 0, year >= 0, boundOffset <= 0 path:
        // floor(4/2) = 2
        expect(get_timespan_occurrences(sdNoYZ, 4, 2, 0)).toBe(2);
    });
});
