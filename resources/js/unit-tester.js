const unit_tester = {

	/**
	 * Test whether leap day calculation is functioning
	 *
	 * @param  {bool}   year_zero_exists   Whether the leap day should be calculated with or without year zero
	 *                                  
	 * @return {bool}                      Returns boolean whether test passed or failed
	 */
	leap_days: function(){

		let static_data = {
			year_data: {
				timespans: [
					{
						"name": "Month",
						"type": "month",
						"length": 24,
						"interval": 4,
						"offset": 0
					}
				],
				leap_days: [
					{
						"name": "Leap day",
						"intercalary": false,
						"timespan": 0,
						"adds_week_day": false,
						"day": 0,
						"week_day": "",
						"interval": "4",
						"offset": 0,
						"not_numbered": false
					}
				]
			},
			settings: {
				year_zero_exists: true
			}
		}

		let leap_day = static_data.year_data.leap_days[0];
		let timespan = static_data.year_data.timespans[0];

		let leap_years = []
		for(let year = -40; year < 40; year++){

			let timespan_fraction = 1;

			if (timespan.interval == 1) {

				timespan_fraction = year;

			} else {

				let offset = timespan.offset % timespan.interval;

				if (year < 0 || static_data.settings.year_zero_exists) {
					timespan_fraction = Math.floor((year - offset) / timespan.interval);
				} else {
					timespan_fraction = Math.floor((year - offset) / timespan.interval);
				}

			}

			let timespan_leaps = is_leap_simple(static_data, year, timespan.interval, timespan.offset);

			//console.log(timespan_fraction)
			let leap_leaps = timespan_leaps && is_leap(static_data, timespan_fraction, leap_day.interval, leap_day.offset);

			if (timespan_leaps && leap_leaps){
				console.log(unconvert_year(static_data, year))
			}
		}

	},

	leap_day_calendar: function(){

		worker_calendar.postMessage({
			calendar_name: calendar_name,
			static_data: static_data,
			dynamic_data: dynamic_data,
			events: events,
			event_categories: event_categories,
			action: "unit test",
			owner: Perms.player_at_least('co-owner'),
			debug: true,
			target_loops: 100
		});

	}

}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

module.exports = unit_tester;