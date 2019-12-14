(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

function sorter(a, b) {
	if (a < b) return -1;  // any negative number works
	if (a > b) return 1;   // any positive number works
	return 0; // equal values MUST yield zero
}

class execution{

	start(){
		this.starttime = performance.now();
	}

	get end(){
		return `${precisionRound(performance.now() - this.starttime, 7)}ms`;
	}

}

var execution_time = {
	start: function(){
		this.starttime = performance.now();
	},
	end: function(){
		console.log(`${precisionRound(performance.now() - this.starttime, 7)}ms`);
	}
}

function fahrenheit_to_celcius(temp){

	return precisionRound((temp-32)*(5/9), 4);

}

function celcius_to_fahrenheit(temp){

	return precisionRound((temp*9/5)+32, 4);

}

function pick_from_table(chance, array, grow){

	var grow = grow !== undefined ? grow : false;
	var keys = Object.keys(array);
	var values = array;
	var target = 0;
	var index = 0;
	for(var index = 0; index < keys.length; index++){
		if(grow){
			target += values[keys[index]];
		}else{
			target = values[keys[index]];
		}
		if(chance <= target){
			return {
				'index': index,
				'key': keys[index],
				'value': values[keys[index]]
			};
		}
	}
	return false;

}

function matcher(params, data){

    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
		return data;
    }

    var terms = params.term.toUpperCase().split(" ")

    var children = [];

    for(var child_index in data.children){

    	var child = data.children[child_index];

    	var include = true;

    	term_loop:
    	for(var term_id in terms){

    		var term = terms[term_id];

    		var text = child.text.toUpperCase();

    		if(text.indexOf(term) == -1 && data.text.indexOf(term) == -1){
    			include = false;
    			break term_loop;
    		}

    	}

    	if(include){

    		children.push(child)

    	}

    }


    if(children.length > 0){

		var modifiedData = $.extend({}, data, true);

		modifiedData.children = children;

		return modifiedData;

    }

    // Return `null` if the term should not be displayed
    return null;
}


/**
 * This function crawls through a string to find a reference
 *
 * @param  {string}     data        A string that points to a location inside of the static_data object
 *                                  Formatted like: "static_data.year_data.timespans.1.interval"
 * @return {object}                 Returns a reference to the object found
 */
function get_calendar_data(data){
	data = data.split('.')
	if(data[0] !== ""){
		var current_calendar_data = static_data[data[0]];
		for(var i = 1; i < data.length; i++){
			current_calendar_data = current_calendar_data[data[i]];
		}
	}else{
		var current_calendar_data = static_data;
	}
	return current_calendar_data;
}



var entityMap1 = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

/**
 * This function is used to compare two javascript objects by iterating through its content.
 *
 * @param  {function}   func        The function to be called
 * @param  {int}        wait        The amount of time to wait in seconds
 * @param  {bool}       immediate   Whether the function should be called immediately (right now)
 */
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * This function is used to compare two javascript objects by iterating through its content.
 *
 * @param  {object}     obj1    A javascript object
 * @param  {object}     obj2    A javascript object
 * @return {bool}               A boolean indicating whether the two javascript objects are the same
 */
Object.compare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}

	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * This function is used to create a sting such as "1st", "3rd", "932nd", etc
 *
 * @param  {int}     i      An integer to turn into a string
 * @return {string}         A string of the number and "st", "nd", "rd", or "th"
 */
function ordinal_suffix_of(i){
	var j = i % 10,
	k = i % 100;
	if (j == 1 && k != 11){
		return i + "st";
	}
	if (j == 2 && k != 12){
		return i + "nd";
	}
	if (j == 3 && k != 13){
		return i + "rd";
	}
	return i + "th";
}

function replaceAt(string, index, replacement) {
	return string.substr(0, index) + replacement+ string.substr(index + replacement.length);
}


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
     * @return {float}          A pseudo-random value
     */
	rndUNorm(idx){
		return fract(43758.5453 * Math.sin(this.seed + (78.233 * idx)));
	}

    /**
     * This function returns a float between 0.0 and 1.0, based on the index you give it
     *
     * @param  {int}     idx    The index in the pseudo-random sequence
     * @return {float}          A pseudo-random value
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
     * @param  {float}   min    The minimum value
     * @param  {float}   max    The maximmum value
     * @return {float}          A pseudo-random value
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
     * @return {float}                  A pseudo-random value
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
     * @param  {float}   phase
     * @param  {float}   frequency
     * @param  {float}   amplitude
     * @return {float}                  A pseudo-random value
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

function bezierQuadratic(p0, p1, p2, t)
{
	// mix is linear interpolation, aka. linear bezier
	return lerp(
		lerp(p0, p1, t),
		lerp(p1, p2, t),
		t
	);
}
function  bezierCubic(p0, p1, p2, p3, t)
{
	return lerp(
		bezierQuadratic(p0, p1, p2, t),
		bezierQuadratic(p1, p2, p3, t),
		t
	);
}


/**
 * This function is used to clamp a floating point's fraction to a certain number of digits
 *
 * @param  {float}  number      The float to be precisio-rounded
 * @param  {int}    precision   An int to determine how many digits to keep in the fraction of the number
 * @return {float}              The precisio-rounded value
 */
function precisionRound(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}


/**
 * This function clamps a value between a min and a max
 *
 * @param  {float}  t       The value to be clamped
 * @param  {float}  pin     Minimum value
 * @param  {float}  max     Maximum value
 * @return {float}          The clamped value
 */
function clamp(t, min, max){
	return Math.min(Math.max(t, min), max);
}


/**
 * This function returns a value that has been lineraly interpolated between p0 and p1
 *
 * @param  {float}  p0      The first float
 * @param  {float}  p1      The second float
 * @param  {float}  t       A normalized value between 0.0 and 1.0, 0.0 returning p0 and 1.0 returning p1
 * @return {float}          The interpolated value
 */
function lerp(p0, p1, t){
	return p0 + t*(p1 - p0);
}


/**
 * This function returns the fraction of any given float.
 *
 * @param  {float}    float     The float
 * @return {float}              The fraction of that value
 */
function fract(float){
	return float - Math.floor(float);
}


/**
 * This function gets the middle value of the two given value
 *
 * @param  {float}    p0    The first value
 * @param  {float}    p1    The second value
 * @return {float}          The middle value
 */
function mid(p0, p1){
	return (p0+p1)/2;
}


/**
 * This function normalizes a value (v) between min and max
 *
 * @param  {float}  v       The value to be normalized
 * @param  {float}  min     The minimum value
 * @param  {float}  max     The maximum value
 * @return {float}          The normalized value
 */
function norm(v, min, max)
{
	return (v - min) / (max - min);
}

/**
 * This function normalizes a value (v) between min and max
 *
 * @param  {float}  v       The value to be normalized
 * @param  {float}  min     The minimum value
 * @param  {float}  max     The maximum value
 * @return {float}          The normalized value
 */
function inv_norm(v, min, max)
{
	return (max - v) / (max - min);
}


/**
 * Greatest common divisor is the largest positive integer that divides each of the integers.
 *
 * @param  {int}    x   The first number
 * @param  {int}    y   The second number
 * @return {int}        The greatest common divisor
 */
function gcd(x, y){
	return x ? gcd(y % x, x) : y;
}


/**
 * Least Common Multiple is the smallest positive integer that is divisible by both x and y.
 *
 * @param  {int}    x   The first number
 * @param  {int}    y   The second number
 * @return {int}        The least common multiple
 */
function lcm(x, y){
	if ((typeof x !== 'number') || (typeof y !== 'number'))
		return false;
	return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

/**
 * Least Common Multiple Offset (bool) will calculate whether two intervals with individual offsets will ever collide
 *
 * @param  {int}    x   The first interval
 * @param  {int}    y   The second interval
 * @param  {int}    a   The first interval's offset
 * @param  {int}    b   The second interval's offset
 * @return {bool}       Whether these two intervals will ever collide
 */
function lcmo_bool(x, y, a, b){
	return Math.abs(a - b) == 0 || Math.abs(a - b) % gcd(x, y) == 0;
}

/**
 * Least Common Multiple Offset will calculate whether two intervals with individual offsets will ever collide,
 * and return an object containing the starting point of their repitition and how often they repeat
 *
 * @param  {int}    x   The first interval
 * @param  {int}    y   The second interval
 * @param  {int}    a   The first interval's offset
 * @param  {int}    b   The second interval's offset
 * @return {object}		An object with the interval's  starting point and LCM
 */
function lcmo(x, y, a, b){

	// If they never repeat, return false
	if(!lcmo_bool(x, y, a, b)){
		return false;
	}

	// Store the respective interval's starting points
	x_start = (Math.abs(x + a) % x)
	y_start = (Math.abs(y + b) % y)

	// If the starts aren't the same, then we need to search for the first instance the intervals' starting points line up
	if(x_start != y_start){

		// Until the starting points line up, keep increasing them until they do
		while(x_start != y_start){

			while(x_start < y_start){
				x_start += x;
			}

			while(y_start < x_start){
				y_start += y;
			}

		}
	}

	return {
		"offset": x_start,
		"interval": lcm(x, y)
	}

}


/**
 * This function is used to calculate the suggested granularity for a given moon cycle.
 * The granularity is used to select the number of sprites that will be shown for that moon.
 *
 * @param  {float}  cycle   The cycle of a moon
 * @return {int}            The given level of granularity suggested for that cycle
 */
function get_moon_granularity(cycle){
	if(cycle >= 40){
		return 40;
	}else if(cycle >= 24){
		return 24;
	}else if(cycle >= 8){
		return 8;
	}else{
		return 4;
	}
}


class date_manager {

	constructor(year, timespan, day){

		this._year = convert_year(year);

		this._timespan = timespan;

		this._day = day;

		this.timespans_in_year = get_timespans_in_year(static_data, this.year, true);

	}

	compare(dynamic_data){

		var rebuild = dynamic_data.year != this.adjusted_year || (static_data.settings.show_current_month && dynamic_data != this.timespan);

		return {
			year: this.adjusted_year,
			timespan: this.timespan,
			day: this.day,
			epoch: this.epoch,
			rebuild: rebuild
		}
	}


	get epoch(){

		return evaluate_calendar_start(static_data, this.year, this.timespan, this.day).epoch;

	}

	get adjusted_year(){

		return unconvert_year(this.year);

	}

	get year(){
		return this._year;
	}

	set year(year){

		if(this.year == year) return;

		if(get_timespans_in_year(static_data, year, false).length != 0){
			this._year = year;
			this.timespans_in_year = get_timespans_in_year(static_data, this.year, true);
			this.cap_timespan();
		}else{
			if(year < this.year){
				this.year = year-1;
			}else if(year > this.year){
				this.year = year+1;
			}
		}

	}

	cap_timespan(){

		if(!this.timespans_in_year[this.timespan].result){
			this.add_timespan();
		}

	}

	get last_timespan(){


		for(var i = this.timespans_in_year.length-1; i >= 0; i--){
			if(this.timespans_in_year[i].result){
				return this.timespans_in_year[i].id
			}
		}

	}

	get first_timespan(){

		for(var i = 0; i < this.timespans_in_year.length-1; i++){
			if(this.timespans_in_year[i].result){
				return this.timespans_in_year[i].id
			}
		}

	}

	set timespan(timespan){

		if(timespan < 0){

			this.subtract_year();
			this.timespan = this.last_timespan;

		}else if(timespan > this.last_timespan){

			this.add_year()
			this.timespan = this.first_timespan;

		}else if(!this.timespans_in_year[timespan].result){

			if(timespan > this._timespan){
				this.timespan = timespan+1;
			}else if(timespan < this._timespan){
				this.timespan = timespan-1;
			}

		}else{
			this._timespan = timespan;
			this.cap_day();
		}

	}

	get timespan(){
		return this._timespan;
	}


	cap_day(){
		if(this.day > this.num_days){
			this.day = this.num_days;
		}
	}

	get num_days(){
		return get_days_in_timespan(static_data, this.year, this.timespan).length;
	}

	get day(){
		return this._day;
	}

	set day(day){

		this._day = day;

		if(this._day < 1){
			this.subtract_timespan()
			this._day = this.num_days;
		}else if(this._day > this.num_days){
			this.add_timespan()
			this._day = 1;
		}

	}

	add_year(){
		this.year++;
	}

	subtract_year(){
		this.year--;
	}


	add_timespan(){
		this.timespan++;
	}

	subtract_timespan(){
		this.timespan--;
	}


	add_day(){
		this.day++;
	}

	subtract_day(){
		this.day--;
	}

}




/**
 * This function is used to calculate the current cycle that the calendar is in on any given year.
 *
 * @param  {int}    year    A number of a year passed through the convert_year function.
 * @return {object}         Object containing:
 *                              "text" - The text to be displayed at the top of the calendar
 *                              "array" - An array containing each index (ints) that indicates which part of the cycle each of them is in
 */
function get_cycle(static_data, year){

	var text = {};
	var index_array = [];

	// If cycles are enabled
	if(static_data.cycles){

		// Define the index array
		var index_array = [];

		// Get the format

		// Loop through each cycle
		for(var index = 0; index < static_data.cycles.data.length; index++){

			var cycle = static_data.cycles.data[index];

			// Get the cycle length from the year
			var cycle_year = Math.floor(year / cycle.length);

			if (cycle_year < 0) cycle_year += Math.ceil(Math.abs(year) / cycle.names.length) * cycle.names.length;

			// Store the cycle index
			var cycle_index = (cycle_year + Math.floor(cycle.offset/cycle.length)) % cycle.names.length;

			// Get the name for this cycle
			var cycle_name = cycle.names[cycle_index];

			// Record the cycle index to the array
			index_array.push(cycle_index)
			text[(index+1).toString()] = cycle_name;
		}

	}

	return {'text': text,
			'array': index_array};
}


/**
 * This function is used to determine if a leap day appears on a given year.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            A number of a year passed through the convert_year function.
 * @param  {int}        Timespan        The index of the timespan
 * @param  {int}        leap_day        The index of the leap day
 * @return {bool}                       A boolean, indicating if the leap day appears on that month
 */
function does_leap_day_appear(static_data, year, timespan, leap_day){

	var timespan_appears = does_timespan_appear(static_data, year, timespan).result;

	var leap_day = static_data.year_data.leap_days[leap_day];

	return timespan_appears && is_leap(static_data, year, leap_day.interval, leap_day.offset);

}


/**
 * This function is used to convert a year to an absolute year, meaning that it will be converted to a mathematically safe number to be used in sensitive epoch calculations.
 * Most of the time, this means if the year is above 1, it will be subtracted by 1. If it's below 0, it will not be touched.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The a number of a year
 * @return {int}                        The absolute year
 */
function convert_year(year){
	return year > 0 ? year-1 : year;
}


/**
 * This function is used to convert a year to an absolute year, meaning that it will be converted to a mathematically safe number to be used in sensitive epoch calculations.
 * Most of the time, this means if the year is above 1, it will be subtracted by 1. If it's below 0, it will not be touched.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The a number of a year
 * @return {int}                        The absolute year
 */
function unconvert_year(year){
	return year >= 0 ? year+1 : year;
}



/**
 * This function is an experiment to see if I could solve the multi-offset LCM problem.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        Timespan_index  The index of a timespan
 * @param  {obj}        self_object     Not sure what this is for anymore, but I believe this was to be able to target specific leap days.
 * @return {array}                      An array containing strings for each day
 */
function get_days_in_timespan(static_data, year, timespan_index, self_object, no_leaps){

	self_object = self_object !== undefined ? self_object : false;
	no_leaps = no_leaps !== undefined ? no_leaps : false;

	var timespan = clone(static_data.year_data.timespans[timespan_index]);

	if(!timespan) return [];

	var days = [];

	for(var i = 1; i <= timespan.length; i++){
		days.push("");
	}

	if(no_leaps){
		return days;
	}

	var offset = 1;

	var leap_days = clone(static_data.year_data.leap_days).sort((a, b) => (a.day > b.day) ? 1 : -1);

	for(var leap_day_index = 0; leap_day_index < leap_days.length; leap_day_index++){

		var leap_day = leap_days[leap_day_index];

		if(leap_day.timespan === timespan_index){

			if(leap_day.intercalary){

				var is_there = does_day_appear(static_data, year, timespan_index, leap_day.day-1);

				if(is_there.result){

					if(self_object && Object.compare(leap_day, self_object)){

						self_object = false;

					}else{

						var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);

						if(leaping){

							days.splice(leap_day.day+offset, 0, `Intercalary "${leap_day.name}"`);

							offset++;
						}
					}


				}

			}else{

				var is_there = does_day_appear(static_data, year, timespan_index, i);

				if(is_there.result){

					if(self_object && Object.compare(leap_day, self_object)){

						self_object = false;

					}else{

						var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);

						if(leaping){

							days.push("");

						}
					}
				}
			}
		}
	}

	return days;

}


/**
 * This is used to get all of the timespans on a specific year to be used in timespan selection dropdowns.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {bool}       inclusive       Whether to still include timespans that aren't there (for use in timespan selection dropdowns)
 * @return {array}                      An array of objects, each object containing:
 *                                          result - boolean, true if the timespan appears on the given date
 *                                          reason - reason for the timespan to gone, only present if result is false
 */
function get_timespans_in_year(static_data, year, inclusive){

	var results = [];

	for(var timespan_index = 0; timespan_index < static_data.year_data.timespans.length; timespan_index++){

		var appears = does_timespan_appear(static_data, year, timespan_index);

		appears.id = timespan_index;

		if(appears.result || inclusive){

			results.push(appears);

		}
	}

	return results;

}


/**
 * This function is used to determine whether a specific timespan appears that year and timespan, as it may be gone due to an era or it may be leaping.
 * Used primarily in timespan dropdown lists to disable selection of those timespans and show that they are not present.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        Timespan        The index of the timespan
 * @return {object}                     An object containing:
 *                                          result - boolean, true if the timespan appears on the given date
 *                                          reason - reason for the timespan to gone, only present if result is false
 */
function does_timespan_appear(static_data, year, timespan){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == convert_year(era.date.year)-1){

			if(timespan > era.date.timespan){

				return {
					result: false,
					reason: 'era ended'
				}

			}

		}

	}

	var offset = (static_data.year_data.timespans[timespan].interval-static_data.year_data.timespans[timespan].offset+1)%static_data.year_data.timespans[timespan].interval;

	if((year+offset) % static_data.year_data.timespans[timespan].interval != 0){

		return {
			result: false,
			reason: 'leaping'
		}

	}else{

		return {
			result: true
		}

	}

}


/**
 * This function is used to determine whether a specific day appears that year and timespan, as it may be gone due to an era.
 * Used primarily in day dropdown lists to disable selection of those days and show that they are not present.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        Timespan        The index of the timespan
 * @param  {int}        day             The day in that timespan
 * @return {object}                     An object containing:
 *                                          result - boolean, true if the day appears on the given date
 *                                          reason - reason for the day to gone, only present if result is false
 */
function does_day_appear(static_data, year, timespan, day){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == convert_year(era.date.year)-1 && timespan == era.date.timespan && day > era.date.day){

			return {
				result: false,
				reason: 'era ended'
			}

		}

	}

	return {
		result: true
	}

}


/**
 * This function is used to calculate the average length of a year in the current calendar.
 *
 * @param  {object}     obj     A calendar static data object
 * @return {float}              The current calendar's average year length
 */
function fract_year_length(static_data){

	var length = 0;

	for(var i = 0; i < static_data.year_data.timespans.length; i++){
		length += static_data.year_data.timespans[i].length/static_data.year_data.timespans[i].interval;
	}

	for(var i = 0; i < static_data.year_data.leap_days.length; i++){

		var leap_day = static_data.year_data.leap_days[i];

		length += get_interval_fractions(leap_day.interval, leap_day.offset)

	}

	return precisionRound(length, 10);

}

/**
 * This function is used to calculate the average length of all of the months in the current calendar.
 * This is only used to display it to the user, mostly as a means for them to deduct the a moon's cycle length.
 *
 * @param  {object}     obj     A calendar static data object
 * @return {float}              The current calendar's average month length
 */
function avg_month_length(static_data){

	var length = 0;
	var num_months = 0;

	for(var i = 0; i < static_data.year_data.timespans.length; i++){

		if(static_data.year_data.timespans[i].type === 'month'){

			num_months++;

			length += static_data.year_data.timespans[i].length/static_data.year_data.timespans[i].interval;
		}
	}

	for(var i = 0; i < static_data.year_data.leap_days.length; i++){

		var leap_day = static_data.year_data.leap_days[i];

		length += get_interval_fractions(leap_day.interval, leap_day.offset)

	}

	return precisionRound(length/num_months, 10);

}

/**
 * This function is used when you need to clone a javascript object and leave no references tied to the original object
 *
 * @param  {object}     obj     A javascript object
 * @return {object}             An identical javascript object with no references tied to the incoming object
 */
function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * This object is used when calculating the difference between two calendar's dates.
 */
var date_converter = {

   /**
     * This function is used when you want to calculate the difference between two calendars' dates.
     *
     * @param  {object}     static_data         A calendar static data object, primary, to be used to calculate the secondary calendar's date
     * @param  {object}     inc_static_data     A calendar static data object, secondary, to be used to calculate its new date
     * @param  {object}     dynamic_data        A calendar dynamic data object, primary, to be used to calculate the secondary calendar's date
     * @param  {object}     inc_dynamic_data    A calendar dynamic data object, secondary, used only to adjust the outgoing date's timezone
     * @return {object}                         A calendar dynamic data object, adjusted from the primary calendar to be used on the secondary calendar
     */

	get_date: function(static_data, inc_static_data, dynamic_data, inc_dynamic_data){

		this.static_data = static_data;
		this.inc_static_data = inc_static_data;

		inc_minutes_per_day = this.inc_static_data.clock.hours * this.inc_static_data.clock.minutes;
		minutes_per_day = this.static_data.clock.hours * this.static_data.clock.minutes;

		time_fraction = minutes_per_day / inc_minutes_per_day;

		this.target_epoch = Math.floor(dynamic_data.epoch*time_fraction);


		var time = fract(this.target_epoch*time_fraction);

		var scaled_time = (dynamic_data.hour/this.static_data.clock.hours)+fract(dynamic_data.minute/this.static_data.clock.minutes)/this.static_data.clock.hours;

		var hour = 1+this.inc_static_data.clock.hours*fract(time+this.static_data.clock.hours)

		var minute = Math.floor(this.inc_static_data.clock.minutes*fract(hour));

		if(inc_dynamic_data.custom_location){
			var location = inc_tatic_data.seasons.locations[inc_dynamic_data.location];

			hour += location.settings.timezone.hour;
			minute += location.settings.timezone.minute;

			if(minute > inc_static_data.clock.minutes){
				hour += Math.floor(minute/inc_static_data.clock.minutes);
				minute = Math.floor(inc_static_data.clock.minutes*fract(Math.floor(minute/inc_static_data.clock.minutes)));
			}

			if(hour > inc_static_data.clock.hours){

				this.target_epoch += Math.floor(hour/inc_static_data.clock.hours);
				hour = Math.floor(inc_static_data.clock.hours*fract(Math.floor(hour/inc_static_data.clock.hours)));

			}

		}


		this.year = Math.floor(this.target_epoch / fract_year_length(this.inc_static_data))-10;
		this.timespan = 0;
		this.day = 1;

		this.loops = 0;

		while(this.loops < 1000){

			var first_suggested_epoch = evaluate_calendar_start(this.inc_static_data, this.year).epoch;

			if(first_suggested_epoch < this.target_epoch){
				this.year++;
			}else{
				this.year--;
				break;
			}

			this.loops++;

		}


		while(this.loops < 1000){

			if(!does_timespan_appear(this.inc_static_data, this.year, this.timespan).result){

				this.increase_month();

			}else{

				this.suggested_epoch = evaluate_calendar_start(this.inc_static_data, this.year, this.timespan).epoch;

				if(this.suggested_epoch < this.target_epoch){
					this.increase_month();
				}else{
					this.decrease_month();
					this.suggested_epoch = evaluate_calendar_start(this.inc_static_data, this.year, this.timespan).epoch;
					break;
				}

			}

			this.loops++;

		}

		while(this.loops < 1000){

			this.suggested_epoch = evaluate_calendar_start(this.inc_static_data, this.year, this.timespan, this.day).epoch;

			if(this.suggested_epoch != this.target_epoch){
				this.increase_day();
			}else{
				break;
			}

			this.loops++;

		}

		this.year = this.year >= 0 ? this.year+1 : this.year;

		return {
			"year": this.year,
			"timespan": this.timespan,
			"day": this.day,
			"epoch": this.suggested_epoch,
			"hour": hour,
			"minute": minute
		};

	},

	increase_day: function(){

		this.day++;

		if(this.day > this.timespan_length.length){

			this.increase_month();
			this.day = 1;

		}

		if(!this.timespan_length[this.day-1].is_there.result){
			this.day++;
		}

	},

	increase_month: function(){

		this.timespan++;

		if(this.timespan == this.inc_static_data.year_data.timespans.length){

			this.year++;
			this.timespan = 0;

		}

		if(!does_timespan_appear(this.inc_static_data, this.year, this.timespan).result){
			this.increase_month();
		}

		this.timespan_length = get_days_in_timespan(this.inc_static_data, this.year, this.timespan);

	},

	decrease_month: function(){

		this.timespan--;

		if(this.timespan < 0){

			this.year--;
			this.timespan = this.inc_static_data.year_data.timespans.length-1;

		}

		if(!does_timespan_appear(this.inc_static_data, this.year, this.timespan).result){
			this.decrease_month();
		}

		this.timespan_length = get_days_in_timespan(this.inc_static_data, this.year, this.timespan);

	}

}

/**
 * This function is used when you need to calculate if a leap day or a leap month has happened on any given year.
 *
 * @param  {string} intervals   A formatted string of ints, in this format: 400,!100,4 - Large to small, comma separating the intervals, ! in front of the int indicating an exclusive interval (subtracting). Could include a single number.
 * @param  {int}    offsets     An int used to offset the contextual starting point of the intervals - Interval of 10 and offset of 5 means this interval starts at 5, continuing to 15, 25, 35.
 * @return {object}             An object containing the leap days that are left over after stripping unessecary ones (100,10 would strip away 100, because 10 fits in that)
 */
function strip_intervals(_intervals, _offset){

	var intervals = _intervals.split(',')
	var processed = _intervals.split(',');

	// Remove all negators at the end of the intervals as they won't affect the overall interval occurrence
	while(processed[processed.length-1].indexOf("!") > -1){
		processed.splice(processed.length-1, 1)
		intervals.splice(intervals.length-1, 1)
	}

	for(var outer_index = 0; outer_index < intervals.length; outer_index++){

		var outer_interval_raw = intervals[outer_index];
		var outer_offset = outer_interval_raw.indexOf('+') > -1 ? 0 : _offset ;
		var outer_negator = outer_interval_raw.indexOf('!') > -1;
		var outer_interval = Number(outer_interval_raw.replace('!','').replace('+',''));
		outer_offset = outer_interval == 1 ? 0 : (outer_interval+outer_offset)%outer_interval;

		for(var inner_index = outer_index+1; inner_index < intervals.length; inner_index++){

			var inner_interval_raw = intervals[inner_index];
			var inner_offset = inner_interval_raw.indexOf('+') > -1 ? 0 : _offset;
			var inner_negator = inner_interval_raw.indexOf('!') > -1;
			var inner_interval = Number(inner_interval_raw.replace('!','').replace('+',''));
			inner_offset = inner_interval == 1 ? 0 : (inner_interval+inner_offset)%inner_interval;

			// Magic
			var data = lcmo(outer_interval, inner_interval, outer_offset, inner_offset);

			// If the intervals actually will meet at some point
			if(data){

				// But if the outer interval has the same LCM as the inner one, remove the outer interval, provided if neither or both are negators.
				if(outer_interval == data.interval && outer_offset == data.offset && ((!outer_negator && !inner_negator) || (outer_negator && inner_negator))){
					if(processed.indexOf(outer_interval_raw) > -1){
						processed.splice(processed.indexOf(outer_interval_raw), 1)
					}
					break;
				}

				// If they match, but the next
				if(outer_negator ^ inner_negator){
					break;
				}

			}else{

				// If the outer interval did not match the inner interval, and it is a negator, and there are no more intervals, remove this interval
				if(outer_index+2 >= intervals.length && outer_negator){

					if(processed.indexOf(outer_interval_raw) > -1){
						processed.splice(processed.indexOf(outer_interval_raw), 1)
					}

					break;
				}
			}
		}
	}

	var new_intervals = [];

	for(index in processed){

		var interval_raw = processed[index];
		var offset = interval_raw.indexOf('+') > -1 ? 0 : _offset;
		var negator = interval_raw.indexOf('!') > -1;
		var interval = Number(interval_raw.replace('!','').replace('+',''));
		offset = interval == 1 ? 0 : (interval+offset)%interval;

		new_intervals.push({
			interval: interval,
			offset: offset,
			negator: negator
		});

	}

	return new_intervals;

}



/**
 * This function is used when you need to calculate if a leap day or a leap month has happened on any given year.
 *
 * @param  {int}    year        The number of a year passed through the convert_year function.
 * @param  {string} intervals   A formatted string of ints, in this format: 400,!100,4 - Large to small, comma separating the intervals, ! in front of the int indicating an exclusive interval (subtracting). Could include a single number.
 * @param  {int}    offsets     An int used to offset the contextual starting point of the intervals - Interval of 10 and offset of 5 means this interval starts at 5, continuing to 15, 25, 35.
 * @return {bool}               A boolean determining whether this interval happens on the year
 */
function is_leap(static_data, _year, _intervals, _offset) {

	var intervals = strip_intervals(_intervals, _offset);

	for(index in intervals){

		var i = intervals[index];

		var year = unconvert_year(_year);

		if((year-i.offset) % i.interval == 0){
			return !i.negator;
		}

	}

	return false;

}


/**
 * This function is used when you need to calculate the fraction of an interval
 *
 * @param  {string} _intervals  A formatted string of ints, in this format: 400,!100,4 - Large to small, comma separating the intervals, + in front of the int indicating an interval not using the offset (defaulting to 0), ! in front of the int indicating an exclusive interval (subtracting). Could include a single number.
 * @param  {int}    _offset     An int used to offset the contextual starting point of the intervals. Interval of 10 and offset of 5 means this interval starts at 5, continuing to 15, 25, 35
 * @return {float}              A float of the fraction of days this interval will add up to each day
 */
function get_interval_fractions(_intervals, _offset){

	var intervals = strip_intervals(_intervals, _offset);

	var occurrences = 0;

	for(var outer_index = 0; outer_index < intervals.length; outer_index++){

		var outer = intervals[outer_index];

		if(!outer.negator){

			occurrences += 1 / outer.interval;

		}

		for(var inner_index = outer_index+1; inner_index < intervals.length; inner_index++){

			var inner = intervals[inner_index];

			var data = lcmo(outer.interval, inner.interval, outer.offset, inner.offset);

			if(data){

				if((outer.negator && !inner.negator) || (!outer.negator && !inner.negator)){

					occurrences -= 1 / data.interval;

				}else{

					occurrences += 1 / data.interval;

				}
			}
		}
	}

	return occurrences;

}


/**
 * This function is used when you need to calculate how often a leap day has appeared,
 * which the function will return as float indicating the number of days. The fractional
 * part of the value may be used to calculate the average year length.
 *
 * @param  {int}    _year       The number of a year passed through the convert_year function.
 * @param  {string} _intervals  A formatted string of ints, in this format: 400,!100,4 - Large to small, comma separating the intervals, + in front of the int indicating an interval not using the offset (defaulting to 0), ! in front of the int indicating an exclusive interval (subtracting). Could include a single number.
 * @param  {int}    _offset     An int used to offset the contextual starting point of the intervals. Interval of 10 and offset of 5 means this interval starts at 5, continuing to 15, 25, 35
 * @return {int}                An int of how many days this interval has added up to before that year
 */
function get_interval_occurrences(_year, _intervals, _offset){

	var intervals = strip_intervals(_intervals, _offset);

	var occurrences = 0;

	// If it is year 0, there has been no leap
	if(_year == 0){
		return 0;
	}

	for(var outer_index = 0; outer_index < intervals.length; outer_index++){

		var outer = intervals[outer_index];

		if(!outer.negator){

			var year = outer.offset > 0 ? _year-outer.offset+outer.interval : _year;

			var result = year / outer.interval;

			result = _year < 0 ? Math.ceil(result) : Math.floor(result);

			occurrences += result;

		}

		for(var inner_index = outer_index+1; inner_index < intervals.length; inner_index++){

			var inner = intervals[inner_index];

			var data = lcmo(outer.interval, inner.interval, outer.offset, inner.offset);

			if(data){

				var year = data.offset > 0 ? _year-data.offset+data.interval : _year;

				var result = year / data.interval;

				result = _year < 0 ? Math.ceil(result) : Math.floor(result);

				if((outer.negator && !inner.negator) || (!outer.negator && !inner.negator)){

					occurrences -= result;

				}else{

					occurrences += result;

				}

			}

		}

	}

	return occurrences;

}

/**
 * This function is the backbone of the calendar.
 *
 * @param  {object}     static_data     The calendar's static_data object.
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        month           The index of a timespan
 * @param  {int}        day             The day of a that timespan
 * @return {array}                      An array containing:
 *                                          0: Epoch - The number of days since year 1
 *                                          1: Intercalary - The number of intercalary days since year 1
 *                                          2: count_timespans - The amount of times each timespans has appeared year 1
 *                                          3: num_timespans - The total number of timespans since year 1
 *                                          4: total_week_num - The number of weeks since year 1
 */
function get_epoch(static_data, year, month, day){

	// Set up variables
	var epoch = 0;
	var month = !isNaN(month) ? month : 0;
	var day = !isNaN(day) ? day : 0;
	var intercalary = 0;
	var actual_year = year;
	var num_timespans = 0;
	var count_timespans = [];
	var total_week_num = 1;

	// Loop through each month
	for(timespan_index = 0; timespan_index < static_data.year_data.timespans.length; timespan_index++){

		// If the month index is lower than the month parameter, add a year so we can get the exact epoch for a month within a year
		if(timespan_index < month){
			year = actual_year+1;
		}else{
			year = actual_year;
		}

		// Get the current timespan's data
		var timespan = static_data.year_data.timespans[timespan_index];

		var offset = (timespan.interval-timespan.offset)%timespan.interval;

		// Get the fraction of that month's appearances
		var timespan_fraction = Math.floor((year + offset) / timespan.interval);

		// Get the number of weeks for that month (check if it has a custom week or not)
		if(!static_data.year_data.overflow){
			if(timespan.week){
				total_week_num += Math.abs(Math.floor((timespan.length * timespan_fraction)/timespan.week));
			}else{
				total_week_num += Math.abs(Math.floor((timespan.length * timespan_fraction)/static_data.year_data.global_week.length));
			}
		}

		// Count the number of times each month has appeared
		count_timespans[timespan_index] = Math.abs(timespan_fraction);

		// Add the month's length to the epoch, adjusted by its interval
		epoch += timespan.length * timespan_fraction;


		// If the month is intercalary, add it to the variable to be subtracted when calculating first day of the year
		if(timespan.type === "intercalary"){
			intercalary += timespan.length * timespan_fraction;
		}else{
			num_timespans += timespan_fraction;
		}

		// Loop through each leap day
		for(leap_day_index = 0; leap_day_index < static_data.year_data.leap_days.length; leap_day_index++){

			// Get the current leap day data
			var leap_day = static_data.year_data.leap_days[leap_day_index];

			var added_leap_day = 0;

			if(timespan_index === leap_day.timespan){

				added_leap_day = get_interval_occurrences(timespan_fraction, leap_day.interval, leap_day.offset);

				// If we have leap days days that are intercalary (eg, do not affect the flow of the static_data, add them to the overall epoch, but remove them from the start of the year week day selection)
				if(leap_day.intercalary || timespan.type === "intercalary"){
					intercalary += added_leap_day;
				}

			}

			epoch += added_leap_day;

		}

	}

	epoch += day;

	if(static_data.year_data.overflow){
		total_week_num += Math.floor((epoch-intercalary)/static_data.year_data.global_week.length);
	}

	return [epoch, intercalary, count_timespans, num_timespans, total_week_num];

}


/**
 * Further expands on the spine of the calendar calculation. It calculates how many days there has been since day 1, and returns a complex data object.
 *
 * @param  {object}     static_data     The calendar's static_data object.
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        month           The index of a timespan
 * @param  {int}        day             The day of a that timespan
 * @return {object}                     An object containing:
 *                                          "epoch" - The number of days since year 1
 *                                          "era_year" - The current era year, if the year count has been reset by eras terminating the year
 *                                          "week_day" - The weekday of that specific date
 *                                          "count_timespans" - The amount of times each timespans has appeared year 1
 *                                          "num_timespans" - The total number of timespans since year 1
 *                                          "total_week_num" - The number of weeks since year 1
 */
function evaluate_calendar_start(static_data, year, month, day){

	//Initiatlize variables
	var year = (year|0);
	var month = !isNaN(month) ? (month|0) : 0;
	var day = !isNaN(day) ? (day|0)-1 : 0;

	var era_year = unconvert_year(year);
	
	tmp = get_epoch(static_data, year, month, day);
	var epoch = tmp[0];
	var intercalary = tmp[1];
	var count_timespans = tmp[2];
	var num_timespans = tmp[3];
	var total_week_num = tmp[4];
	var era_years = []

	// For each era, check if they end the year, subtract the remaining days of that year from the epoch total so we can get proper start of the year
	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		era_years[era_index] = era.date.year;

		if(era.settings.ends_year && year > convert_year(era.date.year)){

			era_epoch = get_epoch(static_data, convert_year(era.date.year), era.date.timespan, era.date.day);
			normal_epoch_during_era = get_epoch(static_data, convert_year(era.date.year)+1);

			epoch -= (normal_epoch_during_era[0] - era_epoch[0]);

			intercalary -= (normal_epoch_during_era[1] - era_epoch[1]);
			for(var i = 0; i < normal_epoch_during_era[2].length; i++){
				count_timespans[i] = (normal_epoch_during_era[2][i] - era_epoch[2][i]);
			}

			num_timespans -= (normal_epoch_during_era[3] - era_epoch[3]);
			total_week_num -= (normal_epoch_during_era[4] - era_epoch[4]);

		}

		if(era.settings.restart && year > convert_year(era.date.year)){

			for(var i = 0; i < era_index; i++){

				var prev_era = static_data.eras[i];

				if(prev_era.settings.restart){

					era_years[era_index] -= era_years[i];

				}

			}

			era_year = era_year - era_years[era_index];

		}


	}

	epoch = year < 0 ? epoch+1 : epoch;

	// Calculate the start of week
	if(static_data.year_data.overflow){

		var week_day = (epoch-intercalary+(Number(static_data.year_data.first_day)-1)) % static_data.year_data.global_week.length;

		if (week_day < 0) week_day += static_data.year_data.global_week.length-1;

		week_day += 1;

	}else{
		var week_day = 1;
	}

	epoch = year < 0 ? epoch-1 : epoch;

	return {"epoch": epoch,
			"era_year": era_year,
			"week_day": week_day,
			"count_timespans": count_timespans,
			"num_timespans": num_timespans,
			"total_week_num": total_week_num
		};

}


/**
 * This simple function returns a bool whether any given year has an era that ends it. Used to prevent users to create two eras that end years in one year.
 *
 * @param  {object}     static_data     The calendar's static_data object.
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @return {bool}                       A boolean to indicate whether that year has been terminated by an era or not
 */
function has_year_ending_era(static_data, year){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == convert_year(era.date.year)){

			return true;

		}

	}

	return false;

}


