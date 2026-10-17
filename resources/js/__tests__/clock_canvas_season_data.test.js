// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import clockCanvasFactory from '../clock-canvas.js';

/**
 * The clock must render even when the calendar has NO seasons (so day-length /
 * sunrise-sunset can't be computed). In that case there is epoch data but no
 * `season` on it, so `has_season_data` must return falsy WITHOUT throwing —
 * `draw()` then skips the day/night arc and the clock renders as plain daytime.
 *
 * The bug: `current_epoch_data?.season.time.sunrise` only guarded
 * `current_epoch_data`, so a present epoch with `season === undefined` threw
 * "can't access property 'time', ...season is undefined".
 */
function makeClock(epochData) {
    const clock = clockCanvasFactory('clock');
    clock.$store = {
        calendar: {
            evaluated_static_data: { epoch_data: { 5: epochData } },
            preview_date: { epoch: 5 },
        },
    };
    return clock;
}

describe('clock_canvas.has_season_data with no seasons', () => {
    it('returns falsy (does not throw) when the epoch has no season', () => {
        const clock = makeClock({ year: 1 /* no `season` key */ });

        expect(() => clock.has_season_data).not.toThrow();
        expect(clock.has_season_data).toBeFalsy();
    });

    it('returns falsy when season has no time data', () => {
        const clock = makeClock({ season: {} /* no `time` */ });

        expect(() => clock.has_season_data).not.toThrow();
        expect(clock.has_season_data).toBeFalsy();
    });

    it('returns the sunrise value when season time data is present', () => {
        const clock = makeClock({
            season: { time: { sunrise: { data: 6 }, sunset: { data: 20 } } },
        });

        expect(clock.has_season_data).toEqual({ data: 6 });
        expect(clock.sunrise).toBe(6);
        expect(clock.sunset).toBe(20);
    });
});
