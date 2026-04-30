import { describe, it, expect } from 'vitest';
import { _convert_old_event_for_testing as convert_old_event } from '../calendar/preset_parsers';
import { _convert_to_granularity_for_testing as convert_to_granularity } from '../calendar/preset_parsers';

// ============================================================================
// convert_to_granularity helper tests
// ============================================================================
describe('convert_to_granularity', () => {
    it('returns cycle * 2 when cycle >= 40', () => {
        expect(convert_to_granularity(40)).toBe(80);
        expect(convert_to_granularity(50)).toBe(100);
        expect(convert_to_granularity(100)).toBe(200);
    });

    it('returns floor(cycle * 1.5) when 24 <= cycle < 40', () => {
        expect(convert_to_granularity(24)).toBe(36);
        expect(convert_to_granularity(30)).toBe(45);
        expect(convert_to_granularity(39)).toBe(58);
    });

    it('returns floor(cycle / 2) when 8 <= cycle < 24', () => {
        expect(convert_to_granularity(8)).toBe(4);
        expect(convert_to_granularity(16)).toBe(8);
        expect(convert_to_granularity(23)).toBe(11);
    });

    it('returns floor(cycle / 3) when cycle < 8', () => {
        expect(convert_to_granularity(0)).toBe(0);
        expect(convert_to_granularity(1)).toBe(0);
        expect(convert_to_granularity(3)).toBe(1);
        expect(convert_to_granularity(6)).toBe(2);
        expect(convert_to_granularity(7)).toBe(2);
    });

    it('handles boundary value 40 (should use >= 40 branch)', () => {
        expect(convert_to_granularity(40)).toBe(80);
    });

    it('handles boundary value 24 (should use >= 24 branch)', () => {
        expect(convert_to_granularity(24)).toBe(36);
    });

    it('handles boundary value 8 (should use >= 8 branch)', () => {
        expect(convert_to_granularity(8)).toBe(4);
    });
});

// ============================================================================
// convert_old_event tests
// ============================================================================
describe('convert_old_event', () => {

    // ========================================================================
    // Case 1: 'once'
    // ========================================================================
    describe('repeats = "once"', () => {
        it('returns correct date and conditions for a specific date', () => {
            let event = {
                repeats: 'once',
                data: { year: 2024, month: 3, day: 15 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([2024, 2, 15]); // month - 1
            expect(conditions).toEqual([
                ['Year', '0', ['2024']],
                ['&&'],
                ['Month', '0', ['2']],    // month - 1 = 2
                ['&&'],
                ['Day', '0', ['15']]
            ]);
        });

        it('handles month=1 (edge case: month - 1 = 0)', () => {
            let event = {
                repeats: 'once',
                data: { year: 1, month: 1, day: 1 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([1, 0, 1]);
            expect(conditions[0]).toEqual(['Year', '0', ['1']]);
            expect(conditions[2]).toEqual(['Month', '0', ['0']]);
            expect(conditions[4]).toEqual(['Day', '0', ['1']]);
        });

        it('handles negative year', () => {
            let event = {
                repeats: 'once',
                data: { year: -5, month: 12, day: 28 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([-5, 11, 28]);
            expect(conditions[0]).toEqual(['Year', '0', ['-5']]);
            expect(conditions[2]).toEqual(['Month', '0', ['11']]);
        });

        it('all condition values are strings', () => {
            let event = {
                repeats: 'once',
                data: { year: 2024, month: 6, day: 10 }
            };
            let [date, conditions] = convert_old_event(event);

            // Year value
            expect(typeof conditions[0][2][0]).toBe('string');
            // Month value
            expect(typeof conditions[2][2][0]).toBe('string');
            // Day value
            expect(typeof conditions[4][2][0]).toBe('string');
        });
    });

    // ========================================================================
    // Case 2: 'daily'
    // ========================================================================
    describe('repeats = "daily"', () => {
        it('returns empty date and Epoch condition', () => {
            let event = { repeats: 'daily', data: {} };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Epoch', '6', ['1', '0']]
            ]);
        });
    });

    // ========================================================================
    // Case 3: 'weekly'
    // ========================================================================
    describe('repeats = "weekly"', () => {
        it('returns Weekday condition with week_day + 1', () => {
            let event = {
                repeats: 'weekly',
                data: { week_day: 3 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['4']]  // 3 + 1 = 4
            ]);
        });

        it('handles week_day=0 (edge case: becomes 1)', () => {
            let event = {
                repeats: 'weekly',
                data: { week_day: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions).toEqual([
                ['Weekday', '0', ['1']]  // 0 + 1 = 1
            ]);
        });
    });

    // ========================================================================
    // Case 4: 'fortnightly'
    // ========================================================================
    describe('repeats = "fortnightly"', () => {
        it('returns Weekday and Week conditions with week_even=true', () => {
            let event = {
                repeats: 'fortnightly',
                data: { week_day: 2, week_even: true }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['3']],   // 2 + 1 = 3
                ['&&'],
                ['Week', '13', ['2', '0']] // week_even=true -> '2'
            ]);
        });

        it('returns Week with "1" when week_even=false', () => {
            let event = {
                repeats: 'fortnightly',
                data: { week_day: 5, week_even: false }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions[2]).toEqual(['Week', '13', ['1', '0']]); // week_even=false -> '1'
        });

        it('handles week_even as falsy value (0)', () => {
            let event = {
                repeats: 'fortnightly',
                data: { week_day: 1, week_even: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            // 0 is falsy, so should use '1'
            expect(conditions[2]).toEqual(['Week', '13', ['1', '0']]);
        });
    });

    // ========================================================================
    // Case 5: 'monthly_date'
    // ========================================================================
    describe('repeats = "monthly_date"', () => {
        it('returns Day condition for specific day each month', () => {
            let event = {
                repeats: 'monthly_date',
                data: { day: 15 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Day', '0', ['15']]
            ]);
        });

        it('handles day=1', () => {
            let event = {
                repeats: 'monthly_date',
                data: { day: 1 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions).toEqual([
                ['Day', '0', ['1']]
            ]);
        });
    });

    // ========================================================================
    // Case 6: 'annually_date'
    // ========================================================================
    describe('repeats = "annually_date"', () => {
        it('returns Month and Day conditions', () => {
            let event = {
                repeats: 'annually_date',
                data: { month: 7, day: 4 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Month', '0', ['6']],  // 7 - 1 = 6
                ['&&'],
                ['Day', '0', ['4']]
            ]);
        });

        it('handles month=1 (becomes 0)', () => {
            let event = {
                repeats: 'annually_date',
                data: { month: 1, day: 25 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions[0]).toEqual(['Month', '0', ['0']]);
        });
    });

    // ========================================================================
    // Case 7: 'monthly_weekday'
    // ========================================================================
    describe('repeats = "monthly_weekday"', () => {
        it('returns Weekday and Week conditions', () => {
            let event = {
                repeats: 'monthly_weekday',
                data: { week_day: 4, week_day_number: 2 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['5']],  // 4 + 1 = 5
                ['&&'],
                ['Week', '0', ['2']]
            ]);
        });
    });

    // ========================================================================
    // Case 8: 'annually_month_weekday'
    // ========================================================================
    describe('repeats = "annually_month_weekday"', () => {
        it('returns Month, Weekday, and Week conditions', () => {
            let event = {
                repeats: 'annually_month_weekday',
                data: { month: 11, week_day: 3, week_day_number: 4 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Month', '0', ['10']],    // 11 - 1 = 10
                ['&&'],
                ['Weekday', '0', ['4']],   // 3 + 1 = 4
                ['&&'],
                ['Week', '0', ['4']]
            ]);
        });
    });

    // ========================================================================
    // Case 9: 'every_x_day'
    // ========================================================================
    describe('repeats = "every_x_day"', () => {
        it('returns Epoch condition with every and modulus+1', () => {
            let event = {
                repeats: 'every_x_day',
                data: { every: 3, modulus: 5 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Epoch', '6', ['3', '6']]  // modulus + 1 = 6
            ]);
        });

        it('handles modulus=0 (becomes 1)', () => {
            let event = {
                repeats: 'every_x_day',
                data: { every: 7, modulus: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions).toEqual([
                ['Epoch', '6', ['7', '1']]  // modulus + 1 = 1
            ]);
        });
    });

    // ========================================================================
    // Case 10: 'every_x_weekday'
    // ========================================================================
    describe('repeats = "every_x_weekday"', () => {
        it('returns Weekday and Week conditions with every/modulus', () => {
            let event = {
                repeats: 'every_x_weekday',
                data: { week_day: 2, every: 4, modulus: 3 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['3']],         // week_day + 1 = 3
                ['&&'],
                ['Week', '20', ['4', '4']]       // modulus + 1 = 4
            ]);
        });

        it('adds +1 to week_day consistently with other weekday-based cases', () => {
            let event = {
                repeats: 'every_x_weekday',
                data: { week_day: 0, every: 2, modulus: 1 }
            };
            let [date, conditions] = convert_old_event(event);

            // week_day=0 becomes '1' after +1 offset, matching all other weekday cases
            expect(conditions[0]).toEqual(['Weekday', '0', ['1']]);
        });
    });

    // ========================================================================
    // Case 11: 'every_x_monthly_date'
    // ========================================================================
    describe('repeats = "every_x_monthly_date"', () => {
        it('returns Day and Month conditions', () => {
            let event = {
                repeats: 'every_x_monthly_date',
                data: { day: 10, every: 3, modulus: 2 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Day', '0', ['10']],
                ['&&'],
                ['Month', '13', ['3', '3']]  // modulus + 1 = 3
            ]);
        });
    });

    // ========================================================================
    // Case 12: 'every_x_monthly_weekday'
    // ========================================================================
    describe('repeats = "every_x_monthly_weekday"', () => {
        it('returns Weekday, Week, and Month conditions', () => {
            let event = {
                repeats: 'every_x_monthly_weekday',
                data: { week_day: 1, week_day_number: 3, every: 2, modulus: 4 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['2']],       // 1 + 1 = 2
                ['&&'],
                ['Week', '0', ['3']],
                ['&&'],
                ['Month', '13', ['2', '5']]    // modulus + 1 = 5
            ]);
        });
    });

    // ========================================================================
    // Case 13: 'every_x_annually_date'
    // ========================================================================
    describe('repeats = "every_x_annually_date"', () => {
        it('returns Day, Month, and Year conditions', () => {
            let event = {
                repeats: 'every_x_annually_date',
                data: { day: 25, month: 12, every: 5, modulus: 2 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Day', '0', ['25']],
                ['&&'],
                ['Month', '0', ['11']],        // 12 - 1 = 11
                ['&&'],
                ['Year', '6', ['5', '3']]      // modulus + 1 = 3
            ]);
        });
    });

    // ========================================================================
    // Case 14: 'every_x_annually_weekday'
    // ========================================================================
    describe('repeats = "every_x_annually_weekday"', () => {
        it('returns Weekday, Week, Month, and Year conditions', () => {
            let event = {
                repeats: 'every_x_annually_weekday',
                data: { week_day: 6, week_day_number: 1, month: 3, every: 4, modulus: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            expect(conditions).toEqual([
                ['Weekday', '0', ['7']],       // 6 + 1 = 7
                ['&&'],
                ['Week', '0', ['1']],
                ['&&'],
                ['Month', '0', ['2']],         // 3 - 1 = 2
                ['&&'],
                ['Year', '6', ['4', '1']]      // modulus + 1 = 1
            ]);
        });
    });

    // ========================================================================
    // Case 15: 'moon_every'
    // ========================================================================
    describe('repeats = "moon_every"', () => {
        it('returns Moons condition with granularity conversion for small phase', () => {
            let event = {
                repeats: 'moon_every',
                data: { moon_id: 0, moon_phase: 5 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(5) = floor(5/3) = 1
            expect(conditions).toEqual([
                ['Moons', '0', ['0', '1']]
            ]);
        });

        it('applies granularity for cycle >= 40', () => {
            let event = {
                repeats: 'moon_every',
                data: { moon_id: 2, moon_phase: 40 }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(40) = 40 * 2 = 80
            expect(conditions).toEqual([
                ['Moons', '0', ['2', '80']]
            ]);
        });

        it('applies granularity for cycle in [24,40) range', () => {
            let event = {
                repeats: 'moon_every',
                data: { moon_id: 1, moon_phase: 30 }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(30) = floor(30 * 1.5) = 45
            expect(conditions).toEqual([
                ['Moons', '0', ['1', '45']]
            ]);
        });

        it('applies granularity for cycle in [8,24) range', () => {
            let event = {
                repeats: 'moon_every',
                data: { moon_id: 3, moon_phase: 16 }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(16) = floor(16/2) = 8
            expect(conditions).toEqual([
                ['Moons', '0', ['3', '8']]
            ]);
        });

        it('applies granularity for cycle < 8', () => {
            let event = {
                repeats: 'moon_every',
                data: { moon_id: 0, moon_phase: 3 }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(3) = floor(3/3) = 1
            expect(conditions).toEqual([
                ['Moons', '0', ['0', '1']]
            ]);
        });
    });

    // ========================================================================
    // Case 16: 'moon_monthly'
    // ========================================================================
    describe('repeats = "moon_monthly"', () => {
        it('returns two Moons conditions (phase + phase number)', () => {
            let event = {
                repeats: 'moon_monthly',
                data: { moon_id: 1, moon_phase: 10, moon_phase_number: 24 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(10) = floor(10/2) = 5
            // moon_phase_number is a COUNT, not a phase — passed as-is via .toString()
            expect(conditions).toEqual([
                ['Moons', '0', ['1', '5']],
                ['&&'],
                ['Moons', '7', ['1', '24']]
            ]);
        });
    });

    // ========================================================================
    // Case 17: 'moon_anually' (note: typo in source — "anually" not "annually")
    // ========================================================================
    describe('repeats = "moon_anually"', () => {
        it('returns Moons, Moons, and Month conditions', () => {
            let event = {
                repeats: 'moon_anually',
                data: { moon_id: 0, moon_phase: 8, moon_phase_number: 2, month: 6 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(8) = floor(8/2) = 4
            expect(conditions[0]).toEqual(['Moons', '0', ['0', '4']]);
            expect(conditions[1]).toEqual(['&&']);
            // moon_phase_number is a COUNT — passed as string via .toString()
            expect(conditions[2]).toEqual(['Moons', '7', ['0', '2']]);
            expect(conditions[3]).toEqual(['&&']);
            expect(conditions[4]).toEqual(['Month', '0', ['5']]); // 6 - 1 = 5
        });

        it('moon_phase_number is properly stringified', () => {
            let event = {
                repeats: 'moon_anually',
                data: { moon_id: 0, moon_phase: 10, moon_phase_number: 5, month: 3 }
            };
            let [date, conditions] = convert_old_event(event);

            // Fixed: moon_phase_number is now stringified consistently
            let moonPhaseNumberValue = conditions[2][2][1];
            expect(moonPhaseNumberValue).toBe('5');
            expect(typeof moonPhaseNumberValue).toBe('string');

            // In moon_monthly, this same field becomes:
            // convert_to_granularity(event.data.moon_phase_number).toString()
            // So the expected fixed behavior would be:
            // expect(moonPhaseNumberValue).toBe(convert_to_granularity(5).toString());
            // i.e. convert_to_granularity(5) = floor(5/3) = 1, so '1'
        });
    });

    // ========================================================================
    // Case 18: 'multimoon_every'
    // ========================================================================
    describe('repeats = "multimoon_every"', () => {
        it('handles single moon', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [{ moon_phase: 10 }]
                }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(10) = floor(10/2) = 5
            expect(conditions).toEqual([
                ['Moons', '0', ['0', '5']]
            ]);
        });

        it('handles two moons with && between them', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [
                        { moon_phase: 8 },
                        { moon_phase: 24 }
                    ]
                }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(8) = floor(8/2) = 4
            // convert_to_granularity(24) = floor(24*1.5) = 36
            expect(conditions).toEqual([
                ['Moons', '0', ['0', '4']],
                ['&&'],
                ['Moons', '0', ['1', '36']]
            ]);
        });

        it('handles three moons with correct indices and && operators', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [
                        { moon_phase: 3 },
                        { moon_phase: 40 },
                        { moon_phase: 16 }
                    ]
                }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(3) = floor(3/3) = 1
            // convert_to_granularity(40) = 40 * 2 = 80
            // convert_to_granularity(16) = floor(16/2) = 8
            expect(conditions).toEqual([
                ['Moons', '0', ['0', '1']],
                ['&&'],
                ['Moons', '0', ['1', '80']],
                ['&&'],
                ['Moons', '0', ['2', '8']]
            ]);
        });

        it('uses array index as moon id, not the moon object id', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [
                        { moon_phase: 6, moon_id: 99 },
                        { moon_phase: 12, moon_id: 42 }
                    ]
                }
            };
            let [date, conditions] = convert_old_event(event);

            // Uses loop index i, not moon_id from the moon object
            expect(conditions[0][2][0]).toBe('0');
            expect(conditions[2][2][0]).toBe('1');
        });

        it('does not have trailing && after last moon', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [
                        { moon_phase: 10 },
                        { moon_phase: 20 }
                    ]
                }
            };
            let [date, conditions] = convert_old_event(event);

            // Last element should be a Moons condition, not ['&&']
            expect(conditions[conditions.length - 1][0]).toBe('Moons');
        });
    });

    // ========================================================================
    // Case 19: 'multimoon_anually' (note: typo in source)
    // ========================================================================
    describe('repeats = "multimoon_anually"', () => {
        it('starts with Month condition then moons', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 5,
                    moons: [{ moon_phase: 10 }]
                }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([]);
            // convert_to_granularity(10) = floor(10/2) = 5
            expect(conditions).toEqual([
                ['Month', '0', ['4']],      // 5 - 1 = 4
                ['&&'],
                ['Moons', '0', ['0', '5']]
            ]);
        });

        it('handles multiple moons with month', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 8,
                    moons: [
                        { moon_phase: 24 },
                        { moon_phase: 7 }
                    ]
                }
            };
            let [date, conditions] = convert_old_event(event);

            // convert_to_granularity(24) = floor(24*1.5) = 36
            // convert_to_granularity(7) = floor(7/3) = 2
            expect(conditions).toEqual([
                ['Month', '0', ['7']],       // 8 - 1 = 7
                ['&&'],
                ['Moons', '0', ['0', '36']],
                ['&&'],
                ['Moons', '0', ['1', '2']]
            ]);
        });

        it('handles month=1 (becomes 0)', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 1,
                    moons: [{ moon_phase: 3 }]
                }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions[0]).toEqual(['Month', '0', ['0']]);
        });

        it('single moon has no trailing &&', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 4,
                    moons: [{ moon_phase: 6 }]
                }
            };
            let [date, conditions] = convert_old_event(event);

            // Should be: Month, &&, Moons (3 items, no trailing &&)
            expect(conditions.length).toBe(3);
            expect(conditions[conditions.length - 1][0]).toBe('Moons');
        });

        it('always has && between Month and first Moon', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 2,
                    moons: [{ moon_phase: 8 }, { moon_phase: 16 }]
                }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions[0][0]).toBe('Month');
            expect(conditions[1]).toEqual(['&&']);
            expect(conditions[2][0]).toBe('Moons');
        });
    });

    // ========================================================================
    // Case 20: unknown / undefined repeats
    // ========================================================================
    describe('unknown repeats value', () => {
        it('returns undefined for unknown repeats string', () => {
            let event = {
                repeats: 'unknown_repeat_type',
                data: {}
            };
            let result = convert_old_event(event);

            expect(result).toBeUndefined();
        });

        it('returns undefined for empty string repeats', () => {
            let event = {
                repeats: '',
                data: {}
            };
            let result = convert_old_event(event);

            expect(result).toBeUndefined();
        });

        it('returns undefined when repeats is undefined', () => {
            let event = { data: {} };
            let result = convert_old_event(event);

            expect(result).toBeUndefined();
        });
    });

    // ========================================================================
    // Cross-cutting edge cases
    // ========================================================================
    describe('cross-cutting edge cases', () => {
        it('all "once" date array elements are numbers, not strings', () => {
            let event = {
                repeats: 'once',
                data: { year: 2024, month: 6, day: 15 }
            };
            let [date] = convert_old_event(event);

            date.forEach(val => {
                expect(typeof val).toBe('number');
            });
        });

        it('all non-"once" cases return empty date array', () => {
            const nonOnceCases = [
                { repeats: 'daily', data: {} },
                { repeats: 'weekly', data: { week_day: 0 } },
                { repeats: 'monthly_date', data: { day: 1 } },
            ];

            for (let event of nonOnceCases) {
                let [date] = convert_old_event(event);
                expect(date).toEqual([]);
            }
        });

        it('conditions arrays always contain string values at index [2]', () => {
            // Test a representative case to confirm condition values are strings
            let event = {
                repeats: 'every_x_annually_weekday',
                data: { week_day: 2, week_day_number: 1, month: 4, every: 3, modulus: 1 }
            };
            let [, conditions] = convert_old_event(event);

            for (let condition of conditions) {
                if (condition.length === 3) {
                    for (let val of condition[2]) {
                        expect(typeof val).toBe('string');
                    }
                }
            }
        });

        it('large year value in "once"', () => {
            let event = {
                repeats: 'once',
                data: { year: 99999, month: 13, day: 30 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(date).toEqual([99999, 12, 30]);
            expect(conditions[0][2][0]).toBe('99999');
            expect(conditions[2][2][0]).toBe('12');
        });

        it('zero values for every and modulus in every_x_day', () => {
            let event = {
                repeats: 'every_x_day',
                data: { every: 0, modulus: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions).toEqual([
                ['Epoch', '6', ['0', '1']]  // modulus + 1 = 1
            ]);
        });

        it('week_day_number=0 in monthly_weekday', () => {
            let event = {
                repeats: 'monthly_weekday',
                data: { week_day: 0, week_day_number: 0 }
            };
            let [date, conditions] = convert_old_event(event);

            expect(conditions).toEqual([
                ['Weekday', '0', ['1']],  // 0 + 1 = 1
                ['&&'],
                ['Week', '0', ['0']]
            ]);
        });

        it('multimoon_every conditions are deep cloned from result', () => {
            let event = {
                repeats: 'multimoon_every',
                data: {
                    moons: [{ moon_phase: 10 }]
                }
            };
            let [, conditions1] = convert_old_event(event);
            let [, conditions2] = convert_old_event(event);

            // Modifying one should not affect the other
            conditions1[0][2][0] = 'MODIFIED';
            expect(conditions2[0][2][0]).toBe('0');
        });

        it('multimoon_anually conditions are deep cloned from result', () => {
            let event = {
                repeats: 'multimoon_anually',
                data: {
                    month: 1,
                    moons: [{ moon_phase: 10 }]
                }
            };
            let [, conditions1] = convert_old_event(event);
            let [, conditions2] = convert_old_event(event);

            // Modifying one should not affect the other
            conditions1[0][2][0] = 'MODIFIED';
            expect(conditions2[0][2][0]).toBe('0');
        });
    });

    // ========================================================================
    // Comprehensive condition_type/operator verification
    // ========================================================================
    describe('condition type identifiers', () => {
        it('"once" uses Year=0, Month=0, Day=0', () => {
            let event = { repeats: 'once', data: { year: 1, month: 1, day: 1 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Year');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Month');
            expect(conditions[2][1]).toBe('0');
            expect(conditions[4][0]).toBe('Day');
            expect(conditions[4][1]).toBe('0');
        });

        it('"daily" uses Epoch=6', () => {
            let event = { repeats: 'daily', data: {} };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Epoch');
            expect(conditions[0][1]).toBe('6');
        });

        it('"weekly" uses Weekday=0', () => {
            let event = { repeats: 'weekly', data: { week_day: 0 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Weekday');
            expect(conditions[0][1]).toBe('0');
        });

        it('"fortnightly" uses Weekday=0, Week=13', () => {
            let event = { repeats: 'fortnightly', data: { week_day: 0, week_even: true } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Weekday');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Week');
            expect(conditions[2][1]).toBe('13');
        });

        it('"every_x_weekday" uses Weekday=0, Week=20', () => {
            let event = { repeats: 'every_x_weekday', data: { week_day: 0, every: 1, modulus: 0 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Weekday');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Week');
            expect(conditions[2][1]).toBe('20');
        });

        it('"every_x_monthly_date" uses Day=0, Month=13', () => {
            let event = { repeats: 'every_x_monthly_date', data: { day: 1, every: 1, modulus: 0 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Day');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Month');
            expect(conditions[2][1]).toBe('13');
        });

        it('"every_x_annually_date" uses Day=0, Month=0, Year=6', () => {
            let event = { repeats: 'every_x_annually_date', data: { day: 1, month: 1, every: 1, modulus: 0 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Day');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Month');
            expect(conditions[2][1]).toBe('0');
            expect(conditions[4][0]).toBe('Year');
            expect(conditions[4][1]).toBe('6');
        });

        it('"moon_every" uses Moons=0', () => {
            let event = { repeats: 'moon_every', data: { moon_id: 0, moon_phase: 8 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Moons');
            expect(conditions[0][1]).toBe('0');
        });

        it('"moon_monthly" uses Moons=0 and Moons=7', () => {
            let event = { repeats: 'moon_monthly', data: { moon_id: 0, moon_phase: 8, moon_phase_number: 8 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions[0][0]).toBe('Moons');
            expect(conditions[0][1]).toBe('0');
            expect(conditions[2][0]).toBe('Moons');
            expect(conditions[2][1]).toBe('7');
        });
    });

    // ========================================================================
    // && operator placement
    // ========================================================================
    describe('&& operator placement', () => {
        it('"once" has 2 && operators at indices 1 and 3', () => {
            let event = { repeats: 'once', data: { year: 1, month: 1, day: 1 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions.length).toBe(5);
            expect(conditions[1]).toEqual(['&&']);
            expect(conditions[3]).toEqual(['&&']);
        });

        it('"annually_month_weekday" has 2 && operators', () => {
            let event = { repeats: 'annually_month_weekday', data: { month: 1, week_day: 0, week_day_number: 1 } };
            let [, conditions] = convert_old_event(event);
            expect(conditions.length).toBe(5);
            expect(conditions[1]).toEqual(['&&']);
            expect(conditions[3]).toEqual(['&&']);
        });

        it('"every_x_annually_weekday" has 3 && operators', () => {
            let event = {
                repeats: 'every_x_annually_weekday',
                data: { week_day: 0, week_day_number: 1, month: 1, every: 1, modulus: 0 }
            };
            let [, conditions] = convert_old_event(event);
            expect(conditions.length).toBe(7);
            expect(conditions[1]).toEqual(['&&']);
            expect(conditions[3]).toEqual(['&&']);
            expect(conditions[5]).toEqual(['&&']);
        });

        it('"daily" has no && operators', () => {
            let event = { repeats: 'daily', data: {} };
            let [, conditions] = convert_old_event(event);
            expect(conditions.length).toBe(1);
        });
    });
});
