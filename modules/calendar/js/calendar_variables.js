var condition_mapping = {

	"Year": [
		["Year is exactly", 				[["year", "==", 0]], 	[["number", "Number", "Enter year number", "1"]]],
		["Year is not", 					[["year", "!=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is or later than", 			[["year", ">=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is or earlier than", 		[["year", "<=", 0]],	[["number", "Number", "Enter year number", "1"]]],
		["Year is later than", 				[["year", ">", 0]],		[["number", "Number", "Enter year number", "1"]]],
		["Year is earlier than", 			[["year", "<", 0]],		[["number", "Number", "Enter year number", "1"]]],
		["Every nth year", 					[["year", "%", 0]],		[["number", "nth", "Enter year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
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
		["Every nth day in year",			[["year_day", "%", 0, 1]],		[["number", "nth", "Enter yearday interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Epoch": [
		["Epoch is", 					[["epoch","==", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is not", 				[["epoch","!=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is or later than", 		[["epoch",">=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is or earlier than", 	[["epoch","<=", 0]],		[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is later than", 		[["epoch",">", 0]],			[["number", "Number", "Enter epoch number", "1"]]],
		["Epoch is earlier than", 		[["epoch","<", 0]],			[["number", "Number", "Enter epoch number", "1"]]],
		["Every nth epoch", 			[["epoch", "%", 0, 1]],		[["number", "nth", "Enter epoch interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Weekday": [
		["Weekday is exactly", 					[["week_day", "==", 0]],		[["select"]]],
		["Weekday is not", 						[["week_day", "!=", 0]],		[["select"]]],
		["Weekday is or later than", 			[["week_day", ">=", 0]],		[["select"]]],
		["Weekday is or earlier than", 			[["week_day", "<=", 0]],		[["select"]]],
		["Weekday is later than", 				[["week_day", ">", 0]],			[["select"]]],
		["Weekday is earlier than", 			[["week_day", "<", 0]],			[["select"]]],

		["Weekday number is exactly", 			[["week_day", "==", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is not", 				[["week_day", "!=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is or later than", 	[["week_day", ">=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is or earlier than", 	[["week_day", "<=", 0]],		[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is later than", 		[["week_day", ">", 0]],			[["number", "Number", "Enter week day number", "1", "1"]]],
		["Weekday number is earlier than", 		[["week_day", "<", 0]],			[["number", "Number", "Enter week day number", "1", "1"]]],

		["Weekday name is exactly",				[["week_day_name", "==", 0]],		[["text", "Name", "Enter week day name"]]],
		["Weekday name is not",					[["week_day_name", "!=", 0]],		[["text", "Name", "Enter week day name"]]]
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
		["Phase is exactly", 				[["moon_phase", "==", 1]], [["select"]]],
		["Phase is not", 					[["moon_phase", "!=", 1]], [["select"]]],
		["Phase is or later than", 			[["moon_phase", ">=", 1]], [["select"]]],
		["Phase is or earlier than", 		[["moon_phase", "<=", 1]], [["select"]]],
		["Phase is later than", 			[["moon_phase", ">", 1]], [["select"]]],
		["Phase is earlier than", 			[["moon_phase", "<", 1]], [["select"]]],
		["Every nth phase",					[["moon_phase", "==", 1],
											 ["moon_phase_num_epoch", "%", 2, 3]],	[["select"], ["number", "nth", "Enter moon phase interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],
		
		["Month-phase count is exactly", 			[["moon_phase_num_month", "==", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Month-phase count is not", 				[["moon_phase_num_month", "!=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Month-phase count is or later than",		[["moon_phase_num_month", ">=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Month-phase count is or earlier than", 	[["moon_phase_num_month", "<=", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Month-phase count is later than", 		[["moon_phase_num_month", ">", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Month-phase count is earlier than", 		[["moon_phase_num_month", "<", 1]], [["number", "Number", "Enter moon phase count in month", "1", "1"]]],
		["Every nth month-phase count", 			[["moon_phase_num_month", "%", 1, 2]],	[["number", "nth", "Enter moon phase count in month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],


		["Year-phase count is exactly", 			[["moon_phase_num_year", "==", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Year-phase count is not", 				[["moon_phase_num_year", "!=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Year-phase count is or later than", 		[["moon_phase_num_year", ">=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Year-phase count is or earlier than", 	[["moon_phase_num_year", "<=", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Year-phase count is later than", 			[["moon_phase_num_year", ">", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Year-phase count is earlier than", 		[["moon_phase_num_year", "<", 1]], [["number", "Number", "Enter moon phase count in year", "1", "1"]]],
		["Every nth year-phase count", 				[["moon_phase_num_year", "%", 1, 2]],	[["number", "nth", "Enter moon phase count in year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["Epoch-phase count is exactly", 			[["moon_phase_num_epoch", "==", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Epoch-phase count is not", 				[["moon_phase_num_epoch", "!=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Epoch-phase count is or later than", 		[["moon_phase_num_epoch", ">=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Epoch-phase count is or earlier than", 	[["moon_phase_num_epoch", "<=", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Epoch-phase count is later than", 		[["moon_phase_num_epoch", ">", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Epoch-phase count is earlier than", 		[["moon_phase_num_epoch", "<", 1]], [["number", "Number", "Enter overall moon phase count", "1", "1"]]],
		["Every nth epoch-phase count", 			[["moon_phase_num_epoch", "%", 1, 2]],	[["number", "nth", "Enter overall moon phase count interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Cycle": [
		["Cycle is exactly", 						[["cycle", "==", 0, 1]], [["select"]]],
		["Cycle is not", 							[["cycle", "!=", 0, 1]], [["select"]]]
	],

	"Era": [
		["Era is exactly", 							[["era", "==", 0, 1]], [["select"]]],
		["Era is not", 								[["era", "!=", 0, 1]], [["select"]]]
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
		["Every nth season day",					[["season_day", "%", 0, 1]],	[["number", "nth", "Enter day in season interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]]
	],

	"Random": [
		["Random chance is above", 					[["season_perc", ">", 0, 1]],		[["number", "(0-100%)", "Random chance", "", "0", "100"], ["number", "Seed", "Seed", Math.abs(Math.random().toString().substr(7)|0), "0"]]],
		["Random chance is below", 					[["season_perc", "<", 0, 1]],		[["number", "(0-100%)", "Random chance", "", "0", "100"], ["number", "Seed", "Seed", Math.abs(Math.random().toString().substr(7)|0), "0"]]],
	],

	"Events": [
		["Event has happened exactly x days ago", 			[["event", "exactly_past", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Event is happening exactly x days from now", 		[["event", "exactly_future", 0, 1]],	[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Event is going to happen within the next x days",	[["event", "in_past", 0, 1]],			[["select"], ["number", "Number", "Enter number of days", "1", "1"]]],
		["Event has happened in the last x days", 			[["event", "in_future", 0, 1]],		[["select"], ["number", "Number", "Enter number of days", "1", "1"]]]
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