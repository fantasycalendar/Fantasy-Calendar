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

	<!---------------------------------------------->
	<!----------------- STATISTICS ----------------->
	<!---------------------------------------------->
	<div class="accordion">
		<div class='wrap-collapsible card settings-statistics'>
			<input id="collapsible_statistics" class="toggle" type="checkbox">
			<label for="collapsible_statistics" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-chart-pie"></i> Statistics <a target="_blank" data-pt-position="right" data-pt-title='More Info: Statistics' href='{{ helplink('statistics') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">
                <div class='row no-gutters'>
                    <div class='col-6 bold-text'>
                        Avg. year length:
                    </div>
                    <div class='col-6 align-left'>
                        <div class='detail-text' id='fract_year_length'>
                        </div>
                    </div>
                </div>
                <div class='row no-gutters'>
                    <div class='col-6 bold-text'>
                        Avg. month length:
                    </div>
                    <div class='col-6 align-left'>
                        <div class='detail-text' id='avg_month_length'>
                        </div>
                    </div>
                </div>
			</div>


		</div>



		<!---------------------------------------------->
		<!---------------- CURRENT DATE ---------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-current_date'>
			<input id="collapsible_date" class="toggle" type="checkbox">
			<label for="collapsible_date" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-hourglass-half"></i> Current Date <a target="_blank" data-pt-position="right" data-pt-title='More Info: Date' href='{{ helplink('current_date_and_time') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
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
						<h4>Current date:</h4>
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


				<div class='date_inputs date_control container mt-3'>

					<div class='row'>
						<h4 class="my-0 py-0">Preview date:</h4>
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

		<div class='wrap-collapsible card settings-clock'>
			<input id="collapsible_clock" class="toggle" type="checkbox">
			<label for="collapsible_clock" class="lbl-toggle card-header lbl-text"><i class="mr-2 fa fa-clock"></i> Clock <a target="_blank" data-pt-position="right" data-pt-title='More Info: Clock' href='{{ helplink('clock') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row'>
					<div class='col-4 pr-0 bold-text'>Enable:</div>
					<div class='col-2 pl-0'>
						@if(request()->is('calendars/*/edit') && $calendar->isLinked())
							{{ Arr::get($calendar->static_data, 'clock.enabled') ? "Yes" : "No" }}
						@else
							<label class="custom-control custom-checkbox center-text">
								<input type="checkbox" class="custom-control-input static_input" id='enable_clock' data='clock' fc-index='enabled'>
								<span class="custom-control-indicator"></span>
							</label>
						@endif
					</div>
					<div class='render_clock col-4 p-0 bold-text'>Render:</div>
					<div class='render_clock col-2 p-0'>
						<label class="custom-control custom-checkbox center-text">
							<input type="checkbox" class="custom-control-input static_input" id='render_clock' refresh='clock' data='clock' fc-index='render'>
							<span class="custom-control-indicator"></span>
						</label>
					</div>
				</div>

				<div class='clock_inputs'>

					<div class='row mt-2'>
						<div class='col-6 bold-text'>
							Hours:
						</div>
						<div class='col-6 pl-0 bold-text'>
							Minutes:
						</div>
					</div>

					<div class='row mb-2'>
							<div class='col-6 input-group'>
								@if(request()->is('calendars/*/edit') && $calendar->isLinked())
									{{ Arr::get($calendar->static_data, 'clock.hours') }}
								@else
									<div class='input-group-prepend'>
										<button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_hours", -1);'><i class="icon-minus"></i></button>
									</div>
									<input class='form-control form-control-sm static_input' min='1' id='clock_hours' data='clock' fc-index='hours' type='number'>
									<div class='input-group-append'>
										<button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_hours", +1);'><i class="icon-plus"></i></button>
									</div>
								@endif
							</div>

							<div class='col-6 input-group pl-0'>
								@if(request()->is('calendars/*/edit') && $calendar->isLinked())
									{{ Arr::get($calendar->static_data, 'clock.minutes') }}
								@else
									<div class='input-group-prepend'>
										<button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_minutes", -1);'><i class="icon-minus"></i></button>
									</div>
									<input class='form-control form-control-sm static_input' min='1' id='clock_minutes' data='clock' fc-index='minutes' type='number'>
									<div class='input-group-append'>
										<button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_minutes", +1);'><i class="icon-plus"></i></button>
									</div>
								@endif
							</div>

					</div>

					<div class='row mt-2 do_render_clock'>
						<div class='col-6 bold-text'>
							Offset hours:
						</div>
						<div class='col-6 pl-0 bold-text'>
							Crowding:
						</div>
					</div>

					<div class='row mb-1 do_render_clock'>

						<div class='col-6 input-group'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_offset", -1);'><i class="icon-minus"></i></button>
                            </div>

                            <input class='form-control form-control-sm static_input' id='clock_offset' refresh='clock' data='clock' fc-index='offset' type='number'>

                            <div class='input-group-append'>
                                <button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_offset", +1);'><i class="icon-plus"></i></button>
                            </div>
						</div>

						<div class='col-6 pl-0 input-group'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_crowding", -1);'><i class="icon-minus"></i></button>
                            </div>

                            <input class='form-control form-control-sm static_input' min='0' id='clock_crowding' refresh='clock' data='clock' fc-index='crowding' type='number'>

                            <div class='input-group-append'>
                                <button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_crowding", +1);'><i class="icon-plus"></i></button>
                            </div>
						</div>

					</div>


				</div>

				@if(request()->is('calendars/*/edit') && $calendar->isLinked())
					<p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the clock?</a></p>
				@endif

			</div>


		</div>



		<!---------------------------------------------->
		<!------------------- WEEKDAYS ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-weekdays step-2-step'>
			<input id="collapsible_globalweek" class="toggle" type="checkbox">
			<label for="collapsible_globalweek" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-calendar-week"></i> Weekdays <a target="_blank" data-pt-position="right" data-pt-title='More Info: Weekdays' href='{{ helplink('weekdays') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row center-text hidden' id='overflow_explanation'>
					This calendar has a custom week in some months or a leap day is adding a week-day, this will disable overflows between months, because it makes no sense for two weeks that do not go together to overflow into each other. Sorry.
				</div>

				<div class='row protip' data-pt-position="right" data-pt-title='Enabling this will continue the week in the next month, and disabling overflow will restart the week so that each month starts with the first week day.'>
					<div class='col-auto pr-1 bold-text'>
						Overflow weekdays:
					</div>
					@if(request()->is('calendars/*/edit') && $calendar->isLinked())
						{{ Arr::get($calendar->static_data, 'year_data.overflow') ? "Enabled" : "Disabled" }}
					@else
						<div class='col-2'>
							<label class="custom-control custom-checkbox right-text">
								<input type="checkbox" class="custom-control-input static_input" data='year_data' fc-index='overflow' id='month_overflow'>
								<span class="custom-control-indicator"></span>
							</label>
						</div>
					@endif
				</div>

				<div class='row no-gutters my-2'>
					<div class='separator'></div>
				</div>

				@if(request()->is('calendars/*/edit') && $calendar->isLinked())

					<ul class="list-group">

						@php
						$weekdays = Arr::get($calendar->static_data, 'year_data.global_week');
						@endphp

						@foreach ($weekdays as $weekday)
							<li class="list-group-item">{{ $weekday }}</li>
						@endforeach

					</ul>

				@else

					<div class='row no-gutters mt-2 bold-text'>
						<div class="col">
							New weekday:
						</div>
					</div>

					<div class='row no-gutters add_inputs global_week'>
						<div class='col'>
							<input type='text' class='form-control name' id='weekday_name_input' placeholder='Weekday name'>
						</div>
						<div class='col-auto'>
							<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
						</div>
					</div>

					<div class='sortable list-group' id='global_week_sortable'></div>

				@endif

                <div id='first_week_day_container' class='hidden'>

                    <div class='row no-gutters my-2'>
                        <div class='separator'></div>
                    </div>

                    <div class='row no-gutters my-2'>
                        <div class='col'>
                            <p class='bold-text m-0'>First week day:</p>
							@if(request()->is('calendars/*/edit') && $calendar->isLinked())
								<ul class="list-group">
									<li class="list-group-item">{{ Arr::get($calendar->static_data, 'year_data.global_week')[Arr::get($calendar->static_data, 'year_data.first_day')-1] }}</li>
								</ul>
							@else
								<select type='number' class='form-control static_input protip' data-pt-position="right" data-pt-title='This sets the first weekday of the first year.' id='first_day' data='year_data' fc-index='first_day'></select>
							@endif
                        </div>
                    </div>
                </div>
				@if(request()->is('calendars/*/edit') && $calendar->isLinked())
					<p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the weekdays?</a></p>
				@endif

			</div>

		</div>

		<!---------------------------------------------->
		<!----------------- TIMESPANS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-timespans step-3-step'>

			<input id="collapsible_timespans" class="toggle" type="checkbox">
			<label for="collapsible_timespans" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-calendar-alt"></i> Months <a target="_blank" data-pt-position="right" data-pt-title='More Info: Months & Intercalaries' href='{{ helplink('months') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				@if(request()->is('calendars/*/edit') && $calendar->isLinked())

					<ul class="list-group">

						@php
						$timespans = Arr::get($calendar->static_data, 'year_data.timespans');
						@endphp

						@foreach ($timespans as $timespan)
							<li class="list-group-item">
								<div class="d-flex justify-content-between align-items-center">
									<strong>{{ $timespan['name'] }}</strong>
								</div>
								@if($timespan['interval'] > 1)
								<div class="d-flex justify-content-start align-items-center mt-2">
									<div class='mr-4'>
										Interval: {{ $timespan['interval'] }}
									</div>
									<div>
										Offset: {{ $timespan['offset'] }}
									</div>
								</div>
								@endif
								@if(Arr::get($timespan, 'week'))
								<div class="mt-2">
									Custom week:
									<ul>
									@foreach ($timespan['week'] as $weekday)
										<li style="list-style-type: circle; font-size:0.8rem;">{{ $weekday }}</li>
									@endforeach
									</ul>
								</div>
								@endif
							</li>
						@endforeach

					</ul>

					<p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the months?</a></p>

				@else

					<div class='row bold-text'>
						<div class="col">
							New month:
						</div>
					</div>

					<div class='add_inputs timespan row no-gutters mb-2'>

						<div class='col-md-6'>
							<input type='text' id='timespan_name_input' class='form-control name' placeholder='Name'>
						</div>

						<div class='col'>
							<select id='timespan_type_input' class='custom-select form-control type'>
								<option selected value='month'>Month</option>
								<option value='intercalary'>Intercalary</option>
							</select>
						</div>

						<div class='col-auto'>
							<button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
						</div>
					</div>

					<div class="row sortable-header timespan_sortable_header hidden">
						<div class='col-6' style="padding-left:25%;">Name</div>
						<div class='col-6' style="padding-left:20%;">Length</div>
					</div>

					<div class='sortable list-group' id='timespan_sortable'></div>

				@endif

			</div>


		</div>



		<!---------------------------------------------->
		<!------------------ LEAP DAYS ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-leapdays'>
			<input id="collapsible_leapdays" class="toggle" type="checkbox">
			<label for="collapsible_leapdays" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-calendar-day"></i> Leap days <a target="_blank" data-pt-position="right" data-pt-title='More Info: Leap Days' href='{{ helplink('leap_days') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content content card-body">

				@if(request()->is('calendars/*/edit') && $calendar->isLinked())

					<ul class="list-group">

					@php
					$leap_days = Arr::get($calendar->static_data, 'year_data.leap_days');
					@endphp

					@foreach ($leap_days as $leap_day)
						<li class="list-group-item">
							<div class="d-flex justify-content-between align-items-center">
								<strong>{{ $leap_day['name'] }}</strong> <small>{{ $leap_day['intercalary'] ? "Intercalary" : "" }}</small>
							</div>
							<div class='mt-2'>
								Interval: {{ str_replace(",", ", ", $leap_day['interval']) }}
							</div>
							<div>
								Offset: {{ $leap_day['offset'] }}
							</div>
							@if($leap_day['intercalary'])
								<div>
									@if($leap_day['day'] == 0)
										Added before day 1
									@else
										Added after day {{ $leap_day['day'] }}
									@endif
								</div>
							@else
								@if($leap_day['adds_week_day'])
									<div>
										Adds a weekday named: {{ $leap_day['week_day'] }}
									</div>
								@endif
							@endif
						</li>
					@endforeach

					</ul>

					<p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the leap days?</a></p>

				@else

					<div class='row bold-text'>
						<div class="col">
							New leap day:
						</div>
					</div>

					<div class='add_inputs leap row no-gutters'>
						<div class='col-md-6'>
							<input type='text' id='leap_day_name_input' class='form-control name' placeholder='Name'>
						</div>

						<div class='col'>
							<select id='leap_day_type_input' class='custom-select form-control type'>
								<option selected value='leap-day'>Normal day</option>
								<option value='intercalary'>Intercalary</option>
							</select>
						</div>

						<div class='col-auto'>
							<button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
						</div>
					</div>


					<div class="row">
						<div style='font-style: italic; margin-left:3.5rem'>Name</div>
					</div>

					<div id='leap_day_list'></div>

				@endif

			</div>
		</div>

		<!---------------------------------------------->
		<!-------------------- ERAS -------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-eras'>
			<input id="collapsible_eras" class="toggle" type="checkbox">
			<label for="collapsible_eras" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-infinity"></i> Eras <a target="_blank" data-pt-position="right" data-pt-title='More Info: Eras' href='{{ helplink('eras') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				@if(request()->is('calendars/*/edit') && $calendar->isLinked())

					<ul class="list-group">

					@php
					$eras = Arr::get($calendar->static_data, 'eras');
					@endphp

					@foreach ($eras as $era)
						<li class="list-group-item">
							<div class="d-flex justify-content-between align-items-center">
								<strong>{{ $era['name'] }}</strong>
								@if($era['settings']['starting_era'])
									<small>Starting Era</small>
								@endif
							</div>
							@if(!$era['settings']['starting_era'])
								<div class='mt-2'>
									Year: {{ $era['date']['year'] }}<br>
									Month: {{ $era['date']['timespan']+1 }}<br>
									Day: {{ $era['date']['day'] }}<br>
								</div>
							@endif
						</li>
					@endforeach

					</ul>

					<p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the eras?</a></p>

				@else

					<div class='row no-gutters bold-text'>
						<div class='col'>
							New Era:
						</div>
					</div>

					<div class='add_inputs eras row no-gutters'>
						<div class="col">
							<input type='text' class='form-control name' id='era_name_input' placeholder='Era name'>
						</div>
						<div class="col-auto">
							<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
						</div>
					</div>

					<div class='sortable' id='era_list'></div>

				@endif

			</div>
		</div>


		<!---------------------------------------------->
		<!------------------- MOONS -------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-moons'>
			<input id="collapsible_moon" class="toggle" type="checkbox">
			<label for="collapsible_moon" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-moon"></i> Moons <a target="_blank" data-pt-position="right" data-pt-title='More Info: Moons' href='{{ helplink('moons') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row bold-text'>
					<div class="col">
						New moon:
					</div>
				</div>

				<div class='add_inputs moon'>
					<div class='row no-gutters'>
						<div class='col'>
							<input type='text' class='form-control name protip' data-pt-position="top" data-pt-title="The moon's name." id='moon_name_input' placeholder='Moon name'>
						</div>
						<div class='col-auto'>
							<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class='row no-gutters'>
						<div class='col-6'>
							<input type='number' class='form-control cycle protip' data-pt-position="top" data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.'  min='1' id='moon_cycle_input' placeholder='Cycle'>
						</div>
						<div class='col-6'>
							<input type='number' class='form-control shift protip' data-pt-position="top" data-pt-title='This is how many days the cycle is offset by.' id='moon_shift_input' placeholder='Shift'>
						</div>
					</div>
				</div>
				<div class='sortable' id='moon_list'></div>
			</div>
		</div>



		<!---------------------------------------------->
		<!------------------- SEASONS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-seasons'>
			<input id="collapsible_seasons" class="toggle" type="checkbox">
			<label for="collapsible_seasons" class="lbl-toggle card-header lbl-text">
				<i class='season_combo_icon fas mr-2'>
					<i class="fas fa-sun"></i><i class="fas fa-snowflake"></i>
				</i>
				Seasons<a target="_blank" data-pt-position="right" data-pt-title='More Info: Seasons' href='{{ helplink('seasons') }}' class="wiki protip"><i class="icon-question-sign"></i></a>
			</label>
			<div class="collapsible-content card-body">

				<div class='row bold-text'>
					<div class='col'>
						Season type:
					</div>
				</div>

				<div class='border rounded mb-2'>
					<div class='row protip py-1 px-2 flex-column flex-md-row align-items-center' data-pt-position="right" data-pt-title='This toggles between having seasons starting on specific dates, or having the seasons last an exact duration with the potential to overflow years.'>
						<div class='col-12 col-md-5 pr-md-0 text-center season_text dated'>
							Date Based
						</div>
						<div class='col-12 col-md-2 px-md-0 text-center'>
							<label class="custom-control custom-checkbox flexible">
								<input type="checkbox" class="custom-control-input" id='periodic_seasons_checkbox'>
								<span class="custom-control-indicator"></span>
							</label>
						</div>
						<div class='col-12 col-md-5 pl-md-0 text-center season_text periodic'>
							Length Based
						</div>
					</div>
				</div>

				<div class='row no-gutters my-1'>
					<div class='form-check col-12 py-1 border rounded'>
						<input type='checkbox' id='season_color_enabled' refresh="true" class='form-check-input static_input' data="seasons.global_settings" fc-index="color_enabled"/>
						<label for='season_color_enabled' class='form-check-label ml-1' >
							Enable season day color
						</label>
					</div>
				</div>

				<div class='row mt-2 bold-text'>
					<div class="col">
						New season:
					</div>
				</div>

				<div class='add_inputs seasons row no-gutters'>
					<div class='col'>
						<input type='text' class='form-control name' id='season_name_input' placeholder='Season name'>
					</div>
					<div class='col-auto'>
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable' id='season_sortable'></div>

				<div class='my-1 small-text' id='season_length_text'></div>

				<div class='container season_offset_container'>
					<div class='row mt-2'>
						Season offset (days):
					</div>
					<div class='row mb-2'>
						<input class='form-control static_input' type='number' data='seasons.global_settings' fc-index='season_offset'/>
					</div>
				</div>

				<div>
					<button type='button' class='btn btn-secondary full' id='create_season_events'>Create solstice and equinox events</button>
				</div>
			</div>

		</div>



		<!---------------------------------------------->
		<!------------------- WEATHER ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-weather'>
			<input id="collapsible_weather" class="toggle" type="checkbox">
			<label for="collapsible_weather" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-cloud-sun-rain"></i> Weather<a target="_blank" data-pt-position="right" data-pt-title='More Info: Weather' href='{{ helplink('weather') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

                <div id='no_seasons_container' class='row no-gutters'>
                    You need at least one season for weather to function.
                </div>

                <div id='has_seasons_container' class='hidden'>

    				<div class='row no-gutters'>
    					<div class='col-auto mr-2'>Enable weather:</div>
    					<div class='col-auto'>
    						<label class="custom-control custom-checkbox">
    							<input type="checkbox" class="custom-control-input static_input" id='enable_weather' refresh='false' data='seasons.global_settings' fc-index='enable_weather'>
    							<span class="custom-control-indicator"></span>
    						</label>
    					</div>
    				</div>

    				<div class='weather_inputs'>

    					<div class='row no-gutters my-2 small-text'>
    						Custom weather can be configured in custom locations.
    					</div>


    					<div class='row my-2'>
    						<div class='col'>
                                Weather offset (days):
    							<input class='form-control static_input' type='number' refresh='false' data='seasons.global_settings' fc-index='weather_offset'/>
    						</div>
    					</div>

    					<div class='row no-gutters'>
    						<div class='col-md-6 my-1'>
                                Temperature system:
    							<select class='custom-select form-control type static_input' id='temp_sys' refresh='false' data='seasons.global_settings' fc-index='temp_sys'>
    								<option selected value='metric'>Metric</option>
    								<option value='imperial'>Imperial</option>
    								<option value='both_m'>Both (inputs metric)</option>
    								<option value='both_i'>Both (inputs imperial)</option>
    							</select>
    						</div>

    						<div class='col-md-6 my-1'>
                                Wind system:
    							<select class='custom-select form-control type static_input' refresh='false' data='seasons.global_settings' fc-index='wind_sys'>
    								<option selected value='metric'>Metric</option>
    								<option value='imperial'>Imperial</option>
    								<option value='both'>Both</option>
    							</select>
    						</div>
    					</div>

    					<div class='row no-gutters my-2 protip' data-pt-position="right" data-pt-title="In addition of the temperature being shown, you'll also see the description for the temperature of that particular day.">
    						<div class='col-auto mr-2'>Cinematic temperature description:</div>
    						<div class='col-auto'>
    							<label class="custom-control custom-checkbox">
    								<input type="checkbox" class="custom-control-input static_input" refresh='false' data='seasons.global_settings' fc-index='cinematic'>
    								<span class="custom-control-indicator"></span>
    							</label>
    						</div>
    					</div>


    					<div class='row no-gutters'>
    						<div class='col-auto'>Weather generation seed:</div>
    					</div>
    					<div class='row no-gutters'>
    						<div class='col'>
    							<input type='number' id='seasons_seed' class='form-control static_input full' refresh='false' data='seasons.global_settings' fc-index='seed' />
    						</div>
    						<div class='col-auto'>
    							<div class='btn btn-primary' id='reseed_seasons'><i class="fa fa-redo"></i></div>
    						</div>
    					</div>
				    </div>
                </div>
			</div>

		</div>

		<!---------------------------------------------->
		<!------------------ LOCATIONS ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-locations'>
			<input id="collapsible_locations" class="toggle" type="checkbox">
			<label for="collapsible_locations" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-compass"></i> Locations <a target="_blank" data-pt-position="right" data-pt-title='More Info: Locations' href='{{ helplink('locations') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

                <div id='locations_warning' class='row no-gutters'>
                    You need weather enabled (temperatures, precipitation) or the clock enabled (timezone, sunrise/sunset) for locations to function.
                </div>

                <div id='locations_warning_hidden' class='hidden'>

    				<div class='row no-gutters bold-text'>
    					Current location:
    				</div>
    				<div class='row no-gutters mb-2'>
    					<select class='form-control protip' id='location_select' data-pt-position="right" data-pt-title="The presets work with four seasons (winter, spring, summer, autumn) or two seasons (winter, summer). If you call your seasons the same, the system matches them with the presets' seasons, no matter which order.">
    					</select>
    				</div>
    				<div class='row no-gutters my-2'>
    					<input type='button' value='Map preset locations to seasons' class='btn btn-secondary full protip' id='map_seasons_to_location' data-pt-position="right" data-pt-title="This will open an UI where you can map your seasons to the preset location's seasons, as your order might be different from the preset.">
    				</div>
                    <div class='row no-gutters my-2'>
                        <input type='button' value='Copy current location' class='btn btn-info full' id='copy_location_data'>
                    </div>

    				<div class='row no-gutters my-2'>
    					<div class='separator'></div>
    				</div>

    				<div class='row no-gutters bold-text'>
    					<div class='col'>
    						New location:
    					</div>
    				</div>

    				<div class='row no-gutters add_inputs locations'>
    					<div class="col">
    						<input type='text' class='form-control name' id='location_name_input' placeholder='Location name'>
    					</div>
    					<div class="col-auto">
    						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
    					</div>
    				</div>

    				<div class='sortable' id='location_list'></div>

    			</div>

            </div>


		</div>

		<!---------------------------------------------->
		<!------------------- CYCLES ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-cycles'>
			<input id="collapsible_cycles" class="toggle" type="checkbox">
			<label for="collapsible_cycles" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-redo"></i> Cycles <a target="_blank" data-pt-position="right" data-pt-title='More Info: Cycles' href='{{ helplink('cycles') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row no-gutters bold-text'>
					Cycle format:
				</div>
				<div class="row no-gutters">
					<input type='text' id='cycle_format' class='form-control name static_input protip' data='cycles' fc-index='format' placeholder='Cycle &lcub;&lcub;1&rcub;&rcub;' data-pt-position="right" data-pt-title="This is the template for the cycles you have. Each cycle part has a set of names which you can add to the top of the calendar. Add one with this field empty to see how this works!">
				</div>

				<div class='row no-gutters my-2'>
					<div class='separator'></div>
				</div>

				<div class='add_inputs cycle row no-gutters'>
					<input type='button' value='Add new cycle' class='btn btn-primary full add'>
				</div>

				<div class='sortable' id='cycle_sortable'></div>

			</div>

		</div>

		<!---------------------------------------------->
		<!----------------- CATEGORIES ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-categories'>
			<input id="collapsible_categories" class="toggle" type="checkbox">
			<label for="collapsible_categories" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-th-list"></i> Event Categories <a target="_blank" data-pt-position="right" data-pt-title='More Info: Event Categories' href='{{ helplink('event_categories') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
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
                        <select class='form-control event-category-list static_input protip' data-pt-position="right" data-pt-title="This sets the category to be selected by default when a new event is created" id='default_event_category' data='settings' fc-index='default_category'></select>
    		      	</div>
                </div>
            </div>
		</div>

		<!---------------------------------------------->
		<!------------------- EVENTS ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card settings-events'>
			<input id="collapsible_events" class="toggle" type="checkbox">
			<label for="collapsible_events" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-calendar-check"></i> Events <a target="_blank" data-pt-position="right" data-pt-title='More Info: Events' href='{{ helplink('events') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
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
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
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
			<label for="collapsible_settings" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-cog"></i> Settings <a target="_blank" data-pt-position="right" data-pt-title='More Info: Settings' href='{{ helplink('settings') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
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

					@if(Auth::user()->can('add-users', $calendar))

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
				<label for="collapsible_users" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-user"></i> User Management <a target="_blank" data-pt-position="right" data-pt-title='More Info: User Management' href='{{ helplink('user_management') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
				<div class="collapsible-content card-body">

					@if(Auth::user()->can('add-users', $calendar))

						<div class='row no-gutters mt-1 mb-3'>
							<p class='m-0'>Invite your friends to collaborate on this calendar! Once they accept your invite, you'll be able to assign them a role.</p>
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
				<label for="collapsible_linking" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-link"></i> Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='More Info: Calendar Linking' href='{{ helplink('calendar_linking') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
				<div class="collapsible-content card-body">

					@if(Auth::user()->can('link', $calendar))

						<div id='calendar_link_hide'>
							<div class='row no-gutters my-1'>
								<p>Calendar linking is a complex feature, we recommend you check out the article on <a href='{{ helplink('calendar_linking') }}' target="_blank"><i class="icon-question-sign"></i> Calendar Linking</a>.</p>
							</div>

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

	<div id="top_follower" class="step-hide">

		<div class='parent_button_container hidden d-print-none'>
			<div class='container d-flex h-100 p-0'>
				<div class='col justify-content-center align-self-center full'>
					<button class='btn btn-danger full' disabled id='rebuild_calendar_btn'>Parent data changed - reload</button>
				</div>
			</div>
		</div>

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden d-print-none' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden d-print-none' disabled fc-index='timespan' value='-1'>< Month</button>
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
			<button class='btn btn-success btn_preview_date hidden d-print-none' disabled fc-index='year' value='1'>Year ></button>
			<button class='btn btn-success btn_preview_date hidden d-print-none' disabled fc-index='timespan' value='1'>Month ></button>
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
	@include('templates.footnote')
</div>
<div id='html_edit'></div>
