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
		
		["Nth days before the end of the month is exactly", 					[["inverse_day", "==", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Nth days before the end of the month is not",							[["inverse_day", "!=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Nth days before the end of the month is exactly or later than",		[["inverse_day", ">=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Nth days before the end of the month is exactly or earlier than",		[["inverse_day", "<=", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Nth days before the end of the month is later than",					[["inverse_day", ">", 0]],		[["number", "Number", "Enter day number", "1"]]],
		["Nth days before the end of the month is earlier than",				[["inverse_day", "<", 0]],		[["number", "Number", "Enter day number", "1"]]],

		["Day is intercalary",				[["intercalary", "==", 0]],		[["boolean"]]],
		["Day is not intercalary",			[["intercalary", "!=", 0]],		[["boolean"]]],
	],
	
	"Date": [
		["Date is exactly", 			[["date", "==", 0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
		["Date is not", 				[["date", "!=", 0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
		["Date is or later than", 		[["date", ">=", 0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
		["Date is or earlier than", 	[["date", "<=", 0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
		["Date is is later than", 		[["date", ">",  0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
		["Date is earlier than", 		[["date", ">",  0, 1, 2]],		[["number", "Number", "Year", "1"], ["select"], ["number", "Number", "Day", "1"]]],
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

		["Nth weekday number before the end of month is exactly", 			[["inverse_week_day_num", "==", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Nth weekday number before the end of month is not", 				[["inverse_week_day_num", "!=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Nth weekday number before the end of month is or later than", 	[["inverse_week_day_num", ">=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Nth weekday number before the end of month is or earlier than", 	[["inverse_week_day_num", "<=", 0]],		[["number", "Number", "Enter number", "1", "1"]]],
		["Nth weekday number before the end of month is later than", 		[["inverse_week_day_num", ">", 0]],			[["number", "Number", "Enter number", "1", "1"]]],
		["Nth weekday number before the end of month is earlier than", 		[["inverse_week_day_num", "<", 0]],			[["number", "Number", "Enter number", "1", "1"]]],
	],

	"Week":[
		["Week in month is exactly", 			[["month_week_num", "==", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Week in month is not", 				[["month_week_num", "!=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Week in month is or later than", 		[["month_week_num", ">=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Week in month is or earlier than", 	[["month_week_num", "<=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Week in month is later than", 		[["month_week_num", ">", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Week in month is earlier than", 		[["month_week_num", "<", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Every nth week in month", 				[["month_week_num", "%", 0, 1]],	[["number", "nth", "Enter week number in month interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["Week in year is exactly", 			[["year_week_num", "==", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Week in year is not", 				[["year_week_num", "!=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Week in year is or later than", 		[["year_week_num", ">=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Week in year is or earlier than", 	[["year_week_num", "<=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Week in year is later than", 			[["year_week_num", ">", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Week in year is earlier than", 		[["year_week_num", "<", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Every nth week in year", 				[["year_week_num", "%", 0, 1]],		[["number", "nth", "Enter week number in year interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

		["Nth week before end of month is exactly", 		[["inverse_month_week_num", "==", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Nth week before end of month is not", 			[["inverse_month_week_num", "!=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Nth week before end of month is or later than", 	[["inverse_month_week_num", ">=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Nth week before end of month is or earlier than", [["inverse_month_week_num", "<=", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Nth week before end of month is later than", 		[["inverse_month_week_num", ">", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],
		["Nth week before end of month is earlier than", 	[["inverse_month_week_num", "<", 0]],		[["number", "Number", "Enter week number in month", "1", "1"]]],

		["Nth week before end of year is exactly", 			[["inverse_year_week_num", "==", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Nth week before end of year is not", 				[["inverse_year_week_num", "!=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Nth week before end of year is or later than", 	[["inverse_year_week_num", ">=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Nth week before end of year is or earlier than", 	[["inverse_year_week_num", "<=", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Nth week before end of year is later than", 		[["inverse_year_week_num", ">", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],
		["Nth week before end of year is earlier than", 	[["inverse_year_week_num", "<", 0]],		[["number", "Number", "Enter week number in year", "1", "1"]]],

		["Total week number is exactly", 			[["total_week_num", "==", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is not", 				[["total_week_num", "!=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is or later than", 		[["total_week_num", ">=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is or earlier than", 	[["total_week_num", "<=", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is later than", 		[["total_week_num", ">", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Total week number is earlier than", 		[["total_week_num", "<", 0]],		[["number", "Number", "Enter overall week number", "1", "1"]]],
		["Every nth total week", 					[["total_week_num", "%", 0, 1]],	[["number", "nth", "Enter overall week number interval", "1", "1"], ["number", "offset", "Enter offset for interval", "0", "0"]]],

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

var moon_paths = [
	"M6.5,16a9.5,9.5 0 1,0 19,0a9.5,9.5 0 1,0 -19,0",
	"M19.79,6C22.25,7.2,25,9.92,25,16s-2.75,8.8-5.21,10a10.59,10.59,0,0,1-3.79.71A10.72,10.72,0,0,1,16,5.28,10.59,10.59,0,0,1,19.79,6Z",
	"M19.43,5.86C21.79,7,24.5,9.7,24.5,16s-2.71,9-5.07,10.14a10.55,10.55,0,0,1-3.43.58A10.72,10.72,0,0,1,16,5.28,10.55,10.55,0,0,1,19.43,5.86Z",
	"M17.87,5.46C20.23,6.34,24,8.88,24,16.17c0,6.85-3.33,9.36-5.69,10.29a11,11,0,0,1-2.31.26A10.72,10.72,0,0,1,16,5.28,10.49,10.49,0,0,1,17.87,5.46Z",
	"M17.79,5.45C20,6.3,23.5,8.77,23.5,15.88c0,7.37-3.75,9.87-5.95,10.71a9.92,9.92,0,0,1-1.55.13A10.72,10.72,0,0,1,16,5.28,10.54,10.54,0,0,1,17.79,5.45Z",
	"M17.35,5.38c1.9.79,5.15,3.25,5.15,10.72,0,7.25-3.06,9.68-5,10.5a10.87,10.87,0,0,1-1.52.12A10.72,10.72,0,0,1,16,5.28,10.1,10.1,0,0,1,17.35,5.38Z",
	"M17.05,5.34c1.6.75,4.45,3.17,4.45,10.79,0,7.39-2.68,9.76-4.3,10.52a11.9,11.9,0,0,1-1.2.07A10.72,10.72,0,0,1,16,5.28,9,9,0,0,1,17.05,5.34Z",
	"M16.85,5.33c1.3.74,3.65,3.12,3.65,10.67s-2.35,9.93-3.65,10.67c-.28,0-.56,0-.85,0A10.72,10.72,0,0,1,16,5.28,7.92,7.92,0,0,1,16.85,5.33Z",
	"M16.46,5.31c.95.78,3,3.34,3,10.69s-2.09,9.91-3,10.69l-.46,0A10.72,10.72,0,0,1,16,5.28Z",
	"M16.29,5.3c.65.8,2.21,3.48,2.21,10.78S17,25.91,16.3,26.7l-.3,0A10.72,10.72,0,0,1,16,5.28Z",
	"M16.13,5.29c.37.89,1.37,3.92,1.37,10.79s-1,9.76-1.36,10.63H16A10.72,10.72,0,0,1,16,5.28Z",
	"M16,5.29A85.5,85.5,0,0,1,16.5,16,85.5,85.5,0,0,1,16,26.71h0A10.72,10.72,0,0,1,16,5.28Z",
	"M16,26.72A10.72,10.72,0,0,1,16,5.28Z",
	"M15.5,16A85.59,85.59,0,0,0,16,26.72,10.72,10.72,0,0,1,16,5.28,85.59,85.59,0,0,0,15.5,16Z",
	"M14.5,16.08c0,6.84,1,9.77,1.36,10.63a10.71,10.71,0,0,1,0-21.42C15.5,6.17,14.5,9.2,14.5,16.08Z",
	"M15.7,26.7a10.7,10.7,0,0,1,0-21.4c-.65.8-2.21,3.47-2.21,10.78S15,25.92,15.7,26.7Z",
	"M15.55,26.7a10.71,10.71,0,0,1,0-21.4c-1,.78-3.05,3.34-3.05,10.7S14.6,25.92,15.55,26.7Z",
	"M15.16,26.68a10.71,10.71,0,0,1,0-21.36C13.85,6.06,11.5,8.43,11.5,16S13.85,25.94,15.16,26.68Z",
	"M14.81,26.65A10.72,10.72,0,0,1,15,5.33c-1.59.76-4.45,3.17-4.45,10.8C10.5,23.53,13.19,25.9,14.81,26.65Z",
	"M14.49,26.6a10.71,10.71,0,0,1,.17-21.23c-1.9.8-5.16,3.24-5.16,10.73C9.5,23.37,12.57,25.79,14.49,26.6Z",
	"M14.46,26.6a10.71,10.71,0,0,1-.24-21.16C12,6.29,8.5,8.76,8.5,15.88,8.5,23.26,12.27,25.76,14.46,26.6Z",
	"M13.72,26.47a10.71,10.71,0,0,1,.43-21C11.78,6.33,8,8.87,8,16.17,8,23,11.35,25.55,13.72,26.47Z",
	"M12.6,26.19a10.73,10.73,0,0,1,0-20.35C10.23,7,7.5,9.67,7.5,16s2.73,9,5.1,10.16Z",
	"M12.23,26a10.7,10.7,0,0,1,0-20C9.77,7.19,7,9.9,7,16S9.77,24.81,12.23,26Z",
	false,
	"M19.77,26C22.23,24.81,25,22.1,25,16S22.23,7.19,19.77,6a10.7,10.7,0,0,1,0,20Z",
	"M19.4,26.16C21.77,25,24.5,22.33,24.5,16S21.77,7,19.4,5.84a10.71,10.71,0,0,1,0,20.32Z",
	"M18.28,26.47C20.65,25.55,24,23,24,16.17c0-7.3-3.78-9.84-6.15-10.72a10.71,10.71,0,0,1,.43,21Z",
	"M17.54,26.6c2.19-.84,6-3.34,6-10.72,0-7.12-3.5-9.59-5.72-10.44a10.71,10.71,0,0,1-.24,21.16Z",
	"M17.51,26.6c1.92-.81,5-3.23,5-10.5,0-7.49-3.26-9.93-5.16-10.73a10.71,10.71,0,0,1,.17,21.23Z",
	"M17.19,26.65c1.62-.75,4.31-3.12,4.31-10.52,0-7.63-2.86-10-4.45-10.8a10.72,10.72,0,0,1,.14,21.32Z",
	"M16.84,26.68c1.31-.74,3.66-3.11,3.66-10.68S18.15,6.06,16.84,5.32a10.71,10.71,0,0,1,0,21.36Z",
	"M16.45,26.7c.95-.78,3.05-3.34,3.05-10.7S17.4,6.08,16.45,5.3a10.71,10.71,0,0,1,0,21.4Z",
	"M16.3,26.7c.67-.78,2.2-3.37,2.2-10.62S16.94,6.1,16.29,5.3a10.7,10.7,0,0,1,0,21.4Z",
	"M16.14,26.71c.37-.86,1.36-3.79,1.36-10.63s-1-9.91-1.37-10.79a10.71,10.71,0,0,1,0,21.42Z",
	"M16,26.72A85.59,85.59,0,0,0,16.5,16,85.59,85.59,0,0,0,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72V5.28a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72h0A85.59,85.59,0,0,1,15.5,16,85.59,85.59,0,0,1,16,5.28h0a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72h-.14c-.37-.86-1.36-3.79-1.36-10.63s1-9.91,1.37-10.79H16a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72l-.3,0c-.67-.78-2.2-3.37-2.2-10.62s1.56-10,2.21-10.78l.29,0a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72l-.45,0c-1-.78-3.05-3.34-3.05-10.7s2.1-9.92,3.05-10.7l.45,0a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72c-.28,0-.56,0-.84,0C13.85,25.94,11.5,23.57,11.5,16s2.35-9.94,3.66-10.68c.28,0,.56,0,.84,0a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72a11.7,11.7,0,0,1-1.19-.07c-1.62-.75-4.31-3.12-4.31-10.52,0-7.63,2.86-10,4.45-10.8.35,0,.7,0,1.05,0a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72a10.85,10.85,0,0,1-1.51-.12c-1.92-.81-5-3.23-5-10.5,0-7.49,3.26-9.93,5.16-10.73A11.9,11.9,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72a11.16,11.16,0,0,1-1.54-.12c-2.19-.84-6-3.34-6-10.72,0-7.12,3.5-9.59,5.72-10.44A10.43,10.43,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72a10.69,10.69,0,0,1-2.28-.25C11.35,25.55,8,23,8,16.17c0-7.3,3.78-9.84,6.15-10.72A11.26,11.26,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
	"M16,26.72a10.63,10.63,0,0,1-3.4-.56C10.23,25,7.5,22.33,7.5,16s2.73-9,5.1-10.16A10.72,10.72,0,1,1,16,26.72Z",
	"M16,26.72a10.52,10.52,0,0,1-3.77-.7C9.77,24.81,7,22.1,7,16S9.77,7.19,12.23,6A10.52,10.52,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z"
];

var moon_phases = {
	'4': {
        'New Moon':                 moon_paths[0],
        'First Quarter':            moon_paths[12],
        'Full Moon':                moon_paths[24],
        'Last Quarter':             moon_paths[36]
	},

	'8': {
		'New Moon':                 moon_paths[0],
		'Waxing Crescent':          moon_paths[6],
		'First Quarter':            moon_paths[12],
		'Waxing Gibbous':           moon_paths[18],
		'Full Moon':                moon_paths[24],
		'Waning Gibbous':           moon_paths[30],
		'Last Quarter':             moon_paths[36],
		'Waning Crescent':          moon_paths[42]
	},

	'16': {
		'New Moon': 				moon_paths[0],
		'New Moon Fading': 			moon_paths[3],
		'Waxing Crescent': 			moon_paths[6],
		'Waxing Crescent Fading': 	moon_paths[9],
		'First Quarter': 			moon_paths[12],
		'First Quarter Fading': 	moon_paths[15],
		'Waxing Gibbous': 			moon_paths[18],
		'Waxing Gibbous Fading': 	moon_paths[21],
		'Full Moon': 				moon_paths[24],
		'Full Moon Fading': 		moon_paths[27],
		'Waning Gibbous': 			moon_paths[30],
		'Waning Gibbous Fading': 	moon_paths[33],
		'Last Quarter': 			moon_paths[36],
		'Last Quarter Fading': 		moon_paths[39],
		'Waning Crescent': 			moon_paths[42],
		'Waning Crescent Fading': 	moon_paths[45]
	},

	'24': {
		'New Moon': 				moon_paths[0],
		'New Moon Fading': 			moon_paths[2],
		'Waxing Crescent Rising': 	moon_paths[4],
		'Waxing Crescent': 			moon_paths[6],
		'Waxing Crescent Fading': 	moon_paths[8],
		'First Quarter Rising': 	moon_paths[10],
		'First Quarter': 			moon_paths[12],
		'First Quarter Fading': 	moon_paths[14],
		'Waxing Gibbous Rising': 	moon_paths[16],
		'Waxing Gibbous': 			moon_paths[18],
		'Waxing Gibbous Fading': 	moon_paths[20],
		'Full Moon Rising': 		moon_paths[22],
		'Full Moon': 				moon_paths[24],
		'Full Moon Fading': 		moon_paths[26],
		'Waning Gibbous Rising': 	moon_paths[28],
		'Waning Gibbous': 			moon_paths[30],
		'Waning Gibbous Fading': 	moon_paths[32],
		'Last Quarter Rising': 		moon_paths[34],
		'Last Quarter': 			moon_paths[36],
		'Last Quarter Fading': 		moon_paths[38],
		'Waning Crescent Rising': 	moon_paths[40],
		'Waning Crescent': 			moon_paths[42],
		'Waning Crescent Fading': 	moon_paths[44],
		'New Moon Rising': 			moon_paths[46]
	},

	'40': {
		'New Moon': 				moon_paths[0],
		'New Moon Fading': 			moon_paths[1],
		'New Moon Faded': 			moon_paths[2],
		'Waxing Crescent Rising': 	moon_paths[3],
		'Waxing Crescent Risen': 	moon_paths[4],
		'Waxing Crescent': 			moon_paths[6],
		'Waxing Crescent Fading': 	moon_paths[7],
		'Waxing Crescent Faded': 	moon_paths[8],
		'First Quarter Rising': 	moon_paths[9],
		'First Quarter Risen': 		moon_paths[10],
		'First Quarter': 			moon_paths[12],
		'First Quarter Fading': 	moon_paths[13],
		'First Quarter Faded': 		moon_paths[14],
		'Waxing Gibbous Rising': 	moon_paths[15],
		'Waxing Gibbous Risen': 	moon_paths[16],
		'Waxing Gibbous': 			moon_paths[18],
		'Waxing Gibbous Fading': 	moon_paths[19],
		'Waxing Gibbous Faded': 	moon_paths[20],
		'Full Moon Rising': 		moon_paths[21],
		'Full Moon Risen': 			moon_paths[22],
		'Full Moon': 				moon_paths[24],
		'Full Moon Fading': 		moon_paths[25],
		'Full Moon Faded': 			moon_paths[26],
		'Waning Gibbous Rising': 	moon_paths[27],
		'Waning Gibbous Risen': 	moon_paths[28],
		'Waning Gibbous': 			moon_paths[30],
		'Waning Gibbous Fading': 	moon_paths[31],
		'Waning Gibbous Faded': 	moon_paths[32],
		'Last Quarter Rising': 		moon_paths[33],
		'Last Quarter Risen': 		moon_paths[34],
		'Last Quarter': 			moon_paths[36],
		'Last Quarter Fading': 		moon_paths[37],
		'Last Quarter Faded': 		moon_paths[38],
		'Waning Crescent Rising': 	moon_paths[39],
		'Waning Crescent Risen': 	moon_paths[40],
		'Waning Crescent': 			moon_paths[42],
		'Waning Crescent Fading': 	moon_paths[43],
		'Waning Crescent Faded': 	moon_paths[44],
		'New Moon Rising': 			moon_paths[45],
		'New Moon Risen': 			moon_paths[46]
	}
};

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
						"name":"Autumn",
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