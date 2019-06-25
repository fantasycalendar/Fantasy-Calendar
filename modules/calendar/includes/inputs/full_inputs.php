<form id="input_container">

	<?php if($_GET['action'] === "edit"){ ?>

		<div class='wrap-collapsible'>
			<div class='title-text center-text'>Edit Calendar</div>
		</div>

		<div class='wrap-collapsible'>
			<div class='detail-row'>
				<input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
			</div>
		</div>

		<div class='wrap-collapsible margin-below'>

			<button type="button" disabled id='btn_save' class='btn btn-lg btn-primary btn-block'>No changes to save</button>
		
			<button type="button" id='btn_delete' class='btn btn-sm btn-danger btn-block'>Delete</button>

		</div>

		<div class='wrap-collapsible'>
			<div class="detail-row">
				<label class="detail-column third">
					<div class="form-check form-check-inline form-control form-control-sm">
						<input type='radio' name='view_type' value='owner' checked> 
						<span>
							Owner View
						</span>
					</div>
				</label>
				<label class="detail-column third">
					<div class="form-check form-check-inline form-control form-control-sm">
						<input type='radio' name='view_type' value='player'> 
						<span>
							Player View
						</span>
					</div>
				</label>
				<label class="detail-column third">
					<div class="form-check form-check-inline form-control form-control-sm">
						<input type='radio' name='view_type' value='weather'> 
						<span>
							Climate view
						</span>
					</div>
				</label>
			</div>
		</div>

	<?php }elseif($_GET['action'] === "generate"){ ?>

		<div class='wrap-collapsible'>
			<div class='title-text center-text'>Create Calendar</div>
		</div>


		<div class='wrap-collapsible'>
			<div class='detail-row form-inline'>
				<input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
			</div>
		</div>


		<div class='wrap-collapsible margin-below'>

			<?php
			if(!empty($_SESSION['user_id'])){
			?>
				<button type='button' id='btn_create' class='btn btn-lg btn-primary btn-block'>Save</button>
			<?php
			} else {
			?>
				<button type='button' class='login-show-button btn btn-lg btn-info btn-block'>Log in to save</button>
			<?php
			}
			?>
			
			<button id='btn_clear' type='button' class='btn btn-sm btn-danger btn-block'>Clear</button>

			<select id='presets'>
				<option val=''>Presets</option>
				<option val='Custom'>Custom JSON</option>
				<option val='Earth'>Earth</option>
				<option val='Tal\'Dorei'>Tal'Dorei</option>
				<option val='Eberron'>Eberron</option>
				<option val='Golarion'>Golarion</option>
				<option val='Greyhawk'>Greyhawk</option>
				<option val='Forgotten Realms'>Forgotten Realms</option>
			</select>
			
			<button id='json_apply' type='button' class='btn btn-warning btn-sm' >Apply</button>

			<div id='json_container'>
				<p>JSON input:</p>
				<textarea id='json_input'></textarea>
			</div>
		</div>

	<?php
	}
	?>

	<div class='wrap-collapsible'>
		<div class='separator'></div>
	</div>



	<!---------------------------------------------->
	<!----------------- STATISTICS ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_statistics" class="toggle" type="checkbox">
		<label for="collapsible_statistics" class="lbl-toggle lbl-text">Statistics <a target="_blank" title='Fantasy Calendar Wiki: Statistics' href='https://wiki.fantasy-calendar.com/index.php?title=Statistics' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-column full'>
				<div class='detail-row'>
					<div class='detail-column half'>
						<div class='detail-text bold-text'>
							Avg. year length:
						</div>
					</div>
					<div class='detail-column float statistics_text'>
						<div class='detail-text' id='fract_year_length'>
						</div>
					</div>
				</div>
				<div class='detail-row'>
					<div class='detail-column half'>
						<div class='detail-text bold-text'>
							Avg. month length:
						</div>
					</div>
					<div class='detail-column float statistics_text'>
						<div class='detail-text' id='avg_month_length'>
						</div>
					</div>
				</div>
			</div>

		</div>

		<div class='separator'></div>

	</div>



	<!---------------------------------------------->
	<!---------------- CURRENT DATE ---------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_date" class="toggle" type="checkbox">
		<label for="collapsible_date" class="lbl-toggle lbl-text">Current Date & Time <a target="_blank" title='Fantasy Calendar Wiki: Date' href='https://wiki.fantasy-calendar.com/index.php?title=Date' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">
			
			<div id='clock'></div>

			<div class='detail-row date_control' id='date_inputs'>

				<div class='detail-row center-text hidden calendar_link_explaination'>
					This calendar is using a different calendar's date to calculate the current date. Only the master calendar can set the date for this calendar.
				</div>

				<div class='detail-row'>

					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Year:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='current'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm year-input' id='current_year' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_current_year'><i class="icon-plus"></i></button>
					</div>
				</div>

				<div class='detail-row'>

					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Month:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='current'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-list' id='current_timespan'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Day:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='current'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-day-list' id='current_day'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_day' id='add_current_day'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='clock_inputs'>

					<div class='separator'></div>

					<div class='detail-row'>

						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Time:</div>
						</div>
						<div class='detail-column fourfifths input_buttons'>
							<button type='button' class='btn btn-sm btn-danger sub-btn adjust_hour' val='-1'><i class="clocktext">1h</i></button>
							<button type='button' class='btn btn-sm btn-danger sub-btn adjust_minute' val='-30'><i class="clocktext">30m</i></button>
							<input class='form-control form-control-sm hour_input' type='number' id='current_hour'>:
							<input class='form-control form-control-sm minute_input' type='number' id='current_minute'>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_minute' val='30'><i class="clocktext">30m</i></button>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_hour' val='1'><i class="clocktext">1h</i></button>
						</div>

					</div>

				</div>

			</div>

			<div class='separator'></div>

			<div class='detail-row'>
				<h4>Preview date:</h4>
			</div>

			<div class='date_control'>

				<div class='detail-row'>

					<div class='detail-column fifth' value='target'>
						<div class='detail-text right-align full'>Year:</div>
					</div>
					<div class='detail-column fourfifths input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm year-input' id='target_year' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_target_year'><i class="icon-plus"></i></button>
					</div>
				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Month:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-list' id='target_timespan'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Day:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-day-list' id='target_day'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_day' id='add_target_day'><i class="icon-plus"></i></button>
					</div>

				</div>

			</div>

			<div class='detail-row'>
				<div class='detail-column half'>
					<button type='button' class='btn btn-danger full' id='reset_preview_date'>Go to base date</button>
				</div>
				<div class='detail-column half'>
					<button type='button' class='btn btn-success full' id='go_to_preview_date'>Go to preview date</button>
				</div>
			</div>

		</div>

		<div class='separator'></div>

	</div>



	<!---------------------------------------------->
	<!-------------------- CLOCK ------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_clock" class="toggle" type="checkbox">
		<label for="collapsible_clock" class="lbl-toggle lbl-text">Clock <a target="_blank" title='Fantasy Calendar Wiki: Clock' href='https://wiki.fantasy-calendar.com/index.php?title=Clock' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-row'>
				<div class='detail-column'>Enable clock:</div>
				<div class='detail-column float'>
					<label class="custom-control custom-checkbox">
						<input type="checkbox" class="custom-control-input static_input" id='enable_clock' data='clock' key='enabled'>
						<span class="custom-control-indicator"></span>
					</label>
				</div>
			</div>

			<div class='clock_inputs' id='clock_inputs'>

				<div class='detail-row'>

					<div class='detail-column half'>
						<div class='detail-text'>
							Hours per day:
						</div>
					</div>

					<div class='detail-column half'>
						<div class='detail-text'>
							Minutes per day:
						</div>
					</div>

				</div>

				<div class='detail-row'>

					<div class='detail-column half input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn' onclick='adjustInput(this, -1);'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm static_input' data='clock' key='hours' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn' onclick='adjustInput(this, +1);'><i class="icon-plus"></i></button>
					</div>

					<div class='detail-column half input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn' onclick='adjustInput(this, -1);'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm static_input' data='clock' key='minutes' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn' onclick='adjustInput(this, +1);'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>

					<div class='detail-column half'>
						<div class='detail-text'>
							Offset hours:
						</div>
					</div>

				</div>
				<div class='detail-row'>

					<div class='detail-column half input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn' onclick='adjustInput(this, -1);'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm static_input' data='clock' key='offset' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn' onclick='adjustInput(this, +1);'><i class="icon-plus"></i></button>
					</div>

				</div>

			</div>

		</div>

		<div class='separator'></div>

	</div>



	<!---------------------------------------------->
	<!----------------- GLOBAL WEEK ---------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_globalweek" class="toggle" type="checkbox">
		<label for="collapsible_globalweek" class="lbl-toggle lbl-text">Global Week <a target="_blank" title='Fantasy Calendar Wiki: Global week' href='https://wiki.fantasy-calendar.com/index.php?title=Global_week' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-text bold-text'>First week day:</div>

			<select class='form-control static_input' id='first_day' data='year_data' key='first_day'></select>

			<div class='separator'></div>

			<div class='form-inline global_week'>
				<input type='text' class='form-control name' placeholder='Weekday name'>
				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='global_week_sortable'>
			</div>

		</div>

		<div class='separator'></div>

	</div>

	<!---------------------------------------------->
	<!----------------- TIMESPANS ------------------>
	<!---------------------------------------------->

	<div class='wrap-collapsible'>

		<input id="collapsible_timespans" class="toggle" type="checkbox">
		<label for="collapsible_timespans" class="lbl-toggle lbl-text">Months & Intercalaries <a target="_blank" title='Fantasy Calendar Wiki: Months & Intercalaries' href='https://wiki.fantasy-calendar.com/index.php?title=Months_intercalaries' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-text bold-text big-text'>Settings:</div>

			<div class='detail-row center-text hidden' id='overflow_explanation'>
				This calendar has a custom week in some months, this will disable overflows	between months, because it makes no sense for two weeks that do not go together to overflow into each other. Sorry.
			</div>

			<div class='detail-row'>
				<div class='detail-column'>
					Overflow month days:
				</div>
				<div class='detail-column float'>
					<label class="custom-control custom-checkbox">
						<input type="checkbox" class="custom-control-input static_input" data='year_data' key='overflow' id='month_overflow'>
						<span class="custom-control-indicator"></span>
					</label>
				</div>
			</div>

			<div class='separator'></div>

			<div class='form-inline timespan'>

				<input type='text' class='form-control name' placeholder='Timespan name'>

				<select class='custom-select type'>
					<option selected value='month'>Month</option>
					<option value='intercalary'>Intercalary</option>
				</select>

				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='timespan_sortable'>
			</div>

		</div>

		<div class='separator'></div>

	</div>



	<!---------------------------------------------->
	<!------------------ LEAP DAYS ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_leapdays" class="toggle" type="checkbox">
		<label for="collapsible_leapdays" class="lbl-toggle lbl-text">Leap days <a target="_blank" title='Fantasy Calendar Wiki: Leap Days' href='https://wiki.fantasy-calendar.com/index.php?title=Leap_days' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-row center-text' id='leap_day_explaination'>
				You need to have at least one month in order to add a leap day.
			</div>

			<div class='form-inline leap'>

				<input type='text' class='form-control name' placeholder='Leap day name'>

				<select class='custom-select type'>
					<option selected value='leap-day'>Normal day</option>
					<option value='intercalary'>Intercalary</option>
				</select>

				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='leap_day_list'>
			</div>

		</div>
		<div class='separator'></div>
	</div>


	

	<!---------------------------------------------->
	<!------------------- MOONS -------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_moon" class="toggle" type="checkbox">
		<label for="collapsible_moon" class="lbl-toggle lbl-text">Moons <a target="_blank" title='Fantasy Calendar Wiki: Moons' href='https://wiki.fantasy-calendar.com/index.php?title=Moons' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">
			<div class='form-inline moon'>
				<input type='text' class='form-control name' placeholder='Moon name'>
				<input type='button' value='Add' class='btn btn-primary add'>
				<input type='number' class='form-control cycle' min='1' placeholder='Cycle'>
				<input type='number' class='form-control shift' placeholder='Shift'>
			</div>
			<div class='sortable' id='moon_list'>
			</div>
		</div>
		<div class='separator'></div>
	</div>



	<!---------------------------------------------->
	<!------------------- SEASONS ------------------>
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_seasons" class="toggle" type="checkbox">
		<label for="collapsible_seasons" class="lbl-toggle lbl-text">Seasons<a target="_blank" title='Fantasy Calendar Wiki: Seasons' href='https://wiki.fantasy-calendar.com/index.php?title=Seasons' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='form-inline seasons'>
				<input type='text' class='form-control name' placeholder='Season name'>
				<input type='button' value='Add season' class='btn btn-primary add'>
			</div>

			<div class='detail-row sortable' id='season_sortable'></div>
			
			<div class='detail-row small-text' id='season_length_text'></div>

			<div class='separator'></div>

			<div class='detail-row'>
				<div class='detail-column'>Season offset:</div>
				<div class='detail-column float'>
					<input class='form-control form-control-sm static_input' type='number' data='seasons.global_settings' key='season_offset'/>
				</div>
			</div>

			<div class='detail-row'>
				<div class='detail-column'>Weather offset:</div>
				<div class='detail-column float'>
					<input class='form-control form-control-sm static_input' type='number' data='seasons.global_settings' key='weather_offset'/>
				</div>
			</div>

			<div class='separator'></div>

			<div class='detail-row'>
				<div class='detail-column'>Enable weather:</div>
				<div class='detail-column float'>
					<label class="custom-control custom-checkbox">
						<input type="checkbox" class="custom-control-input static_input" id='enable_weather' data='seasons.global_settings' key='enable_weather'>
						<span class="custom-control-indicator"></span>
					</label>
				</div>
			</div>

			<div id='weather_inputs'>
				<div class='detail-row'>
					<div class='detail-column half'>
						<div class='detail-row'>Temperature system:</div>
						<div class='detail-row'>
							<select class='custom-select type full static_input' id='temp_sys' data='seasons.global_settings' key='temp_sys'>
								<option selected value='metric'>Metric</option>
								<option value='imperial'>Imperial</option>
								<option value='both_m'>Both (inputs metric)</option>
								<option value='both_i'>Both (inputs imperical)</option>
							</select>
						</div>
					</div>

					<div class='detail-column half'>
						<div class='detail-row'>Wind speed system:</div>
						<div class='detail-row'>
							<select class='custom-select type full static_input' data='seasons.global_settings' key='wind_sys'>
								<option selected value='metric'>Metric</option>
								<option value='imperial'>Imperial</option>
								<option value='both'>Both</option>
							</select>
						</div>
					</div>
				</div>

				<div class='detail-row'>
					<div class='detail-column'>Cinematic temperature description:</div>
					<div class='detail-column float'>
						<label class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input static_input" data='seasons.global_settings' key='cinematic'>
							<span class="custom-control-indicator"></span>
						</label>
					</div>
				</div>

				<div class='separator'></div>

				<div class='detail-row'>
					<div class='detail-row'>Weather generation seed:</div>
					<div class='detail-column half'>
						<input type='number' id='seasons_seed' class='form-control static_input' data='seasons.global_settings' key='seed' />
					</div>
					<div class='detail-column half'>
						<div class='btn btn-primary full' id='reseed_seasons'>Generate new seed</div>
					</div>
				</div>
			</div>
		</div>

		<div class='separator'></div>
	</div>

	<!---------------------------------------------->
	<!------------------ LOCATIONS ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_locations" class="toggle" type="checkbox">
		<label for="collapsible_locations" class="lbl-toggle lbl-text">Locations <a target="_blank" title='Fantasy Calendar Wiki: Locations' href='https://wiki.fantasy-calendar.com/index.php?title=Locations' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='form-inline locations'>
				<input type='text' class='form-control name' placeholder='Location name'>
				<input type='button' value='Add location' class='btn btn-primary add'>
			</div>

			<div class='detail-row detail-select-container'>
				<div class='detail-label'>Location:</div>
				<div class='detail-select'>
					<select class='form-control' id='location_select'>
					</select>
				</div>
			</div>
			<div class='detail-row'>
				<input type='button' value='Copy location data' class='btn btn-info full add' id='copy_location_data'>
			</div>
			<div class='sortable' id='location_list'></div>
		</div>

		<div class='separator'></div>

	</div>

	<!---------------------------------------------->
	<!------------------- CYCLES ------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_cycles" class="toggle" type="checkbox">
		<label for="collapsible_cycles" class="lbl-toggle lbl-text">Cycles <a target="_blank" title='Fantasy Calendar Wiki: Cycles' href='https://wiki.fantasy-calendar.com/index.php?title=Cycles' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">
			<div class="detail-row">
				Cycle format:
			</div>	
			<div class="detail-row">
				<input type='text' id='cycle_format' class='form-control name static_input' data='cycles' key='format' placeholder='Cycle format'>
			</div>	

			<div class='form-inline cycle'>
				<input type='button' value='Add new cycle' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='cycle_sortable'></div>

			<div class='separator'></div>

			<div class='form-inline cycle'>
				<div class="cycle_test_container">Test year: <input type='number' value='1' min='1' id='cycle_test_input' class='form-control spinner'></div>
				<div id='cycle_test_result' class="italics-text">Test</div>
			</div>
		</div>

		<div class='separator'></div>
	</div>

	<!---------------------------------------------->
	<!-------------------- ERAS -------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_eras" class="toggle" type="checkbox">
		<label for="collapsible_eras" class="lbl-toggle lbl-text">Eras <a target="_blank" title='Fantasy Calendar Wiki: Eras' href='https://wiki.fantasy-calendar.com/index.php?title=Eras' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='form-inline eras'>
				<input type='text' class='form-control name' placeholder='Era name'>
				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='era_list'>
			</div>

			<input type='button' value='Reorder based on date' id='reorder_eras' class='btn btn-primary full hidden'>

		</div>
		<div class='separator'></div>
	</div>

	<!---------------------------------------------->
	<!----------------- CATEGORIES ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_categories" class="toggle" type="checkbox">
		<label for="collapsible_categories" class="lbl-toggle lbl-text">Event Categories <a target="_blank" title='Fantasy Calendar Wiki: Event Categories' href='https://wiki.fantasy-calendar.com/index.php?title=Event_categories' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">
			<div class='form-inline event_categories'>
				<input type='text' class='form-control name' placeholder='Event category name'>
				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='event_category_list'>
			</div>
		</div>
		<div class='separator'></div>
	</div>


	<!---------------------------------------------->
	<!------------------- EVENTS ------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_events" class="toggle" type="checkbox">
		<label for="collapsible_events" class="lbl-toggle lbl-text">Events <a target="_blank" title='Fantasy Calendar Wiki: Events' href='https://wiki.fantasy-calendar.com/index.php?title=Events' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='form-inline events'>
				<input type='text' class='form-control name' placeholder='Event name'>
				<input type='button' value='Add' class='btn btn-primary add'>
			</div>

			<div class='sortable' id='events_list'>
			</div>
		</div>
		<div class='separator'></div>
	</div>


	<!---------------------------------------------->
	<!------------------ SETTINGS ------------------>
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_settings" class="toggle" type="checkbox">
		<label for="collapsible_settings" class="lbl-toggle lbl-text">Settings <a target="_blank" title='Fantasy Calendar Wiki: Settings' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='form-inline'>


				<!------------------------------------------------------->

				<div class='bold-text'>Layout:</div>

				<label class="full setting last">
					<select class='form-control full static_input' data='settings' key='layout'>
						<option value='grid'>Grid style</option>
						<option value='wide'>Wide style</option>
						<option value='vertical'>Vertical style</option>
						<!--<option value='mini'>Minimalistic style</option>-->
					</select>
				</label>

				<label class="form-control full setting first">
					<input type='checkbox' class='margin-right static_input' data='settings' key='show_era_abbreviation'> 
					<span>
						Show era abbreviation
					</span>
					<a target="_blank" title='Instead of showing the full era name, only the abbreviation will be shown, if it has one' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting last">
					<input type='checkbox' class='margin-right static_input' data='settings' key='show_current_month'> 
					<span>
						Show only current month
					</span>
					<a target="_blank" title='Makes the calendar only show the current month' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<!------------------------------------------------------->

				<div class='bold-text'>Player View Settings:</div>

				<label class="form-control full setting first">
					<input type='checkbox' class='margin-right static_input' data='settings' key='allow_view'> 
					<span>
						Allow advancing view in calendar
					</span>
					<a target="_blank" title='This will allow players to view any past or future year and months like you can' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting">
					<input type='checkbox' class='margin-right static_input' data='settings' key='only_backwards'> 
					<span>
						Limit to only backwards view
					</span>
					<a target="_blank" title='This will limit players to only view past years' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting last">
					<input type='checkbox' class='margin-right static_input' data='settings' key='only_reveal_today'> 
					<span>
						Show only up to current day
					</span>
					<a target="_blank" title='Players will only be able to see up to current day, future days will be greyed out' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<!------------------------------------------------------->

				<div class='bold-text'>Hiding Settings:</div>

				<label class="form-control full setting first">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_moons'> 
					<span>
						Hide all moons from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_clock'> 
					<span>
						Hide time from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_events'> 
					<span>
						Hide all events from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_future_weather'> 
					<span>
						Hide future weather from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_all_weather'> 
					<span>
						Hide ALL weather from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting last">
					<input type='checkbox' class='margin-right static_input' data='settings' key='hide_eras'> 
					<span>
						Hide era from players
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>



				<!------------------------------------------------------->

				<div class='bold-text'>Event Settings:</div>

				<label class="form-control full setting first">
					<input type='checkbox' class='margin-right static_input' refresh='false' data='settings' key='add_month_number' onclick="setTimeout(calendar_layouts.add_month_number, 0);"> 
					<span>
						Add month number to months
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>

				<label class="form-control full setting last">
					<input type='checkbox' class='margin-right static_input' refresh='false' data='settings' key='add_year_day_number' onclick="setTimeout(calendar_layouts.add_year_day_number, 0);"> 
					<span>
						Add year day to each day
					</span>
					<a target="_blank" title='' href='https://wiki.fantasy-calendar.com/index.php?title=Settings' class="setting-question"><i class="icon-question-sign"></i></a>
				</label>
			</div>
		</div>
		<div class='separator'></div>
	</div>


	<!---------------------------------------------->
	<!------------------ LINKING ------------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_linking" class="toggle" type="checkbox">
		<label for="collapsible_linking" class="lbl-toggle lbl-text">Calendar Linking <a target="_blank" title='Fantasy Calendar Wiki: Calendar Linking' href='https://wiki.fantasy-calendar.com/index.php?title=Calendar_Linking' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-row center-text hidden calendar_link_explaination'>
				This calendar is already linked to another calendar. Before linking any calendars to this one, you must unlink it from the master.
			</div>

			<div id='calendar_link_hide'>

				<div class='detail-row'>
					<select class='form-control form-control' id='calendar_link_select'></select>
				</div>
				<div class='detail-row'>
					<button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_list_select'>Refresh</button>
				</div>
				<div class='detail-row'>
					<button type='button' class='btn btn-primary full' id='link_calendar'>Link</button>
				</div>

				<div class='sortable' id='calendar_link_list'></div>

			</div>

		</div>




		<div class='separator'></div>
	</div>
</form>

<div id='input_collapse_btn' class="btn btn-outline-primary"></div>

<div id="calendar_container">

	<div id="calendar_errors_background">
		<div id="calendar_errors">
			<span id="calendar_error_text">
				This is an alert box.
			</span>
		</div>
	</div>

	<div id="top_follower">

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden' disabled key='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden' disabled key='timespan' value='-1'>< Month</button>
		</div>

		<div id='top_follower_content'></div>

		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden' disabled key='year' value='1'>Year ></button>
			<button class='btn btn-success btn_preview_date hidden' disabled key='timespan' value='1'>Month ></button>
		</div>

	</div>

	<div id="calendar">

	</div>

	<div id="weather_container" class="hidden">

		<canvas class='chart' id='temperature'></canvas>

		<canvas class='chart' id='precipitation'></canvas>

	</div>

	<?php include('footnote.php') ?>

</div>

<div id='html_edit'></div>