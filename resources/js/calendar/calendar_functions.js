// (function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

window.escapeHtml = function(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

window.unescapeHtml = function(safe) {
	if(!isNaN(safe)) return safe;
	return safe
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#039;/g, `'`)
}

class execution{

	start(){
		this.starttime = performance.now();
	}

	end(string){
		console.log(`${string !== undefined ? string + " " : ""}${precisionRound(performance.now() - this.starttime, 7)}ms`);
	}

}

var execution_time = {
	start: function(){
		this.starttime = performance.now();
	},
	end: function(string){
		console.log(`${string !== undefined ? string + " " : ""}${precisionRound(performance.now() - this.starttime, 7)}ms`);
	}
}

window.is_past_current_date = function(dynamic_data, year, timespan, day){

	if(year !== undefined && timespan !== undefined && day !== undefined){
		return (
			year > dynamic_data.year ||
			(year == dynamic_data.year && timespan > dynamic_data.timespan ||
				(year == dynamic_data.year && timespan == dynamic_data.timespan && day > dynamic_data.day)
			)
		)
	}else if(year !== undefined && timespan !== undefined && day === undefined){

		return (year > dynamic_data.year || (year == dynamic_data.year && timespan > dynamic_data.timespan))

	}else if(year !== undefined && timespan === undefined && day === undefined){

		return year > dynamic_data.year;

	}

}

window.get_colors_for_season = function(season_name) {
	let index = ['spring', 'summer', 'autumn', 'winter', 'fall'].indexOf(season_name.toLowerCase());
	if(index != -1) {
		if(index == 0) return "#1ee313";
		else if(index == 1) return "#e74d0e";
		else if(index == 2 || index == 4) return "#eabf14";
		else if(index == 3) return "#0bcfe9";
	} else {
		return "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
	}
}

window.fahrenheit_to_celcius = function(temp){

	return precisionRound((temp-32)*(5/9), 4);

}

window.celcius_to_fahrenheit = function(temp){

	return precisionRound((temp*9/5)+32, 4);

}

window.pick_from_table = function(chance, array, grow){

	var grow = grow !== undefined ? grow : false;
	var keys = Object.keys(array);
	var length = keys.length;
	var values = array;
	var target = 0;
	var index = 0;
	for(var index = 0; index < length; index++){
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

window.matcher = function(params, data){

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

window.truncate_weekdays = function(weekday_array){

	var new_array = [];

	for(var index in weekday_array){

		var name = weekday_array[index];

		if(!isNaN(Number(name))){

			new_array.push(name);

		}else if(is_roman_numeral(name)){

			new_array.push(name);

		}else{

			if(name.split(' ').length > 1 && name.split(' ')[1] != ""){
				name = name.split(' ')[0].substring(0,1) + name.split(' ')[1].substring(0,1);
			}else{
				name = name.substring(0,2);
			}

			new_array.push(name);

		}

	}

	return new_array;

}


window.is_roman_numeral = function(string){
	var regex = /^(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)$/i;

	return regex.test(string.toUpperCase());
}

/**
 * This function crawls through a string to find a reference
 *
 * @param  {string}     data        A string that points to a location inside of the static_data object
 *                                  Formatted like: "static_data.year_data.timespans.1.interval"
 * @return {object}                 Returns a reference to the object found
 */
window.get_calendar_data = function(data){
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

/**
 * This function is used to compare two javascript objects by iterating through its content.
 *
 * @param  {function}   func        The function to be called
 * @param  {int}        wait        The amount of time to wait in seconds
 * @param  {bool}       immediate   Whether the function should be called immediately (right now)
 */
window.debounce = function(func, wait, immediate) {
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

window.capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * This function is used to create a sting such as "1st", "3rd", "932nd", etc
 *
 * @param  {int}     i      An integer to turn into a string
 * @return {string}         A string of the number and "st", "nd", "rd", or "th"
 */
window.ordinal_suffix_of = function(i){
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

window.replaceAt = function(string, index, replacement) {
	return string.substr(0, index) + replacement+ string.substr(index + replacement.length);
}

window.mod = function(n, m) {
    return ((n % m) + m) % m;
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

window.bezierQuadratic = function(p0, p1, p2, t)
{
	// mix is linear interpolation, aka. linear bezier
	return lerp(
		lerp(p0, p1, t),
		lerp(p1, p2, t),
		t
	);
}
window. bezierCubic = function(p0, p1, p2, p3, t)
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
 * @param  {number}  number      The float to be precisio-rounded
 * @param  {number}  precision   An int to determine how many digits to keep in the fraction of the number
 * @return {number}              The precision-rounded value
 */
window.precisionRound = function(number, precision) {
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
window.clamp = function(t, min, max){
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
window.lerp = function(p0, p1, t){
	return p0 + t*(p1 - p0);
}


/**
 * This function returns the fraction of any given float.
 *
 * @param  {float}    float     The float
 * @return {float}              The fraction of that value
 */
window.fract = function(float){
	return float - Math.floor(float);
}


/**
 * This function gets the middle value of the two given value
 *
 * @param  {float}    p0    The first value
 * @param  {float}    p1    The second value
 * @return {float}          The middle value
 */
window.mid = function(p0, p1){
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
window.norm = function(v, min, max)
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
window.inv_norm = function(v, min, max)
{
	return (max - v) / (max - min);
}


/**
 * This function is used to calculate the suggested granularity for a given moon cycle.
 * The granularity is used to select the number of sprites that will be shown for that moon.
 *
 * @param  {float}  cycle   The cycle of a moon
 * @return {int}            The given level of granularity suggested for that cycle
 */
window.get_moon_granularity = function(cycle){
	if(cycle >= 40){
		return 40;
	}else if(cycle >= 24){
		return 24;
	}else if(cycle >= 16){
		return 16;
	}else if(cycle >= 8){
		return 8;
	}else{
		return 4;
	}
}

window.get_current_era = function(static_data, epoch){

	if(static_data.eras === undefined || static_data.eras.length == 0){
		return -1;
	}

	let current_era = -1;

	// Find eras within this year
	for(var i = static_data.eras.length-1; i >= 0; i--){

		var era = static_data.eras[i];

		if(!era.settings.starting_era && epoch >= era.date.epoch){

			current_era = i;
			break

		}

	}

	if(current_era == -1 && static_data.eras[0].settings.starting_era){
		current_era = 0;
	}

	return current_era;

}


export class date_manager {

	constructor(year, timespan, day){

		this._year = convert_year(static_data, year);

		this._timespan = timespan;
		this._day = day;

		this._max_year = false;
		this._max_timespan = false;
		this._max_day = false;

		this.timespans_in_year = get_timespans_in_year(static_data, this.year, true);

	}

	compare(data){

		var rebuild = data.year != this.adjusted_year || (static_data.settings.show_current_month && data.timespan != this.timespan);

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

	update_epoch(){
		this.epoch = evaluate_calendar_start(static_data, this.year, this.timespan, this.day).epoch;
	}

	get adjusted_year(){

		return unconvert_year(static_data, this.year);

	}

	set max_year(year){
		this._max_year = convert_year(static_data, year);
	}

	get max_year(){
		return this._max_year;
	}

	check_max_year(year){

		if(this.max_year === false){
			return true;
		}

		return this.max_year >= year;
	}

	set max_timespan(timespan){
		this._max_timespan = timespan;
	}

	get max_timespan(){
		return this._max_timespan;
	}

	check_max_timespan(timespan){

		if(this.max_timespan === false){
			return true;
		}

		if(this.max_year > this.year){
			return true;
		}

		return this.max_timespan >= timespan;
	}

	set max_day(day){
		this._max_day = day;
	}

	get max_day(){
		return this._max_day;
	}

	check_max_day(day){

		if(this.max_day === false){
			return true;
		}

		if(this.max_year > this.year || (this.max_year == this.year && this.max_timespan > this.timespan)){
			return true;
		}

		return this.max_day >= day;
	}

	get last_valid_year(){

		if(this.max_year){
			return unconvert_year(static_data, this.max_year);
		}else{
			return false;
		}

	}

	get last_valid_timespan(){

		if(this.max_year > this.year){
			return Infinity;
		}else{
			return this.max_timespan;
		}

	}

	get last_valid_day(){

		if(this.max_year > this.year || (this.max_year == this.year && this.max_timespan > this.timespan)){
			return Infinity;
		}else{
			return this.max_day;
		}

	}

	get year(){
		return this._year;
	}

	set year(year){

		if(year === undefined) return;

		if(this.year == year || !this.check_max_year(year)) return;

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

		if(this.timespan >= this.timespans_in_year.length){
			this.timespan = this.last_timespan.length-1;
		}

		if(!this.timespans_in_year[this.timespan].result || this.day > this.num_days){
			this.timespan = this.last_timespan;
			this.day = this.num_days;
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

		if(timespan === undefined) return;

		if(!this.check_max_timespan(timespan)) return;

		if(timespan < 0){

			this.subtract_year();
			this.timespan = this.last_timespan;

		}else if(timespan > this.last_timespan){

			this.add_year();
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
		if(!this.check_max_day(this.day)){
			this.day = this.max_day;
		}else if(this.day > this.num_days){
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

		if(day === undefined) return;

		if(!this.check_max_day(day)) return;

		this._day = day;

		if(this._day < 1){
			this.subtract_timespan()
			this._day = this.num_days;
		}else if(this._day > this.num_days){
			this.add_timespan();
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

window.valid_preview_date = function(year, timespan, day){

    if(!static_data.settings.allow_view){
        return false;
	}

	if(static_data.settings.only_reveal_today){

		if(year > dynamic_data.year){
			return false;
		}

		if(year === dynamic_data.year){
			if(timespan > dynamic_data.timespan){
				return false;
			}

			if(timespan === dynamic_data.timespan && day > dynamic_data.day){
				return false;
			}
		}

	}else if(static_data.settings.only_backwards){

        if(!static_data.settings.show_current_month && year > dynamic_data.year){
			return false;
        }

        if(year >= dynamic_data.year) {
            if (timespan > dynamic_data.timespan) {
                return false;
            }
            if (timespan === dynamic_data.timespan && day > dynamic_data.day) {
                return false;
            }
        }
    }

    return true;

}


/**
 * This function is used to calculate the current cycle that the calendar is in on any given year.
 *
 * @param  {int}    year    A number of a year passed through the convert_year function.
 * @return {object}         Object containing:
 *                              "text" - The text to be displayed at the top of the calendar
 *                              "array" - An array containing each index (ints) that indicates which part of the cycle each of them is in
 */
window.get_cycle = function(static_data, epoch_data){

	var text = {
		"n": "<br>"
	};

	var index_array = [];

	// If cycles are enabled
	if(static_data.cycles){

		// Define the index array
		var index_array = [];

		// Loop through each cycle
		for(var index = 0; index < static_data.cycles.data.length; index++){

			var cycle = static_data.cycles.data[index];

			var cycle_type = cycle.type ? cycle.type : "year";

			var cycle_epoch_data = epoch_data[cycle_type];

			if(cycle_type == "day"){
				cycle_epoch_data--;
			}else if(cycle_type == "year day"){
				cycle_epoch_data--;
			}else if(cycle_type == "year"){
				cycle_epoch_data = convert_year(static_data, cycle_epoch_data);
			}

			// Get the cycle length from the year
			var cycle_num = Math.floor(cycle_epoch_data / cycle.length);

			if (cycle_num < 0) cycle_num += Math.ceil(Math.abs(cycle_epoch_data) / cycle.names.length) * cycle.names.length;

			// Store the cycle index
			var cycle_index = (cycle_num + Math.floor(cycle.offset/cycle.length)) % cycle.names.length;

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
 * @param  {int}        timespan_index  The index of the timespan
 * @param  {int}        leap_day_index  The index of the leap day
 * @return {bool}                       A boolean, indicating if the leap day appears on that month
 */
window.does_leap_day_appear = function(static_data, year, timespan_index, leap_day_index){

	let timespan_appears = does_timespan_appear(static_data, year, timespan_index).result;

	let leap_day = static_data.year_data.leap_days[leap_day_index];

	let timespan = static_data.year_data.timespans[timespan_index];

	let timespan_occurrences = get_timespan_occurrences(static_data, year, timespan.interval, timespan.offset);

	return timespan_appears && IntervalsCollection.make(leap_day).intersectsYear(timespan_occurrences, static_data.settings.year_zero_exists);

}


/**
 * This function is used to convert a year to an absolute year, meaning that it will be converted to a mathematically safe number to be used in sensitive epoch calculations.
 * Most of the time, this means if the year is above 1, it will be subtracted by 1. If it's below 0, it will not be touched.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The a number of a year
 * @return {int}                        The absolute year
 */
window.convert_year = function(static_data, year){
	if(static_data.settings.year_zero_exists){
		return year;
	}else{
		return year > 0 ? year-1 : year;
	}
}


/**
 * This function is used to convert a year to an absolute year, meaning that it will be converted to a mathematically safe number to be used in sensitive epoch calculations.
 * Most of the time, this means if the year is above 1, it will be subtracted by 1. If it's below 0, it will not be touched.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The a number of a year
 * @return {int}                        The absolute year
 */
window.unconvert_year = function(static_data, year){
	if(static_data.settings.year_zero_exists){
		return year;
	}else{
		return year >= 0 ? year+1 : year;
	}
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
window.get_days_in_timespan = function(static_data, year, timespan_index, self_object, no_leaps, special){

	self_object = self_object !== undefined ? self_object : false;
	no_leaps = no_leaps !== undefined ? no_leaps : false;

	var timespan = clone(static_data.year_data.timespans[timespan_index]);

	if(!timespan) return [];

	var days = [];

	for(var i = 1; i <= timespan.length; i++){
		var appears = does_day_appear(static_data, year, timespan_index, i);
		if(appears.result || special){
			days.push({ normal_day: true });
		}
	}

	var day = i;

	if(no_leaps){
		return days;
	}

	var offset = 0;

	var leap_days = clone(static_data.year_data.leap_days);

	for(var leap_day_index = 0; leap_day_index < leap_days.length; leap_day_index++){
		leap_days[leap_day_index].index = leap_day_index;
	}

	leap_days.sort((a, b) => (a.day > b.day) ? 1 : -1);

	for(var index = 0; index < leap_days.length; index++){

		var leap_day_index = leap_days[index].index;
		var leap_day = static_data.year_data.leap_days[leap_day_index];

		if(self_object && Object.compare(leap_day, self_object)){

			self_object = false;

		}else if(leap_day.timespan === timespan_index){

			if(leap_day.intercalary && timespan.type != 'intercalary'){

				var is_there = does_day_appear(static_data, year, timespan_index, leap_day.day-1);

				if(is_there.result || special){

					var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);

					if(leaping){

						days.splice(leap_day.day + offset, 0, { normal_day: false, text: `${leap_day.name}`, not_numbered: leap_day.not_numbered });
						day++;
						offset++;

					}

				}

			}else{

				var is_there = does_day_appear(static_data, year, timespan_index, i);

				if(is_there.result || special){

					var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);

					if(leaping){

						days.push({ normal_day: true });
						day++;

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
window.get_timespans_in_year = function(static_data, year, inclusive){

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
 * @param  {int}        timespan        The index of the timespan
 * @return {object}                     An object containing:
 *                                          result - boolean, true if the timespan appears on the given date
 *                                          reason - reason for the timespan to gone, only present if result is false
 */
window.does_timespan_appear = function(static_data, year, timespan){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

        if(era.settings.starting_era) continue;

		if(era.settings.ends_year && year === convert_year(static_data, era.date.year)){

			if(timespan > era.date.timespan){

				return {
					result: false,
					reason: 'era ended'
				}

			}

		}

	}

	const timespan_obj = static_data.year_data.timespans[timespan];

	if(is_leap_simple(static_data, year, timespan_obj.interval, timespan_obj.offset)){

		return {
			result: true
		}

	}else{

		return {
			result: false,
			reason: 'leaping'
		}

	}

}


/**
 * This function is used to determine whether a specific day appears that year and timespan, as it may be gone due to an era.
 * Used primarily in day dropdown lists to disable selection of those days and show that they are not present.
 *
 * @param  {object}     static_data     A calendar static data object
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        timespan        The index of the timespan
 * @param  {int}        day             The day in that timespan
 * @return {object}                     An object containing:
 *                                          result - boolean, true if the day appears on the given date
 *                                          reason - reason for the day to gone, only present if result is false
 */
window.does_day_appear = function(static_data, year, timespan, day){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

        if(era.settings.starting_era) continue;

		if(era.settings.ends_year && year == convert_year(static_data, era.date.year) && timespan == era.date.timespan && day > era.date.day){

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
 * @param  {object}    static_data     A calendar static data object
 * @return {float}                     The current calendar's average year length
 */
window.avg_year_length = function(static_data){

	let avg_length = 0;

	for(let timespan_index = 0; timespan_index < static_data.year_data.timespans.length; timespan_index++){

		let timespan = static_data.year_data.timespans[timespan_index];

		avg_length += timespan.length/timespan.interval;

		for(let leap_day_index = 0; leap_day_index < static_data.year_data.leap_days.length; leap_day_index++){

			let leap_day = static_data.year_data.leap_days[leap_day_index];

			if(leap_day.timespan === timespan_index){

				avg_length += IntervalsCollection.make(leap_day).totalFraction;

			}
		}
	}

	return precisionRound(avg_length, 10);

}

/**
 * This function is used to calculate the average length of all of the months in the current calendar.
 * This is only used to display it to the user, mostly as a means for them to deduct the a moon's cycle length.
 *
 * @param  {object}     static_data     A calendar static data object
 * @return {number}                     The current calendar's average month length
 */
window.avg_month_length = function(static_data){

	let length = 0;
	let num_months = 0;

	for(let i = 0; i < static_data.year_data.timespans.length; i++){

		if(static_data.year_data.timespans[i].type === 'month'){

			num_months++;

			length += static_data.year_data.timespans[i].length/static_data.year_data.timespans[i].interval;

		}
	}

	for(let i = 0; i < static_data.year_data.leap_days.length; i++){

		const leap_day = static_data.year_data.leap_days[i];

        const interval = IntervalsCollection.make(leap_day);

        length += interval.totalFraction

	}

	const average_month_length = precisionRound(length / num_months, 10);

    return average_month_length ?? 0;

}

/**
 * This function is used when you need to clone a javascript object and leave no references tied to the original object
 *
 * @param  {object}     obj     A javascript object
 * @return {object}             An identical javascript object with no references tied to the incoming object
 */
window.clone = function(obj) {
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

window.time_data_to_string = function(static_data, time){

	var minutes = (Math.round(fract(time)*this.static_data.clock.minutes)).toString().length < 2 ? "0"+(Math.round(fract(time)*this.static_data.clock.minutes)).toString() : (Math.round(fract(time)*this.static_data.clock.minutes));

	return Math.floor(time)+":"+minutes;

}

window.is_leap_simple = function(static_data, year, interval, offset, debug) {

    if(interval === 1) return true;

    let cleanYear = unconvert_year(static_data, year);

    let mod = cleanYear - (offset % interval);

    if(cleanYear < 0 && !static_data.settings.year_zero_exists) mod++;

    return mod % interval === 0;

}

window.get_timespan_occurrences = function(static_data, year, interval, offset){

    if(interval === 1) return year;

    let boundOffset = offset % interval;

    if(static_data.settings.year_zero_exists) {

        return Math.ceil((year - boundOffset) / interval);

    }else if(year < 0) {

        let timespan_occurrences = Math.ceil((year - (boundOffset-1)) / interval);

        if(boundOffset === 0){
            timespan_occurrences--;
        }

        return timespan_occurrences;

    }else if(boundOffset > 0){

        return Math.floor((year + interval - boundOffset) / interval);

    }

    return Math.floor(year / interval);

}

/**
 * This function is the backbone of the calendar.
 *
 * @param  {object}     static_data     The calendar's static_data object.
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @param  {int}        _timespan       The index of a timespan
 * @param  {int}        _day            The day of a that timespan
 * @param  {boolean}    debug           A boolean flag set to true used in the initial calendar setup for debugging
 * @return {array}                      An array containing:
 *                                          0: Epoch - The number of days since year 1
 *                                          1: Intercalary - The number of intercalary days since year 1
 *                                          2: count_timespans - The amount of times each timespans has appeared year 1
 *                                          3: num_timespans - The total number of timespans since year 1
 *                                          4: total_week_num - The number of weeks since year 1
 */
window.get_epoch = function(static_data, year, _timespan, _day, debug){

	// Set up variables
	let epoch = 0;
	let timespan = !isNaN(_timespan) ? _timespan : 0;
	let day = !isNaN(_day) ? _day : 0;
	let intercalary = 0;
	let actual_year = year;
	let num_timespans = 0;
	let count_timespans = [];
	let total_week_num = 1;

	// Loop through each timespan
	for(let timespan_index = 0; timespan_index < static_data.year_data.timespans.length; timespan_index++){

		// If the timespan index is lower than the timespan parameter, add a year so we can get the exact epoch for a timespan within a year
		if(timespan_index < timespan){
			year = actual_year+1;
		}else{
			year = actual_year;
		}

		// Get the current timespan's data
		let timespan_obj = static_data.year_data.timespans[timespan_index];

        let timespan_occurrences = get_timespan_occurrences(static_data, year, timespan_obj.interval, timespan_obj.offset);

		// Get the number of weeks for that month (check if it has a custom week or not)
		if(!static_data.year_data.overflow){
			if(timespan_obj.week){
				total_week_num += Math.abs(Math.floor((timespan_obj.length * timespan_occurrences)/timespan_obj.week.length));
			}else{
				total_week_num += Math.abs(Math.floor((timespan_obj.length * timespan_occurrences)/static_data.year_data.global_week.length));
			}
		}

		// Count the number of times each month has appeared
		count_timespans[timespan_index] = Math.abs(timespan_occurrences);

		// Add the month's length to the epoch, adjusted by its interval
		epoch += timespan_obj.length * timespan_occurrences;

		// If the month is intercalary, add it to the variable to be subtracted when calculating first day of the year
		if(timespan_obj.type === "intercalary"){
			intercalary += timespan_obj.length * timespan_occurrences;
		}

		num_timespans += timespan_occurrences;

		// Loop through each leap day
		for(let leap_day_index = 0; leap_day_index < static_data.year_data.leap_days.length; leap_day_index++){

			// Get the current leap day data
			const leap_day = static_data.year_data.leap_days[leap_day_index];

			if(timespan_index === leap_day.timespan){

			    const interval = IntervalsCollection.make(leap_day);

				const leap_day_occurrences = interval.occurrences(timespan_occurrences, static_data.settings.year_zero_exists);

				// If we have leap days days that are intercalary (eg, do not affect the flow of the static_data, add them to the overall epoch, but remove them from the start of the year week day selection)
				if(leap_day.intercalary || timespan_obj.type === "intercalary"){
					intercalary += leap_day_occurrences;
				}

                epoch += leap_day_occurrences;

			}

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
 * @param  {int}        _year           The number of a year passed through the convert_year function.
 * @param  {int}        _timespan       The index of a timespan
 * @param  {int}        _day            The day of a that timespan (1 indexed)
 * @param  {bool}       debug           Whether debugging is enabled
 * @return {object}                     An object containing:
 *                                          "epoch" - The number of days since year 1
 *                                          "era_year" - The current era year, if the year count has been reset by eras terminating the year
 *                                          "week_day" - The weekday of that specific date
 *                                          "count_timespans" - The amount of times each timespans has appeared year 1
 *                                          "num_timespans" - The total number of timespans since year 1
 *                                          "total_week_num" - The number of weeks since year 1
 */
window.evaluate_calendar_start = function(static_data, _year, _timespan, _day, debug){

	//Initiatlize variables
	let year = (_year|0);
	let timespan = !isNaN(_timespan) ? (_timespan|0) : 0;
	let day = !isNaN(_day) ? (_day|0)-1 : 0;

	let era_year = (_year|0);

	let tmp = get_epoch(static_data, year, timespan, day, debug);
	let epoch = tmp[0];
	let intercalary = tmp[1];
	let count_timespans = tmp[2];
	let num_timespans = tmp[3];
	let total_week_num = tmp[4];
	let era_years = [];
	let current_era = -1;

	// For each era, check if they end the year, subtract the remaining days of that year from the epoch total so we can get proper start of the year
	for(let era_index = 0; era_index < static_data.eras.length; era_index++){

		let era = static_data.eras[era_index];

        if(era.settings.starting_era) continue;

		if(era.settings.ends_year && year > convert_year(static_data, era.date.year)){

			let era_epoch = get_epoch(static_data, convert_year(static_data, era.date.year), era.date.timespan, era.date.day);
			let normal_epoch_during_era = get_epoch(static_data, convert_year(static_data, era.date.year)+1);

			epoch -= (normal_epoch_during_era[0] - era_epoch[0]);

			intercalary -= (normal_epoch_during_era[1] - era_epoch[1]);
			for(let i = 0; i < normal_epoch_during_era[2].length; i++){
				count_timespans[i] = (normal_epoch_during_era[2][i] - era_epoch[2][i]);
			}

			num_timespans -= (normal_epoch_during_era[3] - era_epoch[3]);
			total_week_num -= (normal_epoch_during_era[4] - era_epoch[4]);

		}

	}

	for(let era_index = 0; era_index < static_data.eras.length; era_index++){

		let era = static_data.eras[era_index];

		era_years[era_index] = convert_year(static_data, era.date.year);

		if(!era.settings.starting_era && era.settings.restart
			&&
			(
				year > convert_year(static_data, era.date.year)
				||
				(year === convert_year(static_data, era.date.year) && timespan > era.date.timespan)
				||
				(year === convert_year(static_data, era.date.year) && timespan === era.date.timespan && day === era.date.day)
				||
				(epoch === era.date.epoch)
			)
		){

			for(let i = 0; i < era_index; i++){

				let prev_era = static_data.eras[i];

				if(prev_era.settings.restart){

					era_years[era_index] -= era_years[i];

				}

			}

			if(era.settings.ends_year){
				era_years[era_index]++;
			}

			era_year -= era_years[era_index];

		}

        if(epoch >= era.date.epoch){
            current_era = era_index;
        }

	}

    if(static_data.eras[0] && current_era === -1 && static_data.eras[0].settings.starting_era){
        current_era = 0;
    }

    if(static_data.eras[current_era] && epoch === static_data.eras[current_era].date.epoch && static_data.eras[current_era].settings.restart){
        era_year = 0;
    }

	let week_day = 0;

	// Calculate the start of week
	if(static_data.year_data.overflow){

		week_day = (epoch-1-intercalary+(Number(static_data.year_data.first_day))) % static_data.year_data.global_week.length;

		if (week_day < 0) week_day += static_data.year_data.global_week.length;

		week_day += 1;

	}else{
		week_day = 1;
	}

	return {"epoch": epoch,
			"era_year": era_year,
			"week_day": week_day,
			"count_timespans": count_timespans,
			"num_timespans": num_timespans,
			"total_week_num": total_week_num,
            "current_era": current_era
		};

}

window.toggle_sidebar = function(force = null) {
    if (force === true) {
        $("#input_container").addClass('inputs_collapsed');
        $("#calendar_container").addClass('inputs_collapsed');
        $('#input_collapse_btn').removeClass('is-active');
    } else if (force === false) {
        $("#input_container").removeClass('inputs_collapsed');
        $("#calendar_container").removeClass('inputs_collapsed');
        $('#input_collapse_btn').addClass('is-active');
    } else {
        $("#input_container").toggleClass('inputs_collapsed');
        $("#calendar_container").toggleClass('inputs_collapsed');
        $('#input_collapse_btn').toggleClass('is-active');
    }

    window.localStorage.setItem('inputs_collapsed', $("#input_container").hasClass('inputs_collapsed'));

    if(typeof static_data !== 'undefined' && static_data.clock.enabled && static_data.clock.render && !isNaN(static_data.clock.hours) && !isNaN(static_data.clock.minutes) && !isNaN(static_data.clock.offset)){
        window.Clock.size = $('#clock').width();
    }

    evaluate_background_size();
}

/**
 * This simple function returns a bool whether any given year has an era that ends it. Used to prevent users to create two eras that end years in one year.
 *
 * @param  {object}     static_data     The calendar's static_data object.
 * @param  {int}        year            The number of a year passed through the convert_year function.
 * @return {bool}                       A boolean to indicate whether that year has been terminated by an era or not
 */
window.has_year_ending_era = function(static_data, year){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

        if(era.settings.starting_era) continue;

		if(era.settings.ends_year && year == convert_year(static_data, era.date.year)){

			return true;

		}

	}

	return false;

}



