(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

function sorter(a, b) {
	if (a < b) return -1;  // any negative number works
	if (a > b) return 1;   // any positive number works
	return 0; // equal values MUST yield zero
}

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

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

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


class random {

	constructor(seed){
		this.seed = seed;
	}

	rndUNorm(idx){
		return fract(43758.5453 * Math.sin(this.seed + (78.233 * idx)));
	}

	rndSNorm(idx){
		return this.rndUNorm(idx) * 2.0 - 1.0;
	}

	random_int_between(idx, min, max){
		return Math.round(this.rndUNorm(idx) * (max - min) + min);  
	}

	random_float_between(idx, min, max){
		return this.rndUNorm(idx) * (max - min) + min;  
	}

	roll_dice(idx, dice_formula){
		var dice_amount = (dice_formula.split('d')[0]|0);
		var dice_size = (dice_formula.split('d')[1]|0);

		var result = 0;
		for(var dice = 1; dice <= dice_amount; dice++){
			result += this.random_int_between(idx, 1, dice_size);
		}
		return result;
	}

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

function precisionRound(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}


function clamp(t, min, max){
	return Math.min(Math.max(t, min), max);
}

function lerp(p0, p1, t){
	return p0 + t*(p1 - p0);
}

function fract(float){
	return float - Math.floor(float);
}

function mid(p0, p1){
	return (p0+p1)/2;
}

function norm(v, min, max)
{
	return (v - min) / (max - min);
}

function gcd(k, n){
	return k ? gcd(n % k, k) : n;
}

function lcm(x, y){
	if ((typeof x !== 'number') || (typeof y !== 'number')) 
		return false;
	return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

function get_cycle(year){

	var text = '';
	var index_array = [];

	// If cycles are enabled
	if(static_data.cycles && year >= 0){

		// Define the index array
		var index_array = [];

		// Get the format
		text = static_data.cycles.format;

		// Loop through each cycle
		for(var index = 0; index < static_data.cycles.data.length; index++){

		
			var cycle = static_data.cycles.data[index];

			// Get the cycle length from the year
			var cycle_year = Math.floor((year + cycle.offset) / cycle.length);

			// Store the cycle index
			var cycle_index = cycle_year % cycle.names.length;

			// Get the name for this cycle
			var cycle_name = cycle.names[cycle_index];

			// Replace the part of the text that has the current index's place
			text = text.replace('$'+(index+1), cycle_name);

			// Record the cycle index to the array
			index_array.push(cycle_index)
		}
	}
	return {'text': text,
			'array': index_array};
}


function does_leap_day_appear(static_data, year, timespan, leap_day){

	var timespan_appears = does_timespan_appear(static_data, year, timespan).result;

	var leap_day = static_data.year_data.leap_days[leap_day];

	return timespan_appears && is_leap(year, leap_day.interval, leap_day.offset);

}

function convert_year(year){
	return year > 0 ? year-1 : year;
}


function get_days_in_timespan(static_data, year, timespan_index, exclusive){

	var timespan = static_data.year_data.timespans[timespan_index];

	if(!timespan) return [];

	var days = [];

	for(var i = 1; i <= timespan.length; i++){
		days.push({
			text: `Day ${i}`,
			is_there: does_day_appear(static_data, year, timespan_index, i),
			leaping: false
		});
	}

	var offset = 0;

	var leap_days = clone(static_data.year_data.leap_days.sort((a, b) => (a.day > b.day) ? 1 : -1))

	for(var leap_day_index = 0; leap_day_index < leap_days.length; leap_day_index++){

		var leap_day = leap_days[leap_day_index];

		if(leap_day.timespan === timespan_index){

			if(leap_day.intercalary){

				var is_there = does_day_appear(static_data, year, timespan_index, leap_day.day-1);

				if(is_there.result){
					var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);
					is_there.result = leaping;
					if(!leaping){
						is_there.reason = "leaping"
					}
				}

				if(exclusive && is_there.result){

					days.splice(leap_day.day+offset, 0, {
						text: `Intercalary "${leap_day.name}"`,
						is_there: is_there,
						leaping: leap_day.interval > 0
					});

					offset++;

				}

			}else{

				var is_there = does_day_appear(static_data, year, timespan_index, i);

				if(exclusive && is_there.result){
					
					var leaping = does_leap_day_appear(static_data, year, timespan_index, leap_day_index);

					is_there.result = leaping;
					if(!leaping){
						is_there.reason = "leaping"
					}

					days.push({
						text: `Day ${i}`,
						is_there: is_there,
						leaping: leap_day.interval > 0
					});
					i++;
				}
			}
		}
	}

	return days;

}

function get_timespans_in_year(static_data, year, exclusive){

	var results = [];

	for(var timespan_index = 0; timespan_index < static_data.year_data.timespans.length; timespan_index++){

		var appears = does_timespan_appear(static_data, year, timespan_index);

		if(appears.result && exclusive){
			
			results.push(appears);

		}

	}

	return results;

}


function does_timespan_appear(static_data, year, timespan){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == era.date.year-1){

			if(timespan > era.date.timespan){

				return {
					result: false,
					reason: 'era ended'
				}

			}

		}

	}

	if((year+static_data.year_data.timespans[timespan].offset) % static_data.year_data.timespans[timespan].interval != 0){
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



function does_day_appear(static_data, year, timespan, day){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == era.date.year-1 && timespan == era.date.timespan && day > era.date.day){

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


function fract_year_length(static_data){

	var length = 0;

	for(var i = 0; i < static_data.year_data.timespans.length; i++){
		length += static_data.year_data.timespans[i].length/static_data.year_data.timespans[i].interval;
	}

	for(var i = 0; i < static_data.year_data.leap_days.length; i++){

		var leap_day = static_data.year_data.leap_days[i];

		length += get_leap_fraction(1, leap_day.interval, 0)
		
	}

	return precisionRound(length, 10);

}


function avg_month_length(static_Data){

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

		length += get_leap_fraction(1, leap_day.interval, 0)
	}

	return precisionRound(length/num_months, 10);

}

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


var date_converter = {

	get_date: function(static_data, inc_calendar, epoch){

		this.static_data = static_data;
		this.inc_calendar = inc_calendar;
		this.target_epoch = epoch;

		this.year = Math.floor(this.target_epoch / fract_year_length(this.inc_calendar));
		this.timespan = 0;
		this.day = 1;

		this.loops = 0;

		while(true){

			var first_suggested_epoch = evaluate_calendar_start(this.inc_calendar, this.year).epoch;

			if(first_suggested_epoch > this.target_epoch){
				this.year++;
			}else{
				break;
			}

			this.loops++;

		}



		while(true){

			if(!does_timespan_appear(this.inc_calendar, this.year, this.timespan).result){

				this.increase_month();

			}else{

				this.suggested_epoch = evaluate_calendar_start(this.inc_calendar, this.year, this.timespan).epoch;

				if(this.suggested_epoch < this.target_epoch){
					this.increase_month();
				}else{
					this.decrease_month();
					this.suggested_epoch = evaluate_calendar_start(this.inc_calendar, this.year, this.timespan).epoch;
					break;
				}

			}

			this.loops++;

		}

		while(true){

			this.suggested_epoch = evaluate_calendar_start(this.inc_calendar, this.year, this.timespan, this.day).epoch;

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
			"epoch": this.suggested_epoch
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

		if(this.timespan == this.inc_calendar.year_data.timespans.length){

			this.year++;
			this.timespan = 0;

		}

		if(!does_timespan_appear(this.inc_calendar, this.year, this.timespan).result){
			this.increase_month();
		}

		this.timespan_length = get_days_in_timespan(this.inc_calendar, this.year, this.timespan);

	},

	decrease_month: function(){

		this.timespan--;

		if(this.timespan < 0){

			this.year--;
			this.timespan = this.inc_calendar.year_data.timespans.length-1;

		}

		if(!does_timespan_appear(this.inc_calendar, this.year, this.timespan).result){
			this.decrease_month();
		}

		this.timespan_length = get_days_in_timespan(this.inc_calendar, this.year, this.timespan);

	}

}


function is_leap(year, intervals, offsets){

	var intervals = intervals.split(',');

	if(intervals.length == 0){

		var interval = interval[0];

		var offset = (interval-offsets+1)%interval;

		console.log(offset)

		return (year + offset) % interval == 0;

	}

	var appears = false;
	var hard = false;

	for(var i = 0; i < intervals.length; i++){

		var offset = clone(offsets);

		var interval = intervals[i];

		if(interval.includes('!')){

			if(interval.includes('+')){
				var interval = Number(interval.slice(2));
				var offset = 1;
			}else{
				var interval = Number(interval.slice(1));
				var offset = (interval-offset+1)%interval;
			}

			if((year + offset) % interval == 0){
				hard = true;
			}

		}else{

			if(interval.includes('+')){
				var interval = Number(interval.slice(1));
				var offset = 1;
			}else{
				var interval = Number(interval);
				var offset = (interval-offset+1)%interval;
			}

			if((year + offset) % interval == 0){
				appears = true;
			}

		}
		
		if(appears || hard){
			break;
		}

	}

	return appears;

}


function get_leap_fraction(year, intervals, offsets){

	// The intervals parameter is a string with numbers seperated by commas, usually in the format of:
	// +400,+!100,4
	// Every fourth, except if divisible by 100, disregarding the previous rule every 400th year
	intervals = intervals.split(',').reverse();

	// If there's only one interval, we can calculate that without looping through each part
	if(intervals.length == 1){

		var interval = intervals[0]|0;

		var offset = (interval-offsets)%interval;

		return (year+offset) / interval;
	}

	// Get the base fraction, which we will add to or subtract based on its following rules
	var base_interval = intervals[0]|0;
	var offset = (base_interval-offsets)%base_interval;
	var fraction = (year+offset) / base_interval;

	for(var i = 1; i < intervals.length; i++){

		var interval = intervals[i];
		var offset = offsets;

		// If it is a negator, subtract it from the total
		if(interval.includes('!')){

			// That ignores offset or respects offset
			if(interval.includes('+')){
				var interval = interval.slice(2)|0;
				offset = 0;
			}else{
				var interval = interval.slice(1)|0;
				offset = (interval-offset)%interval;
			}

			fraction -= (year+offset) / lcm(interval, base_interval);

		// If it is inclusive
		}else{

			// That ignores or respects the offset
			if(interval.includes('+')){
				var interval = interval.slice(1)|0;
				offset = 0;
			}else{
				var interval = interval|0;
				offset = (interval-offset)%interval;
			}

			fraction += (year+offset) / interval;

			// We subtract because of intersections, eg every 3rd year and every 10 years would intersect on 30, so we need to subtract then.
			fraction -= (year+offset) / lcm(interval, base_interval);

		}

	}

	return fraction;

}

function get_epoch(static_data, year, month, day, inclusive){

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
	for(month_index = 0; month_index < static_data.year_data.timespans.length; month_index++){

		// If the month index is lower than the month parameter, add a year so we can get the exact epoch for a month within a year
		if(month_index < month){
			year = actual_year+1;
		}else{
			year = actual_year;
		}

		// Get the current timespan's data
		var timespan = static_data.year_data.timespans[month_index];

		var offset = (timespan.interval-timespan.offset)%timespan.interval;

		// Get the fraction of that month's appearances
		var timespan_fraction = Math.ceil((year + offset) / timespan.interval);

		// Get the number of weeks for that month (check if it has a custom week or not)
		if(!static_data.year_data.overflow){
			if(timespan.week){
				total_week_num += Math.abs(Math.floor((timespan.length * timespan_fraction)/timespan.week));
			}else{
				total_week_num += Math.abs(Math.floor((timespan.length * timespan_fraction)/static_data.year_data.global_week.length));
			}
		}

		// Count the number of times each month has appeared
		count_timespans[month_index] = Math.abs(timespan_fraction);
 
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
			leap_day = static_data.year_data.leap_days[leap_day_index];

			added_leap_day = 0;

			if(month_index === leap_day.timespan){
				
				added_leap_day = Math.floor(get_leap_fraction(timespan_fraction, leap_day.interval, leap_day.offset));

				// If we have leap days days that are intercalary (eg, do not affect the flow of the static_data, add them to the overall epoch, but remove them from the start of the year week day selection)
				if(leap_day.intercalary){
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


function evaluate_calendar_start(static_data, year, month, day){

	//Initiatlize variables
	var era_year = year >= 0 ? year+1 : year;
	var month = !isNaN(month) ? month : 0;
	var day = !isNaN(day) ? day-1 : 0;
	tmp = get_epoch(static_data, (year|0), (month|0), (day|0));
	var epoch = tmp[0];
	var intercalary = tmp[1];
	var count_timespans = tmp[2];
	var num_timespans = tmp[3];
	var total_week_num = tmp[4];
	var week_day = static_data.year_data.first_day;

	// For each era, check if they end the year, subtract the remaining days of that year from the epoch total so we can get proper start of the year
	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		era = static_data.eras[era_index];

		if(era.settings.ends_year && year > era.date.year-1){

			era_epoch = get_epoch(static_data, era.date.year-1, era.date.timespan, era.date.day-1);
			normal_epoch_during_era = get_epoch(static_data, era.date.year-1);

			epoch -= (normal_epoch_during_era[0] - era_epoch[0]);

			intercalary -= (normal_epoch_during_era[1] - era_epoch[1]);
			count_timespans -= (normal_epoch_during_era[2] - era_epoch[2]);
			num_timespans -= (normal_epoch_during_era[3] - era_epoch[3]);
			total_week_num -= (normal_epoch_during_era[4] - era_epoch[4]);

			era_year -= era.date.year;

		}

	}
	
	// Calculate the start of week
	if(static_data.year_data.overflow){
		week_day = (epoch-intercalary+static_data.year_data.first_day-1) % static_data.year_data.global_week.length;
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
			"total_week_num": total_week_num
		};

}


function has_year_ending_era(static_data, year){

	for(var era_index = 0; era_index < static_data.eras.length; era_index++){

		var era = static_data.eras[era_index];

		if(era.settings.ends_year && year == convert_year(era.date.year)){

			return true;

		}

	}

	return false;

}