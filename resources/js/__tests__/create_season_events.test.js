import { describe, it, expect, vi } from 'vitest';

// Mock the dependencies that seasons_collapsible.js imports.
// CollapsibleComponent is a class used by SeasonsCollapsible (not by create_season_events),
// but we need it to avoid import errors.
vi.mock('../calendar/collapsible_component.js', () => ({
    default: class CollapsibleComponent {}
}));

// calendar_functions.js imports IntervalsCollection and uses window.Alpine.
// We only need the module to not crash on import.
vi.mock('../calendar/calendar_functions.js', () => ({
    fract: vi.fn(),
    get_colors_for_season: vi.fn(),
    hslToHex: vi.fn(),
    lerp: vi.fn(),
}));

import { _create_season_events_for_testing as create_season_events } from '../calendar/seasons_collapsible';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal static_data object for the simple (non-complex) path.
 * @param {Array<{name: string, transition_length?: number, duration?: number}>} seasons
 * @param {boolean} periodic_seasons
 */
function makeStaticData(seasons, periodic_seasons = true) {
    return {
        seasons: {
            data: seasons.map(s => ({
                name: s.name,
                transition_length: s.transition_length ?? 90,
                duration: s.duration ?? 0,
            })),
            global_settings: {
                periodic_seasons,
            },
        },
    };
}

/**
 * Shared shape expectations for every event object returned by create_season_events.
 */
function expectCommonEventShape(event) {
    expect(event).toHaveProperty('name');
    expect(event).toHaveProperty('description');
    expect(event).toHaveProperty('data');
    expect(event).toHaveProperty('event_category_id', '-1');
    expect(event).toHaveProperty('settings');

    // data sub-fields
    expect(event.data).toHaveProperty('has_duration', false);
    expect(event.data).toHaveProperty('duration', 0);
    expect(event.data).toHaveProperty('show_first_last', false);
    expect(event.data).toHaveProperty('connected_events');
    expect(event.data.connected_events).toEqual([]);
    expect(event.data).toHaveProperty('date');
    expect(event.data.date).toEqual([]);
    expect(event.data).toHaveProperty('conditions');

    // settings sub-fields
    expect(event.settings).toEqual({
        color: 'Green',
        text: 'text',
        hide: false,
        hide_full: false,
        print: false,
    });
}

// ===========================================================================
// COMPLEX MODE (complex = true)
// ===========================================================================

describe('create_season_events — complex mode', () => {
    it('returns exactly 4 events', () => {
        let result = create_season_events(true, undefined);
        expect(result).toHaveLength(4);
    });

    it('returns the correct event names in order', () => {
        let result = create_season_events(true, undefined);
        let names = result.map(e => e.name);
        expect(names).toEqual([
            'Summer Solstice',
            'Winter Solstice',
            'Spring Equinox',
            'Autumn Equinox',
        ]);
    });

    it('uses correct Season condition types (15, 16, 17, 18)', () => {
        let result = create_season_events(true, undefined);
        expect(result[0].data.conditions).toEqual([['Season', '15', ['1']]]);
        expect(result[1].data.conditions).toEqual([['Season', '16', ['1']]]);
        expect(result[2].data.conditions).toEqual([['Season', '17', ['1']]]);
        expect(result[3].data.conditions).toEqual([['Season', '18', ['1']]]);
    });

    it('Summer Solstice has limited_repeat: false', () => {
        let result = create_season_events(true, undefined);
        expect(result[0].data.limited_repeat).toBe(false);
        expect(result[0].data.limited_repeat_num).toBe(0);
    });

    it('Winter Solstice has limited_repeat: false', () => {
        let result = create_season_events(true, undefined);
        expect(result[1].data.limited_repeat).toBe(false);
        expect(result[1].data.limited_repeat_num).toBe(0);
    });

    it('Spring Equinox has limited_repeat: true with num 2', () => {
        let result = create_season_events(true, undefined);
        expect(result[2].data.limited_repeat).toBe(true);
        expect(result[2].data.limited_repeat_num).toBe(2);
    });

    it('Autumn Equinox has limited_repeat: true with num 2', () => {
        let result = create_season_events(true, undefined);
        expect(result[3].data.limited_repeat).toBe(true);
        expect(result[3].data.limited_repeat_num).toBe(2);
    });

    it('all events have the common event shape', () => {
        let result = create_season_events(true, undefined);
        for (let event of result) {
            expectCommonEventShape(event);
        }
    });

    it('all events have event_category_id of "-1"', () => {
        let result = create_season_events(true, undefined);
        for (let event of result) {
            expect(event.event_category_id).toBe('-1');
        }
    });

    it('does not read static_data at all (can pass undefined)', () => {
        // If it tried to read static_data, this would throw.
        expect(() => create_season_events(true, undefined)).not.toThrow();
        expect(() => create_season_events(true, null)).not.toThrow();
    });

    it('events have correct descriptions', () => {
        let result = create_season_events(true, undefined);
        expect(result[0].description).toContain('summer solstice');
        expect(result[1].description).toContain('winter solstice');
        expect(result[2].description).toContain('spring equinox');
        expect(result[3].description).toContain('autumn equinox');
    });
});

// ===========================================================================
// SIMPLE MODE — exactly 4 seasons
// ===========================================================================

describe('create_season_events — simple mode, 4 seasons', () => {
    it('returns 4 events for standard 4 seasons', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(4);
    });

    it('maps Winter → Winter Solstice', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
    });

    it('maps Spring → Spring Equinox', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].name).toBe('Spring Equinox');
    });

    it('maps Summer → Summer Solstice', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[2].name).toBe('Summer Solstice');
    });

    it('maps Autumn → Autumn Equinox', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('is case-insensitive — "WINTER" matches winter', () => {
        let sd = makeStaticData([
            { name: 'WINTER' },
            { name: 'SPRING' },
            { name: 'SUMMER' },
            { name: 'AUTUMN' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Spring Equinox');
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('is case-insensitive — lowercase matches', () => {
        let sd = makeStaticData([
            { name: 'winter' },
            { name: 'spring' },
            { name: 'summer' },
            { name: 'autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Spring Equinox');
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('partial matching — "The Long Winter" matches winter', () => {
        let sd = makeStaticData([
            { name: 'The Long Winter' },
            { name: 'The Beautiful Spring' },
            { name: 'The Hot Summer' },
            { name: 'The Colorful Autumn' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Spring Equinox');
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('custom season names that match no keyword use the season name directly', () => {
        let sd = makeStaticData([
            { name: 'Dry' },
            { name: 'Wet' },
            { name: 'Cold' },
            { name: 'Warm' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Dry');
        expect(result[1].name).toBe('Wet');
        expect(result[2].name).toBe('Cold');
        expect(result[3].name).toBe('Warm');
    });

    it('custom season names have empty descriptions', () => {
        let sd = makeStaticData([
            { name: 'Dry' },
            { name: 'Wet' },
            { name: 'Cold' },
            { name: 'Warm' },
        ]);
        let result = create_season_events(false, sd);
        for (let event of result) {
            expect(event.description).toBe('');
        }
    });

    it('conditions use Season type "0" (season index) AND "8" (season day)', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        for (let i = 0; i < 4; i++) {
            expect(result[i].data.conditions).toEqual([
                ['Season', '0', [i]],
                ['&&'],
                ['Season', '8', [1]],
            ]);
        }
    });

    it('season index [i] is correct for each event', () => {
        let sd = makeStaticData([
            { name: 'Alpha' },
            { name: 'Beta' },
            { name: 'Gamma' },
            { name: 'Delta' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].data.conditions[0][2]).toEqual([0]);
        expect(result[1].data.conditions[0][2]).toEqual([1]);
        expect(result[2].data.conditions[0][2]).toEqual([2]);
        expect(result[3].data.conditions[0][2]).toEqual([3]);
    });

    it('all events have common shape', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        for (let event of result) {
            expectCommonEventShape(event);
        }
    });

    it('all events have limited_repeat: false in 4-season simple mode', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(false, sd);
        for (let event of result) {
            expect(event.data.limited_repeat).toBe(false);
            expect(event.data.limited_repeat_num).toBe(0);
        }
    });

    it('mixed known/unknown season names in 4-season mode', () => {
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Monsoon' },
            { name: 'Summer' },
            { name: 'Harvest' },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Monsoon');
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Harvest');
    });
});

// ===========================================================================
// SIMPLE MODE — non-4 seasons (solstice + equinox path)
// ===========================================================================

describe('create_season_events — simple mode, non-4 seasons', () => {
    it('with 2 seasons (Winter, Summer) + periodic: generates 4 events (2 solstice + 2 equinox)', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        // Winter → solstice + equinox, Summer → solstice + equinox
        expect(result).toHaveLength(4);
    });

    it('with 2 seasons (Winter, Summer): solstice events have correct names', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[2].name).toBe('Summer Solstice');
    });

    it('with 2 seasons (Winter, Summer): equinox events have correct names', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].name).toBe('Spring Equinox');
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('equinox conditions use Math.floor(transition_length / 2)', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 91 },
            { name: 'Summer', transition_length: 100 },
        ]);
        let result = create_season_events(false, sd);
        // Winter equinox (index 1): Math.floor(91/2) = 45
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [45]]);
        // Summer equinox (index 3): Math.floor(100/2) = 50
        expect(result[3].data.conditions[2]).toEqual(['Season', '8', [50]]);
    });

    it('equinox conditions use correct season index', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        // Winter equinox → season index 0
        expect(result[1].data.conditions[0]).toEqual(['Season', '0', [0]]);
        // Summer equinox → season index 1
        expect(result[3].data.conditions[0]).toEqual(['Season', '0', [1]]);
    });

    it('when periodic_seasons is false: only solstice events, no equinoxes', () => {
        let sd = makeStaticData(
            [
                { name: 'Winter', transition_length: 90 },
                { name: 'Summer', transition_length: 90 },
            ],
            false, // periodic_seasons = false
        );
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Summer Solstice');
    });

    it('when periodic_seasons is true: both solstice and equinox events per season', () => {
        let sd = makeStaticData(
            [
                { name: 'Winter', transition_length: 90 },
                { name: 'Summer', transition_length: 90 },
            ],
            true,
        );
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(4);
        // pattern: solstice, equinox, solstice, equinox
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Spring Equinox');
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Autumn Equinox');
    });

    it('with 3 custom seasons + periodic: each gets solstice and equinox', () => {
        let sd = makeStaticData([
            { name: 'Dry', transition_length: 60 },
            { name: 'Wet', transition_length: 80 },
            { name: 'Mild', transition_length: 100 },
        ]);
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(6);
        expect(result[0].name).toBe('Dry Solstice');
        expect(result[1].name).toBe('Dry Equinox');
        expect(result[2].name).toBe('Wet Solstice');
        expect(result[3].name).toBe('Wet Equinox');
        expect(result[4].name).toBe('Mild Solstice');
        expect(result[5].name).toBe('Mild Equinox');
    });

    it('custom seasons have empty descriptions for both solstice and equinox', () => {
        let sd = makeStaticData([
            { name: 'Dry', transition_length: 60 },
            { name: 'Wet', transition_length: 80 },
        ]);
        let result = create_season_events(false, sd);
        // solstice events
        expect(result[0].description).toBe('');
        // equinox events
        expect(result[1].description).toBe('');
        expect(result[2].description).toBe('');
        expect(result[3].description).toBe('');
    });

    it('with 1 season + periodic: generates 2 events (solstice + equinox)', () => {
        let sd = makeStaticData([
            { name: 'Eternal', transition_length: 365 },
        ]);
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Eternal Solstice');
        expect(result[1].name).toBe('Eternal Equinox');
    });

    it('with 1 season + no periodic: generates 1 event (solstice only)', () => {
        let sd = makeStaticData(
            [{ name: 'Eternal', transition_length: 365 }],
            false,
        );
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Eternal Solstice');
    });

    it('solstice events use Season type "8" with value [1]', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        // Solstice event (index 0)
        expect(result[0].data.conditions[2]).toEqual(['Season', '8', [1]]);
    });

    it('all events have common shape', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);
        for (let event of result) {
            expectCommonEventShape(event);
        }
    });

    it('equinox with even transition_length: Math.floor(100/2) = 50', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 100 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [50]]);
    });

    it('equinox with odd transition_length: Math.floor(91/2) = 45', () => {
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 91 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [45]]);
    });

    it('equinox with transition_length of 1: Math.floor(1/2) = 0', () => {
        let sd = makeStaticData([
            { name: 'Custom', transition_length: 1 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [0]]);
    });
});

// ===========================================================================
// VAR HOISTING EDGE CASES — critical for var→let migration
// ===========================================================================

describe('create_season_events — var hoisting bugs in non-4-season branch', () => {
    // BUG DOCUMENTATION:
    //
    // In the non-4-seasons else branch, `equinox_name` and `equinox_description`
    // are only assigned in the `winter`, `summer`, and `else` (custom) branches.
    // The `autumn` and `spring` branches do NOT assign these variables.
    //
    // Because `var` is function-scoped and hoisted, when the loop reaches an
    // "autumn" or "spring" season, `equinox_name` and `equinox_description`
    // retain whatever value they had from the PREVIOUS iteration.
    //
    // This means:
    //   - If Autumn comes after Summer, its equinox event gets "Autumn Equinox"
    //     (Summer's equinox_name), which accidentally looks correct but for the
    //     wrong reason.
    //   - If Spring comes after Autumn, its equinox event ALSO gets "Autumn Equinox"
    //     (still leaked from the Summer iteration), which is WRONG.
    //
    // When converting `var` to `let`, these variables would become `undefined`
    // for autumn/spring seasons, which would change behavior.

    it('BUG: "Autumn" season equinox reuses previous iteration equinox_name from "Summer"', () => {
        // With periodic_seasons enabled, 5 seasons in order:
        // Winter (sets equinox_name="Spring Equinox")
        // Summer (sets equinox_name="Autumn Equinox")
        // Autumn (does NOT set equinox_name → leaks "Autumn Equinox" from Summer)
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 90 },
            { name: 'Autumn', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        // Events: Winter solstice, Winter equinox, Summer solstice, Summer equinox,
        //         Autumn solstice, Autumn equinox
        expect(result).toHaveLength(6);

        // Fixed: Autumn now explicitly sets equinox_name = "Winter Solstice"
        // (the astronomical event during autumn's transition to winter)
        expect(result[5].name).toBe('Winter Solstice');
        expect(result[5].description).toBe(
            'The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.'
        );
    });

    it('"Spring" season equinox is correctly set to "Summer Solstice"', () => {
        // Order: Summer, Spring
        // Spring now explicitly sets equinox_name = "Summer Solstice"
        let sd = makeStaticData([
            { name: 'Summer', transition_length: 90 },
            { name: 'Spring', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        expect(result).toHaveLength(4);

        // Fixed: Spring's equinox is "Summer Solstice" (the astronomical event
        // during spring's transition to summer)
        expect(result[3].name).toBe('Summer Solstice');
    });

    it('"Spring" after "Winter" gets correct equinox name', () => {
        // Order: Winter, Spring
        // Spring now explicitly sets equinox_name = "Summer Solstice"
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Spring', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        expect(result).toHaveLength(4);

        // Fixed: Spring's equinox is "Summer Solstice"
        expect(result[3].name).toBe('Summer Solstice');
        expect(result[3].description).toBe(
            'At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.'
        );
    });

    it('"Autumn" after "Winter" gets correct equinox name', () => {
        // Order: Winter, Autumn
        // Autumn now explicitly sets equinox_name = "Winter Solstice"
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Autumn', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        expect(result).toHaveLength(4);

        // Fixed: Autumn's equinox is "Winter Solstice"
        expect(result[3].name).toBe('Winter Solstice');
    });

    it('Custom season after Summer gets its own equinox_name (not leaked)', () => {
        // The else branch DOES set equinox_name, so custom seasons are safe.
        let sd = makeStaticData([
            { name: 'Summer', transition_length: 90 },
            { name: 'Rainy', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        expect(result).toHaveLength(4);

        // Custom season "Rainy" hits the else branch, which sets equinox_name properly
        expect(result[2].name).toBe('Rainy Solstice');
        expect(result[3].name).toBe('Rainy Equinox');
    });

    it('5-season sequence assigns correct equinox names for all seasons', () => {
        // Order: Winter, Summer, Autumn, Spring, Custom
        // Each season now explicitly sets its own equinox_name.
        let sd = makeStaticData([
            { name: 'Winter', transition_length: 90 },
            { name: 'Summer', transition_length: 80 },
            { name: 'Autumn', transition_length: 70 },
            { name: 'Spring', transition_length: 60 },
            { name: 'Fantasy', transition_length: 50 },
        ]);
        let result = create_season_events(false, sd);

        // 5 seasons × 2 events each (periodic=true) = 10 events
        expect(result).toHaveLength(10);

        // Winter(0): solstice="Winter Solstice", equinox="Spring Equinox"
        expect(result[0].name).toBe('Winter Solstice');
        expect(result[1].name).toBe('Spring Equinox');

        // Summer(1): solstice="Summer Solstice", equinox="Autumn Equinox"
        expect(result[2].name).toBe('Summer Solstice');
        expect(result[3].name).toBe('Autumn Equinox');

        // Autumn(2): solstice="Autumn Equinox", equinox="Winter Solstice"
        expect(result[4].name).toBe('Autumn Equinox');
        expect(result[5].name).toBe('Winter Solstice');

        // Spring(3): solstice="Spring Equinox", equinox="Summer Solstice"
        expect(result[6].name).toBe('Spring Equinox');
        expect(result[7].name).toBe('Summer Solstice');

        // Fantasy(4): solstice="Fantasy Solstice", equinox="Fantasy Equinox" (else branch)
        expect(result[8].name).toBe('Fantasy Solstice');
        expect(result[9].name).toBe('Fantasy Equinox');
    });

    it('equinox_description is correctly set for each season', () => {
        let sd = makeStaticData([
            { name: 'Summer', transition_length: 90 },
            { name: 'Autumn', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        // Autumn's equinox is "Winter Solstice" with the winter solstice description
        expect(result[3].description).toBe(
            'The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.'
        );
    });

    it('first iteration with Autumn correctly sets equinox', () => {
        // Autumn as the only season — now explicitly assigns equinox_name
        let sd = makeStaticData([
            { name: 'Autumn', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        // solstice + equinox = 2 events
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Autumn Equinox'); // solstice name

        // Fixed: Autumn now explicitly sets equinox_name = "Winter Solstice"
        expect(result[1].name).toBe('Winter Solstice');
        expect(result[1].description).toBe(
            'The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.'
        );
    });

    it('first iteration with Spring correctly sets equinox', () => {
        let sd = makeStaticData([
            { name: 'Spring', transition_length: 90 },
        ]);
        let result = create_season_events(false, sd);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Spring Equinox'); // solstice name for spring

        // Fixed: Spring now explicitly sets equinox_name = "Summer Solstice"
        expect(result[1].name).toBe('Summer Solstice');
    });
});

// ===========================================================================
// EDGE CASES
// ===========================================================================

describe('create_season_events — edge cases', () => {
    it('empty seasons array returns empty array', () => {
        let sd = makeStaticData([]);
        let result = create_season_events(false, sd);
        expect(result).toEqual([]);
    });

    it('5 seasons (non-4) without periodic_seasons returns 5 solstice-only events', () => {
        let sd = makeStaticData(
            [
                { name: 'Winter', transition_length: 73 },
                { name: 'Spring', transition_length: 73 },
                { name: 'Summer', transition_length: 73 },
                { name: 'Autumn', transition_length: 73 },
                { name: 'Monsoon', transition_length: 73 },
            ],
            false,
        );
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(5);
        // All are solstice events (no equinox since periodic_seasons is false)
        expect(result.map(e => e.name)).toEqual([
            'Winter Solstice',
            'Spring Equinox',   // Note: the "solstice" name for spring is "Spring Equinox" per the code
            'Summer Solstice',
            'Autumn Equinox',   // the "solstice" name for autumn is "Autumn Equinox" per the code
            'Monsoon Solstice',
        ]);
    });

    it('season with transition_length of 0: equinox day is Math.floor(0/2) = 0', () => {
        let sd = makeStaticData([
            { name: 'Custom', transition_length: 0 },
        ]);
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(2);
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [0]]);
    });

    it('large transition_length: equinox day calculation', () => {
        let sd = makeStaticData([
            { name: 'Custom', transition_length: 999 },
        ]);
        let result = create_season_events(false, sd);
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [499]]);
    });

    it('complex=true takes priority regardless of static_data contents', () => {
        // Even if static_data has 4 seasons, complex=true returns the hardcoded 4
        let sd = makeStaticData([
            { name: 'Winter' },
            { name: 'Spring' },
            { name: 'Summer' },
            { name: 'Autumn' },
        ]);
        let result = create_season_events(true, sd);
        expect(result).toHaveLength(4);
        // Verify these are the complex events (with Season types 15-18), not simple
        expect(result[0].data.conditions[0][1]).toBe('15');
    });

    it('non-4-season: events alternate solstice/equinox when periodic', () => {
        let sd = makeStaticData([
            { name: 'A', transition_length: 60 },
            { name: 'B', transition_length: 80 },
            { name: 'C', transition_length: 100 },
        ]);
        let result = create_season_events(false, sd);
        expect(result).toHaveLength(6);
        // Pattern: A solstice, A equinox, B solstice, B equinox, C solstice, C equinox
        expect(result[0].name).toBe('A Solstice');
        expect(result[1].name).toBe('A Equinox');
        expect(result[2].name).toBe('B Solstice');
        expect(result[3].name).toBe('B Equinox');
        expect(result[4].name).toBe('C Solstice');
        expect(result[5].name).toBe('C Equinox');
    });

    it('non-4-season: each equinox uses its own season transition_length', () => {
        let sd = makeStaticData([
            { name: 'A', transition_length: 10 },
            { name: 'B', transition_length: 20 },
            { name: 'C', transition_length: 31 },
        ]);
        let result = create_season_events(false, sd);
        // A equinox: Math.floor(10/2) = 5
        expect(result[1].data.conditions[2]).toEqual(['Season', '8', [5]]);
        // B equinox: Math.floor(20/2) = 10
        expect(result[3].data.conditions[2]).toEqual(['Season', '8', [10]]);
        // C equinox: Math.floor(31/2) = 15
        expect(result[5].data.conditions[2]).toEqual(['Season', '8', [15]]);
    });
});
