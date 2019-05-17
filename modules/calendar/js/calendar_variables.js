var condition_mapping = {

	"Year": [
		["Year is exactly", 				[["year", "==", 0]], 	[["number", "Number", "0"]]],
		["Year is not", 					[["year", "!=", 0]],	[["number", "Number", "0"]]],
		["Year is or later than", 			[["year", ">=", 0]],	[["number", "Number", "0"]]],
		["Year is or earlier than", 		[["year", "<=", 0]],	[["number", "Number", "0"]]],
		["Year is later than", 				[["year", ">", 0]],		[["number", "Number", "0"]]],
		["Year is earlier than", 			[["year", "<", 0]],		[["number", "Number", "0"]]],
		["Every nth year", 					[["year", "%", 0]],		[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]]
	],

	"Era year": [
		["Era year is exactly", 			[["era_year", "==", 0]], 	[["number", "Number", "0"]]],
		["Era year is not", 				[["era_year", "!=", 0]],	[["number", "Number", "0"]]],
		["Era year is or later than", 		[["era_year", ">=", 0]],	[["number", "Number", "0"]]],
		["Era year is or earlier than", 	[["era_year", "<=", 0]],	[["number", "Number", "0"]]],
		["Era year is later than", 			[["era_year", ">", 0]],		[["number", "Number", "0"]]],
		["Era year is earlier than", 		[["era_year", "<", 0]],		[["number", "Number", "0"]]],
		["Every nth era year", 				[["era_year", "%", 0]],		[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]]
	],

	"Month": [
		["Month is exactly",				[["timespan_index", "==", 0]],		[["select"]]],
		["Month is not",					[["timespan_index", "!=", 0]],		[["select"]]],
		["Month is or later than",			[["timespan_index", ">=", 0]],		[["select"]]],
		["Month is or earlier than",		[["timespan_index", "<=", 0]],		[["select"]]],
		["Month is later than",				[["timespan_index", "}>", 0]],		[["select"]]],
		["Month is earlier than",			[["timespan_index", "}<", 0]],		[["select"]]],
		["Every nth specific month",		[["timespan_index", 0],
											 ["timespan_count", "%", 1, 2]],	[["select"], ["number", "nth", "1", "1"], ["number", "offset", "0"]]],
		["Month number is exactly",			[["timespan_number", "==", 0]],		[["number", "Number", "1"]]],
		["Month number is not",				[["timespan_number", "!=", 0]],		[["number", "Number", "1"]]],
		["Month number is or later than",	[["timespan_number", ">=", 0]],		[["number", "Number", "1"]]],
		["Month number is or earlier than", [["timespan_number", "<=", 0]],		[["number", "Number", "1"]]],
		["Month number is later than",		[["timespan_number", ">", 0]],		[["number", "Number", "1"]]],
		["Month number is earlier than",	[["timespan_number", "<", 0]],		[["number", "Number", "1"]]],
		["Every nth month",					[["num_timespans", "%", 0, 1]],		[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
		["Month name is exactly",			[["timespan_name", "==", 0]],		[["text", "Name"]]],
		["Month name is not",				[["timespan_name", "!=", 0]],		[["text", "Name"]]],
	],

	"Day": [
		["Day in month is exactly", 		[["day", "==", 0]],				[["number", "Number", "1"]]],
		["Day in month is not",				[["day", "!=", 0]],				[["number", "Number", "1"]]],
		["Day in month is or later than",	[["day", ">=", 0]],				[["number", "Number", "1"]]],
		["Day in month is or earlier than",	[["day", "<=", 0]],				[["number", "Number", "1"]]],
		["Day in month is later than",		[["day", ">", 0]],				[["number", "Number", "1"]]],
		["Day in month is earlier than",	[["day", "<", 0]],				[["number", "Number", "1"]]],
		["Day in year is exactly",			[["yearday", "==", 0]],			[["number", "Number", "1"]]],
		["Day in year is not",				[["yearday", "!=", 0]],			[["number", "Number", "1"]]],
		["Day in year is or later than",	[["yearday", ">=", 0]],			[["number", "Number", "1"]]],
		["Day in year is or earlier than",	[["yearday", "<=", 0]],			[["number", "Number", "1"]]],
		["Day in year is later than",		[["yearday", ">", 0]],			[["number", "Number", "1"]]],
		["Day in year is earlier than",		[["yearday", "<", 0]],			[["number", "Number", "1"]]],
		["Every nth day in year",			[["yearday", "%", 0, 1]],		[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
	],

	"Epoch": [
		["Epoch is", 					[["epoch","==", 0]],		[["number", "Number", "1"]]],
		["Epoch is not", 				[["epoch","!=", 0]],		[["number", "Number", "1"]]],
		["Epoch is or later than", 		[["epoch",">=", 0]],		[["number", "Number", "1"]]],
		["Epoch is or earlier than", 	[["epoch","<=", 0]],		[["number", "Number", "1"]]],
		["Epoch is later than", 		[["epoch",">", 0]],			[["number", "Number", "1"]]],
		["Epoch is earlier than", 		[["epoch","<", 0]],			[["number", "Number", "1"]]],
		["Every nth epoch", 			[["epoch", "%", 0, 1]],		[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
	],

	"Weekday": [
		["Weekday is exactly", 					[["week_day", "==", 0]],		[["select"]]],
		["Weekday is not", 						[["week_day", "!=", 0]],		[["select"]]],
		["Weekday is or later than", 			[["week_day", ">=", 0]],		[["select"]]],
		["Weekday is or earlier than", 			[["week_day", "<=", 0]],		[["select"]]],
		["Weekday is later than", 				[["week_day", ">", 0]],			[["select"]]],
		["Weekday is earlier than", 			[["week_day", "<", 0]],			[["select"]]],
		["Every nth weekday",					[["week_day", 0],
												 ["week_day_num", "%", 1, 2]],	[["select"], ["number", "nth", "1", "1"], ["number", "offset", "0"]]],
		["Weekday number is exactly", 			[["week_day_num", "==", 0]],	[["number", "Number", "1", "1"]]],
		["Weekday number is not", 				[["week_day_num", "!=", 0]],	[["number", "Number", "1", "1"]]],
		["Weekday number is or later than", 	[["week_day_num", ">=", 0]],	[["number", "Number", "1", "1"]]],
		["Weekday number is or earlier than", 	[["week_day_num", "<=", 0]],	[["number", "Number", "1", "1"]]],
		["Weekday number is later than", 		[["week_day_num", ">", 0]],		[["number", "Number", "1", "1"]]],
		["Weekday number is earlier than", 		[["week_day_num", "<", 0]],		[["number", "Number", "1", "1"]]],

		["Weekday name is exactly",				[["week_day_name", "==", 0]],		[["text", "Name"]]],
		["Weekday name is not",					[["week_day_name", "!=", 0]],		[["text", "Name"]]],
	],

	"Week":[
		["Month-week number is exactly", 			[["month_week_num", "==", 0]],	[["number", "Number", "1", "1"]]],
		["Month-week number is not", 				[["month_week_num", "!=", 0]],	[["number", "Number", "1", "1"]]],
		["Month-week number is or later than", 		[["month_week_num", ">=", 0]],	[["number", "Number", "1", "1"]]],
		["Month-week number is or earlier than", 	[["month_week_num", "<=", 0]],	[["number", "Number", "1", "1"]]],
		["Month-week number is later than", 		[["month_week_num", ">", 0]],	[["number", "Number", "1", "1"]]],
		["Month-week number is earlier than", 		[["month_week_num", "<", 0]],	[["number", "Number", "1", "1"]]],
		["Every nth month-week", 					[["month_week_num", "%", 0]],	[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
		["Year-week number is exactly", 			[["year_week_num", "==", 0]],	[["number", "Number", "1", "1"]]],
		["Year-week number is not", 				[["year_week_num", "!=", 0]],	[["number", "Number", "1", "1"]]],
		["Year-week number is or later than", 		[["year_week_num", ">=", 0]],	[["number", "Number", "1", "1"]]],
		["Year-week number is or earlier than", 	[["year_week_num", "<=", 0]],	[["number", "Number", "1", "1"]]],
		["Year-week number is later than", 			[["year_week_num", ">", 0]],	[["number", "Number", "1", "1"]]],
		["Year-week number is earlier than", 		[["year_week_num", "<", 0]],	[["number", "Number", "1", "1"]]],
		["Every nth year-week", 					[["year_week_num", "%", 0]],	[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
		["Total week number is exactly", 			[["total_week_num", "==", 0]],	[["number", "Number", "1", "1"]]],
		["Total week number is not", 				[["total_week_num", "!=", 0]],	[["number", "Number", "1", "1"]]],
		["Total week number is or later than", 		[["total_week_num", ">=", 0]],	[["number", "Number", "1", "1"]]],
		["Total week number is or earlier than", 	[["total_week_num", "<=", 0]],	[["number", "Number", "1", "1"]]],
		["Total week number is later than", 		[["total_week_num", ">", 0]],	[["number", "Number", "1", "1"]]],
		["Total week number is earlier than", 		[["total_week_num", "<", 0]],	[["number", "Number", "1", "1"]]],
		["Every nth total week", 					[["total_week_num", "%", 0]],	[["number", "nth", "1", "1"], ["number", "offset", "0", "0"]]],
	],

	"Moons": [
		["Phase is exactly", 				[["moon_phase", "==", 0, 1]], [["select"]]],
		["Phase is not", 					[["moon_phase", "!=", 0, 1]], [["select"]]],
		["Phase is or later than", 			[["moon_phase", ">=", 0, 1]], [["select"]]],
		["Phase is or earlier than", 		[["moon_phase", "<=", 0, 1]], [["select"]]],
		["Phase is later than", 			[["moon_phase", ">", 0, 1]], [["select"]]],
		["Phase is earlier than", 			[["moon_phase", "<", 0, 1]], [["select"]]],
		["Every nth phase",					[["moon_phase", 0, 1],
											 ["moon_phase_num_epoch", "%", 2, 3]],	[["select"], ["number", "nth", "1", "1"], ["number", "offset", "0"]]],
		
		["Month-phase is exactly", 			[["moon_phase_month", "==", 0, 1]], [["select"]]],
		["Month-phase is not", 				[["moon_phase_month", "!=", 0, 1]], [["select"]]],
		["Month-phase is or later than",	[["moon_phase_month", ">=", 0, 1]], [["select"]]],
		["Month-phase is or earlier than", 	[["moon_phase_month", "<=", 0, 1]], [["select"]]],
		["Month-phase is later than", 		[["moon_phase_month", ">", 0, 1]], [["select"]]],
		["Month-phase is earlier than", 	[["moon_phase_month", "<", 0, 1]], [["select"]]],
		["Every nth phase",					[["moon_phase", 0, 1],
											 ["moon_phase_num_month", "%", 2, 3]],	[["select"], ["number", "nth", "1", "1"], ["number", "offset", "0"]]],

		["Year-phase is exactly", 			[["moon_phase_year","==", 0, 1]], [["select"]]],
		["Year-phase is not", 				[["moon_phase_year","!=", 0, 1]], [["select"]]],
		["Year-phase is or later than", 	[["moon_phase_year",">=", 0, 1]], [["select"]]],
		["Year-phase is or earlier than", 	[["moon_phase_year","<=", 0, 1]], [["select"]]],
		["Year-phase is later than", 		[["moon_phase_year",">", 0, 1]], [["select"]]],
		["Year-phase is earlier than", 		[["moon_phase_year","<", 0, 1]], [["select"]]],
		["Every nth phase",					[["moon_phase", 0, 1],
											 ["moon_phase_num_year", "%", 2, 3]],	[["select"], ["number", "nth", "1", "1"], ["number", "offset", "0"]]],
	],

	"Cycle": [
		["Cycle is exactly", 				[["cycle", "==", 0, 1]], [["select"]]],
		["Cycle is not", 					[["cycle", "!=", 0, 1]], [["select"]]]
	],

	"Era": [
		["Era is exactly", 					[["era", "==", 0, 1]], [["select"]]],
		["Era is not", 						[["era", "!=", 0, 1]], [["select"]]]
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

	'16': [
		'New Moon',
		'Waxing Crescent Rising',
		'Waxing Crescent',
		'First Quarter Rising',
		'First Quarter',
		'Waxing Gibbous Rising',
		'Waxing Gibbous',
		'Full Moon Rising',
		'Full Moon',
		'Waning Gibbous Rising',
		'Waning Gibbous',
		'Last Quarter Rising',
		'Last Quarter',
		'Waning Crescent Rising',
		'Waning Crescent',
		'New Moon Rising'
	],

	'32': [
		'New Moon',
		'New Moon Fading',
		'Waxing Crescent Rising',
		'Waxing Crescent',
		'Waxing Crescent',
		'Waxing Crescent Fading',
		'First Quarter Rising',
		'First Quarter',
		'First Quarter',
		'First Quarter Fading',
		'Waxing Gibbous Rising',
		'Waxing Gibbous',
		'Waxing Gibbous',
		'Waxing Gibbous Fading',
		'Full Moon Rising',
		'Full Moon',
		'Full Moon',
		'Full Moon Fading',
		'Waning Gibbous Rising',
		'Waning Gibbous',
		'Waning Gibbous',
		'Waning Gibbous Fading',
		'Last Quarter Rising',
		'Last Quarter',
		'Last Quarter',
		'Last Quarter Fading',
		'Waning Crescent Rising',
		'Waning Crescent',
		'Waning Crescent',
		'Waning Crescent Fading',
		'New Moon Rising',
		'New Moon'
	]
};