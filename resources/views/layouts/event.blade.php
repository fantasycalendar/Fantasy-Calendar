<div id="event_show_background" class='clickable_background hidden'>
	<div class='event-basic-container'>
		<div class='event-basic-wrapper'>
			<div class='event-basic-wrapper'>
				<div class='event-wrapper'>
					<div class='close-ui-btn-bg'></div>
					<i class="close_ui_btn icon-remove-circle"></i>

					<h2 class='event_name event-form-heading'></h2>
					<div class='detail-row'>
						<div class="event_desc"></div>
					</div>

					<div id='event_comment_mastercontainer'>

						<div class='spacey_separator'></div>

						<h4>Comments:</h4>

						<div class='detail-row'>
							<div id='event_comments' class='loading'></div>
						</div>
						@if(Auth::check())
							<div class='detail-row'>
								<textarea class='form-control' id='event_comment_input' placeholder='Enter your comment and press submit.' autofocus=''></textarea>
								<button type='button' class='btn btn-primary' style="z-index: 200" id='submit_comment'>Submit</button>
							</div>
						@endif

					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div id="event_edit_background" class='clickable_background hidden'>
	<div class='event-basic-container'>
		<div class='event-basic-wrapper'>
			<form id="event-form" class="event-wrapper" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn icon-remove-circle"></i>

				<h2 class='event-form-heading'>Edit Event</h2>
				<div class='detail-row'>
					<input type='text' class='form-control event_name' name='event_name' placeholder='Event name' autofocus='' />
				</div>

				<div class='detail-row'>
					<textarea class='form-control event_desc editable' name='event_desc' placeholder='Event description' autofocus=''></textarea>
				</div>

				<div class='detail-row hidden'>

					<label for="condition_presets">Condition presets:</label>
					<select class="form-control" id="condition_presets">
						<option value='none'>None</option>
						<option value='once'>Happens once</option>
						<option value='daily'>Daily</option>
						<option value='weekly'>Weekly on Wednesday</option>
						<option value='fortnightly'>Fortnightly on Wednesday</option>
						<option value='monthly_date'>Monthly on this date</option>
						<option value='monthly_weekday'>Monthly on the 1st Wednesday</option>
						<option value='annually_date'>Annually on this date</option>
						<option value='annually_month_weekday'>Annually on this date</option>
						<option nth value='every_x_day'>Every x day</option>
						<option nth value='every_x_weekday'>Every x Wednesday</option>
						<option nth value='every_x_monthly_date'>Every x month on the 3rd</option>
						<option nth value='every_x_monthly_weekday'>Every x month on the 3rd Wednesday</option>
						<option nth value='every_x_annually_date'>Every x year on the 3rd of June</option>
						<option nth value='every_x_annually_weekday'>Every x year on the 3rd Wednesday in June</option>
					</select>

				</div>

				<div class='detail-row hidden'>
					<input type='number' class='form-control' id='repeat_input' name='repeat_input' value='1' min='1' placeholder='Every nth' />
				</div>

				<div>
					<h5 class='event-form-heading'>Conditions:</h5>
					<div class='detail-row' id='non_preset_buttons'>
						<button type='button' id='add_event_condition' class='btn btn-primary half'>Add condition</button>
						<button type='button' id='add_event_condition_group' class='btn btn-primary half'>Add new group</button>
					</div>
					<div class='detail-row hidden' id='preset_buttons'>
						<button type='button' id='add_event_preset' class='btn btn-info full'>Add condition preset</button>
					</div>
					<div class='detail-row'>

						<ol class='form-control group_list_root' id='event_conditions_container'>

						</ol>

					</div>
					<div class='detail-row'>
						<button type='button' id='remove_dropped' class='btn btn-danger full hidden'>DROP TO REMOVE</button>
					</div>
				</div>

				<div class='event_occurrences hidden'>
					<div class='detail-row'>
						<h5 class='event-form-heading full'>Test event occurrences for the next:</h5>
						<div class='detail-row'>
							<button type='button' class='btn btn-info quarter test_event_btn' years="1">1 year</button>
							<button type='button' class='btn btn-info quarter test_event_btn' years="10">10 years</button>
							<button type='button' class='btn btn-info quarter test_event_btn' years="50">50 years</button>
							<button type='button' class='btn btn-info quarter test_event_btn' years="100">100 years</button>
						</div>
					</div>

					<div class='detail-row list_container hidden'>
						<div class='text'></div>
						<div class='list hidden detail-row'>
							<ul class='detail-column half col1'></ul>
							<ul class='detail-column half col2'></ul>
							<div class='full page_number'></div>
							<button type='button' class='btn btn-info half prev' disabled>Previous</button>
							<button type='button' class='btn btn-info half next' disabled>Next</button>
						</div>
					</div>
				</div>

				<div class='spacey_separator'></div>

				<div class='detail-row'>
					<h5 class='event-form-heading full'>Display settings:</h5>

					<div class='detail-column half'>
						<label class='form-control checkbox'>
							<input type='checkbox' id='limited_repeat' name='limited_repeat'> Limit repetitions
						</label>
					</div>

					<div class='detail-column half'>
						<label class='form-control '>
							<div class='detail-column'>
								 Limit for
							</div>
							<div class='detail-column third'>
								 <input type='number' min='1' value='1' class='form-control form-control-sm' id='limited_repeat_num' name='limited_repeat_num'>
							</div>
							<div class='detail-column'>
								 days.
							</div>
						</label>
					</div>
				</div>

				<div class='detail-row'>

					<h5 class='event-form-heading full'>Duration settings:</h5>

					<div class='detail-column half'>
						<label class='form-control checkbox'>
							<input type='checkbox' id='has_duration' name='has_duration'> Has duration
						</label>
					</div>

					<div class='detail-column half'>
						<label class='form-control '>
							<div class='detail-column'>
								 Lasts for
							</div>
							<div class='detail-column third'>
								 <input type='number' min='1' value='1' class='form-control form-control-sm' id='duration' name='duration'>
							</div>
							<div class='detail-column'>
								 days.
							</div>
						</label>
					</div>
				</div>

				<div class='detail-row'>
					<div class='detail-column'>
						<label class='form-control checkbox'>
							<input type='checkbox' id='show_first_last' name='show_first_last'> Show only first and last event
						</label>
					</div>
				</div>

				<div class='spacey_separator'></div>

				<div class='detail-row'>
					<h5 class='event-form-heading'>Category:</h5>
					<select class="form-control event-category-list" id="event_categories" name='event_categories' placeholder='Event Category'>

					</select>
				</div>

				<div class='detail-row'>
					<h5 class='event-form-heading full'>Settings:</h5>

					<div class='detail-row'>
						<div class='detail-column full'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='event_hide_full' name='event_hide_full'> Hide ENTIRELY (useful for event-based-events)
							</label>
						</div>
					</div>

					<div class='detail-column half'>
						<label class='form-control checkbox'>
							<input type='checkbox' id='event_hide_players' name='event_hide_players'> Hide from players
						</label>
					</div>

					<div class='detail-column half'>
						<label class='form-control checkbox'>
							<input type='checkbox' id='event_dontprint_checkbox' name='event_dontprint_checkbox'> Do not print
						</label>
					</div>
				</div>

				<div class='detail-row'>
					<div class='detail-column half'>
						<h5 class='event-form-heading'>Text color:</h5>
						<select id="color_style" name='color_style' class='form-control event-text-input color_display' key='color_display'>
							<option class="event background Dark-Solid">Dark-Solid</option>
							<option class="event background Red">Red</option>
							<option class="event background Pink">Pink</option>
							<option class="event background Purple">Purple</option>
							<option class="event background Deep-Purple">Deep-Purple</option>
							<option class="event background Blue">Blue</option>
							<option class="event background Light-Blue">Light-Blue</option>
							<option class="event background Cyan">Cyan</option>
							<option class="event background Teal">Teal</option>
							<option class="event background Green">Green</option>
							<option class="event background Light-Green">Light-Green</option>
							<option class="event background Lime">Lime</option>
							<option class="event background Yellow">Yellow</option>
							<option class="event background Orange">Orange</option>
							<option class="event background Blue-Grey">Blue-Grey</option>
						</select>
					</div>

					<div class='detail-column half'>
						<h5 class='event-form-heading'>Text style:</h5>
						<select id="text_style" name='text_style' class='form-control event-text-input text_display'>
							<option class="event Dark-Solid text" value="text">Just text</option>
							<option class="event Dark-Solid dot" value="dot">• Dot with text</option>
							<option class="event Dark-Solid background" value="background">Background</option>
						</select>
					</div>
				</div>

				<div class='detail-row'>
					<div class='detail-column full'>
						Event look: <div class='half event-text-output event'>Event name</div>
					</div>
				</div>

				<div class='detail-row'>
					<div class='detail-column full'>
						<div id='event_messagebox'></div>
					</div>
				</div>

				<div class='btn btn-lg btn-primary btn-block' id='btn_event_save'>Save</div>
				<div class='btn btn-sm btn-danger btn-block' id='btn_event_delete'>Delete</div>

			</form>
		</div>
	</div>
</div>

<div id="html_edit_background" class='clickable_background hidden'>
	<div class='event-basic-container'>
		<div class='event-basic-wrapper'>
			<form id="html-form" class="event-wrapper" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn icon-remove-circle"></i>

				<h2 class='event-form-heading'>Edit HTML</h2>

				<div class='detail-row'>
					<textarea class='form-control html_input editable' name='html_input' placeholder='Event description' autofocus=''></textarea>
				</div>

				<div class='btn btn-lg btn-primary btn-block' id='btn_html_save'>Save</div>
			</form>
		</div>
	</div>
</div>
