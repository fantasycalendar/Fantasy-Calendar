import { describe, it, expect } from 'vitest';
import { Climate } from '../calendar/calendar_season_generator';

// ---------------------------------------------------------------------------
// Helpers
//
// evaluate_equinoxes() (and the get_time_data() it relies on) is DOM-free and
// reads only a small set of fields. We bypass the heavy Climate constructor with
// Object.create(Climate.prototype) and assign exactly those fields.
//
// Field cheat-sheet (verified against source lines 859-958):
//   this.static_data.clock.enabled  (gate)
//   this.static_data.clock.minutes  (minutes-per-hour, set 60)
//   this.start_epoch / this.end_epoch
//   this.low_solstice_epochs / this.high_solstice_epochs
//   this.middle_day_time
//   this.epoch_data[epoch].season = { season_index, season_precise_perc,
//                                      high_solstice, low_solstice }
//   this.current_location.seasons[i].time.sunrise = {hour, minute}
//   this.current_location.seasons[i].time.sunset  = {hour, minute}
//
// With season_precise_perc = 1, get_time_data() returns exactly the season's
// curr sunrise/sunset (lerp(next, curr, 1) === curr), so day length is fully
// deterministic: dayLength = sunset_hour - sunrise_hour (minutes set to 0).
// ---------------------------------------------------------------------------

const MIDDLE_DAY_TIME = 12;

/**
 * Build a season whose curr day length (sunset - sunrise) is exactly
 * `dayLength` hours. We centre the day around 13:00 to keep numbers clean.
 */
function makeSeason(dayLength) {
    const half = dayLength / 2;
    const sunriseHour = 13 - half;
    const sunsetHour = 13 + half;
    return {
        time: {
            sunrise: { hour: sunriseHour, minute: 0 },
            sunset: { hour: sunsetHour, minute: 0 },
        },
    };
}

/**
 * Build a Climate fixture.
 *
 * @param {number[]} dayLengths        per-epoch day length (epoch i uses index i)
 * @param {object}   opts
 * @param {number[]} opts.low          low_solstice_epochs
 * @param {number[]} opts.high         high_solstice_epochs
 */
function makeClimate(dayLengths, { low = [], high = [] } = {}) {
    const climate = Object.create(Climate.prototype);

    // One season per epoch, each pointed at by that epoch's season_index.
    const seasons = dayLengths.map(makeSeason);

    const epoch_data = {};
    dayLengths.forEach((_, i) => {
        epoch_data[i] = {
            season: {
                season_index: i,
                season_precise_perc: 1,
                high_solstice: high.includes(i),
                low_solstice: low.includes(i),
                // rising_equinox / falling_equinox default to false (unset).
            },
        };
    });

    Object.assign(climate, {
        static_data: { clock: { enabled: true, minutes: 60 } },
        start_epoch: 0,
        end_epoch: dayLengths.length,
        low_solstice_epochs: low,
        high_solstice_epochs: high,
        middle_day_time: MIDDLE_DAY_TIME,
        epoch_data,
        current_location: { seasons },
    });

    return climate;
}

describe('Climate.evaluate_equinoxes seed direction (I15)', () => {
    it('only-low: detects a RISING equinox crossing the mean before the low solstice', () => {
        // Day lengths rise through the mean (12) at epoch 2, low solstice at epoch 4.
        //   epoch 0: 10  (< 12)
        //   epoch 1: 11  (< 12)
        //   epoch 2: 13  (>= 12)  <- upward mean crossing -> rising equinox
        //   epoch 3: 14
        //   epoch 4: 10  low_solstice
        const climate = makeClimate([10, 11, 13, 14, 10], { low: [4], high: [] });

        climate.evaluate_equinoxes();

        // CORRECT behaviour: first solstice is a low -> seek rising -> epoch 2 marked.
        expect(climate.epoch_data[2].season.rising_equinox).toBe(true);
    });

    it('only-high: detects a FALLING equinox crossing the mean before the high solstice', () => {
        // Day lengths fall through the mean (12) at epoch 2, high solstice at epoch 4.
        //   epoch 0: 14
        //   epoch 1: 13
        //   epoch 2: 11  (<= 12)  <- downward mean crossing -> falling equinox
        //   epoch 3: 10
        //   epoch 4: 14  high_solstice
        const climate = makeClimate([14, 13, 11, 10, 14], { low: [], high: [4] });

        climate.evaluate_equinoxes();

        expect(climate.epoch_data[2].season.falling_equinox).toBe(true);
    });

    it('both-non-empty, low first: seeds rising and detects the upward crossing', () => {
        // low solstice (epoch 0) comes before high solstice (epoch 4).
        // After the low at epoch 0 we seek rising; upward crossing at epoch 2.
        //   epoch 0: 10  low_solstice
        //   epoch 1: 11
        //   epoch 2: 13  <- upward crossing -> rising equinox
        //   epoch 3: 14
        //   epoch 4: 14  high_solstice
        const climate = makeClimate([10, 11, 13, 14, 14], { low: [0], high: [4] });

        climate.evaluate_equinoxes();

        expect(climate.epoch_data[2].season.rising_equinox).toBe(true);
    });

    it('both-non-empty, high first: seeds falling and detects the downward crossing', () => {
        // high solstice (epoch 0) comes before low solstice (epoch 4).
        // After the high at epoch 0 we seek falling; downward crossing at epoch 2.
        //   epoch 0: 14  high_solstice
        //   epoch 1: 13
        //   epoch 2: 11  <- downward crossing -> falling equinox
        //   epoch 3: 10
        //   epoch 4: 10  low_solstice
        const climate = makeClimate([14, 13, 11, 10, 10], { low: [4], high: [0] });

        climate.evaluate_equinoxes();

        expect(climate.epoch_data[2].season.falling_equinox).toBe(true);
    });
});
