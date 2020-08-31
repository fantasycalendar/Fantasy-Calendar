<div id='calendar' x-data="CalendarRenderer">
    <template x-if="loaded" x-for="timespan in render_data.timespans">
        <div class="timespan_container grid">
            <div class='timespan_name' x-text='timespan.title'>
                <span class='timespan_number'>
                </span>
            </div>
            <div class='timespan_row_container'>
                <div class='timespan_row_names'>
                    <template x-for="weekday in timespan.weekdays">
                        <div class='week_day_name' x-text='weekday'></div>
                    </template>
                </div>
                <template x-for="week in timespan.days">
                    <div class='timespan_row'>
                        <template x-for="day in week">
                            <div x-text='day.number_text'></div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>