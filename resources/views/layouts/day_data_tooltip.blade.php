<div
    id='day_data_tooltip_box'
    x-data="CalendarDayData"
    @day-data-modal-open.window="
        show_epoch($event);
        $nextTick(() => {
            update_position()
            open = true;
        });
    "
    x-show="open"
    @keydown.escape.window="open = false"
    @click.away="open = false"
    x-cloak
>
	<h4 class='bold-text text-center'>Day data:</h4>

    <table>
		<tr class='day_data_year' x-show="displayed_data.year">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The current year"
            >
                Year:
            </td>
            <td class='data_container' x-text="displayed_data.year"></td>
        </tr>
		<tr class='day_data_era_year' x-show="displayed_data.era_year">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The year within the era"
            >
                Era year:
            </td>
            <td class='data_container' x-text="displayed_data.era_year"></td>
        </tr>
		<tr class='day_data_timespan_name' x-show="displayed_data.timespan_name">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The name of the month"
            >
                Month name:
            </td>
            <td class='data_container' x-text="displayed_data.timespan_name"></td>
        </tr>
		<tr class='day_data_day' x-show="displayed_data.day">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The day in the month"
            >
                Day:
            </td>
            <td class='data_container' x-text="displayed_data.day"></td>
        </tr>
		<tr class='day_data_epoch' x-show="displayed_data.epoch">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of days that has appeared since the first year"
            >
                Epoch:
            </td>
            <td class='data_container' x-text="displayed_data.epoch"></td>
        </tr>
		<tr class='day_data_year_day' x-show="displayed_data.year_day">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The day within the year"
            >
                Year day:
            </td>
            <td class='data_container' x-text="displayed_data.year_day"></td>
        </tr>
		<tr class='day_data_week_day' x-show="displayed_data.week_day_name">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The weekday's name"
            >
                Weekday:
            </td>
            <td class='data_container' x-text="displayed_data.week_day_name"></td>
        </tr>
		<tr class='day_data_timespan_number' x-show="displayed_data.timespan_number">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The number of the month in the year"
            >
                Month number:
            </td>
            <td class='data_container' x-text="displayed_data.timespan_number"></td>
        </tr>
		<tr class='day_data_timespan_count' x-show="displayed_data.timespan_count">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The number of times this month has appeared since the first year"
            >
                Month count:
            </td>
            <td class='data_container' x-text="displayed_data.timespan_count"></td>
        </tr>
		<tr class='day_data_num_timespans' x-show="displayed_data.num_timespans">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of total months that has appeared since the first year"
            >
                Total month count:
            </td>
            <td class='data_container' x-text="displayed_data.num_timespans"></td>
        </tr>
		<tr class='day_data_inverse_day' x-show="displayed_data.inverse_day">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Days until the end of the month"
            >
                Inverse day:
            </td>
            <td class='data_container' x-text="displayed_data.inverse_day"></td>
        </tr>
		<tr class='day_data_leap_day' x-show="displayed_data.leap_day_index">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The current leap day"
            >
                Leap day index:
            </td>
            <td class='data_container' x-text="displayed_data.leap_day_index"></td>
        </tr>
		<tr class='day_data_week_day_num' x-show="displayed_data.week_day_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The number of the weekday"
            >
                Weekday number:
            </td>
            <td class='data_container' x-text="displayed_data.week_day_num"></td>
        </tr>
		<tr class='day_data_inverse_week_day_num' x-show="displayed_data.inverse_week_day_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of weekdays until the end of the week"
            >
                Inverse weekday:
            </td>
            <td class='data_container' x-text="displayed_data.inverse_week_day_num"></td>
        </tr>
		<tr class='day_data_month_week_num' x-show="displayed_data.month_week_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of the current week in the month"
            >
                Week in month:
            </td>
            <td class='data_container' x-text="displayed_data.month_week_num"></td>
        </tr>
		<tr class='day_data_inverse_month_week_num' x-show="displayed_data.inverse_month_week_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of weeks left until the end of the month"
            >
                Inverse month week count:
            </td>
            <td class='data_container' x-text="displayed_data.inverse_month_week_num"></td>
        </tr>
		<tr class='day_data_year_week_num' x-show="displayed_data.year_week_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title=""
            >
                Week in year:
            </td>
            <td class='data_container' x-text="displayed_data.year_week_num"></td>
        </tr>
		<tr class='day_data_inverse_year_week_num' x-show="displayed_data.inverse_year_week_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Number of weeks left until the end of the year"
            >
                Inverse year week count:
            </td>
            <td class='data_container' x-text="displayed_data.inverse_year_week_num"></td>
        </tr>
		<tr class='day_data_total_week_num' x-show="displayed_data.total_week_num">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Total number of weeks since the first year"
            >
                Total weeks since first year:
            </td>
            <td class='data_container' x-text="displayed_data.total_week_num"></td>
        </tr>
		<tr class='day_data_moon_phase' x-show="displayed_data.moon_phases.length">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The moon phases currently active"
            >
                Moon phase:
            </td>
            <td class='data_container'>
                <template x-for="moon_phase in displayed_data.moon_phases">
                    <p class="mb-0" x-text="moon_phase"></p>
                </template>
            </td>
        </tr>
		<tr class='day_data_moon_phase_num_month' x-show="displayed_data.moon_phase_num_month.length">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="How many times this moon's phase has been seen this month (1st full moon etc)"
            >
                Moon phase month count:
            </td>
            <td class='data_container'>
                <template x-for="moon_phase_month_count in displayed_data.moon_phase_num_month">
                    <p class="mb-0" x-text="moon_phase_month_count"></p>
                </template>
            </td>
        </tr>
		<tr class='day_data_moon_phase_num_year' x-show="displayed_data.moon_phase_num_year.length">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="How many times this moon's phase has been seen this year (1st full moon etc)"
            >
                Moon phase year count:
            </td>
            <td class='data_container'>
                <template x-for="moon_phase_year_count in displayed_data.moon_phase_num_year">
                    <p class="mb-0" x-text="moon_phase_year_count"></p>
                </template>
            </td>
        </tr>
		<tr class='day_data_moon_phase_num_epoch' x-show="displayed_data.moon_phase_num_epoch.length">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="How many times this moon's phase has been seen since the first year"
            >
                Moon phase count total:
            </td>
            <td class='data_container'>
                <template x-for="moon_phase_epoch_count in displayed_data.moon_phase_num_epoch">
                    <p class="mb-0" x-text="moon_phase_epoch_count"></p>
                </template>
            </td>
        </tr>
		<tr class='day_data_intercalary'>
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Whether this day is an intercalary day or not"
            >
                Day is intercalary:
            </td>
            <td class='data_container' x-text="displayed_data.intercalary"></td>
        </tr>
		<tr class='day_data_era' x-show="displayed_data.era_name">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title=""
            >
                Era:
            </td>
            <td class='data_container' x-text="displayed_data.era_name"></td>
        </tr>
		<tr class='day_data_cycle' x-show="displayed_data.cycles.length">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The name of the current era"
            >
                Current cycle(s):
            </td>
            <td class='data_container'>
                <template x-for="cycle in displayed_data.cycles">
                    <p class="mb-0" x-text="cycle"></p>
                </template>
            </td>
        </tr>
		<tr class='day_data_season' x-show="displayed_data.season_name">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Name of the current season"
            >
                Season name:
            </td>
            <td class='data_container' x-text="displayed_data.season_name"></td>
        </tr>
		<tr class='day_data_season' x-show="displayed_data.season_perc">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="How far through the season this day is"
            >
                Season percentage:
            </td>
            <td class='data_container' x-text="displayed_data.season_perc + '%'"></td>
        </tr>
		<tr class='day_data_season' x-show="displayed_data.season_day">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="Days since the start of this season"
            >
                Season day:
            </td>
            <td class='data_container' x-text="displayed_data.season_day"></td>
        </tr>
		<tr class='day_data_season' x-show="displayed_data.sunrise">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The time the sun will rise today"
            >
                Sunrise:
            </td>
            <td class='data_container' x-text="displayed_data.sunrise"></td>
        </tr>
		<tr class='day_data_season' x-show="displayed_data.sunset">
            <td
                class='bold-text protip'
                data-pt-position="left"
                data-pt-title="The time the sun will set today"
            >
                Sunset:
            </td>
            <td class='data_container' x-text="displayed_data.sunset"></td>
        </tr>
	</table>

</div>
