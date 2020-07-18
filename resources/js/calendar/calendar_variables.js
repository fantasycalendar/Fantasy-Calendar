var condition_mapping = {

	"Year": [
		["Year is exactly", 				[["year", "==", 0]], 	[["number", "Number", "Enter year number", "1"]]],
		["Year is not", 					[["year", "!=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is or later than", 			[["year", ">=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is or earlier than", 		[["year", "<=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is later than", 				[["year", ">", 0]],		[["number", "Number", "Enter year number", "1"]]],
		["Year is earlier than", 			[["year", "<", 0]],		[["number", "Number", "Enter year number", "1"]]],
		["Every nth year", 					[["year", "%", 0, 1]],		[["number", "nth", "Enter year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Month": [
		["Month is exactly",				[["timespan_index", "==", 0]],		[["select"]]],
		["Month is not",					[["timespan_index", "!=", 0]],		[["select"]]],
		["Month is or later than",			[["timespan_index", ">=", 0]],		[["select"]]],
		["Month is or earlier than",		[["timespan_index", "<=", 0]],		[["select"]]],
		["Month is later than",				[["timespan_index", ">", 0]],		[["select"]]],
		["Month is earlier than",			[["timespan_index", "<", 0]],		[["select"]]],
		["Every nth specific month",		[["timespan_index", "==", 0],
											 ["timespan_count", "%", 1, 2]],	[["select"], ["number", "nth", "Enter month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0"]]],
		["Month number is exactly",			[["timespan_number", "==", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Month number is not",				[["timespan_number", "!=", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Month number is or later than",	[["timespan_number", ">=", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Month number is or earlier than", [["timespan_number", "<=", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Month number is later than",		[["timespan_number", ">", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Month number is earlier than",	[["timespan_number", "<", 0]],		[["number", "Number", "Enter month number", "1"]]],
		["Every nth month",					[["num_timespans", "%", 0, 1]],		[["number", "nth", "Enter month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		["Month name is exactly",			[["timespan_name", "==", 0]],		[["text", "Name", "Insert month name"]]],
		["Month name is not",				[["timespan_name", "!=", 0]],		[["text", "Name", "Insert month name"]]]
	],

	"Day": [
		["Day in month is exactly", 		[["day", "==", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Day in month is not",				[["day", "!=", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Day in month is or later than",	[["day", ">=", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Day in month is or earlier than",	[["day", "<=", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Day in month is later than",		[["day", ">", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Day in month is earlier than",	[["day", "<", 0]],				[["number", "Number", "Enter day number", "1"]]],
		["Every nth day in month",			[["day", "%", 0, 1]],			[["number", "nth", "Enter day interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["Day in year is exactly",			[["year_day", "==", 0]],		[["number", "Number", "Enter yearday number", "1"]]],
		["Day in year is not",				[["year_day", "!=", 0]],		[["number", "Number", "Enter yearday number", "1"]]],
		["Day in year is or later than",	[["year_day", ">=", 0]],		[["number", "Number", "Enter yearday number", "1"]]],
		["Day in year is or earlier than",	[["year_day", "<=", 0]],		[["number", "Number", "Enter yearday number", "1"]]],
		["Day in year is later than",		[["year_day", ">", 0]],			[["number", "Number", "Enter yearday number", "1"]]],
		["Day in year is earlier than",		[["year_day", "<", 0]],			[["number", "Number", "Enter yearday number", "1"]]],
		["Every nth day in year",			[["year_day", "%", 0, 1]],		[["number", "nth", "Enter yearday interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		
		["Exactly x days before the end of the month", 					[["inverse_day", "==", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Not x days before the end of the month",						[["inverse_day", "!=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Exactly or later than x days before the end of the month",	[["inverse_day", ">=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Exactly or earlier than x days before the end of the month",	[["inverse_day", "<=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Later than x days before the end of the month",				[["inverse_day", ">", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Earlier than x days before the end of the month",				[["inverse_day", "<", 0]],		[["number", "Number", "Enter day number", "1"]]],

		["Day is intercalary",				[["intercalary", "==", 0]],		[["boolean"]]],
		["Day is not intercalary",			[["intercalary", "!=", 0]],		[["boolean"]]],
	],

	"Epoch": [
		["Epoch is exactly", 			[["epoch","==", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is not", 				[["epoch","!=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is or later than", 		[["epoch",">=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is or earlier than", 	[["epoch","<=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is later than", 		[["epoch",">", 0]],			[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is earlier than", 		[["epoch","<", 0]],			[["number", "Number", "Enter epoch number", "1"]]],
		["Every nth epoch", 			[["epoch", "%", 0, 1]],		[["number", "nth", "Enter epoch interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Weekday": [
		["Weekday is exactly", 					[["week_day_name", "==", 0]],	[["select"]]],
		["Weekday is not", 						[["week_day_name", "!=", 0]],	[["select"]]],

		["Weekday number is exactly", 			[["week_day", "==", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is not", 				[["week_day", "!=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is or later than", 	[["week_day", ">=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is or earlier than", 	[["week_day", "<=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is later than", 		[["week_day", ">", 0]],			[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is earlier than", 		[["week_day", "<", 0]],			[["number", "Number", "Enter week day number", "1", "1"]]],

		["Weekday number in month is exactly", 			[["week_day_num", "==", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Weekday number in month is not", 				[["week_day_num", "!=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Weekday number in month is or later than", 	[["week_day_num", ">=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Weekday number in month is or earlier than", 	[["week_day_num", "<=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Weekday number in month is later than", 		[["week_day_num", ">", 0]],			[["number", "Number", "Enter number", "1", "1"]]],
		["Weekday number in month is earlier than", 	[["week_day_num", "<", 0]],			[["number", "Number", "Enter number", "1", "1"]]],
	],

	"Week":[
		["Month-week number is exactly", 			[["month_week_num", "==", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Month-week number is not", 				[["month_week_num", "!=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Month-week number is or later than", 		[["month_week_num", ">=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Month-week number is or earlier than", 	[["month_week_num", "<=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Month-week number is later than", 		[["month_week_num", ">", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Month-week number is earlier than", 		[["month_week_num", "<", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Every nth month-week", 					[["month_week_num", "%", 0, 1]],	[["number", "nth", "Enter week number in month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		["Year-week number is exactly", 			[["year_week_num", "==", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Year-week number is not", 				[["year_week_num", "!=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Year-week number is or later than", 		[["year_week_num", ">=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Year-week number is or earlier than", 	[["year_week_num", "<=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Year-week number is later than", 			[["year_week_num", ">", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Year-week number is earlier than", 		[["year_week_num", "<", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Every nth year-week", 					[["year_week_num", "%", 0, 1]],		[["number", "nth", "Enter week number in year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		["Total week number is exactly", 			[["total_week_num", "==", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is not", 				[["total_week_num", "!=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is or later than", 		[["total_week_num", ">=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is or earlier than", 	[["total_week_num", "<=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is later than", 		[["total_week_num", ">", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is earlier than", 		[["total_week_num", "<", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Every nth total week", 					[["total_week_num", "%", 0, 1]],	[["number", "nth", "Enter overall week number interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Moons": [
		["Moon phase is exactly", 						[["moon_phase", "==", 1]], [["select"]]],
		["Moon phase is not", 							[["moon_phase", "!=", 1]], [["select"]]],
		["Moon phase is or later than", 				[["moon_phase", ">=", 1]], [["select"]]],
		["Moon phase is or earlier than", 				[["moon_phase", "<=", 1]], [["select"]]],
		["Moon phase is later than", 					[["moon_phase", ">", 1]], [["select"]]],
		["Moon phase is earlier than", 					[["moon_phase", "<", 1]], [["select"]]],
		["Every nth moon phase",						[["moon_phase", "==", 1],
											 			["moon_phase_num_epoch", "%", 2, 3]],	[["select"], ["number", "nth", "Enter moon phase interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		
		["Moon month-phase count is exactly", 			[["moon_phase_num_month", "==", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Moon month-phase count is not", 				[["moon_phase_num_month", "!=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Moon month-phase count is or later than",		[["moon_phase_num_month", ">=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Moon month-phase count is or earlier than", 	[["moon_phase_num_month", "<=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Moon month-phase count is later than", 		[["moon_phase_num_month", ">", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Moon month-phase count is earlier than", 		[["moon_phase_num_month", "<", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Every nth moon month-phase count", 			[["moon_phase_num_month", "%", 1, 2]],	[["number", "nth", "Enter moon phase count in month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],


		["Moon year-phase count is exactly", 			[["moon_phase_num_year", "==", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Moon year-phase count is not", 				[["moon_phase_num_year", "!=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Moon year-phase count is or later than", 		[["moon_phase_num_year", ">=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Moon year-phase count is or earlier than", 	[["moon_phase_num_year", "<=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Moon year-phase count is later than", 		[["moon_phase_num_year", ">", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Moon year-phase count is earlier than", 		[["moon_phase_num_year", "<", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Every nth moon year-phase count", 			[["moon_phase_num_year", "%", 1, 2]],	[["number", "nth", "Enter moon phase count in year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["Moon epoch-phase count is exactly", 			[["moon_phase_num_epoch", "==", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Moon epoch-phase count is not", 				[["moon_phase_num_epoch", "!=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Moon epoch-phase count is or later than", 	[["moon_phase_num_epoch", ">=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Moon epoch-phase count is or earlier than", 	[["moon_phase_num_epoch", "<=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Moon epoch-phase count is later than", 		[["moon_phase_num_epoch", ">", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Moon epoch-phase count is earlier than", 		[["moon_phase_num_epoch", "<", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Every nth epoch-phase count", 				[["moon_phase_num_epoch", "%", 1, 2]],	[["number", "nth", "Enter overall moon phase count interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Location":[
		["Location is exactly", 					[["location", "==", 0]], [["select"]]],
		["Location is not", 						[["location", "!=", 0]], [["select"]]],
	],

	"Cycle": [
		["Cycle is exactly", 						[["cycle", "==", 0, 1]], [["select"]]],
		["Cycle is not", 							[["cycle", "!=", 0, 1]], [["select"]]]
	],

	"Era": [
		["Era is exactly", 							[["era", "==", 0, 1]], [["select"]]],
		["Era is not", 								[["era", "!=", 0, 1]], [["select"]]]
	],

	"Era year": [
		["Era year is exactly", 			[["era_year", "==", 0]], 	[["number", "Number", "Enter era year number", "0"]]],
		["Era year is not", 				[["era_year", "!=", 0]],	[["number", "Number", "Enter era year number", "0"]]],
		["Era year is or later than", 		[["era_year", ">=", 0]],	[["number", "Number", "Enter era year number", "0"]]],
		["Era year is or earlier than", 	[["era_year", "<=", 0]],	[["number", "Number", "Enter era year number", "0"]]],
		["Era year is later than", 			[["era_year", ">", 0]],		[["number", "Number", "Enter era year number", "0"]]],
		["Era year is earlier than", 		[["era_year", "<", 0]],		[["number", "Number", "Enter era year number", "0"]]],
		["Every nth era year", 				[["era_year", "%", 0]],		[["number", "nth", "Enter era year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Season": [
		["Season is exactly", 						[["season_index", "==", 0]], 	[["select"]]],
		["Season is not", 							[["season_index", "!=", 0]], 	[["select"]]],

		["Season percent is exactly", 				[["season_perc", "==", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],
		["Season percent is not", 					[["season_perc", "!=", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],
		["Season percent is or later than", 		[["season_perc", ">=", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],
		["Season percent is or earlier than", 		[["season_perc", "<=", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],
		["Season percent is later than", 			[["season_perc", ">", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],
		["Season percent is earlier than", 			[["season_perc", "<", 0]],		[["number", "Number", "Enter percentage of season", "1", "1", "100"]]],

		["Season day is exactly", 					[["season_day", "==", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Season day is not",						[["season_day", "!=", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Season day is or later than",				[["season_day", ">=", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Season day is or earlier than",			[["season_day", "<=", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Season day is later than",				[["season_day", ">", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Season day is earlier than",				[["season_day", "<", 0]],		[["number", "Number", "Enter day in season", "1", "1"]]],
		["Every nth season day",					[["season_day", "%", 0, 1]],	[["number", "nth", "Enter day in season interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["It is the longest day",	 							[["high_solstice", "==", 0]], 	[["boolean"]]],
		["It is the shortest day",	 							[["low_solstice", "==", 0]], 	[["boolean"]]],
		["It is the rising equinox (spring-like)",				[["rising_equinox", "==", 0]], 	[["boolean"]]],
		["It is the falling equinox (autumn-like)",				[["falling_equinox", "==", 0]], [["boolean"]]],
	],

	"Random": [
		["Random chance is above", 					[["season_perc", ">", 0, 1]],		[["number", "(0-100%)", "Random chance", "", "0", "100"], ["number", "Seed", "Seed", Math.abs(Math.random().toString().substr(7)|0), "0"]]],
		["Random chance is below", 					[["season_perc", "<", 0, 1]],		[["number", "(0-100%)", "Random chance", "", "0", "100"], ["number", "Seed", "Seed", Math.abs(Math.random().toString().substr(7)|0), "0"]]],
	],

	"Events": [
		["Target event happened exactly x days ago", 							[["event", "exactly_past", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Target event is happening exactly x days from now", 					[["event", "exactly_future", 0, 1]],	[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Target event is going to happen within the next x days (exclusive)",	[["event", "in_past_exc", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Target event has happened in the last x days (exclusive)", 			[["event", "in_future_exc", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Target event is going to happen within the next x days (inclusive)",	[["event", "in_past_inc", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Target event has happened in the last x days (inclusive)", 			[["event", "in_future_inc", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]]
	]
}

var moon_phases = {
	'4': [
		'New Moon',
		'First Quarter',
		'Full Moon',
		'Last Quarter'
	],

	'8': [
		'New Moon',
		'Waxing Crescent',
		'First Quarter',
		'Waxing Gibbous',
		'Full Moon',
		'Waning Gibbous',
		'Last Quarter',
		'Waning Crescent'
	],

	'24': [
		'New Moon',
		'New Moon Fading',
		'Waxing Crescent Rising',
		'Waxing Crescent',
		'Waxing Crescent Fading',
		'First Quarter Rising',
		'First Quarter',
		'First Quarter Fading',
		'Waxing Gibbous Rising',
		'Waxing Gibbous',
		'Waxing Gibbous Fading',
		'Full Moon Rising',
		'Full Moon',
		'Full Moon Fading',
		'Waning Gibbous Rising',
		'Waning Gibbous',
		'Waning Gibbous Fading',
		'Last Quarter Rising',
		'Last Quarter',
		'Last Quarter Fading',
		'Waning Crescent Rising',
		'Waning Crescent',
		'Waning Crescent Fading',
		'New Moon Rising',
	],

	'40': [
		'New Moon',
		'New Moon Fading',
		'New Moon Faded',
		'Waxing Crescent Rising',
		'Waxing Crescent Risen',
		'Waxing Crescent',
		'Waxing Crescent Fading',
		'Waxing Crescent Faded',
		'First Quarter Rising',
		'First Quarter Risen',
		'First Quarter',
		'First Quarter Fading',
		'First Quarter Faded',
		'Waxing Gibbous Rising',
		'Waxing Gibbous Risen',
		'Waxing Gibbous',
		'Waxing Gibbous Fading',
		'Waxing Gibbous Faded',
		'Full Moon Rising',
		'Full Moon Risen',
		'Full Moon',
		'Full Moon Fading',
		'Full Moon Faded',
		'Waning Gibbous Rising',
		'Waning Gibbous Risen',
		'Waning Gibbous',
		'Waning Gibbous Fading',
		'Waning Gibbous Faded',
		'Last Quarter Rising',
		'Last Quarter Risen',
		'Last Quarter',
		'Last Quarter Fading',
		'Last Quarter Faded',
		'Waning Crescent Rising',
		'Waning Crescent Risen',
		'Waning Crescent',
		'Waning Crescent Fading',
		'Waning Crescent Faded',
		'New Moon Rising',
		'New Moon Risen',
	],
};


var svg_moon_shadows = [
	'<circle class="lunar_shadow" cx="32" cy="32" r="21.438"/>',
	'<path class="lunar_shadow" transform="translate(-64)" d="M103.580,11.974 C108.500,14.406 114.000,19.838 114.000,32.000 C114.000,44.162 108.500,49.594 103.580,52.026 C101.221,52.920 98.673,53.432 96.000,53.432 C84.164,53.432 74.568,43.836 74.568,32.000 C74.568,20.164 84.164,10.568 96.000,10.568 C98.673,10.568 101.221,11.080 103.580,11.974 Z"/>',
	'<path class="lunar_shadow" transform="translate(-128)" d="M166.864,11.711 C171.583,14.010 177.000,19.392 177.000,32.000 C177.000,44.608 171.583,49.990 166.864,52.289 C164.707,53.018 162.404,53.432 160.000,53.432 C148.164,53.432 138.568,43.836 138.568,32.000 C138.568,20.164 148.164,10.568 160.000,10.568 C162.404,10.568 164.707,10.982 166.864,11.711 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-192)" d="M227.734,10.914 C232.462,12.675 240.000,17.766 240.000,32.333 C240.000,46.033 233.336,51.069 228.610,52.922 C227.123,53.248 225.584,53.432 224.000,53.432 C212.164,53.432 202.568,43.836 202.568,32.000 C202.568,20.164 212.164,10.568 224.000,10.568 C225.276,10.568 226.519,10.700 227.734,10.914 Z"/>',
	'<path class="lunar_shadow" transform="translate(-256)" d="M291.588,10.892 C296.026,12.600 303.000,17.541 303.000,31.750 C303.000,46.492 295.494,51.507 291.101,53.182 C290.086,53.330 289.056,53.432 288.000,53.432 C276.164,53.432 266.568,43.836 266.568,32.000 C266.568,20.164 276.164,10.568 288.000,10.568 C289.225,10.568 290.419,10.695 291.588,10.892 Z"/>',
	'<path class="lunar_shadow" transform="translate(-320)" d="M354.694,10.756 C358.501,12.349 365.000,17.254 365.000,32.200 C365.000,46.708 358.874,51.570 355.032,53.193 C354.039,53.334 353.032,53.432 352.000,53.432 C340.164,53.432 330.568,43.836 330.568,32.000 C330.568,20.164 340.164,10.568 352.000,10.568 C352.915,10.568 353.810,10.644 354.694,10.756 Z"/>',
	'<path class="lunar_shadow" transform="translate(-384)" d="M418.110,10.675 C421.304,12.187 427.000,17.018 427.000,32.250 C427.000,47.039 421.633,51.776 418.397,53.290 C417.609,53.378 416.811,53.432 416.000,53.432 C404.164,53.432 394.568,43.836 394.568,32.000 C394.568,20.164 404.164,10.568 416.000,10.568 C416.712,10.568 417.415,10.607 418.110,10.675 Z"/>',
	'<path class="lunar_shadow" transform="translate(-448)" d="M481.698,10.654 C484.306,12.133 489.000,16.892 489.000,32.000 C489.000,47.108 484.306,51.867 481.698,53.346 C481.136,53.390 480.573,53.432 480.000,53.432 C468.164,53.432 458.568,43.836 458.568,32.000 C458.568,20.164 468.164,10.568 480.000,10.568 C480.573,10.568 481.136,10.610 481.698,10.654 Z"/>',
	'<path class="lunar_shadow" transform="translate(-512)" d="M544.915,10.614 C546.811,12.180 551.000,17.298 551.000,32.000 C551.000,46.702 546.811,51.820 544.915,53.386 C544.609,53.399 544.309,53.432 544.000,53.432 C532.164,53.432 522.568,43.836 522.568,32.000 C522.568,20.164 532.164,10.568 544.000,10.568 C544.309,10.568 544.609,10.601 544.915,10.614 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-576)" d="M608.575,10.597 C609.888,12.209 613.000,17.568 613.000,32.167 C613.000,46.631 609.944,51.824 608.610,53.401 C608.406,53.407 608.206,53.432 608.000,53.432 C596.164,53.432 586.568,43.836 586.568,32.000 C586.568,20.164 596.164,10.568 608.000,10.568 C608.194,10.568 608.382,10.592 608.575,10.597 Z"/>',
	'<path class="lunar_shadow" transform="translate(-640)" d="M672.268,10.582 C673.002,12.350 675.000,18.423 675.000,32.167 C675.000,45.822 673.026,51.688 672.281,53.418 C672.186,53.419 672.095,53.432 672.000,53.432 C660.164,53.432 650.568,43.836 650.568,32.000 C650.568,20.164 660.164,10.568 672.000,10.568 C672.090,10.568 672.177,10.581 672.268,10.582 Z"/>',
	'<path class="lunar_shadow" transform="translate(-704)" d="M736.086,10.573 C736.328,12.339 737.000,18.464 737.000,32.000 C737.000,45.536 736.328,51.661 736.086,53.427 C736.057,53.428 736.029,53.432 736.000,53.432 C724.164,53.432 714.568,43.836 714.568,32.000 C714.568,20.164 724.164,10.568 736.000,10.568 C736.029,10.568 736.057,10.572 736.086,10.573 Z"/>',
	'<path class="lunar_shadow" transform="translate(-768)" d="M800.000,53.432 C788.164,53.432 778.568,43.836 778.568,32.000 C778.568,20.164 788.164,10.568 800.000,10.568 L800.000,53.432 Z"/>',
	'<path class="lunar_shadow" transform="translate(-832)" d="M863.000,32.000 C863.000,45.553 863.674,51.675 863.915,53.433 C852.115,53.387 842.562,43.811 842.562,32.000 C842.562,20.189 852.115,10.613 863.915,10.567 C863.674,12.325 863.000,18.447 863.000,32.000 Z"/>',
	'<path class="lunar_shadow" transform="translate(-896)" d="M925.000,32.167 C925.000,45.834 926.978,51.700 927.721,53.423 C916.012,53.273 906.562,43.746 906.562,32.000 C906.562,20.250 916.019,10.719 927.735,10.576 C927.003,12.335 925.000,18.405 925.000,32.167 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-960)" d="M991.395,53.407 C979.838,53.084 970.562,43.635 970.562,32.000 C970.562,20.353 979.856,10.896 991.430,10.591 C990.120,12.196 987.000,17.549 987.000,32.167 C987.000,46.651 990.065,51.837 991.395,53.407 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1024)" d="M1055.092,53.392 C1043.677,52.913 1034.562,43.533 1034.562,32.000 C1034.562,20.467 1043.677,11.087 1055.092,10.608 C1053.199,12.167 1049.000,17.280 1049.000,32.000 C1049.000,46.720 1053.199,51.833 1055.092,53.392 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1088)" d="M1118.314,53.352 C1107.265,52.490 1098.562,43.270 1098.562,32.000 C1098.562,20.730 1107.265,11.510 1118.314,10.648 C1115.708,12.119 1111.000,16.869 1111.000,32.000 C1111.000,47.131 1115.708,51.881 1118.314,53.352 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1152)" d="M1181.622,53.298 C1170.903,52.114 1162.562,43.035 1162.562,32.000 C1162.562,20.868 1171.049,11.722 1181.904,10.668 C1178.713,12.172 1173.000,16.994 1173.000,32.250 C1173.000,47.068 1178.388,51.794 1181.622,53.298 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1216)" d="M1244.988,53.202 C1234.578,51.734 1226.562,42.814 1226.562,32.000 C1226.562,21.068 1234.752,12.065 1245.327,10.747 C1241.523,12.331 1235.000,17.226 1235.000,32.200 C1235.000,46.733 1241.147,51.587 1244.988,53.202 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1280)" d="M1308.923,53.192 C1298.545,51.696 1290.562,42.792 1290.562,32.000 C1290.562,21.378 1298.296,12.584 1308.435,10.883 C1303.999,12.583 1297.000,17.517 1297.000,31.750 C1297.000,46.519 1304.534,51.526 1308.923,53.192 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-1344)" d="M1371.431,52.938 C1361.789,50.843 1354.562,42.270 1354.562,32.000 C1354.562,21.428 1362.222,12.665 1372.290,10.905 C1367.563,12.658 1360.000,17.742 1360.000,32.333 C1360.000,46.072 1366.702,51.099 1371.431,52.938 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1408)" d="M1433.200,52.381 C1424.698,49.473 1418.562,41.460 1418.562,32.000 C1418.562,22.540 1424.698,14.527 1433.200,11.682 C1428.467,13.962 1423.000,19.334 1423.000,32.000 C1423.000,44.666 1428.467,50.038 1433.200,52.318 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1472)" d="M1496.463,52.048 C1488.347,48.995 1482.562,41.183 1482.562,32.000 C1482.562,22.817 1488.347,15.005 1496.463,11.952 C1491.532,14.373 1486.000,19.803 1486.000,32.000 C1486.000,44.197 1491.532,49.627 1496.463,52.048 Z"/>',
	'',
	'<path class="lunar_shadow" transform="translate(-1600)" d="M1639.537,52.048 C1644.468,49.627 1650.000,44.197 1650.000,32.000 C1650.000,19.803 1644.468,14.373 1639.537,11.952 C1647.653,15.005 1653.438,22.817 1653.438,32.000 C1653.438,41.183 1647.653,48.995 1639.537,52.048 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1664)" d="M1702.800,52.318 C1707.533,50.038 1713.000,44.666 1713.000,32.000 C1713.000,19.334 1707.533,13.962 1702.800,11.682 C1711.302,14.527 1717.438,22.540 1717.438,32.000 C1717.438,41.460 1711.302,49.473 1702.800,52.318 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-1728)" d="M1764.569,52.938 C1769.298,51.099 1776.000,46.072 1776.000,32.333 C1776.000,17.742 1768.437,12.658 1763.710,10.905 C1773.778,12.665 1781.438,21.428 1781.438,32.000 C1781.438,42.270 1774.211,50.843 1764.569,52.938 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1792)" d="M1827.077,53.192 C1831.466,51.526 1839.000,46.519 1839.000,31.750 C1839.000,17.517 1832.001,12.583 1827.565,10.883 C1837.704,12.584 1845.438,21.378 1845.438,32.000 C1845.438,42.792 1837.455,51.696 1827.077,53.192 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1856)" d="M1891.012,53.202 C1894.853,51.587 1901.000,46.733 1901.000,32.200 C1901.000,17.226 1894.477,12.331 1890.673,10.747 C1901.248,12.065 1909.438,21.068 1909.438,32.000 C1909.438,42.814 1901.422,51.734 1891.012,53.202 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1920)" d="M1954.378,53.298 C1957.612,51.794 1963.000,47.068 1963.000,32.250 C1963.000,16.994 1957.287,12.172 1954.096,10.668 C1964.951,11.722 1973.438,20.868 1973.438,32.000 C1973.438,43.035 1965.097,52.114 1954.378,53.298 Z"/>',
	'<path class="lunar_shadow" transform="translate(-1984)" d="M2017.686,53.352 C2020.292,51.881 2025.000,47.131 2025.000,32.000 C2025.000,16.869 2020.292,12.119 2017.686,10.648 C2028.735,11.510 2037.438,20.730 2037.438,32.000 C2037.438,43.270 2028.735,52.490 2017.686,53.352 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2048)" d="M2080.908,53.392 C2082.801,51.833 2087.000,46.720 2087.000,32.000 C2087.000,17.280 2082.801,12.167 2080.908,10.608 C2092.323,11.087 2101.438,20.467 2101.438,32.000 C2101.438,43.533 2092.323,52.913 2080.908,53.392 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-2112)" d="M2144.605,53.407 C2145.935,51.837 2149.000,46.651 2149.000,32.167 C2149.000,17.549 2145.880,12.196 2144.570,10.591 C2156.144,10.896 2165.438,20.353 2165.438,32.000 C2165.438,43.635 2156.162,53.084 2144.605,53.407 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2176)" d="M2208.279,53.423 C2209.022,51.700 2211.000,45.834 2211.000,32.167 C2211.000,18.405 2208.997,12.335 2208.265,10.576 C2219.981,10.719 2229.438,20.250 2229.438,32.000 C2229.438,43.746 2219.988,53.273 2208.279,53.423 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2240)" d="M2272.085,53.433 C2272.326,51.675 2273.000,45.553 2273.000,32.000 C2273.000,18.447 2272.326,12.325 2272.085,10.567 C2283.885,10.613 2293.438,20.189 2293.438,32.000 C2293.438,43.811 2283.885,53.387 2272.085,53.433 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2304)" d="M2336.000,53.437 L2336.000,10.563 C2347.840,10.563 2357.437,20.160 2357.437,32.000 C2357.437,43.840 2347.840,53.437 2336.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2368)" d="M2400.000,53.437 C2399.971,53.437 2399.943,53.433 2399.915,53.433 C2399.674,51.675 2399.000,45.553 2399.000,32.000 C2399.000,18.447 2399.674,12.325 2399.915,10.567 C2399.943,10.567 2399.971,10.563 2400.000,10.563 C2411.840,10.563 2421.437,20.160 2421.437,32.000 C2421.437,43.840 2411.840,53.437 2400.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2432)" d="M2464.000,53.437 C2463.906,53.437 2463.815,53.425 2463.721,53.423 C2462.978,51.700 2461.000,45.834 2461.000,32.167 C2461.000,18.405 2463.003,12.335 2463.735,10.576 C2463.824,10.575 2463.911,10.563 2464.000,10.563 C2475.840,10.563 2485.437,20.160 2485.437,32.000 C2485.437,43.840 2475.840,53.437 2464.000,53.437 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-2496)" d="M2528.000,53.437 C2527.796,53.437 2527.598,53.413 2527.395,53.407 C2526.065,51.837 2523.000,46.651 2523.000,32.167 C2523.000,17.549 2526.120,12.196 2527.430,10.591 C2527.621,10.586 2527.808,10.563 2528.000,10.563 C2539.840,10.563 2549.437,20.160 2549.437,32.000 C2549.437,43.840 2539.840,53.437 2528.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2560)" d="M2592.000,53.437 C2591.694,53.437 2591.396,53.404 2591.092,53.392 C2589.199,51.833 2585.000,46.720 2585.000,32.000 C2585.000,17.280 2589.199,12.167 2591.092,10.608 C2591.396,10.596 2591.694,10.563 2592.000,10.563 C2603.840,10.563 2613.437,20.160 2613.437,32.000 C2613.437,43.840 2603.840,53.437 2592.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2624)" d="M2656.000,53.437 C2655.431,53.437 2654.872,53.396 2654.314,53.352 C2651.708,51.881 2647.000,47.131 2647.000,32.000 C2647.000,16.869 2651.708,12.119 2654.314,10.648 C2654.872,10.604 2655.431,10.563 2656.000,10.563 C2667.840,10.563 2677.438,20.160 2677.438,32.000 C2677.438,43.840 2667.840,53.437 2656.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2688)" d="M2720.000,53.437 C2719.195,53.437 2718.403,53.385 2717.622,53.298 C2714.388,51.794 2709.000,47.068 2709.000,32.250 C2709.000,16.994 2714.713,12.172 2717.904,10.668 C2718.594,10.601 2719.293,10.563 2720.000,10.563 C2731.840,10.563 2741.437,20.160 2741.437,32.000 C2741.437,43.840 2731.840,53.437 2720.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2752)" d="M2784.000,53.437 C2782.975,53.437 2781.974,53.341 2780.988,53.202 C2777.147,51.587 2771.000,46.733 2771.000,32.200 C2771.000,17.226 2777.523,12.331 2781.327,10.747 C2782.205,10.637 2783.093,10.563 2784.000,10.563 C2795.840,10.563 2805.438,20.160 2805.438,32.000 C2805.438,43.840 2795.840,53.437 2784.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2816)" d="M2848.000,53.437 C2846.952,53.437 2845.930,53.337 2844.923,53.192 C2840.534,51.526 2833.000,46.519 2833.000,31.750 C2833.000,17.517 2839.999,12.583 2844.435,10.883 C2845.597,10.688 2846.783,10.563 2848.000,10.563 C2859.840,10.563 2869.437,20.160 2869.437,32.000 C2869.437,43.840 2859.840,53.437 2848.000,53.437 Z"/>',
	//'<path class="lunar_shadow" transform="translate(-2880)" d="M2912.000,53.437 C2910.431,53.437 2908.905,53.258 2907.431,52.938 C2902.702,51.099 2896.000,46.072 2896.000,32.333 C2896.000,17.742 2903.563,12.658 2908.290,10.905 C2909.497,10.694 2910.732,10.563 2912.000,10.563 C2923.840,10.563 2933.438,20.160 2933.438,32.000 C2933.438,43.840 2923.840,53.437 2912.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-2944)" d="M2976.000,53.437 C2973.620,53.437 2971.339,53.034 2969.200,52.318 C2964.467,50.038 2959.000,44.666 2959.000,32.000 C2959.000,19.334 2964.467,13.962 2969.200,11.682 C2971.339,10.966 2973.620,10.563 2976.000,10.563 C2987.840,10.563 2997.437,20.160 2997.437,32.000 C2997.437,43.840 2987.840,53.437 2976.000,53.437 Z"/>',
	'<path class="lunar_shadow" transform="translate(-3008)" d="M3040.000,53.437 C3037.343,53.437 3034.810,52.932 3032.463,52.048 C3027.532,49.627 3022.000,44.197 3022.000,32.000 C3022.000,19.803 3027.532,14.373 3032.463,11.952 C3034.810,11.068 3037.343,10.563 3040.000,10.563 C3051.840,10.563 3061.438,20.160 3061.438,32.000 C3061.438,43.840 3051.840,53.437 3040.000,53.437 Z"/>'
];


var preset_data = {

	temperature_gauge: {
		'Polar': -40,
		'Bone-chilling': -22,
		'Bitter cold': -4,
		'Biting': 5,
		'Frigid': 14,
		'Crisp': 23,
		'Freezing': 32,
		'Cold': 41,
		'Chilly': 50,
		'Cool': 59,
		'Mild': 68,
		'Warm': 77,
		'Hot': 86,
		'Very Hot': 95,
		'Sweltering': 104,
		'Blistering': 113,
		'Burning': 140,
		'Blazing': 176,
		'Infernal': 212
	},

	clouds: [
		'A few clouds',
		'Mostly cloudy',
		'Gray, slightly overcast',
		'Gray, highly overcast',
		'Dark storm clouds',
		'Dark storm clouds'
	],

	precipitation: {
		'warm': {
			'Light mist': 0.2,
			'Drizzle': 0.175,
			'Steady rainfall': 0.175,
			'Strong rainfall': 0.15,
			'Pounding rain': 0.15,
			'Downpour': 0.15
		},
		'cold': {
			'A few flakes': 0.2,
			'A dusting of snow': 0.175,
			'Flurries': 0.175,
			'Moderate snowfall': 0.15,
			'Heavy snowfall': 0.15,
			'Blizzard': 0.15
		}
	},

	wind: {

		type: [
			'1d4',
			'1d6',
			'2d4',
			'2d6',
			'2d8',
			'2d10'
		],

		speed: {
			'Calm': 1,
			'Light air': 2,
			'Light breeze': 2,
			'Gentle breeze': 2,
			'Moderate breeze': 2,
			'Fresh breeze': 2,
			'Strong breeze': 2,
			'Moderate gale': 2,
			'Fresh gale': 2,
			'Strong gale': 1,
			'Storm': 1,
			'Violent storm': 19,
			'Hurricane': 2
		},

		info: {
			'Calm': {
				'mph': '<1',
				'desciption': 'Smoke rises vertically'
			},
			'Light air': {
				'mph': '1-3',
				'desciption': 'Wind direction shown by smoke but not wind vanes'
			},
			'Light breeze': {
				'mph': '4-7',
				'desciption': 'Wind felt on face, leaves rustle, vanes move'
			},
			'Gentle breeze': {
				'mph': '8-12',
				'desciption': 'Leaves and small twigs sway and banners flap'
			},
			'Moderate breeze': {
				'mph': '13-18',
				'desciption': 'Small branches move, and dust and small branches are raised'
			},
			'Fresh breeze': {
				'mph': '19-24',
				'desciption': 'Small trees sway and small waves form on inland waters'
			},
			'Strong breeze': {
				'mph': '25-31',
				'desciption': 'Large branches move'
			},
			'Moderate gale': {
				'mph': '32-38',
				'desciption': 'Whole trees sway and walking against wind takes some effort'
			},
			'Fresh gale': {
				'mph': '39-46',
				'desciption': 'Twigs break off trees and general progress is impeded'
			},
			'Strong gale': {
				'mph': '47-54',
				'desciption': 'Slight structural damage occurs'
			},
			'Storm': {
				'mph': '55-63',
				'desciption': 'Trees are uprooted and considerable structural damage occurs'
			},
			'Violent storm': {
				'mph': '64-72',
				'desciption': 'Widespread damage occurs'
			},
			'Hurricane': {
				'mph': '73-136',
				'desciption': 'Widespread devastation occurs'
			}
		},

		direction_table: {
			'N': {
				'N': 0.31,
				'NW': 0.14,
				'W': 0.105,
				'NE': 0.14,
				'E': 0.105,
				'SW': 0.075,
				'SE': 0.075,
				'S': 0.05
			},
			'NE': {
				'NE': 0.31,
				'N': 0.14,
				'E': 0.14,
				'W': 0.075,
				'S': 0.075,
				'NW': 0.105,
				'SE': 0.105,
				'SW': 0.05
			},
			'E': {
				'E': 0.31,
				'NE': 0.14,
				'SE': 0.14,
				'N': 0.105,
				'S': 0.105,
				'NW': 0.075,
				'SW': 0.075,
				'W': 0.05
			},
			'SE': {
				'SE': 0.31,
				'E': 0.14,
				'S': 0.14,
				'NE': 0.105,
				'SW': 0.105,
				'N': 0.075,
				'W': 0.075,
				'NW': 0.05
			},
			'S': {
				'S': 0.31,
				'SE': 0.14,
				'SW': 0.14,
				'E': 0.105,
				'W': 0.105,
				'NE': 0.075,
				'NW': 0.075,
				'N': 0.05
			},
			'SW': {
				'SW': 0.31,
				'S': 0.14,
				'W': 0.14,
				'SE': 0.105,
				'NW': 0.105,
				'E': 0.075,
				'N': 0.075,
				'NE': 0.05
			},
			'W': {
				'W': 0.31,
				'SW': 0.14,
				'NW': 0.14,
				'S': 0.105,
				'N': 0.105,
				'SE': 0.075,
				'NE': 0.075,
				'E': 0.05
			},
			'NW': {
				'NW': 0.31,
				'W': 0.14,
				'N': 0.14,
				'SW': 0.105,
				'NE': 0.105,
				'S': 0.075,
				'E': 0.075,
				'SE': 0.05
			}
		}
	},

	feature_table: {
		'Rain':{
			'warm': {
				'None': 0.5,
				'Fog': 1.0
			},
			'cold': {
				'None': 0.75,
				'Hail': 1.0
			}
		},
		'Storm': {
			'warm': {
				'None': 0.5,
				'Lightning': 1.0
			},
			'cold': {
				'None': 0.8,
				'Hail': 1.0
			}
		},
		'Windy': {
			'warm': {
				'None': 0.5,
				'Dust Storm': 0.8,
				'Tornado': 1.0
			},
			'cold': {
				'None': 0.8,
				'Tornado': 1.0
			}
		}
	},

	curves: {

		"timezone": {
			"hour": 0,
			"minute": 0
		},

		"large_noise_frequency": 0.015,
		"large_noise_amplitude": 10.0,

		"medium_noise_frequency": 0.3,
		"medium_noise_amplitude": 4.0,

		"small_noise_frequency": 0.8,
		"small_noise_amplitude": 5.0

	},

	locations: {
		"2": {
			'Cool and Rainy': {
				'name': 'Cool and Rainy',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 5,
							'temp_high': 40,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'precipitation': 0.35,
							'precipitation_intensity': 0.6
						}
					}
				]
			},
			'Cool with Dry Winter': {
				'name': 'Cool with Dry Winter',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 5,
							'temp_high': 40,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 85,
							'precipitation': 0.35,
							'precipitation_intensity': 0.75
						}
					}
				]
			},
			'Warm and Rainy': {
				'name': 'Warm and Rainy',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 10,
							'temp_high': 50,
							'precipitation': 0.4,
							'precipitation_intensity': 0.5
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 85,
							'precipitation': 0.4,
							'precipitation_intensity': 0.6
						}
					}
				]
			},
			'Warm with Dry Summer': {
				'name': 'Warm with Dry Summer',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 10,
							'temp_high': 60,
							'precipitation': 0.3,
							'precipitation_intensity': 0.6
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 95,
							'precipitation': 0.1,
							'precipitation_intensity': 0.2
						}
					}
				]
			},
			'Warm with Dry Winter': {
				'name': 'Warm with Dry Winter',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 32,
							'temp_high': 50,
							'precipitation': 0.15,
							'precipitation_intensity': 0.2
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 110,
							'precipitation': 0.45,
							'precipitation_intensity': 0.6
						}
					}
				]
			},
			'Equatorial': {
				'name': 'Equatorial',
				'seasons': [
					{
						'name': 'Dry',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 100,
							'precipitation': 0.5,
							'precipitation_intensity': 0.3
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 60,
							'temp_high': 100,
							'precipitation': 0.6,
							'precipitation_intensity': 0.7
						}
					}
				]
			},
			'Monsoon': {
				'name': 'Monsoon',
				'seasons': [
					{
						'name': 'Dry',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 120,
							'precipitation': 0.15,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 120,
							'precipitation': 0.9,
							'precipitation_intensity': 0.8
						}
					}
				],
			},
			'Desert': {
				'name': 'Desert',
				'seasons': [
					{
						'name': 'Dry',
						'custom_name': true,
						'weather': {
							'temp_low': 55,
							'temp_high': 70,
							'precipitation': 0.05,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 65,
							'temp_high': 110,
							'precipitation': 0.05,
							'precipitation_intensity': 0.8
						}
					}
				]
			},
			'Tropical Savannah': {
				'name': 'Tropical Savannah',
				'seasons': [
					{
						'name': 'Dry',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Wet',
						'custom_name': true,
						'weather': {
							'temp_low': 75,
							'temp_high': 115,
							'precipitation': 0.85,
							'precipitation_intensity': 0.2
						}
					}
				],
			},
			'Steppes': {
				'name': 'Steppes',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': 35,
							'temp_high': 50,
							'precipitation': 0.2,
							'precipitation_intensity': 0.3
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 70,
							'temp_high': 115,
							'precipitation': 0.05,
							'precipitation_intensity': 0.3
						}
					}
				]
			},
			'Tundra': {
				'name': 'Tundra',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': -35,
							'temp_high': -15,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 35,
							'temp_high': 55,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					}
				]
			},
			'Polar: Arctic': {
				'name': 'Polar: Arctic',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': -20,
							'temp_high': -10,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': 50,
							'temp_high': 70,
							'precipitation': 0.3,
							'precipitation_intensity': 0.1
						}
					}
				]
			},
			'Polar: Antarctic': {
				'name': 'Polar: Antarctic',
				'seasons': [
					{
						'name': 'Winter',
						'custom_name': true,
						'weather': {
							'temp_low': -81,
							'temp_high': -65,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					},
					{
						'name': 'Summer',
						'custom_name': true,
						'weather': {
							'temp_low': -22,
							'temp_high': -15,
							'precipitation': 0.1,
							'precipitation_intensity': 0.1
						}
					}
				]
			}
		},

		"4": {
			"Cool and Rainy":{
				"name":"Cool and Rainy",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":5,
							"temp_high":40,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":85,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.35,
							"precipitation_intensity":0.6
						}
					}
				]
			},
			"Cool with Dry Winter":{
				"name":"Cool with Dry Winter",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":5,
							"temp_high":40,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.225,
							"precipitation_intensity":0.425
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":85,
							"precipitation":0.35,
							"precipitation_intensity":0.75
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":32.5,
							"temp_high":62.5,
							"precipitation":0.225,
							"precipitation_intensity":0.425
						}
					}
				]
			},
			"Warm and Rainy":{
				"name":"Warm and Rainy",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":10,
							"temp_high":50,
							"precipitation":0.4,
							"precipitation_intensity":0.5
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":30.0,
							"temp_high":67.5,
							"precipitation":0.4,
							"precipitation_intensity":0.55
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":50,
							"temp_high":85,
							"precipitation":0.4,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":30.0,
							"temp_high":67.5,
							"precipitation":0.4,
							"precipitation_intensity":0.55
						}
					}
				]
			},
			"Warm with Dry Summer":{
				"name":"Warm with Dry Summer",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":10,
							"temp_high":60,
							"precipitation":0.3,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":35.0,
							"temp_high":77.5,
							"precipitation":0.2,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":60,
							"temp_high":95,
							"precipitation":0.1,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":35.0,
							"temp_high":77.5,
							"precipitation":0.2,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Warm with Dry Winter":{
				"name":"Warm with Dry Winter",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":32,
							"temp_high":50,
							"precipitation":0.15,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":51.0,
							"temp_high":80.0,
							"precipitation":0.3,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":110,
							"precipitation":0.45,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":51.0,
							"temp_high":80.0,
							"precipitation":0.3,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Equatorial":{
				"name":"Equatorial",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":57,
							"temp_high":70,
							"precipitation":0.2,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":56.0,
							"temp_high":68.0,
							"precipitation":0.45,
							"precipitation_intensity":0.4
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":55,
							"temp_high":66,
							"precipitation":0.7,
							"precipitation_intensity":0.6
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":56.0,
							"temp_high":68.0,
							"precipitation":0.45,
							"precipitation_intensity":0.4
						}
					}
				]
			},
			"Monsoon":{
				"name":"Monsoon",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":90,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":70.0,
							"temp_high":90.0,
							"precipitation":0.5,
							"precipitation_intensity":0.45
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":90,
							"precipitation":0.9,
							"precipitation_intensity":0.8
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":70.0,
							"temp_high":90.0,
							"precipitation":0.5,
							"precipitation_intensity":0.45
						}
					}
				]
			},
			"Warm Desert":{
				"name":"Warm Desert",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":55,
							"temp_high":70,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":60.0,
							"temp_high":90.0,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":65,
							"temp_high":110,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":60.0,
							"temp_high":90.0,
							"precipitation":0.05,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Cold Desert":{
				"name":"Cold Desert",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":7,
							"temp_high":25,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":29.5,
							"temp_high":51.0,
							"precipitation":0.25,
							"precipitation_intensity":0.125
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":52,
							"temp_high":77,
							"precipitation":0.3,
							"precipitation_intensity":0.15
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":29.5,
							"temp_high":51.0,
							"precipitation":0.25,
							"precipitation_intensity":0.125
						}
					}
				]
			},
			"Tropical Savanna":{
				"name":"Tropical Savanna",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":75,
							"temp_high":115,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":75.0,
							"temp_high":115.0,
							"precipitation":0.475,
							"precipitation_intensity":0.15
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":75,
							"temp_high":115,
							"precipitation":0.85,
							"precipitation_intensity":0.2
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":75.0,
							"temp_high":115.0,
							"precipitation":0.475,
							"precipitation_intensity":0.15
						}
					}
				]
			},
			"Steppes":{
				"name":"Steppes",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":35,
							"temp_high":50,
							"precipitation":0.2,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":52.5,
							"temp_high":82.5,
							"precipitation":0.125,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":70,
							"temp_high":115,
							"precipitation":0.05,
							"precipitation_intensity":0.3
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":52.5,
							"temp_high":82.5,
							"precipitation":0.125,
							"precipitation_intensity":0.3
						}
					}
				]
			},
			"Tundra":{
				"name":"Tundra",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-35,
							"temp_high":-15,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":0.0,
							"temp_high":20.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":35,
							"temp_high":55,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":0.0,
							"temp_high":20.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Polar: Arctic":{
				"name":"Polar: Arctic",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-20,
							"temp_high":-10,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":15.0,
							"temp_high":30.0,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":50,
							"temp_high":70,
							"precipitation":0.3,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":15.0,
							"temp_high":30.0,
							"precipitation":0.2,
							"precipitation_intensity":0.1
						}
					}
				]
			},
			"Polar: Antarctic":{
				"name":"Polar: Antarctic",
				"seasons":[
					{
						"name":"Winter",
						"custom_name":true,
						"weather":{
							"temp_low":-81,
							"temp_high":-65,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Spring",
						"custom_name":true,
						"weather":{
							"temp_low":-51.5,
							"temp_high":-40.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Summer",
						"custom_name":true,
						"weather":{
							"temp_low":-22,
							"temp_high":-15,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					},
					{
						"name":"Autumn",
						"custom_name":true,
						"weather":{
							"temp_low":-51.5,
							"temp_high":-40.0,
							"precipitation":0.1,
							"precipitation_intensity":0.1
						}
					}
				]
			}
		}
	}
}