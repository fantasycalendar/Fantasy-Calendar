<div id="event_show_background" class='clickable_background hidden'>
	<div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<div class='modal-wrapper'>
            
				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle"></i>

				<div class='row no-gutters modal-form-heading'>
					<h2><span class='event_name'>Editing Event</span> <i class="fas fa-pencil-alt edit_event_btn"></i></h2>
				</div>
				
				<div class='row'>
					<div class="event_desc col-12"></div>
				</div>

				<div id='event_comment_mastercontainer' class="row">

					<div class="col-12">
						<hr>

						<h4>Comments:</h4>

						<div class='row'>
							<div id='event_comments' class='loading col-12'></div>
						@if(Auth::check())
							<div class='col-12 mt-2' id='event_comment_input_container'>
								<textarea class='form-control' id='event_comment_input' placeholder='Enter your comment and press submit.' autofocus=''></textarea>
								<button type='button' class='btn btn-primary mt-2' style="z-index: 200" id='submit_comment'>Submit</button>
							</div>
						@endif
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div id="event_edit_background" class='clickable_background hidden'>
	<div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<form id="event-form" class="modal-wrapper container" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle"></i>

				<div class='row no-gutters mb-1 modal-form-heading'>
					<h2 class='event_action_type'><span>Editing Event</span> <i class="fas fa-eye view_event_btn"></i></h2>
				</div>

				<div class='row no-gutters my-1'>
					<input type='text' class='form-control event_name' name='event_name' placeholder='Event name' autofocus='' />
				</div>

				<div class='row no-gutters my-1'>
					<textarea class='form-control event_desc editable' name='event_desc' placeholder='Event description' autofocus=''></textarea>
				</div>

                @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('advance-date', $calendar)))

                    <h5 class='row no-gutters mt-2 modal-form-heading'>Condition presets:</h5>

                    <div class='row no-gutters mb-1'>
                        <select class="form-control" id="condition_presets">
                            <option value='none'>None</option>
                            <option value='once'>Happens once</option>
                                <option value='daily'>Daily</option>
                                <option value='weekly'>Weekly on Wednesday</option>
                                <option value='fortnightly'>Fortnightly on Wednesday</option>
                                <option value='monthly_date'>Monthly on this date</option>
                                <option value='monthly_weekday'>Monthly on the 1st Wednesday</option>
                                <option value='monthly_inverse_weekday'>Monthly on the last Wednesday</option>
                                <option value='annually_date'>Annually on this date</option>
                                <option value='annually_month_weekday'>Annually on the 1st Wednesday date</option>
                                <option value='annually_inverse_month_weekday'>Annually on the last Wednesday</option>
                                <option nth value='every_x_day'>Every x day</option>
                                <option nth value='every_x_weekday'>Every x Wednesday</option>
                                <option nth value='every_x_monthly_date'>Every x month on the 3rd</option>
                                <option nth value='every_x_monthly_weekday'>Every x month on the 3rd Wednesday</option>
                                <option nth value='every_x_inverse_monthly_weekday'>Every x month on the last Wednesday</option>
                                <option nth value='every_x_annually_date'>Every x year on the 3rd of June</option>
                                <option nth value='every_x_annually_weekday'>Every x month on the 3rd Wednesday</option>
                                <option nth value='every_x_inverse_annually_weekday'>Every x year on the last Wednesday in June</option>
                                <optgroup value='moons' label='Moons' class='hidden'></optgroup>
                        </select>
                    </div>
                    
                    <div class='row no-gutters mb-1 hidden'>
                        <input type='number' class='form-control' id='repeat_input' name='repeat_input' value='2' min='1' placeholder='Every nth' />
                    </div>

                    <h5 class='row no-gutters my-2 modal-form-heading'>Conditions:</h5>

                    <div class='row no-gutters my-2' id='non_preset_buttons'>
                        <div class='col-11 pr-1'>
                            <div class='row p-0'>
                                <div class='col-6 pr-1'>
                                    <button type='button' id='add_event_condition' class='btn btn-primary full'>Add condition</button>
                                </div>
                                <div class='col-6 pl-1'>
                                    <button type='button' id='add_event_condition_group' class='btn btn-secondary full'>Add group</button>
                                </div>
                            </div>
                        </div>
                        <div class='col-1 pl-1'>
                            <button type='button' id='condition_remove_button' class='btn btn-danger full'><i class="icon fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class='row no-gutters my-2'>
                        <ol class='form-control group_list_root' id='event_conditions_container'>
                        </ol>
                    </div>

                    <div class='event_occurrences hidden'>
                    
                        <div class='row no-gutters mt-2'>
                        <h5 class='modal-form-heading full'>Test event occurrences for the next:</h5>
                        </div>

                        <div class='row no-gutters'>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' years="1">1 year</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' years="10">10 years</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' years="50">50 years</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' years="100">100 years</button>
                            </div>
                        </div>
                    </div>

                    <div class='event_occurrences_list_container hidden my-2'>
                        <div class='text'></div>
                        <div class='list hidden row no-gutters'>
                            <ul class='col half col1 list-unstyled'></ul>
                            <ul class='col half col2 list-unstyled'></ul>
                            <div class='full page_number'></div>
                            <div class='col half pr-1'>
                                <button type='button' class='btn btn-info full prev' disabled>Previous</button>
                            </div>
                            <div class='col half pl-1'>
                                <button type='button' class='btn btn-info full next' disabled>Next</button>
                            </div>
                        </div>
                    </div>

                    <div class='row no-gutters mt-2'>
                        <div class='separator'></div>
                    </div>
                    
                    <div class='row no-gutters mt-2'>
                      <h5 class='modal-form-heading'>Duration settings:</h5>
                    </div>

                    <div class='row no-gutters'>
                        <div class='col-md-6 pl-0 pr-1'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' id='limited_repeat' name='limited_repeat'> Limit repetitions
                            </label>
                        </div>
                        <div class='col-md-6 pl-1 pr-0 form-control'>
                            <label class='row no-gutters'>
                                <div class='col-auto pl-4 pr-1'>Limit for</div>
                                <div class='col-4'>
                                     <input type='number' min='1' value='1' class='form-control form-control-sm' id='limited_repeat_num' name='limited_repeat_num' disabled>
                                </div>
                                <div class='col-auto pl-1 pr-0'>days.</div>
                            </label>
                        </div>
                    </div>

                    <div class='limit_for_warning hidden row no-gutters p-2 mb-2 border rounded'>
                        <p class='m-0'><strong>Use with caution.</strong> This setting will simulate to check dates backward to ensure consistency across the beginning of years. That process can take a while if this number is particularly high, like 50 or more.</p>
                    </div>

                    <div class='row no-gutters'>
                        <div class='col-md-6 pl-0 pr-1'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' id='has_duration' name='has_duration'> Has duration
                            </label>
                        </div>

                        <div class='col-md-6 pl-1 pr-0 form-control'>
                            <label class='row no-gutters'>
                                <div class='col-auto pl-4 pr-1'>Lasts for</div>
                                <div class='col-4'>
                                     <input type='number' min='1' value='1' class='form-control form-control-sm' id='duration' name='duration' disabled>
                                </div>
                                <div class='col-auto pl-1 pr-0'>days.</div>
                            </label>
                        </div>
                    </div>

                    <div class='duration_warning hidden row no-gutters p-2 mb-2 border rounded'>
                        <p class='m-0'><strong>Use with caution.</strong> This setting will simulate to check dates backward/forward to ensure consistency across the beginning/end of years. That process can take a while if this number is particularly high, like 50 or more.</p>
                    </div>

                    <div class='row no-gutters mb-2'>
                        <div class='col-12 pl-0 pr-1'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' id='show_first_last' name='show_first_last'> Show only first and last event
                            </label>
                        </div>
                    </div>
                @endif

                <div class='row no-gutters my-2'>
                    <div class='separator'></div>
                </div>

                @if(!isset($calendar) || count($calendar->event_categories))
                    <div class='row mb-2 no-gutters'>
                        <div class='col-auto pl-0 pr-1'>
                            <h5 class='modal-form-heading'>Category:</h5>
                        </div>
                        <div class='col pl-0 pl-1'>
                            <select class="form-control event-category-list" id="event_categories" name='event_categories' placeholder='Event Category'>

                            </select>
                        </div>
                    </div>
                @endif

                @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('update', $calendar)))
                    <div class='row no-gutters'>
                        <div class='col'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' id='event_hide_full' name='event_hide_full'> Hide ENTIRELY (useful for event-based-events)
                            </label>
                        </div>
                    </div>
                @endif

                <div class='row no-gutters'>
                    <div class='col'>
                        <label class='form-control checkbox'>
                            <input type='checkbox' class='event_setting' id='event_hide_players' name='event_hide_players'> Hide event 
                            @if(!isset($calendar) || (Auth::user() != Null && !Auth::user()->can('update', $calendar)))
                                (still visible for owner and co-owners)
                            @endif
                        </label>
                    </div>
                </div>

                @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('update', $calendar)))
                    <div class='row no-gutters'>
                        <div class='col'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' id='event_print_checkbox' name='event_print_checkbox'> Show when printing
                            </label>
                        </div>
                    </div>
                @endif

				<div class='row no-gutters'>
					<div class='col pr-1'>
						<h5 class='modal-form-heading'>Color:</h5>
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

					<div class='col pl-1'>
						<h5 class='modal-form-heading'>Display:</h5>
						<select id="text_style" name='text_style' class='form-control event-text-input text_display'>
							<option value="text">Just text</option>
							<option value="dot">• Dot with text</option>
							<option value="background">Background</option>
						</select>
					</div>
				</div>

				<div class='row no-gutters mt-3'>
					<div class='col-4'>
						Event look: <div class='event-text-output event'>Event name</div>
					</div>
				</div>

				<div class='row no-gutters'>
					<div class='col'>
						<div id='event_messagebox'></div>
					</div>
				</div>

				<div class='row no-gutters my-1'>
					<div class='btn btn-lg btn-primary btn-block' id='btn_event_save'>Save</div>
				</div>
				<div class='row no-gutters my-1'>
					<div class='btn btn-sm btn-danger btn-block' id='btn_event_delete'>Delete</div>
				</div>
			</form>
		</div>
	</div>
</div>

<div id="html_edit_background" class='clickable_background hidden'>
	<div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<form id="html-form" class="modal-wrapper" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle"></i>

				<h2 class='modal-form-heading'>Edit HTML</h2>

				<div class='row'>
					<textarea class='form-control html_input editable' name='html_input' placeholder='Event description' autofocus=''></textarea>
				</div>

				<div class='btn btn-lg btn-primary btn-block' id='btn_html_save'>Save</div>
			</form>
		</div>
	</div>
</div>
