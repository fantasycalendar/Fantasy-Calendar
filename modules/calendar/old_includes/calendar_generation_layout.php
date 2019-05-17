<div id='clock'>
	<img src='resources/clock_arm.png' id='clock_arm'/>
	<div id='clock_hours'></div>
	<img src='resources/startofday.png' id='StartOfDay' class='SunUpDown'/>
	<img src='resources/endofday.png' id='EndOfDay' class='SunUpDown' />
	<img src='resources/clock_base.png' id='base'/>
</div>

<ul class="nav nav-tabs" role="tablist">
	<li class="nav-item">
		<a class="nav-link active" data-toggle="tab" href="#generation" role="tab">Generation</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" data-toggle="tab" href="#settings" role="tab">Settings</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" data-toggle="tab" href="#events" role="tab">Events</a>
	</li>
</ul>

<div id='input_container'>

	<div id='preset_container'>
	
		<input id='calendar_name' placeholder='Calendar Name' type='text' />

		<div id='edit_button_container'></div>

		<?php
		if(!empty($_SESSION['user_id'])){
		?>
			<button disabled id='btn_save' class='btn btn-lg btn-primary btn-block'>Save</button>
		<?php
		} else {
		?>
			<button class='login-show-button btn btn-lg btn-info btn-block'>Log in to save</button>
		<?php
		}

		if($_GET['action'] === 'edit'){
		?>
			<button id='btn_delete' class='btn btn-sm btn-danger btn-block'>Delete</button>
		<?php
		}elseif($_GET['action'] === 'generate'){
		?>
			<button id='btn_clear' class='btn btn-sm btn-danger btn-block'>Clear</button>

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
			
			<button id='json_apply' class='btn btn-warning btn-sm' >Apply</button>

			<div id='json_container'>
				<p>JSON input:</p>
				<textarea id='json_input'></textarea>
			</div>

		<?php
		}
		?>

	</div>

	<div id='generation_column'>

		<div class="tab-content">
		
			<div class="tab-pane active" id="generation" role="tabpanel">

				<div class='left_column'>

					<p>Enable clock: <input type='checkbox' id='clock_enabled' class='checkbox' checked></p>

					<div class='clock_setting_container'>
						
						<p>Current Time:</p>
						<div class='btn_input_container'>
							<button class='btn_procedural btn btn-danger' arguments='-1.0'  function='change_hour'>-</button>
							<div class='btn_input'>
								<input id='current_hour_input' class='subline' type='number' tabindex="1" /><div>:</div>
								<input id='current_minute_input' class='subline' type='number' tabindex="2" />
							</div>
							<button class='btn_procedural btn btn-success' arguments='1.0' function='change_hour'>+</button>
						</div>
					</div>
					<div class='solstice_setting_container'>
						
						<div class='solstice_container'>
							<p>Summer solstice:</p>
							<select id='summer_solstice_month' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the summer solstice month on the calendar.' tabindex="4"></select>

							<select id="summer_solstice_day" parent="summer_solstice_month" class="solstice_day procedural_day_list" name='event_to_day' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines which day the summer solstice is on the calendar.' tabindex="5">
							</select>
						</div>
						<div class='solstice_container'>
							<p>Winter solstice:</p>
							<select id='winter_solstice_month' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the winter solstice month on the calendar.' tabindex="8"></select>

							<select id="winter_solstice_day" parent="winter_solstice_month" class="solstice_day procedural_day_list" name='event_to_day' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines which day the winter solstice is on the calendar.' tabindex="9">
							</select>
						</div>

					</div>

					<p>Current Year:</p>
					<div class='btn_input_container'>
						<button class='btn_procedural btn btn-danger' arguments='-1' function='change_year'>-</button><input id='current_year' class='btn_input' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which year is currently is in your calendar.' tabindex="12"/><button class='btn_procedural btn btn-success' arguments='1' placeholder='Year' function='change_year'>+</button>
					</div>

					<p>Current month:</p>
					<select id='current_month' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.' tabindex="14"></select>
					
					<p>Days in a year:</p>
					<input id='year_len' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how many days there are in a year in your calendar.' tabindex="16"/>

					<p>Leap year every X year:</p>
					<input id='year_leap' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how often a leap year should occur. If you put 4, the leap year appears on year 0, 4, 8, 12, and so on.' tabindex="16"/>

					<span id="leap_month_container">
						<p>Leap month:</p>
						<select id='month_leap' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the month which the leap day falls upon.' tabindex="18"></select>
					</span>
					
					<div class='checkbox_text_container overflow_container' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines if the last day of a month will offset the first day of the next month.'>
						<div class='checkbox_container overflow_checkbox'><input type='checkbox' id='overflow_months'></div>
						<div class='checkbox_text overflow_text'>Overflow months</div>
					</div>

					<p>Months in a year:</p>
					<input id='n_months' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how many months there are in your calendar.' tabindex="20" />
					<div id='month_list'></div>
					
				</div>
				<div class='right_column'>
					
					<p>Enable solstice: <input type='checkbox' id='solstice_enabled' class='checkbox' checked></p>
					
					<div class='clock_setting_container'>
						<p>Hours per Day:</p>
						<div class='btn_input_container'>
							<button class='btn_procedural btn btn-danger' arguments='-1' function='change_hours'>-</button><input id='hours_input' class='btn_input' type='number' tabindex="3"/><button class='btn_procedural btn btn-success' arguments='1' function='change_hours'>+</button>
						</div>
					</div>
					<div class='solstice_setting_container'>
						<p>Summer times:</p>
						<div class='clock_rise_set'>
							<input type='number' id='summer_set' class='solstice_input'  data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines the time the sun sets during the summer solstice (longest day).' tabindex="7" placeholder='Set'/>
							<input type='number' id='summer_rise' class='solstice_input' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines the time the sun rises during the summer solstice (longest day).' tabindex="6" placeholder='Rise'/>
						</div>

						<p>Winter times:</p>
						<div class='clock_rise_set'>
							<input type='number' id='winter_set' class='solstice_input'  data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines the time the sun sets during the winter solstice (shortest day).' tabindex="11"  placeholder='Set'/>
							<input type='number' id='winter_rise' class='solstice_input'  data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines the time the sun rises during the winter solstice (shortest day).' tabindex="10"  placeholder='Rise'/>
						</div>
					</div>
					
					<p>Name of era:</p>
					<input id='current_era' type='text' data-toggle='tooltip' data-animation='false' data-placement='right' title='This is just fluff, which adds an era after the year (i.e. 1200 BC).' tabindex="13"/>

					<p>Current Day:</p>
					<div class='btn_input_container'>
						<button class='btn_procedural btn btn-danger' arguments='-1' function='update_date'>-</button>
						<select id="current_day" parent="current_month" class="btn_input procedural_day_list" name='event_to_day' placeholder='Day' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which day is currently is in your calendar.' tabindex="15">
						</select>
						<button class='btn_procedural btn btn-success' arguments='1' function='update_date'>+</button>
					</div>
					
					<p>Days in a week:</p>
					<input type='number' id='week_len' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how many days there are in a week.' tabindex="17"/>
					<div id='week_day_list'></div>

					<p>First day:</p>
					<select id='first_day' class='procedural_week_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the first day of year 0.' tabindex="19"></select>
					
					<!-- <p>Moon fidelity:</p>
					<select id='moon_fidelity' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects how accurate the moon cycle will be.' tabindex="21">
						<option>High (32 moon cycles)</option>
						<option>Medium (16 moon cycles)</option>
						<option>Low (8 moon cycles)</option>
					</select> -->

					<p>Moons:</p>
					<input type='number' id='n_moons' data-toggle='tooltip' data-animation='false' data-placement='right' title='This determines how many moons there are in your world.' tabindex="22"/>
					<div id='moon_list'></div>
				</div>

			</div>


			<div class="tab-pane" id="settings" role="tabpanel">
				
				<div class='center_column'>
						
					<h4>Player view settings:</h4>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='show_current_month'></div>
						<div class='checkbox_text'>Show only current month</div>
					</div>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='allow_view'></div>
						<div class='checkbox_text'>Allow advancing view in calendar</div>
					</div>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='only_backwards'></div>
						<div class='checkbox_text'>Allow only backwards view</div>
					</div>
					
					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='add_month_number'></div>
						<div class='checkbox_text'>Add month number to months</div>
					</div>
					
					<h4>Hiding settings:</h4>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='hide_moons'></div>
						<div class='checkbox_text'>Hide moons from players</div>
					</div>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='hide_clock'></div>
						<div class='checkbox_text'>Hide clock from players</div>
					</div>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='hide_events'></div>
						<div class='checkbox_text'>Hide events from players</div>
					</div>
					
					<h4>Event settings:</h4>

					<div class='checkbox_text_container'>
						<div class='checkbox_container'><input type='checkbox' class='setting' id='auto_events'></div>
						<div class='checkbox_text'>Auto generate solstice/equinox event</div>
					</div>

				</div>
			</div>

			<div class="tab-pane" id="events" role="tabpanel">
				<!--
				<div class='center_column'>
						
					<h4>Event filtering:</h4>

					<div class='event_filter_input_container'>
						<div>
							<p>From Year:</p>
							<input id='event_filter_from_year' value='0' class='btn_input' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which year is currently is in your calendar.'/>
						</div>
						<div>
							<p>To Year:</p>
							<input id='event_filter_to_year' value='0' class='btn_input' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which year is currently is in your calendar.'/>
						</div>
					</div>

					<div class='event_filter_input_container'>
						<div>
							<p>From Month:</p>
							<select id='event_filter_from_month' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.'></select>
						</div>
						<div>
							<p>To Month:</p>
							<select id='event_filter_to_month' class='procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.'></select>
						</div>
					</div>

					<div class='event_filter_input_container'>
						<div>
							<p>From Day:</p>
							<select id='event_filter_from_day' parent="event_filter_from_month" class='procedural_day_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.'></select>
						</div>
						<div>
							<p>To Day:</p>
							<select id='event_filter_to_day' parent="event_filter_to_month" class='procedural_day_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.'></select>
						</div>
					</div>
				</div>-->
			</div>
		</div>
	</div>
</div>