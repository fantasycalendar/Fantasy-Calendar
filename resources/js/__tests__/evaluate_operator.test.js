import { describe, it, expect } from 'vitest';
import { event_evaluator } from '../calendar/calendar_workers';

/**
 * Comprehensive tests for event_evaluator.evaluate_operator()
 *
 * This function is the core comparison engine used by evaluate_condition()
 * to determine whether calendar events should fire on a given epoch.
 * Parameters (a, b, c) typically map to:
 *   a = selected epoch_data field value (e.g., year, day, epoch)
 *   b = condition value (e.g., target year, interval for %)
 *   c = secondary condition value (e.g., offset for %)
 */

describe('evaluate_operator', () => {

    // ─────────────────────────────────────────────
    // == (loose equality)
    // ─────────────────────────────────────────────
    describe('== (loose equality)', () => {

        it('returns true for identical numbers', () => {
            expect(event_evaluator.evaluate_operator('==', 5, 5)).toBe(true);
        });

        it('returns false for different numbers', () => {
            expect(event_evaluator.evaluate_operator('==', 5, 6)).toBe(false);
        });

        it('returns true for zero == zero', () => {
            expect(event_evaluator.evaluate_operator('==', 0, 0)).toBe(true);
        });

        it('returns true for negative numbers that are equal', () => {
            expect(event_evaluator.evaluate_operator('==', -3, -3)).toBe(true);
        });

        it('returns false for positive vs negative of same magnitude', () => {
            expect(event_evaluator.evaluate_operator('==', 3, -3)).toBe(false);
        });

        // Loose equality coercion: number == string
        it('returns true when comparing number 5 to string "5" (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('==', 5, '5')).toBe(true);
        });

        it('returns true when comparing string "5" to number 5 (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('==', '5', 5)).toBe(true);
        });

        it('returns true for 0 == "0" (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('==', 0, '0')).toBe(true);
        });

        it('returns true for null == undefined (loose equality)', () => {
            expect(event_evaluator.evaluate_operator('==', null, undefined)).toBe(true);
        });

        it('returns false for null == 0 (loose equality)', () => {
            expect(event_evaluator.evaluate_operator('==', null, 0)).toBe(false);
        });

        it('returns false for 0 == null', () => {
            expect(event_evaluator.evaluate_operator('==', 0, null)).toBe(false);
        });

        it('returns true for "" == 0 (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('==', '', 0)).toBe(true);
        });

        it('returns true for "" == false (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('==', '', false)).toBe(true);
        });

        it('returns true for identical strings', () => {
            expect(event_evaluator.evaluate_operator('==', 'hello', 'hello')).toBe(true);
        });

        it('returns false for different strings', () => {
            expect(event_evaluator.evaluate_operator('==', 'hello', 'world')).toBe(false);
        });

        it('handles large numbers correctly', () => {
            expect(event_evaluator.evaluate_operator('==', 999999, 999999)).toBe(true);
            expect(event_evaluator.evaluate_operator('==', 999999, 999998)).toBe(false);
        });
    });

    // ─────────────────────────────────────────────
    // != (loose inequality)
    // ─────────────────────────────────────────────
    describe('!= (loose inequality)', () => {

        it('returns false for identical numbers', () => {
            expect(event_evaluator.evaluate_operator('!=', 5, 5)).toBe(false);
        });

        it('returns true for different numbers', () => {
            expect(event_evaluator.evaluate_operator('!=', 5, 6)).toBe(true);
        });

        it('returns false for zero != zero', () => {
            expect(event_evaluator.evaluate_operator('!=', 0, 0)).toBe(false);
        });

        it('returns true for positive vs negative', () => {
            expect(event_evaluator.evaluate_operator('!=', 3, -3)).toBe(true);
        });

        // Loose inequality coercion
        it('returns false when comparing number 5 to string "5" (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('!=', 5, '5')).toBe(false);
        });

        it('returns false when comparing string "5" to number 5 (type coercion)', () => {
            expect(event_evaluator.evaluate_operator('!=', '5', 5)).toBe(false);
        });

        it('returns false for null != undefined (loose inequality)', () => {
            expect(event_evaluator.evaluate_operator('!=', null, undefined)).toBe(false);
        });

        it('returns true for null != 0', () => {
            expect(event_evaluator.evaluate_operator('!=', null, 0)).toBe(true);
        });

        it('returns true for different strings', () => {
            expect(event_evaluator.evaluate_operator('!=', 'foo', 'bar')).toBe(true);
        });

        it('returns false for identical strings', () => {
            expect(event_evaluator.evaluate_operator('!=', 'foo', 'foo')).toBe(false);
        });
    });

    // ─────────────────────────────────────────────
    // >= (greater than or equal)
    // ─────────────────────────────────────────────
    describe('>= (greater than or equal)', () => {

        it('returns true when a > b', () => {
            expect(event_evaluator.evaluate_operator('>=', 10, 5)).toBe(true);
        });

        it('returns true when a == b', () => {
            expect(event_evaluator.evaluate_operator('>=', 5, 5)).toBe(true);
        });

        it('returns false when a < b', () => {
            expect(event_evaluator.evaluate_operator('>=', 4, 5)).toBe(false);
        });

        it('handles zero correctly', () => {
            expect(event_evaluator.evaluate_operator('>=', 0, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('>=', 0, -1)).toBe(true);
            expect(event_evaluator.evaluate_operator('>=', -1, 0)).toBe(false);
        });

        it('handles negative numbers', () => {
            expect(event_evaluator.evaluate_operator('>=', -3, -5)).toBe(true);
            expect(event_evaluator.evaluate_operator('>=', -5, -3)).toBe(false);
            expect(event_evaluator.evaluate_operator('>=', -3, -3)).toBe(true);
        });

        it('handles large epoch-like numbers', () => {
            expect(event_evaluator.evaluate_operator('>=', 738886, 738885)).toBe(true);
            expect(event_evaluator.evaluate_operator('>=', 738886, 738886)).toBe(true);
            expect(event_evaluator.evaluate_operator('>=', 738886, 738887)).toBe(false);
        });

        it('handles string vs number comparison', () => {
            // "10" >= 5 — string "10" is coerced to number 10
            expect(event_evaluator.evaluate_operator('>=', '10', 5)).toBe(true);
        });
    });

    // ─────────────────────────────────────────────
    // <= (less than or equal)
    // ─────────────────────────────────────────────
    describe('<= (less than or equal)', () => {

        it('returns true when a < b', () => {
            expect(event_evaluator.evaluate_operator('<=', 3, 5)).toBe(true);
        });

        it('returns true when a == b', () => {
            expect(event_evaluator.evaluate_operator('<=', 5, 5)).toBe(true);
        });

        it('returns false when a > b', () => {
            expect(event_evaluator.evaluate_operator('<=', 6, 5)).toBe(false);
        });

        it('handles zero correctly', () => {
            expect(event_evaluator.evaluate_operator('<=', 0, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('<=', -1, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('<=', 0, -1)).toBe(false);
        });

        it('handles negative numbers', () => {
            expect(event_evaluator.evaluate_operator('<=', -5, -3)).toBe(true);
            expect(event_evaluator.evaluate_operator('<=', -3, -5)).toBe(false);
            expect(event_evaluator.evaluate_operator('<=', -3, -3)).toBe(true);
        });

        it('handles large epoch-like numbers', () => {
            expect(event_evaluator.evaluate_operator('<=', 738885, 738886)).toBe(true);
            expect(event_evaluator.evaluate_operator('<=', 738886, 738886)).toBe(true);
            expect(event_evaluator.evaluate_operator('<=', 738887, 738886)).toBe(false);
        });
    });

    // ─────────────────────────────────────────────
    // > (greater than)
    // ─────────────────────────────────────────────
    describe('> (greater than)', () => {

        it('returns true when a > b', () => {
            expect(event_evaluator.evaluate_operator('>', 10, 5)).toBe(true);
        });

        it('returns false when a == b', () => {
            expect(event_evaluator.evaluate_operator('>', 5, 5)).toBe(false);
        });

        it('returns false when a < b', () => {
            expect(event_evaluator.evaluate_operator('>', 4, 5)).toBe(false);
        });

        it('handles zero boundary', () => {
            expect(event_evaluator.evaluate_operator('>', 1, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('>', 0, 0)).toBe(false);
            expect(event_evaluator.evaluate_operator('>', -1, 0)).toBe(false);
        });

        it('handles negative numbers', () => {
            expect(event_evaluator.evaluate_operator('>', -3, -5)).toBe(true);
            expect(event_evaluator.evaluate_operator('>', -5, -3)).toBe(false);
        });

        it('handles consecutive numbers (boundary precision)', () => {
            expect(event_evaluator.evaluate_operator('>', 1, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('>', 0, -1)).toBe(true);
        });
    });

    // ─────────────────────────────────────────────
    // < (less than)
    // ─────────────────────────────────────────────
    describe('< (less than)', () => {

        it('returns true when a < b', () => {
            expect(event_evaluator.evaluate_operator('<', 3, 5)).toBe(true);
        });

        it('returns false when a == b', () => {
            expect(event_evaluator.evaluate_operator('<', 5, 5)).toBe(false);
        });

        it('returns false when a > b', () => {
            expect(event_evaluator.evaluate_operator('<', 6, 5)).toBe(false);
        });

        it('handles zero boundary', () => {
            expect(event_evaluator.evaluate_operator('<', -1, 0)).toBe(true);
            expect(event_evaluator.evaluate_operator('<', 0, 0)).toBe(false);
            expect(event_evaluator.evaluate_operator('<', 0, 1)).toBe(true);
        });

        it('handles negative numbers', () => {
            expect(event_evaluator.evaluate_operator('<', -5, -3)).toBe(true);
            expect(event_evaluator.evaluate_operator('<', -3, -5)).toBe(false);
        });
    });

    // ─────────────────────────────────────────────
    // % (modulo / "every nth" with offset)
    // ─────────────────────────────────────────────
    // Formula: c = c % b; return (a - c) % b == 0;
    // In the calendar engine:
    //   a = selected value (e.g., current year)
    //   b = interval (e.g., "every 4th")
    //   c = offset
    // So: normalizedOffset = offset % interval
    //     result = (value - normalizedOffset) % interval == 0
    describe('% (modulo — every nth with offset)', () => {

        describe('basic "every nth year" (offset 0)', () => {

            it('every 4th year: year 0 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 4, 0)).toBe(true);
            });

            it('every 4th year: year 4 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 4, 4, 0)).toBe(true);
            });

            it('every 4th year: year 8 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 8, 4, 0)).toBe(true);
            });

            it('every 4th year: year 1 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 1, 4, 0)).toBe(false);
            });

            it('every 4th year: year 2 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 2, 4, 0)).toBe(false);
            });

            it('every 4th year: year 3 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 3, 4, 0)).toBe(false);
            });

            it('every 2nd day: day 0 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 2, 0)).toBe(true);
            });

            it('every 2nd day: day 1 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 1, 2, 0)).toBe(false);
            });

            it('every 2nd day: day 2 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 2, 2, 0)).toBe(true);
            });

            it('every 1st (interval=1): every value matches', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 1, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 1, 1, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 99, 1, 0)).toBe(true);
            });

            it('every 3rd epoch: epoch 9 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 9, 3, 0)).toBe(true);
            });

            it('every 3rd epoch: epoch 10 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 10, 3, 0)).toBe(false);
            });
        });

        describe('with offset', () => {

            it('every 4th year, offset 1: year 1 matches', () => {
                // normalized offset = 1 % 4 = 1; (1 - 1) % 4 = 0
                expect(event_evaluator.evaluate_operator('%', 1, 4, 1)).toBe(true);
            });

            it('every 4th year, offset 1: year 5 matches', () => {
                // normalized offset = 1 % 4 = 1; (5 - 1) % 4 = 0
                expect(event_evaluator.evaluate_operator('%', 5, 4, 1)).toBe(true);
            });

            it('every 4th year, offset 1: year 9 matches', () => {
                expect(event_evaluator.evaluate_operator('%', 9, 4, 1)).toBe(true);
            });

            it('every 4th year, offset 1: year 0 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 4, 1)).toBe(false);
            });

            it('every 4th year, offset 1: year 4 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', 4, 4, 1)).toBe(false);
            });

            it('every 3rd day, offset 2: day 2 matches', () => {
                // normalized offset = 2 % 3 = 2; (2 - 2) % 3 = 0
                expect(event_evaluator.evaluate_operator('%', 2, 3, 2)).toBe(true);
            });

            it('every 3rd day, offset 2: day 5 matches', () => {
                // normalized offset = 2 % 3 = 2; (5 - 2) % 3 = 0
                expect(event_evaluator.evaluate_operator('%', 5, 3, 2)).toBe(true);
            });

            it('every 3rd day, offset 2: day 3 does not match', () => {
                // normalized offset = 2 % 3 = 2; (3 - 2) % 3 = 1
                expect(event_evaluator.evaluate_operator('%', 3, 3, 2)).toBe(false);
            });

            it('offset larger than interval gets normalized via c % b', () => {
                // offset=7, interval=4 → normalized offset = 7 % 4 = 3
                // (3 - 3) % 4 = 0 → true
                expect(event_evaluator.evaluate_operator('%', 3, 4, 7)).toBe(true);
                // (7 - 3) % 4 = 0 → true
                expect(event_evaluator.evaluate_operator('%', 7, 4, 7)).toBe(true);
                // (4 - 3) % 4 = 1 → false
                expect(event_evaluator.evaluate_operator('%', 4, 4, 7)).toBe(false);
            });

            it('offset equal to interval normalizes to 0', () => {
                // offset=4, interval=4 → normalized offset = 4 % 4 = 0
                // equivalent to offset 0
                expect(event_evaluator.evaluate_operator('%', 0, 4, 4)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 4, 4, 4)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 1, 4, 4)).toBe(false);
            });
        });

        describe('negative values', () => {

            it('negative year with interval 4, offset 0: year -4 matches', () => {
                // (-4 - 0) % 4 = 0
                expect(event_evaluator.evaluate_operator('%', -4, 4, 0)).toBe(true);
            });

            it('negative year with interval 4, offset 0: year -8 matches', () => {
                expect(event_evaluator.evaluate_operator('%', -8, 4, 0)).toBe(true);
            });

            it('negative year with interval 4, offset 0: year -1 does not match', () => {
                // In JS, (-1) % 4 = -1, and -1 != 0 → false
                expect(event_evaluator.evaluate_operator('%', -1, 4, 0)).toBe(false);
            });

            it('negative year with interval 4, offset 0: year -2 does not match', () => {
                expect(event_evaluator.evaluate_operator('%', -2, 4, 0)).toBe(false);
            });

            it('negative year with interval 3, offset 1: year -2 matches', () => {
                // normalized offset = 1 % 3 = 1; (-2 - 1) % 3 = -3 % 3 = 0 → true
                expect(event_evaluator.evaluate_operator('%', -2, 3, 1)).toBe(true);
            });
        });

        describe('c is undefined (no offset provided)', () => {
            // When c is undefined, it should be treated as 0 (no offset).
            // The fix coerces undefined → 0 via `(c || 0) % b`.

            it('treats undefined c as 0', () => {
                // (0 || 0) % 4 = 0; (0 - 0) % 4 = 0; 0 == 0 → true
                expect(event_evaluator.evaluate_operator('%', 0, 4, undefined)).toBe(true);
            });

            it('works correctly for any a when c is undefined', () => {
                // c defaults to 0, so this is just (a - 0) % b == 0
                expect(event_evaluator.evaluate_operator('%', 4, 4, undefined)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 8, 4, undefined)).toBe(true);
            });

            it('treats undefined offset as 0 — every-4th check works', () => {
                // With c=undefined treated as 0: (0 - 0) % 4 = 0 → true
                let result = event_evaluator.evaluate_operator('%', 0, 4, undefined);
                expect(result).toBe(true);
            });
        });

        describe('edge case: interval of 0 (division by zero)', () => {
            // b=0 means c = c % 0 = NaN, (a - NaN) % 0 = NaN, NaN == 0 → false
            // Alternatively: even if c were valid, (a - c) % 0 = NaN
            it('returns false when interval is 0 (NaN from modulo by zero)', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 0, 0)).toBe(false);
            });

            it('returns false for any value when interval is 0', () => {
                expect(event_evaluator.evaluate_operator('%', 5, 0, 0)).toBe(false);
                expect(event_evaluator.evaluate_operator('%', 100, 0, 1)).toBe(false);
            });
        });

        describe('large intervals and values (realistic calendar scenarios)', () => {

            it('every 100th epoch from epoch 0', () => {
                expect(event_evaluator.evaluate_operator('%', 0, 100, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 100, 100, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 200, 100, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 50, 100, 0)).toBe(false);
                expect(event_evaluator.evaluate_operator('%', 99, 100, 0)).toBe(false);
            });

            it('every 7th day, offset 3 (e.g., a specific weekday)', () => {
                expect(event_evaluator.evaluate_operator('%', 3, 7, 3)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 10, 7, 3)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 17, 7, 3)).toBe(true);
                expect(event_evaluator.evaluate_operator('%', 4, 7, 3)).toBe(false);
                expect(event_evaluator.evaluate_operator('%', 0, 7, 3)).toBe(false);
            });
        });
    });

    // ─────────────────────────────────────────────
    // && (logical AND)
    // ─────────────────────────────────────────────
    // Note: JS `&&` returns the first falsy value or the last value if all truthy.
    // The calendar engine uses this to chain conditions: result = (newResult && prevResult)
    describe('&& (logical AND)', () => {

        it('returns truthy when both are true', () => {
            expect(event_evaluator.evaluate_operator('&&', true, true)).toBe(true);
        });

        it('returns falsy when first is false', () => {
            expect(event_evaluator.evaluate_operator('&&', false, true)).toBe(false);
        });

        it('returns falsy when second is false', () => {
            expect(event_evaluator.evaluate_operator('&&', true, false)).toBe(false);
        });

        it('returns falsy when both are false', () => {
            expect(event_evaluator.evaluate_operator('&&', false, false)).toBe(false);
        });

        // JS && returns the first falsy operand, or the last operand if all truthy
        it('returns second operand when both truthy (JS && semantics)', () => {
            let result = event_evaluator.evaluate_operator('&&', 1, 2);
            expect(result).toBe(2);
        });

        it('returns first operand when first is falsy', () => {
            let result = event_evaluator.evaluate_operator('&&', 0, 5);
            expect(result).toBe(0);
        });

        it('returns first operand when first is empty string (falsy)', () => {
            let result = event_evaluator.evaluate_operator('&&', '', 'hello');
            expect(result).toBe('');
        });

        it('returns 0 (falsy) when 0 && anything', () => {
            expect(event_evaluator.evaluate_operator('&&', 0, 100)).toBe(0);
        });

        it('returns null when null && true', () => {
            expect(event_evaluator.evaluate_operator('&&', null, true)).toBe(null);
        });

        it('returns undefined when undefined && true', () => {
            expect(event_evaluator.evaluate_operator('&&', undefined, true)).toBe(undefined);
        });

        it('handles typical calendar chaining: true && true', () => {
            // evaluate_condition chains: result = evaluate_operator("&&", newCondResult, prevResult)
            expect(event_evaluator.evaluate_operator('&&', true, true)).toBe(true);
        });

        it('handles typical calendar chaining: true && false stops the chain', () => {
            expect(event_evaluator.evaluate_operator('&&', true, false)).toBe(false);
        });

        it('returns b when a is truthy number and b is truthy number', () => {
            expect(event_evaluator.evaluate_operator('&&', 5, 10)).toBe(10);
        });

        it('returns b when a is truthy and b is boolean true', () => {
            expect(event_evaluator.evaluate_operator('&&', 1, true)).toBe(true);
        });
    });

    // ─────────────────────────────────────────────
    // NAND (negated AND)
    // ─────────────────────────────────────────────
    describe('NAND (negated AND)', () => {

        it('returns false when both are true', () => {
            expect(event_evaluator.evaluate_operator('NAND', true, true)).toBe(false);
        });

        it('returns true when first is false', () => {
            expect(event_evaluator.evaluate_operator('NAND', false, true)).toBe(true);
        });

        it('returns true when second is false', () => {
            expect(event_evaluator.evaluate_operator('NAND', true, false)).toBe(true);
        });

        it('returns true when both are false', () => {
            expect(event_evaluator.evaluate_operator('NAND', false, false)).toBe(true);
        });

        it('returns false when both are truthy numbers', () => {
            expect(event_evaluator.evaluate_operator('NAND', 1, 1)).toBe(false);
        });

        it('returns true when first is 0 (falsy)', () => {
            expect(event_evaluator.evaluate_operator('NAND', 0, 5)).toBe(true);
        });

        it('returns true when second is 0 (falsy)', () => {
            expect(event_evaluator.evaluate_operator('NAND', 5, 0)).toBe(true);
        });

        it('returns true when both are 0', () => {
            expect(event_evaluator.evaluate_operator('NAND', 0, 0)).toBe(true);
        });

        it('returns false when both are non-zero truthy', () => {
            expect(event_evaluator.evaluate_operator('NAND', 42, 99)).toBe(false);
        });

        it('returns true when first is null', () => {
            expect(event_evaluator.evaluate_operator('NAND', null, true)).toBe(true);
        });

        it('returns true when first is undefined', () => {
            expect(event_evaluator.evaluate_operator('NAND', undefined, true)).toBe(true);
        });

        it('returns true when second is empty string', () => {
            expect(event_evaluator.evaluate_operator('NAND', true, '')).toBe(true);
        });
    });

    // ─────────────────────────────────────────────
    // || (logical OR)
    // ─────────────────────────────────────────────
    // Note: JS `||` returns the first truthy value, or the last value if all falsy.
    describe('|| (logical OR)', () => {

        it('returns truthy when both are true', () => {
            expect(event_evaluator.evaluate_operator('||', true, true)).toBe(true);
        });

        it('returns truthy when first is true', () => {
            expect(event_evaluator.evaluate_operator('||', true, false)).toBe(true);
        });

        it('returns truthy when second is true', () => {
            expect(event_evaluator.evaluate_operator('||', false, true)).toBe(true);
        });

        it('returns falsy when both are false', () => {
            expect(event_evaluator.evaluate_operator('||', false, false)).toBe(false);
        });

        // JS || returns the first truthy operand, or the last operand if all falsy
        it('returns first truthy operand (JS || semantics)', () => {
            let result = event_evaluator.evaluate_operator('||', 5, 10);
            expect(result).toBe(5);
        });

        it('returns second operand when first is falsy', () => {
            let result = event_evaluator.evaluate_operator('||', 0, 10);
            expect(result).toBe(10);
        });

        it('returns second operand when first is empty string', () => {
            let result = event_evaluator.evaluate_operator('||', '', 'hello');
            expect(result).toBe('hello');
        });

        it('returns 0 when both are falsy (0 || 0)', () => {
            expect(event_evaluator.evaluate_operator('||', 0, 0)).toBe(0);
        });

        it('returns null when both are falsy (false || null)', () => {
            expect(event_evaluator.evaluate_operator('||', false, null)).toBe(null);
        });

        it('returns first truthy even if second is also truthy', () => {
            expect(event_evaluator.evaluate_operator('||', 'a', 'b')).toBe('a');
        });

        it('returns second when first is null', () => {
            expect(event_evaluator.evaluate_operator('||', null, 42)).toBe(42);
        });

        it('returns second when first is undefined', () => {
            expect(event_evaluator.evaluate_operator('||', undefined, 'fallback')).toBe('fallback');
        });
    });

    // ─────────────────────────────────────────────
    // ^ and XOR (logical XOR)
    // ─────────────────────────────────────────────
    // This is logical XOR over operand truthiness, returning a Boolean
    // (consistent with the other logical operators). The UI labels it
    // "only one must be true". Both '^' and 'XOR' produce the same result.
    describe('^ / XOR (logical XOR)', () => {

        describe('^ operator', () => {

            it('returns false for identical falsy values (0 ^ 0)', () => {
                expect(event_evaluator.evaluate_operator('^', 0, 0)).toBe(false);
            });

            it('returns false for identical truthy values (5 ^ 5)', () => {
                expect(event_evaluator.evaluate_operator('^', 5, 5)).toBe(false);
            });

            it('returns false for two different truthy values (5 ^ 3)', () => {
                // Both 5 and 3 are truthy -> logical XOR is false
                expect(event_evaluator.evaluate_operator('^', 5, 3)).toBe(false);
            });

            it('returns true when only b is truthy (0 ^ b)', () => {
                expect(event_evaluator.evaluate_operator('^', 0, 7)).toBe(true);
            });

            it('returns true when only a is truthy (a ^ 0)', () => {
                expect(event_evaluator.evaluate_operator('^', 7, 0)).toBe(true);
            });

            it('1 ^ 1 = false (both truthy)', () => {
                expect(event_evaluator.evaluate_operator('^', 1, 1)).toBe(false);
            });

            it('1 ^ 0 = true', () => {
                expect(event_evaluator.evaluate_operator('^', 1, 0)).toBe(true);
            });

            it('0 ^ 1 = true', () => {
                expect(event_evaluator.evaluate_operator('^', 0, 1)).toBe(true);
            });

            it('handles booleans: true ^ true = false', () => {
                expect(event_evaluator.evaluate_operator('^', true, true)).toBe(false);
            });

            it('handles booleans: true ^ false = true', () => {
                expect(event_evaluator.evaluate_operator('^', true, false)).toBe(true);
            });

            it('handles booleans: false ^ true = true', () => {
                expect(event_evaluator.evaluate_operator('^', false, true)).toBe(true);
            });

            it('handles booleans: false ^ false = false', () => {
                expect(event_evaluator.evaluate_operator('^', false, false)).toBe(false);
            });

            it('handles larger truthy numbers (255 ^ 128)', () => {
                // Both truthy -> logical XOR is false
                expect(event_evaluator.evaluate_operator('^', 255, 128)).toBe(false);
            });

            it('handles negative numbers (-1 ^ 0)', () => {
                // -1 is truthy, 0 is falsy -> logical XOR is true
                expect(event_evaluator.evaluate_operator('^', -1, 0)).toBe(true);
            });

            it('handles negative numbers (-1 ^ -1)', () => {
                // Both truthy -> logical XOR is false
                expect(event_evaluator.evaluate_operator('^', -1, -1)).toBe(false);
            });
        });

        describe('XOR operator (string form)', () => {

            it('returns same result as ^ for identical values', () => {
                expect(event_evaluator.evaluate_operator('XOR', 0, 0)).toBe(false);
                expect(event_evaluator.evaluate_operator('XOR', 5, 5)).toBe(false);
            });

            it('returns same result as ^ for two truthy values', () => {
                expect(event_evaluator.evaluate_operator('XOR', 5, 3)).toBe(false);
            });

            it('returns same result as ^ for booleans', () => {
                expect(event_evaluator.evaluate_operator('XOR', true, false)).toBe(true);
                expect(event_evaluator.evaluate_operator('XOR', false, true)).toBe(true);
                expect(event_evaluator.evaluate_operator('XOR', true, true)).toBe(false);
                expect(event_evaluator.evaluate_operator('XOR', false, false)).toBe(false);
            });

            it('1 XOR 0 = true', () => {
                expect(event_evaluator.evaluate_operator('XOR', 1, 0)).toBe(true);
            });

            it('0 XOR 1 = true', () => {
                expect(event_evaluator.evaluate_operator('XOR', 0, 1)).toBe(true);
            });

            it('0 XOR 0 = false', () => {
                expect(event_evaluator.evaluate_operator('XOR', 0, 0)).toBe(false);
            });
        });

        describe('^ and XOR produce identical results', () => {

            it('matching results for various inputs', () => {
                let testCases = [
                    [0, 0], [1, 0], [0, 1], [1, 1],
                    [5, 3], [255, 128], [42, 42],
                    [true, false], [false, true],
                    [-1, 0], [-1, -1],
                ];

                for (let [a, b] of testCases) {
                    let caretResult = event_evaluator.evaluate_operator('^', a, b);
                    let xorResult = event_evaluator.evaluate_operator('XOR', a, b);
                    expect(caretResult).toBe(xorResult);
                }
            });
        });

        describe('returns a real boolean (consistent with other logical operators)', () => {

            it('returns a boolean type, not a number', () => {
                expect(typeof event_evaluator.evaluate_operator('^', true, false)).toBe('boolean');
                expect(typeof event_evaluator.evaluate_operator('XOR', true, false)).toBe('boolean');
            });

            it('is logical XOR over truthiness for non-boolean operands', () => {
                // Both truthy -> XOR is false
                expect(event_evaluator.evaluate_operator('^', 5, 3)).toBe(false);
                // One truthy, one falsy -> XOR is true
                expect(event_evaluator.evaluate_operator('^', 7, 0)).toBe(true);
                expect(event_evaluator.evaluate_operator('^', -1, 0)).toBe(true);
            });
        });
    });

    // ─────────────────────────────────────────────
    // Unknown operator
    // ─────────────────────────────────────────────
    describe('unknown operator', () => {

        it('returns undefined for an unrecognized operator string', () => {
            expect(event_evaluator.evaluate_operator('???', 1, 2)).toBeUndefined();
        });

        it('returns undefined for empty string operator', () => {
            expect(event_evaluator.evaluate_operator('', 1, 2)).toBeUndefined();
        });

        it('returns undefined for null operator', () => {
            expect(event_evaluator.evaluate_operator(null, 1, 2)).toBeUndefined();
        });

        it('returns undefined for undefined operator', () => {
            expect(event_evaluator.evaluate_operator(undefined, 1, 2)).toBeUndefined();
        });

        it('returns undefined for "===" (strict equality is not supported)', () => {
            expect(event_evaluator.evaluate_operator('===', 5, 5)).toBeUndefined();
        });

        it('returns undefined for "!==" (strict inequality is not supported)', () => {
            expect(event_evaluator.evaluate_operator('!==', 5, 5)).toBeUndefined();
        });

        it('returns undefined for numeric operator', () => {
            expect(event_evaluator.evaluate_operator(42, 1, 2)).toBeUndefined();
        });
    });

    // ─────────────────────────────────────────────
    // Type coercion / boundary edge cases
    // ─────────────────────────────────────────────
    describe('type coercion and boundary conditions', () => {

        describe('comparison operators with string numbers', () => {
            // These simulate what happens when epoch_data values are strings
            // (the calendar engine coerces with Number() but edge cases exist)

            it('>= with string "10" and number 5', () => {
                expect(event_evaluator.evaluate_operator('>=', '10', 5)).toBe(true);
            });

            it('<= with string "3" and number 5', () => {
                expect(event_evaluator.evaluate_operator('<=', '3', 5)).toBe(true);
            });

            it('> with string "10" and string "9" (lexicographic comparison!)', () => {
                // IMPORTANT: "10" > "9" is FALSE in JS because it's lexicographic
                // when both are strings. "1" < "9" lexicographically.
                expect(event_evaluator.evaluate_operator('>', '10', '9')).toBe(false);
            });

            it('> with number 10 and number 9', () => {
                expect(event_evaluator.evaluate_operator('>', 10, 9)).toBe(true);
            });

            it('< with string "2" and string "10" (lexicographic)', () => {
                // "2" < "10" → false because "2" > "1" lexicographically
                expect(event_evaluator.evaluate_operator('<', '2', '10')).toBe(false);
            });
        });

        describe('undefined and null as operands', () => {

            it('== with undefined, undefined → true', () => {
                expect(event_evaluator.evaluate_operator('==', undefined, undefined)).toBe(true);
            });

            it('!= with undefined, undefined → false', () => {
                expect(event_evaluator.evaluate_operator('!=', undefined, undefined)).toBe(false);
            });

            it('>= with undefined, undefined → false (NaN >= NaN)', () => {
                // undefined is coerced to NaN for comparisons
                expect(event_evaluator.evaluate_operator('>=', undefined, undefined)).toBe(false);
            });

            it('> with null, null → false (0 > 0)', () => {
                expect(event_evaluator.evaluate_operator('>', null, null)).toBe(false);
            });

            it('>= with null, null → true (0 >= 0)', () => {
                expect(event_evaluator.evaluate_operator('>=', null, null)).toBe(true);
            });
        });

        describe('boolean operands in comparison operators', () => {

            it('== true, 1 → true (type coercion)', () => {
                expect(event_evaluator.evaluate_operator('==', true, 1)).toBe(true);
            });

            it('== false, 0 → true (type coercion)', () => {
                expect(event_evaluator.evaluate_operator('==', false, 0)).toBe(true);
            });

            it('>= true, 1 → true (true coerces to 1)', () => {
                expect(event_evaluator.evaluate_operator('>=', true, 1)).toBe(true);
            });

            it('> true, 0 → true (1 > 0)', () => {
                expect(event_evaluator.evaluate_operator('>', true, 0)).toBe(true);
            });
        });

        describe('NaN behavior', () => {

            it('== NaN, NaN → false (NaN is not equal to anything)', () => {
                expect(event_evaluator.evaluate_operator('==', NaN, NaN)).toBe(false);
            });

            it('!= NaN, NaN → true', () => {
                expect(event_evaluator.evaluate_operator('!=', NaN, NaN)).toBe(true);
            });

            it('>= NaN, 0 → false', () => {
                expect(event_evaluator.evaluate_operator('>=', NaN, 0)).toBe(false);
            });

            it('< NaN, 0 → false', () => {
                expect(event_evaluator.evaluate_operator('<', NaN, 0)).toBe(false);
            });
        });

        describe('Infinity behavior', () => {

            it('>= Infinity, 999999 → true', () => {
                expect(event_evaluator.evaluate_operator('>=', Infinity, 999999)).toBe(true);
            });

            it('<= -Infinity, -999999 → true', () => {
                expect(event_evaluator.evaluate_operator('<=', -Infinity, -999999)).toBe(true);
            });

            it('> Infinity, Infinity → false', () => {
                expect(event_evaluator.evaluate_operator('>', Infinity, Infinity)).toBe(false);
            });

            it('== Infinity, Infinity → true', () => {
                expect(event_evaluator.evaluate_operator('==', Infinity, Infinity)).toBe(true);
            });
        });
    });

    // ─────────────────────────────────────────────
    // Realistic calendar engine scenarios
    // ─────────────────────────────────────────────
    describe('realistic calendar engine usage patterns', () => {

        it('chaining two conditions with &&: year >= 2020 AND year is every 4th', () => {
            let year = 2024;

            // Condition 1: year >= 2020
            let cond1 = event_evaluator.evaluate_operator('>=', year, 2020);
            expect(cond1).toBe(true);

            // Condition 2: every 4th year, offset 0
            let cond2 = event_evaluator.evaluate_operator('%', year, 4, 0);
            expect(cond2).toBe(true);

            // Chain them
            let result = event_evaluator.evaluate_operator('&&', cond2, cond1);
            expect(result).toBe(true);
        });

        it('chaining conditions where one fails: year 2023 is not every 4th', () => {
            let year = 2023;

            let cond1 = event_evaluator.evaluate_operator('>=', year, 2020);
            expect(cond1).toBe(true);

            let cond2 = event_evaluator.evaluate_operator('%', year, 4, 0);
            expect(cond2).toBe(false);

            let result = event_evaluator.evaluate_operator('&&', cond2, cond1);
            expect(result).toBe(false);
        });

        it('OR-ing two conditions: day == 1 OR day == 15', () => {
            let day = 15;

            let cond1 = event_evaluator.evaluate_operator('==', day, 1);
            let cond2 = event_evaluator.evaluate_operator('==', day, 15);

            let result = event_evaluator.evaluate_operator('||', cond1, cond2);
            expect(result).toBe(true);
        });

        it('year range: year >= start AND year <= end', () => {
            let year = 2025;

            let cond1 = event_evaluator.evaluate_operator('>=', year, 2020);
            let cond2 = event_evaluator.evaluate_operator('<=', year, 2030);

            let result = event_evaluator.evaluate_operator('&&', cond1, cond2);
            // cond1 = true, cond2 = true, true && true = true
            expect(result).toBe(true);
        });

        it('year outside range: year >= start AND year <= end fails', () => {
            let year = 2031;

            let cond1 = event_evaluator.evaluate_operator('>=', year, 2020);
            let cond2 = event_evaluator.evaluate_operator('<=', year, 2030);

            let result = event_evaluator.evaluate_operator('&&', cond1, cond2);
            // cond1 = true, cond2 = false, false && true = false
            expect(result).toBe(false);
        });

        it('every 7th epoch with offset 3 simulates a specific weekday', () => {
            // Testing epochs 0-13 for matches at offset 3
            let matches = [];
            for (let epoch = 0; epoch <= 20; epoch++) {
                if (event_evaluator.evaluate_operator('%', epoch, 7, 3)) {
                    matches.push(epoch);
                }
            }
            expect(matches).toEqual([3, 10, 17]);
        });

        it('leap year check: every 4th year from year 0', () => {
            let leapYears = [];
            for (let year = 0; year <= 20; year++) {
                if (event_evaluator.evaluate_operator('%', year, 4, 0)) {
                    leapYears.push(year);
                }
            }
            expect(leapYears).toEqual([0, 4, 8, 12, 16, 20]);
        });

        it('NAND: "not both conditions true" — event fires unless on day 1 of month 1', () => {
            // NAND(isDay1, isMonth1): fires when NOT (day==1 AND month==0)
            let isDay1 = event_evaluator.evaluate_operator('==', 1, 1);
            let isMonth0 = event_evaluator.evaluate_operator('==', 0, 0);
            let result = event_evaluator.evaluate_operator('NAND', isDay1, isMonth0);
            expect(result).toBe(false); // both true → NAND is false

            let isDay2 = event_evaluator.evaluate_operator('==', 2, 1);
            let result2 = event_evaluator.evaluate_operator('NAND', isDay2, isMonth0);
            expect(result2).toBe(true); // first is false → NAND is true
        });
    });
});
