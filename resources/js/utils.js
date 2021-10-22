import Interval from "./fantasycalendar/Interval.js";

/**
 * Greatest common divisor is the largest positive integer that divides each of the integers.
 *
 * @param  {number}    x   The first number
 * @param  {number}    y   The second number
 * @return {number}        The greatest common divisor
 */
function gcd(x, y) {
    return x ? gcd(y % x, x) : y;
}


/**
 * Least Common Multiple is the smallest positive integer that is divisible by both x and y.
 *
 * @param  {number}    x           The first number
 * @param  {number}    y           The second number
 * @return {number}                The least common multiple
 */
function lcm(x, y) {
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

/**
 * Least Common Multiple Offset (bool) will calculate whether two intervals with individual offsets will ever collide
 *
 * @param  {Interval}    intervalA   The first interval
 * @param  {Interval}    intervalB   The second interval
 * @return {boolean}                 Whether these two intervals will ever collide
 */
export function lcmo_bool(intervalA, intervalB) {
    return Math.abs(intervalA.offset - intervalB.offset) === 0
        || Math.abs(intervalA.offset - intervalB.offset) % gcd(intervalA.interval, intervalB.interval) === 0;
}

/**
 * Least Common Multiple Offset will calculate whether two intervals with individual offsets will ever collide,
 * and return an object containing the starting point of their repetition and how often they repeat
 *
 * @param  {Interval}    intervalA   The first interval
 * @param  {Interval}    intervalB   The second interval
 * @return {object}	                 An object with the interval's  starting point and LCM
 */
export function lcmo(intervalA, intervalB) {

    // If they never repeat, return false
    if(!lcmo_bool(intervalA, intervalB)) {
        return false;
    }

    // Store the respective interval's starting points
    let x_start = (Math.abs(intervalA.interval + intervalA.offset) % intervalA.interval)
    let y_start = (Math.abs(intervalB.interval + intervalB.offset) % intervalB.interval)

    // If the starts aren't the same, then we need to search for the first instance the intervals' starting points line up
    if(x_start !== y_start) {

        // Until the starting points line up, keep increasing them until they do
        while(x_start !== y_start) {

            while(x_start < y_start) {
                x_start += intervalA.interval;
            }

            while(y_start < x_start) {
                y_start += intervalB.interval;
            }

        }
    }

    return new Interval(lcm(intervalA.interval, intervalB.interval), x_start);

}

/**
 * This function clamps a value between a min and a max
 *
 * @param  {Number}  t       The value to be clamped
 * @param  {Number}  min     Minimum value
 * @param  {Number}  max     Maximum value
 * @return {Number}          The clamped value
 */
export function clamp(t, min, max){
    return Math.min(Math.max(t, min), max);
}
