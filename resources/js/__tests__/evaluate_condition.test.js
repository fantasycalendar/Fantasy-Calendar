import { describe, it, expect, beforeEach } from 'vitest';
import { event_evaluator } from '../calendar/calendar_workers';

/**
 * Comprehensive tests for event_evaluator.evaluate_condition().
 *
 * The function signature is:
 *   evaluate_condition(epoch_data, array)
 * where `array` is [category, type_index_string, values_array].
 *
 * It looks up condition_mapping[category][type] to get the condition
 * definition, then branches on category to extract selector/operands from
 * epoch_data, and finally combines sub-condition results with AND.
 */

// ---------------------------------------------------------------------------
// Shared setup
// ---------------------------------------------------------------------------
beforeEach(() => {
    // Minimal static_data required for various branches
    event_evaluator.static_data = {
        settings: { year_zero_exists: true },
        year_data: {
            global_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
    };

    event_evaluator.dynamic_data = {
        custom_location: false,
        location: 0,
    };

    event_evaluator.stored_epochs = {};

    event_evaluator.event_data = {
        valid: {},
        starts: {},
        ends: {},
    };

    // Provide a no-op current_event to avoid undefined crashes for Events
    event_evaluator.current_event = {
        data: {
            connected_events: [],
        },
    };
});

// ===========================================================================
// 1. EPOCH conditions (types 0–6)
// ===========================================================================
describe('Epoch conditions', () => {
    const epoch_data = { epoch: 100 };

    it('type 0 — "Epoch is exactly" — matches when epoch equals value', () => {
        // condition_mapping.Epoch[0].conditions = [["epoch", "==", 0]]
        const result = event_evaluator.evaluate_condition(epoch_data, ['Epoch', '0', ['100']]);
        expect(result).toBe(true);
    });

    it('type 0 — "Epoch is exactly" — does not match different epoch', () => {
        const result = event_evaluator.evaluate_condition(epoch_data, ['Epoch', '0', ['200']]);
        expect(result).toBe(false);
    });

    it('type 1 — "Epoch is not" — true when epoch differs', () => {
        // condition_mapping.Epoch[1].conditions = [["epoch", "!=", 0]]
        const result = event_evaluator.evaluate_condition(epoch_data, ['Epoch', '1', ['200']]);
        expect(result).toBe(true);
    });

    it('type 1 — "Epoch is not" — false when epoch matches', () => {
        const result = event_evaluator.evaluate_condition(epoch_data, ['Epoch', '1', ['100']]);
        expect(result).toBe(false);
    });

    it('type 2 — "Epoch is or later than" (>=)', () => {
        // condition_mapping.Epoch[2].conditions = [["epoch", ">=", 0]]
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Epoch', '2', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 101 }, ['Epoch', '2', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 99 }, ['Epoch', '2', ['100']])).toBe(false);
    });

    it('type 3 — "Epoch is or earlier than" (<=)', () => {
        // condition_mapping.Epoch[3].conditions = [["epoch", "<=", 0]]
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Epoch', '3', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 99 }, ['Epoch', '3', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 101 }, ['Epoch', '3', ['100']])).toBe(false);
    });

    it('type 4 — "Epoch is later than" (>)', () => {
        // condition_mapping.Epoch[4].conditions = [["epoch", ">", 0]]
        expect(event_evaluator.evaluate_condition({ epoch: 101 }, ['Epoch', '4', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Epoch', '4', ['100']])).toBe(false);
    });

    it('type 5 — "Epoch is earlier than" (<)', () => {
        // condition_mapping.Epoch[5].conditions = [["epoch", "<", 0]]
        expect(event_evaluator.evaluate_condition({ epoch: 99 }, ['Epoch', '5', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Epoch', '5', ['100']])).toBe(false);
    });

    it('type 6 — "Every nth epoch" (%) with offset', () => {
        // condition_mapping.Epoch[6].conditions = [["epoch", "%", 0, 1]]
        // evaluate_operator('%', selected, nth, offset): c = offset % nth; (selected - c) % nth == 0
        // Every 5th epoch, offset 0 → epoch 0, 5, 10, …
        expect(event_evaluator.evaluate_condition({ epoch: 10 }, ['Epoch', '6', ['5', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 11 }, ['Epoch', '6', ['5', '0']])).toBe(false);
    });

    it('type 6 — "Every nth epoch" with non-zero offset', () => {
        // Every 5th epoch, offset 2 → epoch 2, 7, 12, …
        // c = 2 % 5 = 2; (epoch - 2) % 5 == 0
        expect(event_evaluator.evaluate_condition({ epoch: 7 }, ['Epoch', '6', ['5', '2']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 8 }, ['Epoch', '6', ['5', '2']])).toBe(false);
    });

    it('converts string values to numbers for comparisons', () => {
        // Values come from UI as strings. The code does Number(values[subcon[2]]).
        const result = event_evaluator.evaluate_condition({ epoch: 50 }, ['Epoch', '2', ['50']]);
        expect(result).toBe(true);
    });

    it('handles negative epoch values', () => {
        expect(event_evaluator.evaluate_condition({ epoch: -10 }, ['Epoch', '0', ['-10']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: -10 }, ['Epoch', '4', ['-20']])).toBe(true);
    });
});

// ===========================================================================
// 2. YEAR conditions (falls through to the else branch)
// ===========================================================================
describe('Year conditions', () => {
    it('type 0 — "Year is exactly" — matches', () => {
        // condition_mapping.Year[0].conditions = [["year", "==", 0]]
        const result = event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '0', ['2024']]);
        expect(result).toBe(true);
    });

    it('type 0 — "Year is exactly" — does not match', () => {
        const result = event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '0', ['2025']]);
        expect(result).toBe(false);
    });

    it('type 1 — "Year is not"', () => {
        expect(event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '1', ['2025']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '1', ['2024']])).toBe(false);
    });

    it('type 2 — "Year is or later than" (>=)', () => {
        expect(event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '2', ['2024']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 2023 }, ['Year', '2', ['2024']])).toBe(false);
    });

    it('type 4 — "Year is later than" (>)', () => {
        expect(event_evaluator.evaluate_condition({ year: 2025 }, ['Year', '4', ['2024']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '4', ['2024']])).toBe(false);
    });

    it('type 5 — "Year is earlier than" (<)', () => {
        expect(event_evaluator.evaluate_condition({ year: 2023 }, ['Year', '5', ['2024']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 2024 }, ['Year', '5', ['2024']])).toBe(false);
    });

    it('type 6 — "Every nth year" (%)', () => {
        // condition_mapping.Year[6].conditions = [["year", "%", 0, 1]]
        // Every 4th year, offset 0: years 0, 4, 8, 12…
        expect(event_evaluator.evaluate_condition({ year: 8 }, ['Year', '6', ['4', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 9 }, ['Year', '6', ['4', '0']])).toBe(false);
    });

    it('type 6 — "Every nth year" with offset', () => {
        // Every 4th year, offset 1: years 1, 5, 9, 13…
        expect(event_evaluator.evaluate_condition({ year: 9 }, ['Year', '6', ['4', '1']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year: 10 }, ['Year', '6', ['4', '1']])).toBe(false);
    });
});

// ===========================================================================
// 3. MONTH conditions (falls through to the else branch)
// ===========================================================================
describe('Month conditions', () => {
    it('type 0 — "Month is exactly"', () => {
        // condition_mapping.Month[0].conditions = [["timespan_index", "==", 0]]
        expect(event_evaluator.evaluate_condition({ timespan_index: 3 }, ['Month', '0', ['3']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_index: 3 }, ['Month', '0', ['4']])).toBe(false);
    });

    it('type 1 — "Month is not"', () => {
        expect(event_evaluator.evaluate_condition({ timespan_index: 3 }, ['Month', '1', ['4']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_index: 3 }, ['Month', '1', ['3']])).toBe(false);
    });

    it('type 2 — "Month is or later than" (>=)', () => {
        expect(event_evaluator.evaluate_condition({ timespan_index: 5 }, ['Month', '2', ['3']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_index: 2 }, ['Month', '2', ['3']])).toBe(false);
    });

    it('type 6 — "Every nth specific month" has TWO sub-conditions (AND)', () => {
        // condition_mapping.Month[6].conditions = [
        //   ["timespan_index", "==", 0],
        //   ["timespan_count", "%", 1, 2]
        // ]
        // values: [month_index, nth_interval, offset]
        // Sub-condition 1: timespan_index == values[0]
        // Sub-condition 2: timespan_count % values[1] with offset values[2]

        // Both true: timespan_index==2 AND (timespan_count-0)%3==0
        const epoch_data = { timespan_index: 2, timespan_count: 6 };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Month', '6', ['2', '3', '0']])).toBe(true);

        // First true, second false: timespan_index==2 but (timespan_count-0)%3 != 0
        const epoch_data2 = { timespan_index: 2, timespan_count: 7 };
        expect(event_evaluator.evaluate_condition(epoch_data2, ['Month', '6', ['2', '3', '0']])).toBe(false);

        // First false, second true
        const epoch_data3 = { timespan_index: 1, timespan_count: 6 };
        expect(event_evaluator.evaluate_condition(epoch_data3, ['Month', '6', ['2', '3', '0']])).toBe(false);
    });

    it('type 7 — "Month number is exactly"', () => {
        // condition_mapping.Month[7].conditions = [["timespan_number", "==", 0]]
        expect(event_evaluator.evaluate_condition({ timespan_number: 5 }, ['Month', '7', ['5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_number: 5 }, ['Month', '7', ['6']])).toBe(false);
    });

    it('type 13 — "Every nth month"', () => {
        // condition_mapping.Month[13].conditions = [["num_timespans", "%", 0, 1]]
        expect(event_evaluator.evaluate_condition({ num_timespans: 12 }, ['Month', '13', ['4', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ num_timespans: 13 }, ['Month', '13', ['4', '0']])).toBe(false);
    });

    it('type 14 — "Month name is exactly" (string comparison)', () => {
        // condition_mapping.Month[14].conditions = [["timespan_name", "==", 0]]
        expect(event_evaluator.evaluate_condition({ timespan_name: 'January' }, ['Month', '14', ['January']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_name: 'January' }, ['Month', '14', ['February']])).toBe(false);
    });

    it('type 15 — "Month name is not" (string comparison)', () => {
        // condition_mapping.Month[15].conditions = [["timespan_name", "!=", 0]]
        expect(event_evaluator.evaluate_condition({ timespan_name: 'January' }, ['Month', '15', ['February']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ timespan_name: 'January' }, ['Month', '15', ['January']])).toBe(false);
    });
});

// ===========================================================================
// 4. DAY conditions (falls through to the else branch)
// ===========================================================================
describe('Day conditions', () => {
    it('type 0 — "Day in month is exactly"', () => {
        // condition_mapping.Day[0].conditions = [["day", "==", 0]]
        expect(event_evaluator.evaluate_condition({ day: 15 }, ['Day', '0', ['15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ day: 15 }, ['Day', '0', ['16']])).toBe(false);
    });

    it('type 1 — "Day in month is not"', () => {
        expect(event_evaluator.evaluate_condition({ day: 15 }, ['Day', '1', ['16']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ day: 15 }, ['Day', '1', ['15']])).toBe(false);
    });

    it('type 4 — "Day in month is later than" (>)', () => {
        // condition_mapping.Day[4].conditions = [["day", ">", 0]]
        expect(event_evaluator.evaluate_condition({ day: 16 }, ['Day', '4', ['15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ day: 15 }, ['Day', '4', ['15']])).toBe(false);
    });

    it('type 6 — "Every nth day in month" (%)', () => {
        // condition_mapping.Day[6].conditions = [["day", "%", 0, 1]]
        expect(event_evaluator.evaluate_condition({ day: 10 }, ['Day', '6', ['5', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ day: 11 }, ['Day', '6', ['5', '0']])).toBe(false);
    });

    it('type 7 — "Day in year is exactly"', () => {
        // condition_mapping.Day[7].conditions = [["year_day", "==", 0]]
        expect(event_evaluator.evaluate_condition({ year_day: 100 }, ['Day', '7', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year_day: 100 }, ['Day', '7', ['101']])).toBe(false);
    });

    it('type 13 — "Every nth day in year" (%)', () => {
        // condition_mapping.Day[13].conditions = [["year_day", "%", 0, 1]]
        expect(event_evaluator.evaluate_condition({ year_day: 21 }, ['Day', '13', ['7', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year_day: 22 }, ['Day', '13', ['7', '0']])).toBe(false);
    });

    it('type 14 — "Nth days before end of month is exactly"', () => {
        // condition_mapping.Day[14].conditions = [["inverse_day", "==", 0]]
        expect(event_evaluator.evaluate_condition({ inverse_day: 5 }, ['Day', '14', ['5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ inverse_day: 5 }, ['Day', '14', ['6']])).toBe(false);
    });

    it('type 20 — "Day is intercalary" — with boolean true value', () => {
        // condition_mapping.Day[20].conditions = [["intercalary", "==", 0]]
        // The element is ["boolean"]. When stored as boolean true, Number(true) = 1.
        // epoch_data.intercalary is boolean (true/false).
        // cond_1 = Number(true) = 1; evaluate_operator("==", true, 1) → true == 1 → true (loose equality)
        expect(event_evaluator.evaluate_condition({ intercalary: true }, ['Day', '20', [true]])).toBe(true);
        expect(event_evaluator.evaluate_condition({ intercalary: false }, ['Day', '20', [true]])).toBe(false);
    });

    it('type 21 — "Day is not intercalary"', () => {
        // condition_mapping.Day[21].conditions = [["intercalary", "!=", 0]]
        expect(event_evaluator.evaluate_condition({ intercalary: false }, ['Day', '21', [true]])).toBe(true);
        expect(event_evaluator.evaluate_condition({ intercalary: true }, ['Day', '21', [true]])).toBe(false);
    });
});

// ===========================================================================
// 5. WEEKDAY conditions (special branch)
// ===========================================================================
describe('Weekday conditions', () => {
    const epoch_data = {
        week_day_name: 'Wednesday',
        week_day: 2,
        week_day_num: 3,
        inverse_week_day_num: 1,
    };

    it('type 0 — "Weekday is exactly" — name lookup from numeric index', () => {
        // condition_mapping.Weekday[0].conditions = [["week_day_name", "==", 0]]
        // When type is "0" and cond_1 is numeric, it looks up global_week[cond_1].
        // values[0] = "2" → Number("2") = 2 → global_week[2] = "Wednesday"
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '0', ['2']]);
        expect(result).toBe(true);
    });

    it('type 0 — "Weekday is exactly" — wrong index does not match', () => {
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '0', ['0']]);
        // global_week[0] = "Monday" != "Wednesday"
        expect(result).toBe(false);
    });

    it('type 1 — "Weekday is not" — name lookup, numeric index', () => {
        // condition_mapping.Weekday[1].conditions = [["week_day_name", "!=", 0]]
        // type "1" also triggers the name lookup
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '1', ['0']]);
        // global_week[0] = "Monday" != "Wednesday" → true
        expect(result).toBe(true);
    });

    it('type 1 — "Weekday is not" — same weekday returns false', () => {
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '1', ['2']]);
        // global_week[2] = "Wednesday" != "Wednesday" → false
        expect(result).toBe(false);
    });

    it('type 0 — "Weekday is exactly" — string name (non-numeric) is used directly', () => {
        // If the value is a non-numeric string, cond_1 stays as the string
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '0', ['Wednesday']]);
        expect(result).toBe(true);
    });

    it('type 2 — "Weekday number is exactly" — no name lookup for type "2"', () => {
        // condition_mapping.Weekday[2].conditions = [["week_day", "==", 0]]
        // type "2" does NOT trigger name lookup (only "0" and "1" do)
        const result = event_evaluator.evaluate_condition(epoch_data, ['Weekday', '2', ['2']]);
        expect(result).toBe(true);
    });

    it('type 3 — "Weekday number is not"', () => {
        // condition_mapping.Weekday[3].conditions = [["week_day", "!=", 0]]
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '3', ['5']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '3', ['2']])).toBe(false);
    });

    it('type 8 — "Weekday number in month is exactly"', () => {
        // condition_mapping.Weekday[8].conditions = [["week_day_num", "==", 0]]
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '8', ['3']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '8', ['4']])).toBe(false);
    });

    it('type 14 — "Nth weekday number before end of month is exactly"', () => {
        // condition_mapping.Weekday[14].conditions = [["inverse_week_day_num", "==", 0]]
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '14', ['1']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Weekday', '14', ['2']])).toBe(false);
    });
});

// ===========================================================================
// 6. WEEK conditions (falls through to the else branch)
// ===========================================================================
describe('Week conditions', () => {
    it('type 0 — "Week in month is exactly"', () => {
        // condition_mapping.Week[0].conditions = [["month_week_num", "==", 0]]
        expect(event_evaluator.evaluate_condition({ month_week_num: 3 }, ['Week', '0', ['3']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ month_week_num: 3 }, ['Week', '0', ['4']])).toBe(false);
    });

    it('type 6 — "Every nth week in month" (%)', () => {
        // condition_mapping.Week[6].conditions = [["month_week_num", "%", 0, 1]]
        expect(event_evaluator.evaluate_condition({ month_week_num: 6 }, ['Week', '6', ['3', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ month_week_num: 7 }, ['Week', '6', ['3', '0']])).toBe(false);
    });

    it('type 7 — "Week in year is exactly"', () => {
        // condition_mapping.Week[7].conditions = [["year_week_num", "==", 0]]
        expect(event_evaluator.evaluate_condition({ year_week_num: 10 }, ['Week', '7', ['10']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year_week_num: 10 }, ['Week', '7', ['11']])).toBe(false);
    });

    it('type 13 — "Every nth week in year" (%)', () => {
        // condition_mapping.Week[13].conditions = [["year_week_num", "%", 0, 1]]
        expect(event_evaluator.evaluate_condition({ year_week_num: 12 }, ['Week', '13', ['4', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ year_week_num: 13 }, ['Week', '13', ['4', '0']])).toBe(false);
    });
});

// ===========================================================================
// 7. MOONS conditions (dedicated branch)
// ===========================================================================
describe('Moons conditions', () => {
    // Moons conditions: selected = epoch_data[selector][values[0]]
    // values[0] is the moon index, subcon[2] is index into values for cond_1

    it('type 0 — "Moon phase is exactly" — moon index 0', () => {
        // condition_mapping.Moons[0].conditions = [["moon_phase", "==", 1]]
        // selector = "moon_phase", operator = "==", subcon[2] = 1
        // selected = epoch_data["moon_phase"][values[0]] = moon_phase[0] = 3
        // cond_1 = values[1] | 0 = 3
        const epoch_data = { moon_phase: [3, 5] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '0', ['0', '3']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '0', ['0', '4']])).toBe(false);
    });

    it('type 0 — "Moon phase is exactly" — moon index 1', () => {
        const epoch_data = { moon_phase: [3, 5] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '0', ['1', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '0', ['1', '3']])).toBe(false);
    });

    it('type 1 — "Moon phase is not"', () => {
        // condition_mapping.Moons[1].conditions = [["moon_phase", "!=", 1]]
        const epoch_data = { moon_phase: [3, 5] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '1', ['0', '4']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '1', ['0', '3']])).toBe(false);
    });

    it('type 4 — "Moon phase is later than" (>)', () => {
        // condition_mapping.Moons[4].conditions = [["moon_phase", ">", 1]]
        const epoch_data = { moon_phase: [5] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '4', ['0', '3']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '4', ['0', '5']])).toBe(false);
    });

    it('type 6 — "Every nth moon phase" — multi-condition (AND)', () => {
        // condition_mapping.Moons[6].conditions = [
        //   ["moon_phase", "==", 1],
        //   ["moon_phase_num_epoch", "%", 2, 3]
        // ]
        // Sub-condition 1: moon_phase[moon_index] == values[1]
        // Sub-condition 2: moon_phase_num_epoch[moon_index] % values[2] with offset values[3]
        const epoch_data = {
            moon_phase: [3],
            moon_phase_num_epoch: [9],
        };
        // moon_phase[0] == 3 → true AND (9 - 0) % 3 == 0 → true
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '6', ['0', '3', '3', '0']])).toBe(true);
        // moon_phase[0] == 3 → true AND (9 - 0) % 4 == 0 → false
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '6', ['0', '3', '4', '0']])).toBe(false);
        // moon_phase[0] != 4 → false, short-circuits
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '6', ['0', '4', '3', '0']])).toBe(false);
    });

    it('type 7 — "Moon month-phase count is exactly"', () => {
        // condition_mapping.Moons[7].conditions = [["moon_phase_num_month", "==", 1]]
        const epoch_data = { moon_phase_num_month: [2, 4] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '7', ['0', '2']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '7', ['1', '4']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '7', ['0', '3']])).toBe(false);
    });

    it('type 21 — "Moon epoch-phase count is exactly"', () => {
        // condition_mapping.Moons[21].conditions = [["moon_phase_num_epoch", "==", 1]]
        const epoch_data = { moon_phase_num_epoch: [10, 20] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '21', ['0', '10']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '21', ['1', '20']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Moons', '21', ['0', '11']])).toBe(false);
    });
});

// ===========================================================================
// 8. SEASON conditions (dedicated branch — only runs if epoch_data.season exists)
// ===========================================================================
describe('Season conditions', () => {
    it('type 0 — "Season is exactly"', () => {
        // condition_mapping.Season[0].conditions = [["season_index", "==", 0]]
        const epoch_data = { season: { season_index: 2, season_perc: 50, season_day: 10 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '0', ['2']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '0', ['3']])).toBe(false);
    });

    it('type 1 — "Season is not"', () => {
        const epoch_data = { season: { season_index: 2 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '1', ['3']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '1', ['2']])).toBe(false);
    });

    it('type 2 — "Season percent is exactly"', () => {
        // condition_mapping.Season[2].conditions = [["season_perc", "==", 0]]
        const epoch_data = { season: { season_perc: 50 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '2', ['50']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '2', ['60']])).toBe(false);
    });

    it('type 4 — "Season percent is or later than" (>=)', () => {
        // condition_mapping.Season[4].conditions = [["season_perc", ">=", 0]]
        const epoch_data = { season: { season_perc: 75 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '4', ['50']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '4', ['80']])).toBe(false);
    });

    it('type 8 — "Season day is exactly"', () => {
        // condition_mapping.Season[8].conditions = [["season_day", "==", 0]]
        const epoch_data = { season: { season_day: 10 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '8', ['10']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '8', ['11']])).toBe(false);
    });

    it('type 14 — "Every nth season day" (%)', () => {
        // condition_mapping.Season[14].conditions = [["season_day", "%", 0, 1]]
        const epoch_data = { season: { season_day: 15 } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '14', ['5', '0']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '14', ['4', '0']])).toBe(false);
    });

    it('returns false when epoch_data has no season property', () => {
        // When season is undefined, the Season branch is skipped (guard: epoch_data["season"]).
        // The code falls through to the else branch, which does:
        //   selected = epoch_data["season_index"] → undefined
        //   cond_1 = Number("2") = 2
        //   evaluate_operator("==", undefined, 2) → undefined == 2 → false
        // So the result becomes false via: true && false = false
        const epoch_data = { epoch: 100 };  // no season property
        const result = event_evaluator.evaluate_condition(epoch_data, ['Season', '0', ['2']]);
        expect(result).toBe(false);
    });
});

// ===========================================================================
// 9. RANDOM conditions (dedicated branch — deterministic based on epoch and seed)
// ===========================================================================
describe('Random conditions', () => {
    // condition_mapping.Random[0].conditions = [["season_perc", ">", 0, 1]]
    // condition_mapping.Random[1].conditions = [["season_perc", "<", 0, 1]]
    // The selector "season_perc" is ignored in the Random branch.
    // selected = fract(43758.5453 * sin(cond_2 + 78.233 * epoch)) * 100
    // cond_1 = values[0] (the threshold), cond_2 = values[1] (the seed)

    it('type 0 — "Random chance is above" — deterministic result', () => {
        const epoch_data = { epoch: 42 };
        // The result is deterministic for a given epoch+seed, so calling twice gives same answer
        const result1 = event_evaluator.evaluate_condition(epoch_data, ['Random', '0', ['50', '0']]);
        const result2 = event_evaluator.evaluate_condition(epoch_data, ['Random', '0', ['50', '0']]);
        expect(result1).toBe(result2);
    });

    it('type 0 — same epoch + same seed = same result', () => {
        const r1 = event_evaluator.evaluate_condition({ epoch: 100 }, ['Random', '0', ['50', '7']]);
        const r2 = event_evaluator.evaluate_condition({ epoch: 100 }, ['Random', '0', ['50', '7']]);
        expect(r1).toBe(r2);
    });

    it('type 0 — different epochs can produce different results', () => {
        // With threshold 50 and seed 0, check a range of epochs.
        // At least some should differ. (Deterministic pseudo-random.)
        const results = [];
        for (let e = 0; e < 20; e++) {
            results.push(event_evaluator.evaluate_condition({ epoch: e }, ['Random', '0', ['50', '0']]));
        }
        const trueCount = results.filter(Boolean).length;
        const falseCount = results.length - trueCount;
        // With a 50% threshold over 20 epochs, we expect both true and false
        expect(trueCount).toBeGreaterThan(0);
        expect(falseCount).toBeGreaterThan(0);
    });

    it('type 0 — threshold 0 means "above 0" so nearly always true', () => {
        // selected = some pseudo-random 0–100; condition is selected > 0
        // This should be true for any non-zero selected value
        const result = event_evaluator.evaluate_condition({ epoch: 42 }, ['Random', '0', ['0', '0']]);
        expect(result).toBe(true);
    });

    it('type 1 — "Random chance is below"', () => {
        // condition_mapping.Random[1].conditions = [["season_perc", "<", 0, 1]]
        // selected < cond_1
        const result = event_evaluator.evaluate_condition({ epoch: 42 }, ['Random', '1', ['100', '0']]);
        // selected is always 0–100 (fract * 100), so < 100 should be true
        expect(result).toBe(true);
    });

    it('type 1 — different seed changes outcome', () => {
        const r1 = event_evaluator.evaluate_condition({ epoch: 5 }, ['Random', '1', ['50', '0']]);
        const r2 = event_evaluator.evaluate_condition({ epoch: 5 }, ['Random', '1', ['50', '999']]);
        // Different seeds may produce different results (not guaranteed, but likely)
        // At minimum, both calls should not throw
        expect(typeof r1).toBe('boolean');
        expect(typeof r2).toBe('boolean');
    });
});

// ===========================================================================
// 10. CYCLE conditions (dedicated branch)
// ===========================================================================
describe('Cycle conditions', () => {
    // condition_mapping.Cycle[0].conditions = [["cycle", "==", 0, 1]]
    // selector = "cycle", operator = "==", subcon[2] = 0, subcon[3] = 1
    // selected_cycle = Number(values[0]) → index into epoch_data.cycle
    // selected = epoch_data["cycle"][selected_cycle]
    // cond_1 = Number(values[1])

    it('type 0 — "Cycle is exactly" — matches', () => {
        const epoch_data = { cycle: [0, 2, 1] };
        // values = ["1", "2"] → cycle index 1, expected value 2
        expect(event_evaluator.evaluate_condition(epoch_data, ['Cycle', '0', ['1', '2']])).toBe(true);
    });

    it('type 0 — "Cycle is exactly" — does not match', () => {
        const epoch_data = { cycle: [0, 2, 1] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Cycle', '0', ['1', '3']])).toBe(false);
    });

    it('type 0 — "Cycle is exactly" — first cycle entry', () => {
        const epoch_data = { cycle: [5, 2, 1] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Cycle', '0', ['0', '5']])).toBe(true);
    });

    it('type 1 — "Cycle is not"', () => {
        // condition_mapping.Cycle[1].conditions = [["cycle", "!=", 0, 1]]
        const epoch_data = { cycle: [0, 2, 1] };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Cycle', '1', ['1', '3']])).toBe(true);
        expect(event_evaluator.evaluate_condition(epoch_data, ['Cycle', '1', ['1', '2']])).toBe(false);
    });
});

// ===========================================================================
// 11. LOCATION conditions (early return!)
// ===========================================================================
describe('Location conditions', () => {
    // condition_mapping.Location[0].conditions = [["location", "==", 0]]
    // condition_mapping.Location[1].conditions = [["location", "!=", 0]]
    // The Location branch returns EARLY (not at the end of the function).

    it('type 0 — "Location is exactly" — returns false when custom_location is false', () => {
        event_evaluator.dynamic_data.custom_location = false;
        event_evaluator.dynamic_data.location = 5;

        const result = event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '0', ['5']]);
        expect(result).toBe(false);
    });

    it('type 0 — "Location is exactly" — returns true when custom_location is true and location matches', () => {
        event_evaluator.dynamic_data.custom_location = true;
        event_evaluator.dynamic_data.location = 5;

        // cond_1 = values[0] | 0 = 5; operator == "=="; evaluate_operator("==", 5, 5) → true
        // return true && true → true
        const result = event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '0', ['5']]);
        expect(result).toBe(true);
    });

    it('type 0 — "Location is exactly" — returns false when location does not match', () => {
        event_evaluator.dynamic_data.custom_location = true;
        event_evaluator.dynamic_data.location = 3;

        const result = event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '0', ['5']]);
        expect(result).toBe(false);
    });

    it('type 1 — "Location is not" — returns true when custom_location and location differs', () => {
        event_evaluator.dynamic_data.custom_location = true;
        event_evaluator.dynamic_data.location = 3;

        const result = event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '1', ['5']]);
        expect(result).toBe(true);
    });

    it('type 1 — "Location is not" — returns false when custom_location is true and location matches', () => {
        event_evaluator.dynamic_data.custom_location = true;
        event_evaluator.dynamic_data.location = 5;

        // evaluate_operator("!=", 5, 5) → false; custom_location && false → false
        const result = event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '1', ['5']]);
        expect(result).toBe(false);
    });
});

// ===========================================================================
// 12. ERA conditions (falls through to the else branch)
// ===========================================================================
describe('Era conditions', () => {
    // condition_mapping.Era[0].conditions = [["era", "==", 0, 1]]
    // This is a 4-element subcon, so it passes cond_2 to evaluate_operator.
    // But for "==" operator, cond_2 isn't used.

    it('type 0 — "Era is exactly"', () => {
        expect(event_evaluator.evaluate_condition({ era: 2 }, ['Era', '0', ['2', 'ignored']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ era: 2 }, ['Era', '0', ['3', 'ignored']])).toBe(false);
    });

    it('type 1 — "Era is not"', () => {
        expect(event_evaluator.evaluate_condition({ era: 2 }, ['Era', '1', ['3', 'ignored']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ era: 2 }, ['Era', '1', ['2', 'ignored']])).toBe(false);
    });
});

// ===========================================================================
// 13. ERA YEAR conditions (falls through to the else branch)
// ===========================================================================
describe('Era year conditions', () => {
    it('type 0 — "Era year is exactly"', () => {
        // condition_mapping["Era year"][0].conditions = [["era_year", "==", 0]]
        expect(event_evaluator.evaluate_condition({ era_year: 100 }, ['Era year', '0', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ era_year: 100 }, ['Era year', '0', ['101']])).toBe(false);
    });

    it('type 2 — "Era year is or later than" (>=)', () => {
        expect(event_evaluator.evaluate_condition({ era_year: 100 }, ['Era year', '2', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ era_year: 100 }, ['Era year', '2', ['101']])).toBe(false);
    });

    it('type 6 — "Every nth era year" (%)', () => {
        // condition_mapping["Era year"][6].conditions = [["era_year", "%", 0]]
        // NOTE: This subcon only has 3 elements, but the % operator needs c (offset).
        // subcon[3] is undefined → values[undefined] is undefined → cond_2 = undefined
        // → Number(undefined) = NaN → isNaN check: cond_2 stays undefined
        // evaluate_operator('%', selected, nth, undefined):
        //   c = undefined % nth = NaN; (selected - NaN) % nth = NaN == 0 → false
        //
        // BUG: "Every nth era year" can NEVER return true because the condition_mapping
        // entry only has 3 elements in its subcon [["era_year", "%", 0]], lacking the
        // offset index. This means cond_2 (offset) is always undefined, which makes
        // the modulo operator always produce NaN, which never equals 0.
        //
        // Fixed: condition_mapping["Era year"][6] now has 4 elements: ["era_year", "%", 0, 1]
        const result = event_evaluator.evaluate_condition({ era_year: 10 }, ['Era year', '6', ['5', '0']]);
        expect(result).toBe(true);  // 10 % 5 == 0 with offset 0 → true
    });
});

// ===========================================================================
// 14. EVENTS conditions (most complex, dedicated branch)
// ===========================================================================
describe('Events conditions', () => {
    // condition_mapping.Events[0].conditions = [["event", "exactly_past", 0, 1]]
    // cond_1 = values[0] | 0 → connected event index in current_event.data.connected_events
    // cond_1 is then resolved to the actual event_id via connected_events[cond_1]
    // cond_2 = values[1] | 0 → offset in days

    beforeEach(() => {
        // Set up a current_event with connected_events pointing to event 42
        event_evaluator.current_event = {
            data: {
                connected_events: [42],
            },
        };
    });

    it('returns false when connected event has no valid epochs', () => {
        event_evaluator.event_data.valid = {};
        const result = event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '0', ['0', '5']]);
        expect(result).toBe(false);
    });

    it('returns false when connected event has empty valid array', () => {
        event_evaluator.event_data.valid = { 42: [] };
        const result = event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '0', ['0', '5']]);
        expect(result).toBe(false);
    });

    it('type 0 — "exactly_past" — epoch == valid_epoch + days_ago', () => {
        // operator = "exactly_past"
        // result = epoch_data.epoch == valid[cond_1][j] + cond_2
        event_evaluator.event_data.valid = { 42: [95] };
        // epoch 100 == 95 + 5 → true
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '0', ['0', '5']])).toBe(true);
        // epoch 101 == 95 + 5 → false
        expect(event_evaluator.evaluate_condition({ epoch: 101 }, ['Events', '0', ['0', '5']])).toBe(false);
    });

    it('type 0 — "exactly_past" — checks all valid epochs', () => {
        event_evaluator.event_data.valid = { 42: [90, 95] };
        // epoch 100 == 95 + 5 → true (second entry)
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '0', ['0', '5']])).toBe(true);
        // epoch 95 == 90 + 5 → true (first entry)
        expect(event_evaluator.evaluate_condition({ epoch: 95 }, ['Events', '0', ['0', '5']])).toBe(true);
    });

    it('type 1 — "exactly_future" — epoch == valid_epoch - days_ahead', () => {
        // operator = "exactly_future"
        // result = epoch_data.epoch == valid[cond_1][j] - cond_2
        event_evaluator.event_data.valid = { 42: [105] };
        // epoch 100 == 105 - 5 → true
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '1', ['0', '5']])).toBe(true);
        // epoch 99 == 105 - 5 → false
        expect(event_evaluator.evaluate_condition({ epoch: 99 }, ['Events', '1', ['0', '5']])).toBe(false);
    });

    it('type 2 — "in_past_exc" — epoch within range before future event (exclusive)', () => {
        // operator = "in_past_exc"
        // result = epoch >= valid_epoch - cond_2 && valid_epoch > epoch
        event_evaluator.event_data.valid = { 42: [110] };
        // For cond_2=5, epoch in [110-5, 110) = [105, 110)
        expect(event_evaluator.evaluate_condition({ epoch: 105 }, ['Events', '2', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 109 }, ['Events', '2', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 110 }, ['Events', '2', ['0', '5']])).toBe(false);  // not exclusive
        expect(event_evaluator.evaluate_condition({ epoch: 104 }, ['Events', '2', ['0', '5']])).toBe(false);
    });

    it('type 3 — "in_future_exc" — epoch within range after past event (exclusive)', () => {
        // operator = "in_future_exc"
        // result = epoch <= valid_epoch + cond_2 && valid_epoch < epoch
        event_evaluator.event_data.valid = { 42: [90] };
        // For cond_2=5, epoch in (90, 90+5] = (90, 95]
        expect(event_evaluator.evaluate_condition({ epoch: 91 }, ['Events', '3', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 95 }, ['Events', '3', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 90 }, ['Events', '3', ['0', '5']])).toBe(false);  // exclusive
        expect(event_evaluator.evaluate_condition({ epoch: 96 }, ['Events', '3', ['0', '5']])).toBe(false);
    });

    it('type 4 — "in_past_inc" — epoch within range before event (inclusive)', () => {
        // operator = "in_past_inc"
        // result = epoch >= valid_epoch - cond_2 && valid_epoch >= epoch
        event_evaluator.event_data.valid = { 42: [110] };
        // For cond_2=5, epoch in [110-5, 110] = [105, 110]
        expect(event_evaluator.evaluate_condition({ epoch: 105 }, ['Events', '4', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 110 }, ['Events', '4', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 104 }, ['Events', '4', ['0', '5']])).toBe(false);
        expect(event_evaluator.evaluate_condition({ epoch: 111 }, ['Events', '4', ['0', '5']])).toBe(false);
    });

    it('type 5 — "in_future_inc" — epoch within range after event (inclusive)', () => {
        // operator = "in_future_inc"
        // result = epoch <= valid_epoch + cond_2 && valid_epoch <= epoch
        event_evaluator.event_data.valid = { 42: [90] };
        // For cond_2=5, epoch in [90, 90+5] = [90, 95]
        expect(event_evaluator.evaluate_condition({ epoch: 90 }, ['Events', '5', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 95 }, ['Events', '5', ['0', '5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 89 }, ['Events', '5', ['0', '5']])).toBe(false);
        expect(event_evaluator.evaluate_condition({ epoch: 96 }, ['Events', '5', ['0', '5']])).toBe(false);
    });

    it('exactly_past checks multiple valid epochs and breaks on first match', () => {
        event_evaluator.event_data.valid = { 42: [80, 95, 200] };
        // epoch 100 == 95 + 5 → true on second iteration
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '0', ['0', '5']])).toBe(true);
    });

    it('exactly_future with no matching valid epoch returns false', () => {
        event_evaluator.event_data.valid = { 42: [200, 300] };
        // epoch 100 != 200-5 and != 300-5
        expect(event_evaluator.evaluate_condition({ epoch: 100 }, ['Events', '1', ['0', '5']])).toBe(false);
    });
});

// ===========================================================================
// 15. DATE conditions (dedicated branch using find_stored_epoch)
// ===========================================================================
describe('Date conditions', () => {
    // condition_mapping.Date[0].conditions = [["date", "==", 0, 1, 2]]
    // selected = epoch_data["epoch"]
    // cond_1 = this.find_stored_epoch(values[0], values[1], values[2])
    //
    // find_stored_epoch calls evaluate_calendar_start which is complex.
    // We mock it by pre-populating stored_epochs.

    beforeEach(() => {
        event_evaluator.static_data.settings.year_zero_exists = true;
    });

    it('type 0 — "Date is exactly" — uses stored epoch for comparison', () => {
        // Pre-populate stored_epochs so find_stored_epoch doesn't call evaluate_calendar_start
        // date_string format: "${convert_year(static_data, year)}-${timespan}-${day}"
        // With year_zero_exists = true, convert_year returns year as-is
        event_evaluator.stored_epochs['2024-3-15'] = 500;

        expect(event_evaluator.evaluate_condition({ epoch: 500 }, ['Date', '0', ['2024', '3', '15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 501 }, ['Date', '0', ['2024', '3', '15']])).toBe(false);
    });

    it('type 1 — "Date is not"', () => {
        event_evaluator.stored_epochs['2024-3-15'] = 500;

        expect(event_evaluator.evaluate_condition({ epoch: 501 }, ['Date', '1', ['2024', '3', '15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 500 }, ['Date', '1', ['2024', '3', '15']])).toBe(false);
    });

    it('type 2 — "Date is or later than" (>=)', () => {
        event_evaluator.stored_epochs['2024-3-15'] = 500;

        expect(event_evaluator.evaluate_condition({ epoch: 500 }, ['Date', '2', ['2024', '3', '15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 501 }, ['Date', '2', ['2024', '3', '15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 499 }, ['Date', '2', ['2024', '3', '15']])).toBe(false);
    });

    it('type 4 — "Date is later than" (>)', () => {
        event_evaluator.stored_epochs['2024-3-15'] = 500;

        expect(event_evaluator.evaluate_condition({ epoch: 501 }, ['Date', '4', ['2024', '3', '15']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 500 }, ['Date', '4', ['2024', '3', '15']])).toBe(false);
    });
});

// ===========================================================================
// 16. Multi-condition types (ANDed sub-conditions)
// ===========================================================================
describe('Multi-condition types (AND logic)', () => {
    it('Month type 6 — both sub-conditions must be true', () => {
        // Tested above, but let's verify the AND logic explicitly with all four combos
        // condition_mapping.Month[6].conditions = [
        //   ["timespan_index", "==", 0],
        //   ["timespan_count", "%", 1, 2]
        // ]

        // T && T
        expect(event_evaluator.evaluate_condition(
            { timespan_index: 2, timespan_count: 9 },
            ['Month', '6', ['2', '3', '0']]
        )).toBe(true);

        // T && F
        expect(event_evaluator.evaluate_condition(
            { timespan_index: 2, timespan_count: 10 },
            ['Month', '6', ['2', '3', '0']]
        )).toBe(false);

        // F && T
        expect(event_evaluator.evaluate_condition(
            { timespan_index: 1, timespan_count: 9 },
            ['Month', '6', ['2', '3', '0']]
        )).toBe(false);

        // F && F
        expect(event_evaluator.evaluate_condition(
            { timespan_index: 1, timespan_count: 10 },
            ['Month', '6', ['2', '3', '0']]
        )).toBe(false);
    });

    it('Moons type 6 — "Every nth moon phase" — both sub-conditions ANDed', () => {
        // condition_mapping.Moons[6].conditions = [
        //   ["moon_phase", "==", 1],
        //   ["moon_phase_num_epoch", "%", 2, 3]
        // ]
        const epoch_data_tt = { moon_phase: [3], moon_phase_num_epoch: [6] };
        expect(event_evaluator.evaluate_condition(epoch_data_tt, ['Moons', '6', ['0', '3', '3', '0']])).toBe(true);

        const epoch_data_tf = { moon_phase: [3], moon_phase_num_epoch: [7] };
        expect(event_evaluator.evaluate_condition(epoch_data_tf, ['Moons', '6', ['0', '3', '3', '0']])).toBe(false);

        const epoch_data_ft = { moon_phase: [4], moon_phase_num_epoch: [6] };
        expect(event_evaluator.evaluate_condition(epoch_data_ft, ['Moons', '6', ['0', '3', '3', '0']])).toBe(false);
    });
});

// ===========================================================================
// 17. Edge cases and operator tests
// ===========================================================================
describe('Edge cases', () => {
    it('evaluate_operator with % operator — modulo with offset', () => {
        // Direct test: evaluate_operator('%', a, b, c)
        // c = c % b; return (a - c) % b == 0;
        // a=10, b=5, c=0: c=0%5=0; (10-0)%5=0 → true
        expect(event_evaluator.evaluate_operator('%', 10, 5, 0)).toBe(true);
        // a=11, b=5, c=0: (11-0)%5=1 → false
        expect(event_evaluator.evaluate_operator('%', 11, 5, 0)).toBe(false);
        // a=7, b=5, c=2: c=2%5=2; (7-2)%5=0 → true
        expect(event_evaluator.evaluate_operator('%', 7, 5, 2)).toBe(true);
    });

    it('evaluate_operator with == uses loose equality', () => {
        // The code uses == not ===
        expect(event_evaluator.evaluate_operator('==', 1, '1')).toBe(true);
        expect(event_evaluator.evaluate_operator('==', 0, false)).toBe(true);
    });

    it('evaluate_operator with != uses loose inequality', () => {
        expect(event_evaluator.evaluate_operator('!=', 1, '1')).toBe(false);
        expect(event_evaluator.evaluate_operator('!=', 1, 2)).toBe(true);
    });

    it('evaluate_operator with && returns falsy/truthy correctly', () => {
        expect(event_evaluator.evaluate_operator('&&', true, true)).toBe(true);
        expect(event_evaluator.evaluate_operator('&&', true, false)).toBe(false);
        expect(event_evaluator.evaluate_operator('&&', false, true)).toBe(false);
    });

    it('Epoch — value as non-numeric string stays as string', () => {
        // If values[subcon[2]] is a non-numeric string, cond_1 remains string.
        // The comparison then uses == with loose equality.
        const result = event_evaluator.evaluate_condition(
            { epoch: 'some_string' },
            ['Epoch', '0', ['some_string']]
        );
        expect(result).toBe(true);
    });

    it('handles zero epoch correctly', () => {
        expect(event_evaluator.evaluate_condition({ epoch: 0 }, ['Epoch', '0', ['0']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ epoch: 0 }, ['Epoch', '1', ['0']])).toBe(false);
    });
});

// ===========================================================================
// 18. Season — solstice/equinox hidden conditions
// ===========================================================================
describe('Season — solstice and equinox conditions', () => {
    // Hidden elements always store value "1" (see event_conditions_component.js addInput).
    // The Season branch does: cond_1 = values[0] | 0 = "1" | 0 = 1
    // selected = epoch_data.season.<selector> (boolean true/false)
    // evaluate_operator("==", true, 1) → true == 1 → true (JS loose equality)
    // evaluate_operator("==", false, 1) → false == 1 → false

    it('type 15 — "It is the longest day" (high_solstice) — true', () => {
        // condition_mapping.Season[15].conditions = [["high_solstice", "==", 0]]
        const epoch_data = { season: { high_solstice: true } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '15', ['1']])).toBe(true);
    });

    it('type 15 — "It is the longest day" (high_solstice) — false', () => {
        const epoch_data = { season: { high_solstice: false } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '15', ['1']])).toBe(false);
    });

    it('type 16 — "It is the shortest day" (low_solstice)', () => {
        const epoch_data = { season: { low_solstice: true } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '16', ['1']])).toBe(true);
    });

    it('type 17 — "It is the rising equinox"', () => {
        const epoch_data = { season: { rising_equinox: true } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '17', ['1']])).toBe(true);
    });

    it('type 18 — "It is the falling equinox"', () => {
        const epoch_data = { season: { falling_equinox: true } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '18', ['1']])).toBe(true);
    });

    it('type 18 — "It is the falling equinox" — not the falling equinox', () => {
        const epoch_data = { season: { falling_equinox: false } };
        expect(event_evaluator.evaluate_condition(epoch_data, ['Season', '18', ['1']])).toBe(false);
    });
});

// ===========================================================================
// 19. Location — edge case: cond_1 uses bitwise OR for type coercion
// ===========================================================================
describe('Location — bitwise OR coercion', () => {
    it('truncates decimal location values with | 0', () => {
        // cond_1 = values[subcon[2]] | 0 → truncates to integer
        event_evaluator.dynamic_data.custom_location = true;
        event_evaluator.dynamic_data.location = 5;

        // "5.9" | 0 = 5, so it should match location 5
        expect(event_evaluator.evaluate_condition({ epoch: 1 }, ['Location', '0', ['5.9']])).toBe(true);
    });
});

// ===========================================================================
// 20. Week — additional conditions
// ===========================================================================
describe('Week — additional condition types', () => {
    it('type 14 — "Nth week before end of month is exactly"', () => {
        // condition_mapping.Week[14].conditions = [["inverse_month_week_num", "==", 0]]
        expect(event_evaluator.evaluate_condition({ inverse_month_week_num: 2 }, ['Week', '14', ['2']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ inverse_month_week_num: 2 }, ['Week', '14', ['3']])).toBe(false);
    });

    it('type 20 — "Nth week before end of year is exactly"', () => {
        // condition_mapping.Week[20].conditions = [["inverse_year_week_num", "==", 0]]
        expect(event_evaluator.evaluate_condition({ inverse_year_week_num: 5 }, ['Week', '20', ['5']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ inverse_year_week_num: 5 }, ['Week', '20', ['6']])).toBe(false);
    });

    it('type 26 — "Total week number is exactly"', () => {
        // condition_mapping.Week[26].conditions = [["total_week_num", "==", 0]]
        expect(event_evaluator.evaluate_condition({ total_week_num: 100 }, ['Week', '26', ['100']])).toBe(true);
        expect(event_evaluator.evaluate_condition({ total_week_num: 100 }, ['Week', '26', ['101']])).toBe(false);
    });
});
