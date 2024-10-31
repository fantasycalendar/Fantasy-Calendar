@props(['calendar' => null])

<div class='add_inputs'>

	<div class='bold-text'>Layout Settings:</div>

	@if(request()->is('calendars/*/edit'))
		<label class="row no-gutters setting">
			<button x-data type='button' id='btn_layouts' class='btn btn-primary full'
							@click="$dispatch('open-layouts-modal')">Select Layout
			</button>
		</label>
	@endif

	<div class="list-group mb-3">
		<label class="row no-gutters setting my-0 list-group-item py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Makes the calendar only show the current month. Enhances calendar loading performance, especially with many moons.">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='show_current_month'>
				<span>
                                    Show only current month
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting my-0 list-group-item py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This will add 'Month 1' and so on to each month in the calendar">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='add_month_number' refresh='false'>
				<span>
                                    Add month number to months
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting my-0 list-group-item py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This adds a small number at the bottom left of the days in the calendar showing which year-day it is">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='add_year_day_number' refresh='false'>
				<span>
                                    Add year day to each day
                                </span>
			</div>
		</label>
	</div>

	<!------------------------------------------------------->

	<div class='bold-text'>Guest View Settings:</div>

	<div class="list-group mb-3">
		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This makes it so that no one can view your calendar, unless you have added them as a user to the calendar">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings' fc-index='private'
							 refresh='false'>
				<span>
                                    Make calendar private
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Allows guests viewing your calendar to check past and future dates with the preview date">
			<div class='col'>
				<input type='checkbox' checked class='margin-right static_input' data='settings'
							 fc-index='allow_view' refresh='false'>
				<span>
                                    Enable previewing dates in calendar
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Similar to the previous setting, but this limits the viewer to only preview backwards, not forwards. This setting needs Allowing advancing view in calendar to be enabled.">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='only_backwards' refresh='false'>
				<span>
                                    Limit previewing to only past dates
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Guest viewers will not be able to see past the current date. Any future days will be grayed out.">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='only_reveal_today' refresh='false'>
				<span>
                                    Show only up to current day
                                </span>
			</div>
		</label>
	</div>

	<!------------------------------------------------------->

	<div class='bold-text'>Hiding Settings:</div>

	<div class="list-group mb-3">
		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Hides all of the moons from guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_moons' refresh='false'>
				<span>
                                    Hide all moons from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Hides the clock from guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_clock' refresh='false'>
				<span>
                                    Hide time from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Hides all events from guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_events' refresh='false'>
				<span>
                                    Hide all events from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Hides the era text at the top of the calendar and only shows the year instead to guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_eras' refresh='false'>
				<span>
                                    Hide era from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Prevents all weather from appearing on the calendar for guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_all_weather' refresh='false'>
				<span>
                                    Hide all weather from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="Prevents any future weather from appearing on the calendar for guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_future_weather' refresh='false'>
				<span>
                                    Hide future weather from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title='This hides the exact temperature from guest viewers - this is really useful with the cinematic temperature setting as guests will only see "cold", "sweltering" and the like'>
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_weather_temp' refresh='false'>
				<span>
                                    Hide temperature from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This hides the exact wind velocity from guest viewers">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_wind_velocity' refresh='false'>
				<span>
                                    Hide wind velocity from guest viewers
                                </span>
			</div>
		</label>

		<label class="row no-gutters setting list-group-item my-0 py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This will hide the weekday bar at the top of each month">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='hide_weekdays' refresh='false'>
				<span>
                                    Hide weekdays in calendar
                                </span>
			</div>
		</label>
	</div>

	@if(isset($calendar) && Auth::user()->can('add-users', $calendar))

		<div class='bold-text'>Event Settings:</div>

		<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right"
					 data-pt-title="This will change whether users can comment on the events of your calendar. When disabled, only the owner can comment on events.">
			<div class='col'>
				<input type='checkbox' class='margin-right static_input' data='settings'
							 fc-index='comments' refresh='false'>
				<span>
								Allow user comments on events
							</span>
			</div>
		</label>

	@endif

	<div class='bold-text'>Advanced Settings:</div>

	<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right"
				 data-pt-title="Normally, the year count is -2, -1, 1, 2, and so on. This makes it so that 0 exists, so -2, -1, 0, 1, 2.">
		<div class='col'>
			@if(request()->is('calendars/*/edit') && $calendar->isLinked())
				<input type='checkbox' class='margin-right'
							 {{ Arr::get($calendar->static_data, 'settings.year_zero_exists') ? "checked" : "" }} disabled>
			@else
				<input type='checkbox' class='margin-right static_input' data='settings'
							 id='year_zero_exists' fc-index='year_zero_exists'>
			@endif
			<span>
								Year zero exists
							</span>
		</div>
	</label>

	@if(request()->is('calendars/*/edit') && $calendar->isLinked())
		<p class=""><a onclick="linked_popup();" href='#'>Why are some settings disabled?</a></p>
	@endif

</div>
