import { describe, it, expect, beforeEach } from 'vitest';
import { event_evaluator } from '../calendar/calendar_workers';

/**
 * Comprehensive tests for evaluate_condition() — "Events" category
 *
 * The "Events" branch of evaluate_condition() compares the current epoch
 * against previously-evaluated epochs of connected events. It handles
 * 6 sub-operators:
 *
 *   Type "0" — exactly_past:    "Target event happened exactly x days ago"
 *   Type "1" — exactly_future:  "Target event is happening exactly x days from now"
 *   Type "2" — in_past_exc:     "Target event is going to happen within the next x days (exclusive)"
 *   Type "3" — in_future_exc:   "Target event has happened in the last x days (exclusive)"
 *   Type "4" — in_past_inc:     "Target event is going to happen within the next x days (inclusive)"
 *   Type "5" — in_future_inc:   "Target event has happened in the last x days (inclusive)"
 *
 * Condition array format: ["Events", typeIndex, [connectedEventIndex, dayDistance]]
 *   - typeIndex selects which operator from condition_mapping["Events"]
 *   - connectedEventIndex indexes into current_event.data.connected_events to get the event ID
 *   - dayDistance is the number of days for the comparison
 *
 * NOTE ON OPERATOR NAMING:
 *   The operator names are confusingly reversed relative to the labels.
 *   "in_past_exc" / "in_past_inc" correspond to labels about future events ("going to happen").
 *   "in_future_exc" / "in_future_inc" correspond to labels about past events ("has happened").
 *   However, the CODE LOGIC is correct relative to the LABELS — it's just the internal
 *   operator names that are misleading. The code checks:
 *     in_past_exc:   valid[j] > epoch  (event is in the future)  ✓ matches "going to happen"
 *     in_future_exc: valid[j] < epoch  (event is in the past)    ✓ matches "has happened"
 *   Tests verify the actual code behavior; comments reference the labels for clarity.
 */

describe('evaluate_condition — Events category', () => {

    beforeEach(() => {
        // Minimal setup required by event_evaluator
        event_evaluator.static_data = {
            settings: { year_zero_exists: true },
            year_data: { global_week: [] },
        };
        event_evaluator.dynamic_data = {};
        event_evaluator.stored_epochs = {};
        event_evaluator.event_data = { valid: {}, starts: {}, ends: {} };
        event_evaluator.events = [];

        // Default: connected_events[0] → event ID 5
        event_evaluator.current_event = {
            data: { connected_events: [5] },
        };

        // Event #5 has valid epochs at 100, 200, 300
        event_evaluator.event_data.valid[5] = [100, 200, 300];
    });

    // ═══════════════════════════════════════════════════════════════
    // Helper: build a condition array for the Events category
    // ═══════════════════════════════════════════════════════════════
    /**
     * @param {string} typeIndex  - "0".."5" selecting the operator
     * @param {string} connIdx    - index into connected_events (as string)
     * @param {string} distance   - day distance (as string, will be | 0 in code)
     */
    function eventsCondition(typeIndex, connIdx, distance) {
        return ['Events', typeIndex, [connIdx, distance]];
    }

    // ═══════════════════════════════════════════════════════════════
    // exactly_past (type "0"):
    //   "Target event happened exactly x days ago"
    //   Code: epoch == valid[j] + cond_2
    // ═══════════════════════════════════════════════════════════════
    describe('exactly_past (type "0") — "happened exactly X days ago"', () => {

        it('returns true when current epoch is exactly X days after a valid epoch', () => {
            // valid[0]=100, distance=10 → looking for epoch == 100+10 = 110
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when current epoch is NOT exactly X days after any valid epoch', () => {
            // valid epochs are 100,200,300; distance=10 → matches 110,210,310
            // epoch 115 doesn't match any
            const result = event_evaluator.evaluate_condition(
                { epoch: 115 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true when multiple valid epochs exist and one matches', () => {
            // valid[2]=300, distance=5 → matches epoch 305
            const result = event_evaluator.evaluate_condition(
                { epoch: 305 },
                eventsCondition('0', '0', '5'),
            );
            expect(result).toBe(true);
        });

        it('returns true for the second valid epoch match', () => {
            // valid[1]=200, distance=10 → matches epoch 210
            const result = event_evaluator.evaluate_condition(
                { epoch: 210 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when no valid epochs exist', () => {
            event_evaluator.event_data.valid[5] = [];
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true with distance 0 — matches the exact event epoch', () => {
            // valid[0]=100, distance=0 → looking for epoch == 100
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('0', '0', '0'),
            );
            expect(result).toBe(true);
        });

        it('returns false with distance 0 when epoch does not match any valid epoch', () => {
            const result = event_evaluator.evaluate_condition(
                { epoch: 150 },
                eventsCondition('0', '0', '0'),
            );
            expect(result).toBe(false);
        });

        it('returns false when epoch is X days BEFORE a valid epoch (wrong direction)', () => {
            // valid[0]=100, distance=10 → code checks epoch == 110, not epoch == 90
            const result = event_evaluator.evaluate_condition(
                { epoch: 90 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // exactly_future (type "1"):
    //   "Target event is happening exactly x days from now"
    //   Code: epoch == valid[j] - cond_2
    // ═══════════════════════════════════════════════════════════════
    describe('exactly_future (type "1") — "happening exactly X days from now"', () => {

        it('returns true when current epoch is exactly X days before a valid epoch', () => {
            // valid[0]=100, distance=10 → epoch == 100-10 = 90
            const result = event_evaluator.evaluate_condition(
                { epoch: 90 },
                eventsCondition('1', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when current epoch is NOT exactly X days before any valid epoch', () => {
            // 100-10=90, 200-10=190, 300-10=290; epoch 85 doesn't match
            const result = event_evaluator.evaluate_condition(
                { epoch: 85 },
                eventsCondition('1', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true matching the third valid epoch', () => {
            // valid[2]=300, distance=50 → epoch == 250
            const result = event_evaluator.evaluate_condition(
                { epoch: 250 },
                eventsCondition('1', '0', '50'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch is X days AFTER a valid epoch (wrong direction)', () => {
            // valid[0]=100, distance=10 → code checks epoch == 90, not epoch == 110
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('1', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true with distance 0 — matches the exact event epoch', () => {
            const result = event_evaluator.evaluate_condition(
                { epoch: 200 },
                eventsCondition('1', '0', '0'),
            );
            expect(result).toBe(true);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // in_past_exc (type "2"):
    //   "Target event is going to happen within the next x days (exclusive)"
    //   Code: epoch >= valid[j] - cond_2 && valid[j] > epoch
    //   Meaning: the event is AHEAD of us (valid[j] > epoch) and
    //            we're within cond_2 days of it (epoch >= valid[j] - cond_2)
    // ═══════════════════════════════════════════════════════════════
    describe('in_past_exc (type "2") — "going to happen within next X days (exclusive)"', () => {

        it('returns true when epoch is within X days before a future valid epoch', () => {
            // valid[0]=100, distance=10 → range: epoch in [90..99] (valid > epoch)
            const result = event_evaluator.evaluate_condition(
                { epoch: 95 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch IS the valid epoch (exclusive)', () => {
            // valid[0]=100, distance=10 → valid[j] > epoch required, so epoch=100 fails
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false when epoch is just outside the range (one day too early)', () => {
            // valid[0]=100, distance=10 → range starts at 90; epoch=89 is outside
            const result = event_evaluator.evaluate_condition(
                { epoch: 89 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true at the edge of range — exactly X days before the event', () => {
            // valid[0]=100, distance=10 → epoch=90 → 90 >= 90 && 100 > 90 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 90 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true when one day before the event (distance=1)', () => {
            // valid[0]=100, distance=1 → epoch=99 → 99 >= 99 && 100 > 99 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 99 },
                eventsCondition('2', '0', '1'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch is AFTER the valid epoch', () => {
            // valid[0]=100, distance=10 → valid[j] > epoch fails for epoch=101
            const result = event_evaluator.evaluate_condition(
                { epoch: 101 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true matching against the second valid epoch', () => {
            // valid[1]=200, distance=5 → range [195..199]
            const result = event_evaluator.evaluate_condition(
                { epoch: 197 },
                eventsCondition('2', '0', '5'),
            );
            expect(result).toBe(true);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // in_future_exc (type "3"):
    //   "Target event has happened in the last x days (exclusive)"
    //   Code: epoch <= valid[j] + cond_2 && valid[j] < epoch
    //   Meaning: the event is BEHIND us (valid[j] < epoch) and
    //            we're within cond_2 days of it (epoch <= valid[j] + cond_2)
    // ═══════════════════════════════════════════════════════════════
    describe('in_future_exc (type "3") — "happened in the last X days (exclusive)"', () => {

        it('returns true when epoch is within X days after a past valid epoch', () => {
            // valid[0]=100, distance=10 → range: epoch in [101..110] (valid < epoch)
            const result = event_evaluator.evaluate_condition(
                { epoch: 105 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch IS the valid epoch (exclusive)', () => {
            // valid[0]=100, distance=10 → valid[j] < epoch required, epoch=100 fails
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false when epoch is just outside the range (one day too late)', () => {
            // valid[0]=100, distance=10 → range ends at 110; epoch=111 is outside
            const result = event_evaluator.evaluate_condition(
                { epoch: 111 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true at the edge of range — exactly X days after the event', () => {
            // valid[0]=100, distance=10 → epoch=110 → 110 <= 110 && 100 < 110 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true one day after the event (distance=1)', () => {
            // valid[0]=100, distance=1 → epoch=101 → 101 <= 101 && 100 < 101 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 101 },
                eventsCondition('3', '0', '1'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch is BEFORE the valid epoch', () => {
            // valid[0]=100, distance=10 → valid[j] < epoch fails for epoch=99
            const result = event_evaluator.evaluate_condition(
                { epoch: 99 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // in_past_inc (type "4"):
    //   "Target event is going to happen within the next x days (inclusive)"
    //   Code: epoch >= valid[j] - cond_2 && valid[j] >= epoch
    //   Same as in_past_exc but includes the event day itself
    // ═══════════════════════════════════════════════════════════════
    describe('in_past_inc (type "4") — "going to happen within next X days (inclusive)"', () => {

        it('returns true when epoch IS the valid epoch (inclusive)', () => {
            // valid[0]=100, distance=10 → valid[j] >= epoch, so epoch=100 is included
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('4', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true when epoch is within X days before a future valid epoch', () => {
            // valid[0]=100, distance=10 → range [90..100] inclusive
            const result = event_evaluator.evaluate_condition(
                { epoch: 95 },
                eventsCondition('4', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true at the edge of range — exactly X days before the event', () => {
            // valid[0]=100, distance=10 → epoch=90 → 90 >= 90 && 100 >= 90 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 90 },
                eventsCondition('4', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch is just outside the range', () => {
            // valid[0]=100, distance=10 → range starts at 90; epoch=89 is outside
            const result = event_evaluator.evaluate_condition(
                { epoch: 89 },
                eventsCondition('4', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false when epoch is after the valid epoch', () => {
            // valid[0]=100, distance=10 → valid[j] >= epoch fails for epoch=101
            const result = event_evaluator.evaluate_condition(
                { epoch: 101 },
                eventsCondition('4', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true with distance 0 ON the event day (inclusive of event itself)', () => {
            // valid[0]=100, distance=0 → epoch=100 → 100 >= 100 && 100 >= 100 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('4', '0', '0'),
            );
            expect(result).toBe(true);
        });

        it('returns false with distance 0 on a non-event day', () => {
            // valid[0]=100, distance=0 → epoch=99 → 99 >= 100 is false
            const result = event_evaluator.evaluate_condition(
                { epoch: 99 },
                eventsCondition('4', '0', '0'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // in_future_inc (type "5"):
    //   "Target event has happened in the last x days (inclusive)"
    //   Code: epoch <= valid[j] + cond_2 && valid[j] <= epoch
    //   Same as in_future_exc but includes the event day itself
    // ═══════════════════════════════════════════════════════════════
    describe('in_future_inc (type "5") — "happened in the last X days (inclusive)"', () => {

        it('returns true when epoch IS the valid epoch (inclusive)', () => {
            // valid[0]=100, distance=10 → valid[j] <= epoch, so epoch=100 is included
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true when epoch is within X days after a past valid epoch', () => {
            // valid[0]=100, distance=10 → range [100..110] inclusive
            const result = event_evaluator.evaluate_condition(
                { epoch: 105 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns true at the edge of range — exactly X days after the event', () => {
            // valid[0]=100, distance=10 → epoch=110 → 110 <= 110 && 100 <= 110 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('returns false when epoch is just outside the range', () => {
            // valid[0]=100, distance=10 → range ends at 110; epoch=111 is outside
            const result = event_evaluator.evaluate_condition(
                { epoch: 111 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false when epoch is before the valid epoch', () => {
            // valid[0]=100, distance=10 → valid[j] <= epoch fails for epoch=99
            const result = event_evaluator.evaluate_condition(
                { epoch: 99 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns true with distance 0 ON the event day (inclusive of event itself)', () => {
            // valid[0]=100, distance=0 → epoch=100 → 100 <= 100 && 100 <= 100 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('5', '0', '0'),
            );
            expect(result).toBe(true);
        });

        it('returns false with distance 0 on a non-event day', () => {
            // valid[0]=100, distance=0 → epoch=101 → 101 <= 100 is false
            const result = event_evaluator.evaluate_condition(
                { epoch: 101 },
                eventsCondition('5', '0', '0'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Edge cases: undefined/empty valid epochs
    // ═══════════════════════════════════════════════════════════════
    describe('edge cases — undefined or empty valid epochs', () => {

        it('returns false when valid epochs array is undefined for the connected event', () => {
            // event_evaluator.event_data.valid[5] exists, but let's reference event #99
            // which has no valid epochs set at all
            event_evaluator.current_event = {
                data: { connected_events: [99] },
            };
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false when valid epochs array is empty', () => {
            event_evaluator.event_data.valid[5] = [];
            const result = event_evaluator.evaluate_condition(
                { epoch: 110 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false for in_past_exc when valid epochs undefined', () => {
            event_evaluator.current_event = {
                data: { connected_events: [99] },
            };
            const result = event_evaluator.evaluate_condition(
                { epoch: 95 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(false);
        });

        it('returns false for in_future_inc when valid epochs empty', () => {
            event_evaluator.event_data.valid[5] = [];
            const result = event_evaluator.evaluate_condition(
                { epoch: 105 },
                eventsCondition('5', '0', '10'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Edge cases: connected event index selection
    // ═══════════════════════════════════════════════════════════════
    describe('edge cases — connected event index selection', () => {

        it('selects the correct connected event via index > 0', () => {
            // connected_events: [10, 20, 30] — index "2" should select event #30
            event_evaluator.current_event = {
                data: { connected_events: [10, 20, 30] },
            };
            // Set up valid epochs for event #30 only
            event_evaluator.event_data.valid[30] = [500];
            // Event #10 and #20 have no valid epochs
            // exactly_past, distance=5 → epoch == 500+5 = 505
            const result = event_evaluator.evaluate_condition(
                { epoch: 505 },
                eventsCondition('0', '2', '5'),
            );
            expect(result).toBe(true);
        });

        it('returns false when selecting a different connected event that has no matching epochs', () => {
            event_evaluator.current_event = {
                data: { connected_events: [10, 20, 30] },
            };
            event_evaluator.event_data.valid[10] = [500];
            event_evaluator.event_data.valid[20] = [600];
            event_evaluator.event_data.valid[30] = [700];
            // exactly_past, connected index "1" → event #20, valid=[600], distance=5 → 605
            // epoch 505 should NOT match event #20 (would match event #10)
            const result = event_evaluator.evaluate_condition(
                { epoch: 505 },
                eventsCondition('0', '1', '5'),
            );
            expect(result).toBe(false);
        });

        it('correctly uses index "1" to match the second connected event', () => {
            event_evaluator.current_event = {
                data: { connected_events: [10, 20, 30] },
            };
            event_evaluator.event_data.valid[20] = [600];
            // exactly_past, connected index "1" → event #20, valid=[600], distance=5 → 605
            const result = event_evaluator.evaluate_condition(
                { epoch: 605 },
                eventsCondition('0', '1', '5'),
            );
            expect(result).toBe(true);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Edge cases: large and unusual distance values
    // ═══════════════════════════════════════════════════════════════
    describe('edge cases — large and boundary distance values', () => {

        it('handles large distance values correctly (exactly_past)', () => {
            // valid[0]=100, distance=1000 → epoch == 1100
            const result = event_evaluator.evaluate_condition(
                { epoch: 1100 },
                eventsCondition('0', '0', '1000'),
            );
            expect(result).toBe(true);
        });

        it('handles large distance values correctly (in_future_inc)', () => {
            // valid[0]=100, distance=1000 → range [100..1100]
            const result = event_evaluator.evaluate_condition(
                { epoch: 1050 },
                eventsCondition('5', '0', '1000'),
            );
            expect(result).toBe(true);
        });

        it('handles distance of 1 at the boundary (in_future_exc)', () => {
            // valid[0]=100, distance=1 → epoch in [101..101] (valid < epoch && epoch <= 101)
            // epoch=101 → 101 <= 101 && 100 < 101 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: 101 },
                eventsCondition('3', '0', '1'),
            );
            expect(result).toBe(true);
        });

        it('distance of 1 just outside boundary (in_future_exc)', () => {
            // valid[0]=100, distance=1 → epoch=102 → 102 <= 101 is false
            const result = event_evaluator.evaluate_condition(
                { epoch: 102 },
                eventsCondition('3', '0', '1'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Inclusive vs Exclusive: direct comparisons
    // ═══════════════════════════════════════════════════════════════
    describe('inclusive vs exclusive — boundary behavior', () => {

        it('in_past_exc excludes the event day, in_past_inc includes it', () => {
            // Both: valid[0]=100, distance=10, epoch=100 (the event day itself)
            const excResult = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('2', '0', '10'),
            );
            const incResult = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('4', '0', '10'),
            );
            expect(excResult).toBe(false); // exclusive: valid[j] > epoch → 100 > 100 is false
            expect(incResult).toBe(true);  // inclusive: valid[j] >= epoch → 100 >= 100 is true
        });

        it('in_future_exc excludes the event day, in_future_inc includes it', () => {
            // Both: valid[0]=100, distance=10, epoch=100 (the event day itself)
            const excResult = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('3', '0', '10'),
            );
            const incResult = event_evaluator.evaluate_condition(
                { epoch: 100 },
                eventsCondition('5', '0', '10'),
            );
            expect(excResult).toBe(false); // exclusive: valid[j] < epoch → 100 < 100 is false
            expect(incResult).toBe(true);  // inclusive: valid[j] <= epoch → 100 <= 100 is true
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Multiple valid epochs — early break behavior
    // ═══════════════════════════════════════════════════════════════
    describe('multiple valid epochs — break-on-first-match behavior', () => {

        it('returns true if ANY valid epoch matches (exactly_future)', () => {
            // valid epochs: [100, 200, 300], distance=50
            // epoch=150 → 100-50=50, 200-50=150 ← match!, 300-50=250
            const result = event_evaluator.evaluate_condition(
                { epoch: 150 },
                eventsCondition('1', '0', '50'),
            );
            expect(result).toBe(true);
        });

        it('returns true if the last valid epoch matches (in_future_inc)', () => {
            // valid epochs: [100, 200, 300], distance=5
            // epoch=303 → need valid[j] <= epoch && epoch <= valid[j]+5
            // 100: 100<=303 && 303<=105 → false
            // 200: 200<=303 && 303<=205 → false
            // 300: 300<=303 && 303<=305 → true!
            const result = event_evaluator.evaluate_condition(
                { epoch: 303 },
                eventsCondition('5', '0', '5'),
            );
            expect(result).toBe(true);
        });

        it('returns false if no valid epoch matches (in_past_inc)', () => {
            // valid epochs: [100, 200, 300], distance=3
            // epoch=50 → need epoch >= valid[j]-3 && valid[j] >= epoch
            // 100: 50 >= 97 → false; 200: 50 >= 197 → false; 300: 50 >= 297 → false
            const result = event_evaluator.evaluate_condition(
                { epoch: 50 },
                eventsCondition('4', '0', '3'),
            );
            expect(result).toBe(false);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Single valid epoch to simplify reasoning
    // ═══════════════════════════════════════════════════════════════
    describe('single valid epoch — simplified verification', () => {

        beforeEach(() => {
            // Simplify: only one valid epoch at 100
            event_evaluator.event_data.valid[5] = [100];
        });

        it('exactly_past: epoch 100+10=110 matches, 109 does not', () => {
            expect(event_evaluator.evaluate_condition(
                { epoch: 110 }, eventsCondition('0', '0', '10'),
            )).toBe(true);
            expect(event_evaluator.evaluate_condition(
                { epoch: 109 }, eventsCondition('0', '0', '10'),
            )).toBe(false);
        });

        it('exactly_future: epoch 100-10=90 matches, 91 does not', () => {
            expect(event_evaluator.evaluate_condition(
                { epoch: 90 }, eventsCondition('1', '0', '10'),
            )).toBe(true);
            expect(event_evaluator.evaluate_condition(
                { epoch: 91 }, eventsCondition('1', '0', '10'),
            )).toBe(false);
        });

        it('in_past_exc: full range check [90..99]', () => {
            // distance=10, valid=100 → range [90..99] (exclusive of 100)
            expect(event_evaluator.evaluate_condition(
                { epoch: 89 }, eventsCondition('2', '0', '10'),
            )).toBe(false);  // below range
            expect(event_evaluator.evaluate_condition(
                { epoch: 90 }, eventsCondition('2', '0', '10'),
            )).toBe(true);   // lower bound
            expect(event_evaluator.evaluate_condition(
                { epoch: 99 }, eventsCondition('2', '0', '10'),
            )).toBe(true);   // upper bound (exclusive of event day, so 99 is in)
            expect(event_evaluator.evaluate_condition(
                { epoch: 100 }, eventsCondition('2', '0', '10'),
            )).toBe(false);  // event day excluded
            expect(event_evaluator.evaluate_condition(
                { epoch: 101 }, eventsCondition('2', '0', '10'),
            )).toBe(false);  // above event day
        });

        it('in_future_exc: full range check [101..110]', () => {
            // distance=10, valid=100 → range [101..110] (exclusive of 100)
            expect(event_evaluator.evaluate_condition(
                { epoch: 99 }, eventsCondition('3', '0', '10'),
            )).toBe(false);  // below event day
            expect(event_evaluator.evaluate_condition(
                { epoch: 100 }, eventsCondition('3', '0', '10'),
            )).toBe(false);  // event day excluded
            expect(event_evaluator.evaluate_condition(
                { epoch: 101 }, eventsCondition('3', '0', '10'),
            )).toBe(true);   // lower bound
            expect(event_evaluator.evaluate_condition(
                { epoch: 110 }, eventsCondition('3', '0', '10'),
            )).toBe(true);   // upper bound
            expect(event_evaluator.evaluate_condition(
                { epoch: 111 }, eventsCondition('3', '0', '10'),
            )).toBe(false);  // above range
        });

        it('in_past_inc: full range check [90..100]', () => {
            // distance=10, valid=100 → range [90..100] (inclusive of 100)
            expect(event_evaluator.evaluate_condition(
                { epoch: 89 }, eventsCondition('4', '0', '10'),
            )).toBe(false);  // below range
            expect(event_evaluator.evaluate_condition(
                { epoch: 90 }, eventsCondition('4', '0', '10'),
            )).toBe(true);   // lower bound
            expect(event_evaluator.evaluate_condition(
                { epoch: 100 }, eventsCondition('4', '0', '10'),
            )).toBe(true);   // event day included
            expect(event_evaluator.evaluate_condition(
                { epoch: 101 }, eventsCondition('4', '0', '10'),
            )).toBe(false);  // above event day
        });

        it('in_future_inc: full range check [100..110]', () => {
            // distance=10, valid=100 → range [100..110] (inclusive of 100)
            expect(event_evaluator.evaluate_condition(
                { epoch: 99 }, eventsCondition('5', '0', '10'),
            )).toBe(false);  // below event day
            expect(event_evaluator.evaluate_condition(
                { epoch: 100 }, eventsCondition('5', '0', '10'),
            )).toBe(true);   // event day included
            expect(event_evaluator.evaluate_condition(
                { epoch: 110 }, eventsCondition('5', '0', '10'),
            )).toBe(true);   // upper bound
            expect(event_evaluator.evaluate_condition(
                { epoch: 111 }, eventsCondition('5', '0', '10'),
            )).toBe(false);  // above range
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Negative epoch values (pre-epoch-zero dates)
    // ═══════════════════════════════════════════════════════════════
    describe('negative epoch values', () => {

        beforeEach(() => {
            event_evaluator.event_data.valid[5] = [-50];
        });

        it('exactly_past works with negative valid epoch', () => {
            // valid=-50, distance=10 → epoch == -50+10 = -40
            const result = event_evaluator.evaluate_condition(
                { epoch: -40 },
                eventsCondition('0', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('exactly_future works with negative valid epoch', () => {
            // valid=-50, distance=10 → epoch == -50-10 = -60
            const result = event_evaluator.evaluate_condition(
                { epoch: -60 },
                eventsCondition('1', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('in_future_inc works with negative valid epoch', () => {
            // valid=-50, distance=5 → epoch in [-50..-45], epoch=-48
            // -48 <= -50+5=-45 → true, -50 <= -48 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: -48 },
                eventsCondition('5', '0', '5'),
            );
            expect(result).toBe(true);
        });

        it('in_past_inc works with negative valid epoch', () => {
            // valid=-50, distance=5 → epoch in [-55..-50], epoch=-53
            // -53 >= -50-5=-55 → true, -50 >= -53 → true
            const result = event_evaluator.evaluate_condition(
                { epoch: -53 },
                eventsCondition('4', '0', '5'),
            );
            expect(result).toBe(true);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // Semantic correctness: label vs. operator name mismatch
    // ═══════════════════════════════════════════════════════════════
    describe('semantic correctness — label vs. operator name documentation', () => {

        /**
         * DOCUMENTATION NOTE:
         *
         * The condition_mapping has a confusing naming pattern where:
         *   - Type "2" label: "going to happen within the next x days (exclusive)"
         *     operator: "in_past_exc"  ← name suggests "past", but checks FUTURE events
         *   - Type "3" label: "happened in the last x days (exclusive)"
         *     operator: "in_future_exc"  ← name suggests "future", but checks PAST events
         *   - Type "4" label: "going to happen within the next x days (inclusive)"
         *     operator: "in_past_inc"
         *   - Type "5" label: "happened in the last x days (inclusive)"
         *     operator: "in_future_inc"
         *
         * The operator names appear to be named from the perspective of the EVENT
         * relative to its own occurrence (the event is "in the past" relative to
         * itself when it hasn't happened yet???), rather than from the perspective
         * of the current epoch. This is confusing but the actual CODE LOGIC is
         * correct for the LABELS. These tests verify the code matches the labels.
         */

        it('type "2" (in_past_exc) correctly detects events ABOUT TO HAPPEN (label: "going to happen")', () => {
            // If the label says "going to happen within the next 10 days",
            // the event should be in the FUTURE relative to the current epoch.
            // valid=200, epoch=195 → event is 5 days in the future → should be true
            event_evaluator.event_data.valid[5] = [200];
            const result = event_evaluator.evaluate_condition(
                { epoch: 195 },
                eventsCondition('2', '0', '10'),
            );
            expect(result).toBe(true);
        });

        it('type "3" (in_future_exc) correctly detects events THAT ALREADY HAPPENED (label: "has happened")', () => {
            // If the label says "happened in the last 10 days",
            // the event should be in the PAST relative to the current epoch.
            // valid=200, epoch=205 → event was 5 days ago → should be true
            event_evaluator.event_data.valid[5] = [200];
            const result = event_evaluator.evaluate_condition(
                { epoch: 205 },
                eventsCondition('3', '0', '10'),
            );
            expect(result).toBe(true);
        });
    });
});
