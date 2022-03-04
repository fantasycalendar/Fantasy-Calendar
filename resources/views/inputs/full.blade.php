<form id="input_container" class='d-print-none'>

	@include('inputs.sidebar.header')

	@yield('label')

	<div class='wrap-collapsible step-hide'>
		<div class="view-tabs btn-group d-flex mb-2 w-100">
            <button type="button" data-pt-position='top' data-pt-title='What you, the owner, will always see' data-view-type='owner' class="protip owner w-100 btn btn-sm btn-primary">Owner View</button>
            <button type="button" data-pt-position='top' data-pt-title='A simulated view of what guests with the link to this calendar will see' data-view-type='player' class="protip player w-100 btn btn-sm btn-secondary">Guest View</button>
            <button type="button" data-pt-position='top' data-pt-title='Graphs showing the weather curves' data-view-type='weather' class="protip weather w-100 btn btn-sm btn-secondary">Climate view</button>
		</div>
	</div>

    <div class='wrap-collapsible step-hide'>
        <div class="d-flex mb-2 w-100">
            <label class="row no-gutters setting border rounded py-2 px-3 protip w-100" data-pt-position="right" data-pt-title="If unchecked, you will be prompted to apply changes after making them, instead of loading the calendar every time.">
                <div class='col'>
                    <input type='checkbox' class='margin-right' data='settings' id='apply_changes_immediately' checked>
                    <span>
                        Apply changes immediately
                    </span>
                </div>
            </label>
        </div>
    </div>

	<div class="accordion">

        <!---------------------------------------------->
        <!----------------- STATISTICS ----------------->
        <!---------------------------------------------->

        <x-sidebar.statistics></x-sidebar.statistics>


		<!---------------------------------------------->
		<!---------------- CURRENT DATE ---------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-current_date'>
			<input id="collapsible_date" class="toggle" type="checkbox">
			<label for="collapsible_date" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-hourglass-half"></i> Current Date <a target="_blank" data-pt-position="right" data-pt-title='More Info: Date' href='{{ helplink('current_date_and_time') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div id='clock' class='mb-2'>
					<canvas style="z-index: 2;" id="clock_face"></canvas>
					<canvas style="z-index: 1;" id="clock_sun"></canvas>
					<canvas style="z-index: 0;" id="clock_background"></canvas>
				</div>

				<div class='center-text hidden' id='empty_calendar_explaination'>
					This calendar doesn't have any weekdays or months yet, so you can't change the date.
				</div>

				<div class='date_inputs date_control container' id='date_inputs'>

					<div class='row'>
						<h5>Current date:</h5>
					</div>

					<div class='row my-2 center-text hidden calendar_link_explanation'>
						@if(request()->is('calendars/*/edit') && $calendar->parent != null)
							<p class='m-0'>This calendar is using a different calendar's date to calculate the current date. Only the <a href='/calendars/{{ $calendar->parent->hash }}/edit' target="_blank">parent calendar</a> can set the date for this calendar.</p>
						@endif
					</div>

                    <div class='row'>

                        <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
                            </div>
                            <input class='form-control year-input' id='current_year' type='number'>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_year' id='add_current_year'><i class="icon-plus"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class='row mt-2'>

                        <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current month in the year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                    </div>

                    <div class='row mt-2'>

                        <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current day in the month">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_day' id='add_current_day'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                    </div>

                    <div class='row mt-2 clock_inputs'>

                        <div class='input-group protip'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn small-text btn-danger adjust_hour' val='-1'>1hr</button>
                                <button type='button' class='btn small-text border-left btn-danger adjust_minute' val='-30'>30m</button>
                            </div>

                            <input class='form-control form-control-sm text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                            <span class="px-1">:</span>
                            <input class='form-control form-control-sm protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">

                            <div class='input-group-append'>
                                <button type='button' class='btn small-text btn-success adjust_minute' val='30'>30m</button>
                                <button type='button' class='btn small-text border-left btn-success adjust_hour' val='1'>1h</button>
                            </div>
                        </div>
                    </div>
				</div>


				<div class='date_inputs date_control preview_date_controls container mt-3'>

					<div class='row'>
						<h5 class="my-0 py-0">Preview date:</h5>
					</div>

                    <div class='row mt-2'>

                        <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The preview year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
                            </div>
                            <input class='form-control year-input' id='target_year' type='number'>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_year' id='add_target_year'><i class="icon-plus"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class='row mt-2'>

                        <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The preview month of the preview year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-list inclusive date' id='target_timespan'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                    </div>

                    <div class='row mt-2'>

                        <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The current day of the preview month">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-day-list inclusive date' id='target_day'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_day' id='add_target_day'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                    </div>

					<div class='row my-2'>
						<div class='btn btn-success full' id='go_to_preview_date'>Go To Preview date</div>
					</div>

					<div class='row my-2'>
						<div class='btn btn-info full hidden' disabled id='reset_preview_date_button'>Go To Current Date</div>
					</div>

				</div>

                <div class='wrap-collapsible card full date_inputs'>
                    <input id="collapsible_add_units" class="toggle" type="checkbox">
                    <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed units to calendar dates</label>
                    <div class="collapsible-content container card-body">

						<div class='row no-gutters mx-0'>
							<input type='number' class="form-control form-control-sm full" id='unit_years' placeholder="Years">
							<input type='number' class="form-control form-control-sm full" id='unit_months' placeholder="Months">
							<input type='number' class="form-control form-control-sm full" id='unit_days' placeholder="Days">
						</div>
						<div class='row no-gutters mx-0 my-2'>
							<div class='col-md-6 col-sm-12'>
								<input type='number' class="form-control form-control-sm full" id='unit_hours' placeholder="Hours">
							</div>
							<div class='col-md-6 col-sm-12'>
								<input type='number' class="form-control form-control-sm full" id='unit_minutes' placeholder="Minutes">
							</div>
						</div>

						@if(request()->is('calendars/*/edit') && $calendar->parent == null)
                        	<button type="button" step="1.0" class="btn btn-primary btn-block my-2" id='current_date_btn'>To current date</button>
						@endif
                        <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" id='preview_date_btn'>To preview date</button>

                    </div>

                </div>

            </div>

		</div>



		<!---------------------------------------------->
		<!-------------------- CLOCK ------------------->
		<!---------------------------------------------->

        <x-sidebar.clock :calendar="$calendar"></x-sidebar.clock>



		<!---------------------------------------------->
		<!------------------- WEEKDAYS ----------------->
		<!---------------------------------------------->

        <x-sidebar.weekdays :calendar="$calendar"></x-sidebar.weekdays>

		<!---------------------------------------------->
		<!----------------- TIMESPANS ------------------>
		<!---------------------------------------------->

        <x-sidebar.timespans :calendar="$calendar"></x-sidebar.timespans>


		<!---------------------------------------------->
		<!------------------ LEAP DAYS ----------------->
		<!---------------------------------------------->

        <x-sidebar.leap-days :calendar="$calendar"></x-sidebar.leap-days>

		<!---------------------------------------------->
		<!-------------------- ERAS -------------------->
		<!---------------------------------------------->

        <x-sidebar.eras :calendar="$calendar"></x-sidebar.eras>

		<!---------------------------------------------->
		<!------------------- MOONS -------------------->
		<!---------------------------------------------->

        <x-sidebar.moons :calendar="$calendar"></x-sidebar.moons>


		<!---------------------------------------------->
		<!------------------- SEASONS ------------------>
		<!---------------------------------------------->

        <x-sidebar.seasons :calendar="$calendar"></x-sidebar.seasons>


		<!---------------------------------------------->
		<!------------------- WEATHER ------------------>
		<!---------------------------------------------->

		<x-sidebar.weather :calendar="$calendar"></x-sidebar.weather>

		<!---------------------------------------------->
		<!------------------ LOCATIONS ----------------->
		<!---------------------------------------------->

        <x-sidebar.locations :calendar="$calendar"></x-sidebar.locations>

		<!---------------------------------------------->
		<!------------------- CYCLES ------------------->
		<!---------------------------------------------->

        <x-sidebar.cycles :calendar="$calendar"></x-sidebar.cycles>

		<!---------------------------------------------->
		<!----------------- CATEGORIES ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-categories'>
			<input id="collapsible_categories" class="toggle" type="checkbox">
			<label for="collapsible_categories" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-th-list"></i> Event Categories <a target="_blank" data-pt-position="right" data-pt-title='More Info: Event Categories' href='{{ helplink('event_categories') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row no-gutters bold-text'>
					<div class='col'>
						New event category:
					</div>
				</div>
				<div class='add_inputs event_categories row no-gutters'>
					<div class="col">
						<input type='text' class='form-control name' id='event_category_name_input' placeholder='Event category name'>
					</div>
					<div class="col-auto">
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

                <div class='sortable list-group' id='event_category_list'></div>

                <div class='row no-gutters my-2'>
                    <div class='separator'></div>
                </div>

                <div class='row no-gutters bold-text'>
                    <div class='col'>
                       Default category:
                        <select class='form-control event-category-list protip' data-pt-position="right" data-pt-title="This sets the category to be selected by default when a new event is created" id='default_event_category'></select>
    		      	</div>
                </div>
            </div>
		</div>

		<!---------------------------------------------->
		<!------------------- EVENTS ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-events'>
			<input id="collapsible_events" class="toggle" type="checkbox">
			<label for="collapsible_events" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-calendar-check"></i> Events <a target="_blank" data-pt-position="right" data-pt-title='More Info: Events' href='{{ helplink('events') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row no-gutters bold-text'>
					<div class='col'>
						New event:
					</div>
				</div>

				<div class='add_inputs events row no-gutters'>
					<div class="col">
						<input type='text' class='form-control name' id='event_name_input' placeholder='Event name'>
					</div>
					<div class="col-auto">
						<button type='button' class='btn btn-primary add' @click="$dispatch('event-editor-modal-new-event', { epoch: dynamic_data.epoch })"><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable list-group' id='events_sortable'></div>
			</div>
		</div>


		<!---------------------------------------------->
		<!------------------ SETTINGS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-settings'>
			<input id="collapsible_settings" class="toggle" type="checkbox">
			<label for="collapsible_settings" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-cog"></i> Settings <a target="_blank" data-pt-position="right" data-pt-title='More Info: Settings' href='{{ helplink('settings') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='add_inputs'>

					<div class='bold-text'>Layout Settings:</div>

					@if(request()->is('calendars/*/edit'))
					<label class="row no-gutters setting">
						<button x-data type='button' id='btn_layouts' class='btn btn-primary full' @click="$dispatch('open-layouts-modal')">Select Layout</button>
					</label>
					@endif

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Makes the calendar only show the current month. Enhances calendar loading performance, especially with many moons.">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='show_current_month'>
							<span>
								Show only current month
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will add 'Month 1' and so on to each month in the calendar">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='add_month_number' refresh='false'>
							<span>
								Add month number to months
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This adds a small number at the bottom left of the days in the calendar showing which year-day it is">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='add_year_day_number' refresh='false'>
							<span>
								Add year day to each day
							</span>
						</div>
					</label>

					<!------------------------------------------------------->

					<div class='bold-text'>Guest View Settings:</div>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This makes it so that no one can view your calendar, unless you have added them as a user to the calendar">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='private' refresh='false'>
							<span>
								Make calendar private
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Allows guests viewing your calendar to check past and future dates with the preview date">
						<div class='col'>
							<input type='checkbox' checked class='margin-right static_input' data='settings' fc-index='allow_view' refresh='false'>
							<span>
								Enable previewing dates in calendar
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Similar to the previous setting, but this limits the viewer to only preview backwards, not forwards. This setting needs Allowing advancing view in calendar to be enabled.">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='only_backwards' refresh='false'>
							<span>
								Limit previewing to only past dates
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Guest viewers will not be able to see past the current date. Any future days will be grayed out.">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='only_reveal_today' refresh='false'>
							<span>
								Show only up to current day
							</span>
						</div>
					</label>

					<!------------------------------------------------------->

					<div class='bold-text'>Hiding Settings:</div>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides all of the moons from guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_moons' refresh='false'>
							<span>
								Hide all moons from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides the clock from guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_clock' refresh='false'>
							<span>
								Hide time from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides all events from guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_events' refresh='false'>
							<span>
								Hide all events from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Hides the era text at the top of the calendar and only shows the year instead to guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_eras' refresh='false'>
							<span>
								Hide era from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Prevents all weather from appearing on the calendar for guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_all_weather' refresh='false'>
							<span>
								Hide all weather from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Prevents any future weather from appearing on the calendar for guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_future_weather' refresh='false'>
							<span>
								Hide future weather from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title='This hides the exact temperature from guest viewers - this is really useful with the cinematic temperature setting as guests will only see "cold", "sweltering" and the like'>
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_weather_temp' refresh='false'>
							<span>
								Hide temperature from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This hides the exact wind velocity from guest viewers">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_wind_velocity' refresh='false'>
							<span>
								Hide wind velocity from guest viewers
							</span>
						</div>
					</label>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will hide the weekday bar at the top of each month">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_weekdays' refresh='false'>
							<span>
								Hide weekdays in calendar
							</span>
						</div>
					</label>

                    @if(isset($calendar) && Auth::user()->can('add-users', $calendar))

					<div class='bold-text'>Event Settings:</div>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="This will change whether users can comment on the events of your calendar. When disabled, only the owner can comment on events.">
						<div class='col'>
							<input type='checkbox' class='margin-right static_input' data='settings' fc-index='comments' refresh='false'>
							<span>
								Allow user comments on events
							</span>
						</div>
					</label>

					@endif

					<div class='bold-text'>Advanced Settings:</div>

					<label class="row no-gutters setting border rounded py-1 px-2 protip" data-pt-position="right" data-pt-title="Normally, the year count is -2, -1, 1, 2, and so on. This makes it so that 0 exists, so -2, -1, 0, 1, 2.">
						<div class='col'>
							@if(request()->is('calendars/*/edit') && $calendar->isLinked())
								<input type='checkbox' class='margin-right' {{ Arr::get($calendar->static_data, 'settings.year_zero_exists') ? "checked" : "" }} disabled>
							@else
								<input type='checkbox' class='margin-right static_input' data='settings' id='year_zero_exists' fc-index='year_zero_exists'>
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
			</div>
		</div>

		@if(request()->is('calendars/*/edit'))

			<!---------------------------------------------->
			<!--------------- User Management -------------->
			<!---------------------------------------------->
			<div class='wrap-collapsible card settings-users'>
				<input id="collapsible_users" class="toggle" type="checkbox">
				<label for="collapsible_users" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-user"></i> User Management <a target="_blank" data-pt-position="right" data-pt-title='More Info: User Management' href='{{ helplink('user_management') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
				<div class="collapsible-content card-body">

					@if(Auth::user()->can('add-users', $calendar))

						<div class='row no-gutters'>
							<p class='m-0'>Invite your friends to collaborate!</p>
                            <p><small>Once they accept your invite, you'll be able to assign them a role.</small></p>
						</div>

						<div class='row no-gutters my-1'>
							<div class="col-md">
								<input type='text' class='form-control' id='email_input' placeholder='Email'>
							</div>
							<div class="col-md-auto">
								<button type='button' class='btn full btn-primary' id='btn_send_invite'>Send Invite</button>
							</div>
						</div>
						<div class='row no-gutters mb-2 hidden'>
							<p class='m-0 email_text alert alert-success'></p>
						</div>

						<div class='sortable' id='calendar_user_list'></div>

						<div class='row no-gutters my-1'>
							<button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_users'>Refresh</button>
						</div>

					@else

						<div class='row no-gutters my-1'>
							<p>Invite your friends to collaborate on this calendar!</p>
							<p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe now</a> to unlock this feature!</p>
						</div>

					@endif

				</div>
			</div>

		@endif

		@if(request()->is('calendars/*/edit'))
			<!---------------------------------------------->
			<!------------------ LINKING ------------------->
			<!---------------------------------------------->
			<div class='wrap-collapsible card settings-linking'>
				<input id="collapsible_linking" class="toggle" type="checkbox">

				<label for="collapsible_linking" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-link"></i> Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='More Info: Calendar Linking' href='{{ helplink('calendar_linking') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>

                <div class="collapsible-content card-body">

                    <div class='row no-gutters'>
                        <p class="m-0">Calendar linking allows you to connect two calendar's dates, making one follow the other!</p>
                        <p><small>This is a complex feature, we recommend you check out the article on <a href='{{ helplink('calendar_linking') }}' target="_blank"><i class="icon-question-sign"></i> Calendar Linking</a>.</small></p>
                    </div>

					@if(Auth::user()->can('link', $calendar))

						<div id='calendar_link_hide'>

							@if($calendar->parent != null)
								<div class='row no-gutters my-1 center-text hidden calendar_link_explanation'>
									<p class='m-0'>This calendar is already linked to a <a href='/calendars/{{ $calendar->parent->hash }}/edit' target="_blank">parent calendar</a>. Before linking any calendars to this one, you must unlink this calendar from its parent.</p>
								</div>
							@else

								<div class='row no-gutters my-1'>
									<select class='form-control' id='calendar_link_select'></select>
								</div>
								<div class='row no-gutters my-1'>
									<button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_list_select'>Refresh</button>
								</div>

								<div class='sortable' id='calendar_link_list'></div>
								<div class='sortable mt-1' id='calendar_new_link_list'></div>
							@endif
						</div>

					@else

						<div class='row no-gutters my-1'>
							<p>Link calendars together, and make this calendar's date drive the date of other calendars!</p>
							<p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe now</a> to unlock this feature!</p>
						</div>

					@endif
				</div>
			</div>
		@endif
	</form>
</div>

<button id='input_collapse_btn' class="hamburger hamburger--arrowturn is-active d-print-none" type="button">
	<span class="hamburger-box">
		<span class="hamburger-inner"></span>
	</span>
</button>

<div id="calendar_container">

	<div id="modal_background" class='flexible_background blurred_background'>
		<div id="modal">
			<span id="modal_text">
				This is an alert box.
			</span>
		</div>
	</div>

    <div id="reload_background" class='flexible_background blurred_background d-flex flex-column justify-content-center hidden d-print-none'>
        <div class='p-2 text-white'>You have made changes to your calendar.</div>
        <div class='p-2'><button type='button' class='btn btn-primary' id='apply_changes_btn'>Update preview</button></div>
    </div>

    <div id="top_follower" :class="{ 'single_month': apply == 'single_month' }" x-data="{ apply: '' }" @layout-change.window="apply = $event.detail.apply">

		<div class='parent_button_container hidden d-print-none'>
			<div class='container d-flex h-100 p-0'>
				<div class='col justify-content-center align-self-center full'>
					<button class='btn btn-danger full' disabled id='rebuild_calendar_btn'>Parent data changed - reload</button>
				</div>
			</div>
		</div>

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden d-print-none sub_year' disabled fc-index='year' value='-1'>< Year</button>
            <button class='btn btn-danger btn_preview_date hidden d-print-none sub_month' disabled fc-index='timespan' value='-1'>
                <span x-cloak x-show="apply != 'single_month'">< Month</span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-left"></i></span>
            </button>
		</div>

		<div class='reset_preview_date_container m-1 left'>
			<button type='button' class='btn m-0 btn-info hidden reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
		</div>

        <div class="follower_center">
            <div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>
        </div>

		<div class='reset_preview_date_container m-1 right'>
            <button type='button' class='btn m-0 btn-info hidden reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden d-print-none add_year' disabled fc-index='year' value='1'>Year ></button>
            <button class='btn btn-success btn_preview_date hidden d-print-none add_month' disabled fc-index='timespan' value='1'>
                <span x-cloak x-show="apply != 'single_month'">Month ></span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-right"></i></span>
            </button>
        </div>

	</div>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))

	<div id="weather_container" class="hidden">

		<div id='day_length' class='hidden'>
			<h3 class='text-center mt-3'>Sunrise and Sunset</h3>
			<canvas class='chart'></canvas>
		</div>

		<div id='temperature' class='hidden'>
			<h3 class='text-center mt-3'>Temperature</h3>
			<canvas class='chart'></canvas>
		</div>

		<div id='precipitation' class='hidden'>
			<h3 class='text-center mt-3'>Precipitation</h3>
			<canvas class='chart'></canvas>
		</div>

	</div>
    <div class="copyright text-center">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd - <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></small>
    </div>

</div>
<div id='html_edit'></div>
