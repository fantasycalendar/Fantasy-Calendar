<div id="event_show_background" class='clickable_background hidden'>
	<div class='event-basic-container'>
		<div class='event-basic-wrapper'>
			<div class='event-basic-wrapper'>
				<div class='event-wrapper'>
					<div class='close-ui-btn-bg'></div>
					<i class="close_ui_btn icon-remove-circle"></i>

					<h2 class='event_name event-form-heading'></h2>
					<div class='row'>
						<div class="event_desc"></div>
					</div>

					<div id='event_comment_mastercontainer'>

						<div class='spacey_separator'></div>

						<h4>Comments:</h4>

						<div class='row'>
							<div id='event_comments' class='loading'></div>
						</div>
						@if(Auth::check())
							<div class='row'>
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
			<form id="event-form" class="event-wrapper container" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn icon-remove-circle"></i>

				<div class='col-12'>

					<div class='row my-1'>
						<h2 class='event-form-heading'>Edit Event</h2>
					</div>

					<div class='row my-1'>
						<input type='text' class='form-control event_name' name='event_name' placeholder='Event name' autofocus='' />
					</div>

					<div class='row my-1'>
						<textarea class='form-control event_desc editable' name='event_desc' placeholder='Event description' autofocus=''></textarea>
					</div>

					<div class='row mt-2'>Condition presets:</div>

					<div class='row mb-1'>
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
							<optgroup value='moons' label='Moons' class='hidden'></optgroup>
						</select>
					</div>

					<div class='row mb-1 hidden'>
						<input type='number' class='form-control' id='repeat_input' name='repeat_input' value='1' min='1' placeholder='Every nth' />
					</div>

					<div class='row' id='preset_buttons'>
						<button type='button' id='add_event_preset' class='btn btn-info full'>Add condition preset</button>
					</div>

					<h5 class='row my-2 event-form-heading'>Conditions:</h5>
					<div class='row my-2' id='non_preset_buttons'>
						<div class='col-6 pl-0 pr-1'>
							<button type='button' id='add_event_condition' class='btn btn-primary full'>Add condition</button>
						</div>
						<div class='col-6 pl-1 pr-0'>
							<button type='button' id='add_event_condition_group' class='btn btn-primary full'>Add new group</button>
						</div>
					</div>
					<div class='row my-2'>

						<ol class='form-control group_list_root' id='event_conditions_container'>

						</ol>

					</div>
					<div class='row my-2'>
						<button type='button' id='remove_dropped' class='btn btn-danger full hidden'>DROP ITEM HERE TO REMOVE</button>
					</div>

					<div class='event_occurrences hidden container p-0'>

						<div class='row mt-2'>
							<h5 class='event-form-heading full'>Test event occurrences for the next:</h5>
						</div>

						<div class='row'>
							<div class='col-3 px-1'>
								<button type='button' class='btn btn-info full test_event_btn' years="1">1 year</button>
							</div>
							<div class='col-3 px-1'>
								<button type='button' class='btn btn-info full test_event_btn' years="10">10 years</button>
							</div>
							<div class='col-3 px-1'>
								<button type='button' class='btn btn-info full test_event_btn' years="50">50 years</button>
							</div>
							<div class='col-3 px-1'>
								<button type='button' class='btn btn-info full test_event_btn' years="100">100 years</button>
							</div>
						</div>
					</div>

					<div class='row mb-2 list_container hidden'>
						<div class='text'></div>
						<div class='list hidden row'>
							<ul class='col half col1'></ul>
							<ul class='col half col2'></ul>
							<div class='full page_number'></div>
							<button type='button' class='btn btn-info half prev' disabled>Previous</button>
							<button type='button' class='btn btn-info half next' disabled>Next</button>
						</div>
					</div>

					<div class='row mt-2'>
						<div class='separator'></div>
					</div>

					<div class='row my-2'>
						<h5 class='event-form-heading'>Display settings:</h5>
					</div>

					<div class='row mb-2'>
						<div class='col-6 pl-0 pr-1'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='limited_repeat' name='limited_repeat'> Limit repetitions
							</label>
						</div>

						<div class='col-6 pl-1 pr-0 form-control'>
							<label class='row'>
								<div class='col-md-auto pl-4 pr-1'>
									 Limit for
								</div>
								<div class='col-4 p-0'>
									 <input type='number' min='1' value='1' class='form-control form-control-sm' id='limited_repeat_num' name='limited_repeat_num' disabled>
								</div>
								<div class='col-md-auto pl-1 pr-0'>
									 days.
								</div>
							</label>
						</div>
					</div>

					<div class='row my-2'>
						<h5 class='event-form-heading'>Duration settings:</h5>
					</div>

					<div class='row mb-2'>
						<div class='col-6 pl-0 pr-1'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='has_duration' name='has_duration'> Has Duration
							</label>
						</div>

						<div class='col-6 pl-1 pr-0 form-control'>
							<label class='row'>
								<div class='col-md-auto pl-4 pr-1'>
									 Lasts for
								</div>
								<div class='col-4 p-0'>
									 <input type='number' min='1' value='1' class='form-control form-control-sm' id='duration' name='duration' disabled>
								</div>
								<div class='col-md-auto pl-1 pr-0'>
									 days.
								</div>
							</label>
						</div>
					</div>

					<div class='row mb-2'>
						<div class='col-12 pl-0 pr-1'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='show_first_last' name='show_first_last'> Show only first and last event in duration
							</label>
						</div>
					</div>

					<div class='row my-2'>
						<div class='separator'></div>
					</div>

					<div class='row'>
						<div class='col-md-auto pl-0 pr-1'>
							<h5 class='event-form-heading'>Category:</h5>
						</div>
						<div class='col pl-0 pl-1'>
							<select class="form-control event-category-list" id="event_categories" name='event_categories' placeholder='Event Category'>

							</select>
						</div>
					</div>

					<div class='row'>
						<h5 class='event-form-heading full'>Settings:</h5>
					</div>

					<div class='row'>
						<div class='col p-0'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='event_hide_full' name='event_hide_full'> Hide ENTIRELY (useful for event-based-events)
							</label>
						</div>
					</div>

					<div class='row'>
						<div class='col p-0'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='event_hide_players' name='event_hide_players'> Hide from players
							</label>
						</div>
					</div>

					<div class='row'>
						<div class='col p-0'>
							<label class='form-control checkbox'>
								<input type='checkbox' id='event_dontprint_checkbox' name='event_dontprint_checkbox'> Do not print
							</label>
						</div>
					</div>

					<div class='row'>
						<div class='col p-0'>
							<h5 class='event-form-heading'>Color:</h5>
							<select id="color_style" name='color_style' class='form-control event-text-input color_display' key='color_display'>
								<option>Dark-Solid</option>
								<option>Red</option>
								<option>Pink</option>
								<option>Purple</option>
								<option>Deep-Purple</option>
								<option>Blue</option>
								<option>Light-Blue</option>
								<option>Cyan</option>
								<option>Teal</option>
								<option>Green</option>
								<option>Light-Green</option>
								<option>Lime</option>
								<option>Yellow</option>
								<option>Orange</option>
								<option>Blue-Grey</option>
							</select>
						</div>

						<div class='col p-0'>
							<h5 class='event-form-heading'>Display:</h5>
							<select id="text_style" name='text_style' class='form-control event-text-input text_display'>
								<option value="text">Just text</option>
								<option value="dot">• Dot with text</option>
								<option value="background">Background</option>
							</select>
						</div>
					</div>

					<div class='row mt-3'>
						<div class='col-4 p-0'>
							Event look: <div class='event-text-output event'>Event name</div>
						</div>
					</div>

					<div class='row'>
						<div class='col p-0'>
							<div id='event_messagebox'></div>
						</div>
					</div>

					<div class='row my-1'>
						<div class='btn btn-lg btn-primary btn-block' id='btn_event_save'>Save</div>
					</div>
					<div class='row my-1'>
						<div class='btn btn-sm btn-danger btn-block' id='btn_event_delete'>Delete</div>
					</div>
				</div>
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

				<div class='row'>
					<textarea class='form-control html_input editable' name='html_input' placeholder='Event description' autofocus=''></textarea>
				</div>

				<div class='btn btn-lg btn-primary btn-block' id='btn_html_save'>Save</div>
			</form>
		</div>
	</div>
</div>
