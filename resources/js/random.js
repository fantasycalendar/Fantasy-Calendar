/**
 * This class is used to generate a pseudo-random number based on a seed
 *
 * @param  {int}    seed    An int that initializes the pseudo-random generator
 */
class random {

	constructor(seed){
		this.seed = seed;
	}

    /**
     * This function returns a float between -1.0 and 1.0, based on the index you give it
     *
     * @param  {int}     idx    The index in the pseudo-random sequence
     * @return {Number}          A pseudo-random value
     */
	rndUNorm(idx){
		return fract(43758.5453 * Math.sin(this.seed + (78.233 * idx)));
	}

    /**
     * This function returns a float between 0.0 and 1.0, based on the index you give it
     *
     * @param  {int}     idx    The index in the pseudo-random sequence
     * @return {Number}          A pseudo-random value
     */
	rndSNorm(idx){
		return this.rndUNorm(idx) * 2.0 - 1.0;
	}


    /**
     * This function returns an integer between minimum and maximum, based on the index you give it
     *
     * @param  {int}     idx    The index in the pseudo-random sequence
     * @param  {int}     min    The minimum value
     * @param  {int}     max    The maximmum value
     * @return {int}            A pseudo-random value
     */
	random_int_between(idx, min, max){
		return Math.round(this.rndUNorm(idx) * (max - min) + min);
	}


    /**
     * This function returns a float between minimum and maximum, based on the index you give it
     *
     * @param  {int}     idx    The index in the pseudo-random sequence
     * @param  {Number}   min    The minimum value
     * @param  {Number}   max    The maximmum value
     * @return {Number}          A pseudo-random value
     */
	random_float_between(idx, min, max){
		return this.rndUNorm(idx) * (max - min) + min;
	}

    /**
     * This function returns an int depending on the dice formula you gave it, based on the index you give it
     * The forumla must be "ydx" where y and x are any absolute numbers above 0
     *
     * @param  {int}     idx            The index in the pseudo-random sequence
     * @param  {string}  dice_formula   The dice formula (eg. 2d6, 1d10, 2d20)
     * @return {Number}                  A pseudo-random value
     */
	roll_dice(idx, dice_formula){

		var dice_amount = (dice_formula.split('d')[0]|0);
		var dice_size = (dice_formula.split('d')[1]|0);

		var result = 0;
		for(var dice = 1; dice <= dice_amount; dice++){
			result += this.random_int_between(idx, 1, dice_size);
		}
		return result;
	}

    /**
     * This function returns a float between -1.0 and 1.0, along a noise curve set by the parameters below
     *
     * @param  {int}     pos            The position in the pseudo-random sequence
     * @param  {Number}   phase
     * @param  {Number}   frequency
     * @param  {Number}   amplitude
     * @return {Number}                  A pseudo-random value
     */
	noise(pos, phase, frequency, amplitude){

		// Generate a random curve moving horizontally and oscillating vertically. Curve consists of
		// segments made up of quadratic bezier curves. To keep those segments connected and smooth,
		// only center points of each segment are generated randomly (pPrev, pCurr, pNext). End points
		// of segment (p0 and p2) are computed as mid-points between 2 consecutive center points.

		// Position along infinite curve. Integer part is segment index, fractional part is position
		// within segment.
		var curvePos = pos * frequency + phase;
		var segmentIdx = Math.floor(curvePos);

		// Generate midpoints for current segment and it's neighbors.
		var pPrev = this.rndSNorm(segmentIdx - 1.0);
		var pCurr = this.rndSNorm(segmentIdx);
		var pNext = this.rndSNorm(segmentIdx + 1.0);

		// Compute control points for bezier curve segment and position within segment.
		var p0 = (pPrev + pCurr) * 0.5;
		var p1 = pCurr;
		var p2 = (pCurr + pNext) * 0.5;
		var t = fract(curvePos);

		// And resulting bezier curve value scaled by amplitude.
		return amplitude * bezierQuadratic(p0, p1, p2, t);

	}
}

module.exports = random;