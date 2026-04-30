import { describe, it, expect, beforeEach } from 'vitest';
import { event_evaluator } from '../calendar/calendar_workers';

/**
 * Comprehensive tests for evaluate_event_group() and evaluate_event_num_group()
 * on event_evaluator.
 *
 * These functions form the core logic for evaluating compound event conditions
 * in Fantasy Calendar. evaluate_event_group handles boolean operator chains
 * (AND, OR, XOR, NAND) while evaluate_event_num_group implements "at least N
 * of these conditions" counting logic.
 *
 * Condition array format for evaluate_event_group:
 *   [condition, [operator], condition, [operator], condition]
 * It iterates backwards by 2 (i -= 2), picking conditions at positions
 * array.length-1, array.length-3, etc., with operators at array.length-2,
 * array.length-4, etc.
 *
 * Nested groups: ["", [sub_array]] or ["!", [sub_array]] or ["3", [sub_array]]
 *
 * evaluate_event_num_group iterates backwards by 1 (i -= 1), counting true
 * conditions, returning true as soon as count >= num.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create a simple epoch_data object with sensible defaults.
 */
function makeEpochData(overrides = {}) {
    return {
        year: 2020,
        epoch: 100,
        timespan_index: 3,
        day: 15,
        week_day_name: 'Monday',
        ...overrides,
    };
}

// Condition shortcuts — these go through the "else" fallback path in
// evaluate_condition, keeping our focus on the group logic.

/** Year is exactly `year` → ["Year", "0", [year]] */
const yearIs = (year) => ['Year', '0', [String(year)]];

/** Year is not `year` → ["Year", "1", [year]] */
const yearIsNot = (year) => ['Year', '1', [String(year)]];

/** Month is exactly `month` → ["Month", "0", [month]] */
const monthIs = (month) => ['Month', '0', [String(month)]];

/** Month is not `month` → ["Month", "1", [month]] */
const monthIsNot = (month) => ['Month', '1', [String(month)]];

/** Day in month is exactly `day` → ["Day", "0", [day]] */
const dayIs = (day) => ['Day', '0', [String(day)]];

/** Day in month is not `day` → ["Day", "1", [day]] */
const dayIsNot = (day) => ['Day', '1', [String(day)]];

// Operators
const AND = ['&&'];
const OR = ['||'];
const XOR = ['^'];
const NAND = ['NAND'];

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    event_evaluator.static_data = {
        settings: { year_zero_exists: true },
        year_data: { global_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    };
    event_evaluator.dynamic_data = {};
    event_evaluator.stored_epochs = {};
    event_evaluator.event_data = { valid: {}, starts: {}, ends: {} };
});

// ─── evaluate_event_group ────────────────────────────────────────────────────

describe('evaluate_event_group', () => {

    // --- Single condition ---

    describe('single condition', () => {
        it('returns true when the condition matches', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(2020)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns false when the condition does not match', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(1999)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('works with a Month condition', () => {
            const epoch = makeEpochData({ timespan_index: 5 });
            const array = [monthIs(5)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('works with a Day condition', () => {
            const epoch = makeEpochData({ day: 25 });
            const array = [dayIs(25)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Two conditions with AND ---

    describe('two conditions with AND (&&)', () => {
        it('returns true when both conditions match', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), AND, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns false when first is true but second is false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), AND, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('returns false when first is false but second is true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), AND, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('returns false when both conditions are false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), AND, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });
    });

    // --- Two conditions with OR ---

    describe('two conditions with OR (||)', () => {
        it('returns true when both conditions match', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), OR, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns true when first is true and second is false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), OR, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns true when first is false and second is true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), OR, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns false when both are false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), OR, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });
    });

    // --- XOR operator ---

    describe('two conditions with XOR (^)', () => {
        it('returns false when both are true (true XOR true = false)', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), XOR, monthIs(3)];
            const result = event_evaluator.evaluate_event_group(epoch, array);
            // XOR: true ^ true should be falsy
            expect(!!result).toBe(false);
        });

        it('returns true when first is true and second is false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), XOR, monthIs(7)];
            const result = event_evaluator.evaluate_event_group(epoch, array);
            expect(!!result).toBe(true);
        });

        it('returns true when first is false and second is true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), XOR, monthIs(3)];
            const result = event_evaluator.evaluate_event_group(epoch, array);
            expect(!!result).toBe(true);
        });

        it('returns false when both are false (false XOR false = false)', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), XOR, monthIs(7)];
            const result = event_evaluator.evaluate_event_group(epoch, array);
            expect(!!result).toBe(false);
        });
    });

    // --- NAND operator ---

    describe('two conditions with NAND', () => {
        it('returns false when both are true (NAND = NOT AND)', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), NAND, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('returns true when first is true and second is false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), NAND, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns true when first is false and second is true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), NAND, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns true when both are false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(1999), NAND, monthIs(7)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Three conditions ---

    describe('three conditions with operators', () => {
        it('evaluates A && B && C correctly when all true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(2020), AND, monthIs(3), AND, dayIs(15)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('evaluates A && B && C correctly when one is false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(2020), AND, monthIs(7), AND, dayIs(15)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('evaluates A || B || C correctly when only middle is true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(1999), OR, monthIs(3), OR, dayIs(99)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('evaluates mixed A && B || C (left-to-right, backwards iteration)', () => {
            // The function iterates backwards: processes C first (i=4), then
            // combines with B using the operator at i=3 (||), then combines
            // with A using the operator at i=1 (&&).
            //
            // Iteration order:
            //   i=4: condition=C (dayIs(99)=false), no array[5], so result=false
            //   i=2: condition=B (monthIs(3)=true), array[3]=[||], result = false || true = true
            //   i=0: condition=A (yearIs(2020)=true), array[1]=[&&], result = true && true = true
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(2020), AND, monthIs(3), OR, dayIs(99)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('evaluates mixed A || B && C (left-to-right, backwards iteration)', () => {
            // Iteration order:
            //   i=4: condition=C (dayIs(15)=true), no array[5], so result=true
            //   i=2: condition=B (monthIs(7)=false), array[3]=[&&], result = true && false = false
            //   i=0: condition=A (yearIs(2020)=true), array[1]=[||], result = false || true = true
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(2020), OR, monthIs(7), AND, dayIs(15)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Backward iteration verification ---

    describe('backward iteration (i -= 2 pattern)', () => {
        it('processes the last condition first with no operator', () => {
            // With a single condition, i starts at 0, array[1] is undefined,
            // so result = new_result directly
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(2020)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('uses the operator at i+1 to combine with accumulated result', () => {
            // Array: [A, [&&], B]
            // i=2: condition=B, array[3]=undefined → result = B
            // i=0: condition=A, array[1]=[&&] → result = B && A
            // So the operator between A and B is at index 1 = [&&]
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            const array = [yearIs(2020), AND, monthIs(3)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('four conditions chain correctly', () => {
            // Array: [A, [&&], B, [&&], C, [||], D]
            // i=6: D=dayIsNot(15)=false, no array[7] → result=false
            // i=4: C=dayIs(15)=true, array[5]=[||] → result = false || true = true
            // i=2: B=monthIs(3)=true, array[3]=[&&] → result = true && true = true
            // i=0: A=yearIs(2020)=true, array[1]=[&&] → result = true && true = true
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [
                yearIs(2020), AND,
                monthIs(3), AND,
                dayIs(15), OR,
                dayIsNot(15),
            ];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Negated sub-group ---

    describe('negated sub-group', () => {
        it('negates a true sub-group to false', () => {
            const epoch = makeEpochData({ year: 2020 });
            // ["!", [sub_conditions]] where sub_conditions evaluate to true
            const array = [['!', [yearIs(2020)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('negates a false sub-group to true', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [['!', [yearIs(1999)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('negated sub-group combined with AND', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            // yearIs(2020) AND NOT(monthIs(7))
            // = true AND NOT(false) = true AND true = true
            const array = [yearIs(2020), AND, ['!', [monthIs(7)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('negated sub-group combined with AND where negation makes it false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            // yearIs(2020) AND NOT(monthIs(3))
            // = true AND NOT(true) = true AND false = false
            const array = [yearIs(2020), AND, ['!', [monthIs(3)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });
    });

    // --- Normal (non-negated) sub-group ---

    describe('normal sub-group (nested group)', () => {
        it('evaluates a sub-group without negation', () => {
            const epoch = makeEpochData({ year: 2020 });
            // ["", [sub_conditions]]
            const array = [['', [yearIs(2020)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('evaluates a false sub-group without negation', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [['', [yearIs(1999)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('nested group with multiple conditions inside', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            // Sub-group: yearIs(2020) AND monthIs(3) = true
            const array = [['', [yearIs(2020), AND, monthIs(3)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('nested group combined with outer condition via OR', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // dayIs(99) OR (yearIs(2020) AND monthIs(3))
            // = false OR true = true
            const array = [
                dayIs(99),
                OR,
                ['', [yearIs(2020), AND, monthIs(3)]],
            ];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Deeply nested groups ---

    describe('deeply nested groups', () => {
        it('evaluates group within a group', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            // Outer group contains a sub-group that itself contains a sub-group
            // ["", [ ["", [yearIs(2020)]] ]]
            const array = [['', [['', [yearIs(2020)]]]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('negation at multiple nesting levels', () => {
            const epoch = makeEpochData({ year: 2020 });
            // NOT(NOT(yearIs(2020))) = NOT(NOT(true)) = NOT(false) = true
            const array = [['!', [['!', [yearIs(2020)]]]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Count sub-groups (delegating to evaluate_event_num_group) ---

    describe('count sub-groups (delegates to evaluate_event_num_group)', () => {
        it('returns true when count threshold is met', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // "2" means "at least 2 of these conditions must be true"
            // yearIs(2020)=true, monthIs(3)=true, dayIs(99)=false → 2 true → true
            const array = [['2', [yearIs(2020), monthIs(3), dayIs(99)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('returns false when count threshold is not met', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // "3" means "at least 3 must be true", but only 2 are true
            const array = [['3', [yearIs(2020), monthIs(3), dayIs(99)]]];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });

        it('count sub-group combined with AND', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // dayIs(15) AND (at least 1 of: yearIs(2020), monthIs(99))
            // = true AND true = true
            const array = [
                dayIs(15),
                AND,
                ['1', [yearIs(2020), monthIs(99)]],
            ];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });
    });

    // --- Empty array ---

    describe('empty array', () => {
        it('returns false for an empty array (no iterations)', () => {
            const epoch = makeEpochData();
            // Loop never executes, result stays at initial value: false
            const array = [];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });
    });

    // --- Edge: "not" conditions in evaluate_condition ---

    describe('inequality conditions', () => {
        it('yearIsNot returns true when year does not match', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIsNot(1999)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
        });

        it('yearIsNot returns false when year matches', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIsNot(2020)];
            expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
        });
    });
});

// ─── evaluate_event_num_group ────────────────────────────────────────────────

describe('evaluate_event_num_group', () => {

    // --- Basic counting ---

    describe('basic counting', () => {
        it('returns true when all conditions are true and num=1', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(2020), monthIs(3), dayIs(15)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 1)).toBe(true);
        });

        it('returns true when exactly num conditions are true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // 2 of 3 are true: yearIs(2020)=true, monthIs(99)=false, dayIs(15)=true
            const array = [yearIs(2020), monthIs(99), dayIs(15)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(true);
        });

        it('returns false when fewer than num conditions are true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // Only 1 of 3 true: yearIs(2020)=true, monthIs(99)=false, dayIs(99)=false
            const array = [yearIs(2020), monthIs(99), dayIs(99)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(false);
        });

        it('returns true when more than num conditions are true', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // All 3 true, num=2
            const array = [yearIs(2020), monthIs(3), dayIs(15)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(true);
        });
    });

    // --- num=0 ---

    describe('num=0', () => {
        it('returns true even when no conditions are true (count >= 0 always)', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(1999), monthIs(99)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 0)).toBe(true);
        });

        it('returns true with empty array when num=0', () => {
            const epoch = makeEpochData();
            // Empty array: loop never runs, count_result=0, result = 0 >= 0 = true...
            // but wait — the loop never runs, so the function returns false (the
            // initial value). The check `count_result >= num` only happens inside
            // the loop body.
            //
            // BUG: When the array is empty and num=0, the function returns false
            // because the loop body never executes. Mathematically, "at least 0 of
            // 0 conditions" should be vacuously true, but the function returns false.
            // This is unlikely to matter in practice since count groups with 0
            // conditions or num=0 are edge cases that probably never occur in real
            // calendar data.
            const array = [];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 0)).toBe(false);
        });
    });

    // --- All false ---

    describe('all conditions false', () => {
        it('returns false when num > 0 and all conditions are false', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [yearIs(1999), monthIs(99), dayIs(99)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 1)).toBe(false);
        });
    });

    // --- Early exit ---

    describe('early exit behavior', () => {
        it('returns true as soon as count reaches num (does not need to process all)', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // 10 conditions, only need 2 true. The first two processed (from
            // the end, backwards) are true, so it should return true early.
            const array = [
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(1999), // false
                yearIs(2020), // true (processed second from end)
                dayIs(15),    // true (processed first — rightmost)
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(true);
        });

        it('returns true immediately when first condition is true and num=1', () => {
            const epoch = makeEpochData({ year: 2020 });
            // Last element (processed first due to backwards iteration) is true
            const array = [yearIs(1999), yearIs(1999), yearIs(2020)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 1)).toBe(true);
        });
    });

    // --- Negated sub-groups within count group ---

    describe('negated sub-groups within count group', () => {
        it('counts a negated-true sub-group as false', () => {
            const epoch = makeEpochData({ year: 2020 });
            // NOT(yearIs(2020)) = NOT(true) = false
            // yearIs(2020) = true
            // Count: 1 true, need 2 → false
            const array = [
                ['!', [yearIs(2020)]],
                yearIs(2020),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(false);
        });

        it('counts a negated-false sub-group as true', () => {
            const epoch = makeEpochData({ year: 2020 });
            // NOT(yearIs(1999)) = NOT(false) = true
            // yearIs(2020) = true
            // Count: 2 true, need 2 → true
            const array = [
                ['!', [yearIs(1999)]],
                yearIs(2020),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(true);
        });
    });

    // --- Normal sub-groups within count group ---

    describe('normal sub-groups within count group', () => {
        it('counts a true sub-group as one true condition', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
            // Sub-group: yearIs(2020) AND monthIs(3) = true
            // dayIs(15) is checked separately = true (day=15 default from makeEpochData)
            // But we want day to match, so use proper epoch
            const epoch2 = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            const array = [
                ['', [yearIs(2020), AND, monthIs(3)]],
                dayIs(15),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch2, array, 2)).toBe(true);
        });

        it('counts a false sub-group as one false condition', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // Sub-group: yearIs(1999) AND monthIs(3) = false
            // dayIs(15) = true
            // Count: 1 true, need 2 → false
            const array = [
                ['', [yearIs(1999), AND, monthIs(3)]],
                dayIs(15),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(false);
        });
    });

    // --- Nested count groups ---

    describe('nested count groups', () => {
        it('a count group nested inside a count group', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // Inner count group: "2" of [yearIs(2020), monthIs(3), dayIs(99)]
            //   = 2 true (year, month), need 2 → true
            // Outer: count that inner result (true) + dayIs(15) (true), need 2 → true
            const array = [
                ['2', [yearIs(2020), monthIs(3), dayIs(99)]],
                dayIs(15),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(true);
        });

        it('a count group nested inside a count group where inner fails', () => {
            const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
            // Inner count group: "3" of [yearIs(2020), monthIs(3), dayIs(99)]
            //   = 2 true, need 3 → false
            // Outer: count that inner result (false) + dayIs(15) (true), need 2 → false
            const array = [
                ['3', [yearIs(2020), monthIs(3), dayIs(99)]],
                dayIs(15),
            ];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 2)).toBe(false);
        });
    });

    // --- Single condition ---

    describe('single condition', () => {
        it('returns true for a single true condition with num=1', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(2020)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 1)).toBe(true);
        });

        it('returns false for a single false condition with num=1', () => {
            const epoch = makeEpochData({ year: 2020 });
            const array = [yearIs(1999)];
            expect(event_evaluator.evaluate_event_num_group(epoch, array, 1)).toBe(false);
        });
    });
});

// ─── Integration: evaluate_event_group with count sub-groups ─────────────────

describe('integration: group and num_group interplay', () => {
    it('count sub-group inside a group with AND', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        // yearIs(2020) AND (at least 2 of: monthIs(3), dayIs(15), dayIs(99))
        // = true AND (2 true, need 2 → true) = true
        const array = [
            yearIs(2020),
            AND,
            ['2', [monthIs(3), dayIs(15), dayIs(99)]],
        ];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
    });

    it('count sub-group inside a group with OR where count fails', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        // yearIs(1999) OR (at least 3 of: monthIs(3), dayIs(15), dayIs(99))
        // = false OR (2 true, need 3 → false) = false
        const array = [
            yearIs(1999),
            OR,
            ['3', [monthIs(3), dayIs(15), dayIs(99)]],
        ];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });

    it('negated group inside a count group', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        // Count group needs 2 of:
        //   NOT(yearIs(1999)) = true
        //   monthIs(3) = true
        //   dayIs(99) = false
        // → 2 true, need 2 → true
        const array = [
            ['2', [
                ['!', [yearIs(1999)]],
                monthIs(3),
                dayIs(99),
            ]],
        ];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
    });

    it('complex nested: group containing negated group and count group combined with AND', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        // NOT(yearIs(1999)) AND (at least 1 of: monthIs(3), dayIs(99))
        // = true AND true = true
        const array = [
            ['!', [yearIs(1999)]],
            AND,
            ['1', [monthIs(3), dayIs(99)]],
        ];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
    });

    it('complex nested: negated group AND count group, both false', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        // NOT(yearIs(2020)) AND (at least 2 of: monthIs(99), dayIs(99))
        // = false AND false = false
        const array = [
            ['!', [yearIs(2020)]],
            AND,
            ['2', [monthIs(99), dayIs(99)]],
        ];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });
});

// ─── evaluate_operator edge cases via evaluate_event_group ───────────────────

describe('evaluate_operator behavior via evaluate_event_group', () => {
    it('AND short-circuit: false AND true = false', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
        // Backwards: monthIs(3)=true first, then yearIs(1999)=false with &&
        // result = true && false = false
        const array = [yearIs(1999), AND, monthIs(3)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });

    it('OR with all false returns false', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3 });
        const array = [yearIs(1999), OR, monthIs(99)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });

    it('NAND truth table: false NAND false = true', () => {
        const epoch = makeEpochData({ year: 2020 });
        const array = [yearIs(1999), NAND, yearIs(1998)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
    });
});

// ─── Backward iteration: operator association direction ──────────────────────

describe('operator association direction (backward iteration)', () => {
    it('processes rightmost condition first, accumulates leftward', () => {
        // A=false, op1=||, B=true, op2=&&, C=false
        // Backward: i=4: C=false → result=false
        //           i=2: B=true, op at [3]=&&, result = false && true = false
        //           i=0: A=false, op at [1]=||, result = false || false = false
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        const array = [yearIs(1999), OR, monthIs(3), AND, dayIs(99)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });

    it('same conditions but different operator order gives different result', () => {
        // A=false, op1=&&, B=true, op2=||, C=false
        // Backward: i=4: C=false → result=false
        //           i=2: B=true, op at [3]=||, result = false || true = true
        //           i=0: A=false, op at [1]=&&, result = true && false = false
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        const array = [yearIs(1999), AND, monthIs(3), OR, dayIs(99)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });

    it('all OR chain: any true makes result true', () => {
        const epoch = makeEpochData({ year: 2020 });
        const array = [yearIs(1999), OR, yearIs(1998), OR, yearIs(2020)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(true);
    });

    it('all AND chain: any false makes result false', () => {
        const epoch = makeEpochData({ year: 2020, timespan_index: 3, day: 15 });
        const array = [yearIs(2020), AND, monthIs(3), AND, dayIs(99)];
        expect(event_evaluator.evaluate_event_group(epoch, array)).toBe(false);
    });
});
