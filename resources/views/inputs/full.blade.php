<form id="input_container">

	<nav class="navbar-expand navbar-dark bg-accent">
		<div class="collapse navbar-collapse" id="collapsemenu">
			<ul class="navbar-nav">
				@auth
					<li class="nav-item active">
						<a class="nav-link" href="{{ route('calendars.index') }}"><i class="fa fa-arrow-left"></i> Return to Calendars</a>
					</li>
				@endauth
			</ul>
		</div>
	</nav>

	@yield('label')

	<div class='wrap-collapsible'>
		<div class="view-tabs btn-group d-flex mb-1 w-100">
            <button type="button" data-view-type='owner' class="owner w-100 btn btn-sm btn-primary">Owner View</button>
            <button type="button" data-view-type='player' class="player w-100 btn btn-sm btn-secondary">Player View</button>
            <button type="button" data-view-type='weather' class="weather w-100 btn btn-sm btn-secondary">Climate view</button>
		</div>
	</div>


	<!---------------------------------------------->
	<!----------------- STATISTICS ----------------->
	<!---------------------------------------------->
	<div class="accordion">
		<div class='wrap-collapsible card'>
			<input id="collapsible_statistics" class="toggle" type="checkbox">
			<label for="collapsible_statistics" class="lbl-toggle card-header lbl-text">Statistics <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Statistics' href='https://wiki.fantasy-calendar.com/index.php?title=Statistics' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='content'>
					<div class='col-12 p-0'>
						<div class='row'>
							<div class='col-6 bold-text'>
								Avg. year length:
							</div>
							<div class='col-6 align-left'>
								<div class='detail-text' id='fract_year_length'>
								</div>
							</div>
						</div>
						<div class='row'>
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

			</div>


		</div>



		<!---------------------------------------------->
		<!---------------- CURRENT DATE ---------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_date" class="toggle" type="checkbox">
			<label for="collapsible_date" class="lbl-toggle card-header lbl-text">Current Date & Time <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Date' href='https://wiki.fantasy-calendar.com/index.php?title=Date' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div id='clock'>
					<canvas style="z-index: 2;" id="clock_face"></canvas>
					<canvas style="z-index: 1;" id="clock_sun"></canvas>
					<canvas style="z-index: 0;" id="clock_background"></canvas>
				</div>

				<div class='center-text hidden' id='empty_calendar_explaination'>
					This calendar doesn't have any weekdays or months yet, so you can't change the date.
				</div>

				<div class='date_control container' id='date_inputs'>

					<div class='row mt-2'>
						<h4>Current date:</h4>
					</div>

					<div class='row mt-2 center-text hidden calendar_link_explaination'>
						This calendar is using a different calendar's date to calculate the current date. Only the master calendar can set the date for this calendar.
					</div>

					<div class='col-12 p-0'>

						<div class='row mt-2'>

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
				</div>


				<div class='date_control container mt-2'>

					<div class='row mt-4'>
						<h4 class="my-0 py-0">Preview date:</h4>
					</div>

					<div class='col-12 p-0'>

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

					</div>

					<div class='row my-4'>
						<div class='btn btn-success full' id='go_to_preview_date'>Go To Preview date</div>
					</div>

				</div>

                <div class='wrap-collapsible card p-0 full'>
                    <input id="collapsible_add_units" class="toggle" type="checkbox">
                    <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed units to calendar</label>
                    <div class="collapsible-content container card-body">

                        <div class='row input-group mx-0'>
                            <input type='number' class="form-control form-control-sm full" id='unit_years' placeholder="Years">
                            <input type='number' class="form-control form-control-sm full" id='unit_months' placeholder="Months">
                            <input type='number' class="form-control form-control-sm full" id='unit_days' placeholder="Days">
                        </div>

                        <button type="button" step="1.0" class="btn btn-primary btn-block my-2" id='current_date_btn'>To current date</button>
                        <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" id='preview_date_btn'>To preview date</button>

                    </div>

                </div>

            </div>


		</div>



		<!---------------------------------------------->
		<!-------------------- CLOCK ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_clock" class="toggle" type="checkbox">
			<label for="collapsible_clock" class="lbl-toggle card-header lbl-text">Clock <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Clock' href='https://wiki.fantasy-calendar.com/index.php?title=Clock' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='row'>
					<div class='col-4 pr-0'>Enable clock:</div>
					<div class='col-2 pl-0'>
						<label class="custom-control custom-checkbox right-text">
							<input type="checkbox" class="custom-control-input static_input" id='enable_clock' data='clock' fc-index='enabled'>
							<span class="custom-control-indicator"></span>
						</label>
					</div>
					<div class='render_clock col-4 p-0'>Render clock:</div>
					<div class='render_clock col-2 pl-0'>
						<label class="custom-control custom-checkbox right-text">
							<input type="checkbox" class="custom-control-input static_input" id='render_clock' refresh='clock' data='clock' fc-index='render'>
							<span class="custom-control-indicator"></span>
						</label>
					</div>
				</div>

				<div class='clock_inputs'>

					<div class='row mt-2'>
						<div class='col-6'>
							Hours per day:
						</div>
						<div class='col-6 pl-0'>
							Minutes per hour:
						</div>
					</div>

					<div class='row mb-2'>

						<div class='col-6 input-group'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_hours", -1);'><i class="icon-minus"></i></button>
                            </div>
                            <input class='form-control form-control-sm static_input' min='1' id='clock_hours' data='clock' fc-index='hours' type='number'>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_hours", +1);'><i class="icon-plus"></i></button>
                            </div>
						</div>

						<div class='col-6 input-group pl-0'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-sm btn-danger' onclick='adjustInput(this, "#clock_minutes", -1);'><i class="icon-minus"></i></button>
                            </div>
                            <input class='form-control form-control-sm static_input' min='1' id='clock_minutes' data='clock' fc-index='minutes' type='number'>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-sm btn-success' onclick='adjustInput(this, "#clock_minutes", +1);'><i class="icon-plus"></i></button>
                            </div>
						</div>

					</div>

					<div class='row mt-2 do_render_clock'>
						<div class='col-6'>
							Offset hours:
						</div>
						<div class='col-6 pl-0'>
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

			</div>


		</div>



		<!---------------------------------------------->
		<!------------------- WEEKDAYS ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_globalweek" class="toggle" type="checkbox">
			<label for="collapsible_globalweek" class="lbl-toggle card-header lbl-text">Weekdays <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Weekdays' href='https://wiki.fantasy-calendar.com/index.php?title=Global_week' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body content">

				<div class='row center-text hidden' id='overflow_explanation'>
					This calendar has a custom week in some months or a leap day is adding a week-day, this will disable overflows between months, because it makes no sense for two weeks that do not go together to overflow into each other. Sorry.
				</div>

				<div class='row protip' data-pt-position="right" data-pt-title='Enabling this will continue the week in the next month, and disabling overflow will restart the week so that each month starts with the first week day.'>
					<div class='col-auto pr-1 bold-text'>
						Overflow weekdays:
					</div>
					<div class='col-2'>
						<label class="custom-control custom-checkbox right-text">
							<input type="checkbox" class="custom-control-input static_input" data='year_data' fc-index='overflow' id='month_overflow'>
							<span class="custom-control-indicator"></span>
						</label>
					</div>
				</div>

				<div class='row px-3 my-3'>
					<div class='separator'></div>
				</div>

				<div id='first_week_day_container'>

					<div class='bold-text'>First week day:</div>

					<select type='number' class='form-control static_input protip' data-pt-position="right" data-pt-title='This sets the first weekday of the first year.' id='first_day' data='year_data' fc-index='first_day'></select>

				</div>


				<div class='row mt-2 bold-text'>
					<div class="col">
						New weekday:
					</div>
				</div>

				<div class='row add_inputs global_week'>
					<div class='col p-0'>
						<input type='text' class='form-control name' placeholder='Weekday name'>
					</div>
					<div class='col-auto p-0'>
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable list-group' id='global_week_sortable'></div>

			</div>


		</div>

		<!---------------------------------------------->
		<!----------------- TIMESPANS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>

			<input id="collapsible_timespans" class="toggle" type="checkbox">
			<label for="collapsible_timespans" class="lbl-toggle card-header lbl-text">Months & Intercalaries <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Months & Intercalaries' href='https://wiki.fantasy-calendar.com/index.php?title=Months_%26_Intercalaries' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class='row bold-text'>
					<div class="col">
						New month:
					</div>
				</div>

				<div class='add_inputs timespan row'>

					<div class='col-7 p-0'>
						<input type='text' class='form-control name' placeholder='Name'>
					</div>

					<div class='col p-0'>
						<select class='custom-select form-control type'>
							<option selected value='month'>Month</option>
							<option value='intercalary'>Intercalary</option>
						</select>
					</div>

					<div class='col-auto p-0'>
						<button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable list-group' id='timespan_sortable'></div>

			</div>


		</div>



		<!---------------------------------------------->
		<!------------------ LEAP DAYS ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_leapdays" class="toggle" type="checkbox">
			<label for="collapsible_leapdays" class="lbl-toggle card-header lbl-text">Leap days <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Leap Days' href='https://wiki.fantasy-calendar.com/index.php?title=Leap_days' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content content card-body container">

				<div class='row mb-2 center-text' id='leap_day_explaination'>
					You need to have at least one month in order to add a leap day.
				</div>

				<div class='row bold-text'>
					<div class="col">
						New leap day:
					</div>
				</div>

				<div class='add_inputs leap row'>
					<div class='col-6 p-0'>
						<input type='text' class='form-control name' placeholder='Name'>
					</div>

					<div class='col p-0'>
						<select class='custom-select form-control type'>
							<option selected value='leap-day'>Normal day</option>
							<option value='intercalary'>Intercalary</option>
						</select>
					</div>

					<div class='col-auto p-0'>
						<button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div id='leap_day_list'></div>

			</div>
		</div>


		<!---------------------------------------------->
		<!------------------- MOONS -------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_moon" class="toggle" type="checkbox">
			<label for="collapsible_moon" class="lbl-toggle card-header lbl-text">Moons <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Moons' href='https://wiki.fantasy-calendar.com/index.php?title=Moons' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class='row bold-text'>
					<div class="col">
						New moon:
					</div>
				</div>

				<div class='add_inputs moon'>
					<div class='row'>
						<div class='col pr-0'>
							<input type='text' class='form-control name' placeholder='Moon name'>
						</div>
						<div class='col-auto pl-0'>
							<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class='row'>
						<div class='col-6 pr-0'>
							<input type='number' class='form-control cycle' min='1' placeholder='Cycle'>
						</div>
						<div class='col-6 pl-0'>
							<input type='number' class='form-control shift' placeholder='Shift'>
						</div>
					</div>
				</div>
				<div class='sortable' id='moon_list'></div>
			</div>
		</div>



		<!---------------------------------------------->
		<!------------------- SEASONS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_seasons" class="toggle" type="checkbox">
			<label for="collapsible_seasons" class="lbl-toggle card-header lbl-text">Seasons<a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Seasons' href='https://wiki.fantasy-calendar.com/index.php?title=Seasons' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content container card-body">

				<div class='row bold-text'>
					<div class='col'>
						Season type:
					</div>
				</div>

				<div class='border rounded mb-2'>
					<div class='row protip pt-1 px-2' data-pt-position="right" data-pt-title='This toggles between having seasons starting on specific dates, or having the seasons last an exact duration with the potential to overflow years.'>
						<div class='col-md-auto col-sm-12 pr-md-0 season_text dated'>
							Date Based
						</div>
						<div class='col-md-auto col-sm-12 px-md-0'>
							<label class="custom-control custom-checkbox">
								<input type="checkbox" class="custom-control-input" id='periodic_seasons_checkbox'>
								<span class="custom-control-indicator"></span>
							</label>
						</div>
						<div class='col-md-auto col-sm-12 pl-md-0 season_text periodic'>
							Length Based
						</div>
					</div>
				</div>

				<div class='row mt-2 bold-text'>
					<div class="col">
						New season:
					</div>
				</div>

				<div class='add_inputs seasons row'>
					<div class='col p-0'>
						<input type='text' class='form-control name' placeholder='Season name'>
					</div>
					<div class='col-auto p-0'>
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
					<i class='center-text full'>(requires clock enabled)</i>
				</div>
			</div>

		</div>



		<!---------------------------------------------->
		<!------------------- WEATHER ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_weather" class="toggle" type="checkbox">
			<label for="collapsible_weather" class="lbl-toggle card-header lbl-text">Weather<a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Weather' href='https://wiki.fantasy-calendar.com/index.php?title=Weather' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body content">

				<div class='col-12'>

					<div class='row'>
						<div class='col-auto p-0'>Enable weather:</div>
						<div class='col-auto p-0'>
							<label class="custom-control custom-checkbox">
								<input type="checkbox" class="custom-control-input static_input" id='enable_weather' refresh='false' data='seasons.global_settings' fc-index='enable_weather'>
								<span class="custom-control-indicator"></span>
							</label>
						</div>
					</div>

					<div id='weather_inputs'>

						<div class='row my-2 small-text'>
							Custom weather can be configured in custom locations.
						</div>


						<div class='row my-2'>
							<div class='col-auto p-0'>Weather offset (days):</div>
							<div class='col-auto p-0'>
								<input class='form-control static_input' type='number' refresh='false' data='seasons.global_settings' fc-index='weather_offset'/>
							</div>
						</div>

						<div class='row mt-2'>
							<div class='col-6 p-0 pr-1'>
								Temperature system:
							</div>

							<div class='col-6 p-0'>
								Wind speed system:
							</div>
						</div>

						<div class='row mb-2'>
							<div class='col-6 p-0 pr-1'>
								<select class='custom-select form-control type static_input' id='temp_sys' refresh='false' data='seasons.global_settings' fc-index='temp_sys'>
									<option selected value='metric'>Metric</option>
									<option value='imperial'>Imperial</option>
									<option value='both_m'>Both (inputs metric)</option>
									<option value='both_i'>Both (inputs imperial)</option>
								</select>
							</div>

							<div class='col-6 p-0'>
								<select class='custom-select form-control type static_input' refresh='false' data='seasons.global_settings' fc-index='wind_sys'>
									<option selected value='metric'>Metric</option>
									<option value='imperial'>Imperial</option>
									<option value='both'>Both</option>
								</select>
							</div>
						</div>

						<div class='row my-2'>
							<div class='col-auto p-0'>Cinematic temperature description:</div>
							<div class='col-auto p-0'>
								<label class="custom-control custom-checkbox">
									<input type="checkbox" class="custom-control-input static_input" refresh='false' data='seasons.global_settings' fc-index='cinematic'>
									<span class="custom-control-indicator"></span>
								</label>
							</div>
						</div>


						<div class='row'>
							<div class='col-auto p-0'>Weather generation seed:</div>
						</div>
						<div class='row'>
							<div class='col-10 p-0'>
								<input type='number' id='seasons_seed' class='form-control static_input full' refresh='false' data='seasons.global_settings' fc-index='seed' />
							</div>
							<div class='col-2 p-0'>
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

		<div class='wrap-collapsible card'>
			<input id="collapsible_locations" class="toggle" type="checkbox">
			<label for="collapsible_locations" class="lbl-toggle card-header lbl-text">Locations <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Locations' href='https://wiki.fantasy-calendar.com/index.php?title=Locations' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class="col-12">

					<div class='row bold-text'>
						Current location:
					</div>
					<div class='row mb-2'>
						<select class='form-control' id='location_select'>
						</select>
					</div>
					<div class='row my-2'>
						<input type='button' value='Copy selected location to new location' class='btn btn-info full add' id='copy_location_data'>
					</div>
				</div> 	

				<div class='row px-3 my-3'>
					<div class='separator'></div>
				</div>

				<div class='row bold-text'>
					<div class='col'>
						New location:
					</div>
				</div>

				<div class='row add_inputs locations'>
					<div class="col p-0">
						<input type='text' class='form-control name' placeholder='Location name'>
					</div>
					<div class="col-auto p-0">
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable' id='location_list'></div>
			</div>


		</div>

		<!---------------------------------------------->
		<!------------------- CYCLES ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_cycles" class="toggle" type="checkbox">
			<label for="collapsible_cycles" class="lbl-toggle card-header lbl-text">Cycles <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Cycles' href='https://wiki.fantasy-calendar.com/index.php?title=Cycles' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">
				<div class="col-12">

					<div class='row bold-text'>
						Cycle format:
					</div>
					<div class="row mb-2">
						<input type='text' id='cycle_format' class='form-control name static_input protip' data='cycles' fc-index='format' placeholder='Hover for info' data-pt-position="right" data-pt-title="This is the template for the cycles you have. Each cycle part has a set of names which you can add to the top of the calendar. Add one with this field empty to see how this works!">
					</div>
				</div>

				<div class='row px-3 my-3'>
					<div class='separator'></div>
				</div>

				<div class='add_inputs cycle row'>
					<input type='button' value='Press to add new cycle' class='btn btn-primary full add'>
				</div>

				<div class='sortable' id='cycle_sortable'></div>

			</div>

		</div>

		<!---------------------------------------------->
		<!-------------------- ERAS -------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_eras" class="toggle" type="checkbox">
			<label for="collapsible_eras" class="lbl-toggle card-header lbl-text">Eras <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Eras' href='https://wiki.fantasy-calendar.com/index.php?title=Eras' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class='row bold-text'>
					<div class='col'>
						New Era:
					</div>
				</div>

				<div class='add_inputs eras row'>
					<div class="col p-0">
						<input type='text' class='form-control name' placeholder='Era name'>
					</div>
					<div class="col-auto p-0">
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable' id='era_list'></div>

				<input type='button' value='Reorder based on date' id='reorder_eras' class='btn btn-primary full hidden'>

			</div>
		</div>

		<!---------------------------------------------->
		<!----------------- CATEGORIES ----------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_categories" class="toggle" type="checkbox">
			<label for="collapsible_categories" class="lbl-toggle card-header lbl-text">Event Categories <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Event Categories' href='https://wiki.fantasy-calendar.com/index.php?title=Event_categories' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class='row bold-text'>
					<div class='col'>
						New event category:
					</div>
				</div>
				<div class='add_inputs event_categories row'>
					<div class="col p-0">
						<input type='text' class='form-control name' placeholder='Event category name'>
					</div>
					<div class="col-auto p-0">
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable list-group' id='event_category_list'></div>
			</div>
		</div>


		<!---------------------------------------------->
		<!------------------- EVENTS ------------------->
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_events" class="toggle" type="checkbox">
			<label for="collapsible_events" class="lbl-toggle card-header lbl-text">Events <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Events' href='https://wiki.fantasy-calendar.com/index.php?title=Events' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body container">

				<div class='row bold-text'>
					<div class='col'>
						New event:
					</div>
				</div>

				<div class='add_inputs events row'>
					<div class="col p-0">
						<input type='text' class='form-control name' placeholder='Event name'>
					</div>
					<div class="col-auto p-0">
						<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class='sortable list-group' id='events_sortable'></div>
			</div>
		</div>


		<!---------------------------------------------->
		<!------------------ SETTINGS ------------------>
		<!---------------------------------------------->

		<div class='wrap-collapsible card'>
			<input id="collapsible_settings" class="toggle" type="checkbox">
			<label for="collapsible_settings" class="lbl-toggle card-header lbl-text">Settings <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Settings' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

				<div class='add_inputs'>


					<!------------------------------------------------------->

					<div class='bold-text'>Layout:</div>

					<label class="full setting last">
						<select class='form-control full static_input' data='settings' fc-index='layout'>
							<option value='grid'>Grid style</option>
							<option value='wide'>Wide style</option>
							<option value='vertical'>Vertical style</option>
							<!--<option value='mini'>Minimalistic style</option>-->
						</select>
					</label>

					<label class="form-control full setting last">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='show_current_month'>
						<span>
							Show only current month
						</span>
						<a target="_blank" title='Makes the calendar only show the current month' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<!------------------------------------------------------->

					<div class='bold-text'>Player View Settings:</div>

					<label class="form-control full setting first">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='allow_view'>
						<span>
							Allow advancing view in calendar
						</span>
						<a target="_blank" title='This will allow players to view any past or future year and months like you can' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='only_backwards'>
						<span>
							Limit to only backwards view
						</span>
						<a target="_blank" title='This will limit players to only view past years' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting last">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='only_reveal_today'>
						<span>
							Show only up to current day
						</span>
						<a target="_blank" title='Players will only be able to see up to current day, future days will be greyed out' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<!------------------------------------------------------->

					<div class='bold-text'>Hiding Settings:</div>

					<label class="form-control full setting first">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_moons'>
						<span>
							Hide all moons from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_clock'>
						<span>
							Hide time from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_events'>
						<span>
							Hide all events from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_future_weather'>
						<span>
							Hide future weather from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_all_weather'>
						<span>
							Hide ALL weather from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting last">
						<input type='checkbox' class='margin-right static_input' data='settings' fc-index='hide_eras'>
						<span>
							Hide era from players
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>



					<!------------------------------------------------------->

					<div class='bold-text'>Display Settings:</div>

					<label class="form-control full setting first">
						<input type='checkbox' class='margin-right static_input' refresh='false' data='settings' fc-index='add_month_number' onclick="setTimeout(calendar_layouts.add_month_number, 10);">
						<span>
							Add month number to months
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

					<label class="form-control full setting">
						<input type='checkbox' class='margin-right static_input' refresh='false' data='settings' fc-index='add_year_day_number' onclick="setTimeout(calendar_layouts.add_year_day_number, 10);">
						<span>
							Add year day to each day
						</span>
						<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
					</label>

				</div>
			</div>
		</div>


		<!---------------------------------------------->
		<!------------------ LINKING ------------------->
		<!---------------------------------------------->
		@if(request()->is('calendars/*/edit'))
			<div class='wrap-collapsible card'>
				<input id="collapsible_linking" class="toggle" type="checkbox">
				<label for="collapsible_linking" class="lbl-toggle card-header lbl-text">Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Calendar Linking' href='https://wiki.fantasy-calendar.com/index.php?title=Calendar_Linking' class="wiki protip"><i class="icon-question-sign"></i></a></label>
				<div class="collapsible-content card-body container">

					<div id='calendar_link_hide'>

						<div class="col-12">

							<div class='row my-1 center-text hidden calendar_link_explaination'>
								This calendar is already linked to a master calendar. Before linking any calendars to this one, you must unlink this calendar from its master calendar.
							</div>

							<div class='row my-1'>
								<select class='form-control' id='calendar_link_select'></select>
							</div>
							<div class='row my-1'>
								<button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_list_select'>Refresh</button>
							</div>
							<div class='row my-1'>
								<button type='button' class='btn btn-primary full' id='link_calendar'>Link</button>
							</div>

						</div>

						<div class='sortable' id='calendar_link_list'></div>

					</div>


					<div id="calendar_link_show">
						<div class='row mt-3'>
							<div class='col-auto ml-4 pr-1 bold-text'>Link from master:</div>
						</div>
						<div class='row protip' data-pt-position="right" data-pt-title='If enabled, the date of this calendar will be taken from the master calendar, but scaled based on the difference in the length of day between the master and this calendar. If this calendar has 12 hours per day and the master has 24, each day counts from the master counts as two days on this one.'>
							<div class='col-auto ml-4 pr-0'>
								Day
							</div>
							<div class='col-auto p-0'>
								<label class="custom-control custom-checkbox">
									<input type="checkbox" class="custom-control-input static_input" id='link_scale' data='clock' fc-index='link_scale'>
									<span class="custom-control-indicator"></span>
								</label>
							</div>
							<div class='col-auto p-0'>
								Minutes
							</div>
						</div>

					</div>

				</div>

			</div>
		@endif
	</form>
</div>

<button id='input_collapse_btn' class="hamburger hamburger--arrowturn is-active" type="button">
	<span class="hamburger-box">
		<span class="hamburger-inner"></span>
	</span>
</button>

<div id="warnings_background">
	<div id="warnings">
		<div id='warnings_content'>
		</div>
		<button type='button' id='warnings_ok' class='btn btn-success half'>OK</button>
		<button type='button' id='warnings_cancel' class='btn btn-danger half'>Cancel</button>
	</div>
</div>

<div id="calendar_container">

	<div id="errors_background">
		<div id="errors">
			<span id="error_text">
				This is an alert box.
			</span>
		</div>
	</div>

	<div id="top_follower">

		<div class='master_button_container hidden'>
			<div class='container d-flex h-100 p-0'>
				<div class='col justify-content-center align-self-center full'>
					<button class='btn btn-danger full' disabled id='rebuild_calendar_btn'>Master data changed - reload</button>
				</div>
			</div>
		</div>

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='timespan' value='-1'>< Month</button>
		</div>

		<div class='reset_preview_date_container left'>
			<button type='button' class='btn btn-info hidden reset_preview_date protip' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
		</div>

		<div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>

		<div class='reset_preview_date_container right'>
			<button type='button' class='btn btn-info hidden reset_preview_date protip' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
		</div>
		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden' disabled fc-index='year' value='1'>Year ></button>
			<button class='btn btn-success btn_preview_date hidden' disabled fc-index='timespan' value='1'>Month ></button>
		</div>

	</div>

	<div id="calendar">

	</div>

	<div id="weather_container" class="hidden">

		<canvas class='chart' id='temperature'></canvas>

		<canvas class='chart' id='precipitation'></canvas>

	</div>
	@include('templates.footnote')
</div>
<div id='html_edit'></div>
