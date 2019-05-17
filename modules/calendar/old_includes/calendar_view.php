<?php

$calendar_name = $calendar->get($_GET['id'])['data']['calendar']['name'];
$user_name = $calendar->get($_GET['id'])['data']['calendar']['username'];
$owned = $calendar->get($_GET['id'])['data']['owned'];

$title = '\'' . $calendar_name . '\'' . ' by ' . $user_name;

include('header.php');

?>

	<link rel='stylesheet' href='css/calendar_generation_style.css?ver=<?php echo $jsversion; ?>'>
	<link rel='stylesheet' href='css/calendar_display_style.css?ver=<?php echo $jsversion; ?>'>

	<script src='js/calendar_display.js?ver=<?php echo $jsversion; ?>'></script>

	<?php if($owned){ ?>

	<script src='js/calendar_view.js?ver=<?php echo $jsversion; ?>'></script>
	<script src='js/calendar_input_layout.js?ver=<?php echo $jsversion; ?>'></script>

	<?php }else{ ?>
	
	<script src='js/calendar_load.js?ver=<?php echo $jsversion; ?>'></script>

	<?php } ?>
	


	<div id='event_background' class='basic-background'>
		<div class='basic-container event-basic-container'>
			<div class='basic-wrapper'>
				<div class='basic-form'>
					<h3 id='display_event_name'></h3>
					<div id='display_event_description'>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="weather_background" class='basic-background'>
		<div class='basic-container'>
			<div class='basic-wrapper'>
				<div class='basic-form weather-basic-form'>
					<h3 id='display_weather_name'>Weather</h3>
					<div><span class='italics-text weather_date'></span></div>
					<div><span class='bold-text'>Temperature:</span> <span class='weather_temp'></span></div>
					<div><span class='bold-text'>Wind:</span> <span class='weather_wind'></span><span class='weather_wind_velocity'></span></div>
					<div><span class='weather_wind_description'></span></div>
					<div><span class='bold-text'>Precipitation:</span> <span class='weather_precip'></span></div>
					<div><span class='bold-text'>Clouds:</span> <span class='weather_clouds'></span></div>
					<div><span class='bold-text'>Feature:</span> <span class='weather_feature'></span></div>
				</div>
			</div>
		</div>
	</div>

	<div id='generator_container'>

		<div id='left_container'>

			<button id='btn_minimize_left_container' class='btn btn-outline-primary'><</button>

			<div id='left_scrollbox'>

				<div id='clock'>
				</div>

				<?php if($owned){ ?>

				<div id='input_container' style='border-top:1px solid #ddd;'>
					
					<div id='generator_column'>

						<div class='center_column'>

							<a href='calendar.php?action=edit&id=<?php echo $_GET['id']; ?>'><button style='margin-bottom:10px;' class='btn btn-sm btn-success btn-block'>Go to Edit</button></a>

							<p>Current Year:</p>
							<div class='btn_input_container'>
								<button class='btn_procedural btn btn-danger' arguments='-1' function='change_year'>-1</button><input id='current_year' class='btn_input' type='number' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which year is currently is in your calendar.'/><button class='btn_procedural btn btn-success' arguments='1' function='change_year'>+1</button>
							</div>

							<p>Current month:</p>
							<div class='btn_input_container'>
								<button class='btn_procedural btn btn-danger' arguments='-1' function='change_month'>-1</button>
								<select id='current_month' class='btn_input procedural_month_list' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the current month on the calendar.' ></select>
								<button class='btn_procedural btn btn-success' arguments='1' function='change_month'>+1</button>
							</div>

							<p>Current Day:</p>
							<div class='btn_input_container'>
								<button class='btn_procedural btn btn-danger' arguments='-1' function='update_date'>-1</button>
								<select id='current_day' parent='current_month' class='btn_input procedural_day_list' name='event_to_day' placeholder='Day' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects which day is currently is in your calendar.'>
								</select>
								<button class='btn_procedural btn btn-success' arguments='1' function='update_date'>+1</button>
							</div>

							<div id='time'>
								<p style='text-align:left;'>Current Time:</p>
								<div class='btn_input_container'>
									<button class='btn_procedural btn btn-danger' arguments='-30' function='change_minute'>30m</button>
									<button class='btn_procedural btn btn-danger' arguments='-1' function='change_hour'>1h</button>
									<div class='btn_input btn_view'>
										<input id='current_hour_input' class='subline' type='number' /><div>:</div>
										<input id='current_minute_input' class='subline' type='number' />
									</div>
									<button class='btn_procedural btn btn-success' arguments='1' function='change_hour'>1h</button>
									<button class='btn_procedural btn btn-success' arguments='30' function='change_minute'>30m</button>
								</div>
							</div>

							<div id='weather_container'>
								<p style='text-align:left;'>Current Climate:</p>
								<select id='weather_climate' data-toggle='tooltip' data-animation='false' data-placement='right' title='This selects the climate from which to generate your weather patterns.' tabindex="4">
									<optgroup id='weather_presets' value='preset' label='Weather presets'>
										<option value='Equatorial'>Equatorial (0-20° lat.)</option>
										<option value='Tropical Savannah'>Tropical Savannah (0-20° lat.)</option>
										<option value='Monsoon'>Monsoon (0-20° lat.)</option>
										<option value='Desert'>Desert (0-30° lat.)</option>
										<option value='Steppes'>Steppes (20-50° lat.)</option>
										<option value='Warm with Dry Winter'>Warm with Dry Winter (20-40° lat.)</option>
										<option value='Warm with Dry Summer'>Warm with Dry Summer (20-50° lat.)</option>
										<option value='Warm and Rainy'>Warm and Rainy (20-50° lat.)</option>
										<option value='Cool and Rainy'>Cool and Rainy (40-70° lat.)</option>
										<option value='Cool with Dry Winter'>Cool with Dry Winter (50-70° lat.)</option>
										<option value='Tundra'>Tundra (70°+ lat.)</option>
										<option value='Polar'>Polar (70°+ lat.)</option>
									</optgroup>
								</select>
							</div>

						</div>
					</div>
				</div>
			</div>

			<?php }else{ ?>

		</div>

	<?php } ?>

	</div>

	<div id='right_container'>
		<div id='calendar_container'>
			<div id='calendar'>
			</div>
			<div id='weather_tooltip_box'>
				<div><span class='bold-text'>Temperature:</span> <span class='weather_temp'></span></div>
				<div><span class='bold-text'>Wind:</span> <span class='weather_wind'></span></div>
				<div><span class='bold-text'>Precipitation:</span> <span class='weather_precip'></span></div>
				<div><span class='bold-text'>Clouds:</span> <span class='weather_clouds'></span></div>
			</div>
		</div>
	</div>

</div>
<?php
	
include('footer.php');


?>
