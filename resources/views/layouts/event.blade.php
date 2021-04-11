<div
    id="event_show_background"
    class='clickable_background'
    x-data="CalendarEventViewer"
    @event-viewer-modal-view-event.window="view_event"
    @event-viewer-modal-load-comments.window="load_comments"
    @event-viewer-modal-submit-comment.window="submit_comment"
    @event-viewer-modal-add-comment.window="add_comment"
    @event-viewer-modal-delete-comment.window="delete_comment"
    @event-viewer-modal-start-edit-comment.window="start_edit_comment"
    @event-viewer-modal-edit-comment.window="edit_comment"
    x-show='open'
    x-cloak
>
	<div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<div class='modal-wrapper'>

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle" @click='callback_do_close(close)'></i>

				<div class='row no-gutters modal-form-heading'>
					<h2><span class='event_name' x-text='data.name'>Editing Event</span> <i class="fas fa-pencil-alt edit_event_btn" @click='callback_do_edit' x-show='can_edit'></i></h2>
				</div>

				<div class='row'>
					<div class="col-12" x-html='data.description'></div>
				</div>

				<div id='event_comment_mastercontainer' x-show="!era" class="row">

					<div class="col-12">
						<hr>

						<h4>Comments:</h4>

						<div class='row'>
							<div id='event_comments' class='col-12'>
                                <span x-show="comments.length == 0 && can_comment_on_event">No comments on this event yet... Maybe you'll be the first?</span>
                                <span x-show="!can_comment_on_event">You need to save your calendar before comments can be added to this event!</span>
                                <template x-for='(comment, index) in comments'>
                                    <div
                                        class='container p-2 rounded event_comment'
                                        :date='comment.date'
                                        :comment_id='comment.id'
                                        :class='{
                                            "comment_owner": !comment.comment_owner,
                                            "calendar_owner": comment.calendar_owner,
                                        }'
                                        >
                                        <div class='row mb-1'>
                                            <div class='col-auto'>
                                                <p><span class='username' x-text="comment.username"></span><span class='date' x-text='" - "+comment.date'></span></p>
                                            </div>
                                            <div class='col-auto ml-auto' x-show="comment.comment_owner || comment.can_delete">
                                                <button class="calendar_action btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" x-show="!comment.editing" type="button" :id="'dropdownButton-comment'+comment.id" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                                <div class="dropdown-menu dropdown-menu-right" :aria-labelledby="'dropdownButton-comment'+comment.id">
                                                    <button class='dropdown-item' @click="start_edit_comment(comment)" x-show="comment.comment_owner">
                                                        <i class="fa fa-edit"></i> Edit
                                                    </button>
                                                    <button class="dropdown-item" @click="delete_comment(comment)" x-show="comment.can_delete">
                                                        <i class="fa fa-calendar-times"></i> Delete
                                                    </button>
                                                </div>
                                                <button class='btn btn-sm btn-primary submit_edit_comment_btn ml-2' @click='submit_edit_comment(comment)' x-show='comment.editing'>Submit</button>
                                                <button class='btn btn-sm btn-danger cancel_edit_comment_btn ml-2' @click='cancel_edit_comment(comment)' x-show='comment.editing'>Cancel</button>
                                            </div>
                                        </div>
                                        <div class='row'>
                                            <div class='col'>
                                                <div class='comment' x-show="!comment.editing" x-html='comment.content'></div>

                                                <div class="rounded border" x-show="comment.editing">
                                                    <div :x-ref="'trumbowyg_comment_'+comment.id"><div></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
						@if(Auth::check())
							<div class='col-12 mt-2' x-show='user_can_comment && can_comment_on_event'>

                                <div class="rounded border">
                                    <div x-ref="trumbowyg_comment_input"></div>
                                </div>

								<button type='button' class='btn btn-primary mt-2' style="z-index: 200" @click='submit_comment'>Submit</button>
							</div>
						@endif
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div
    x-data="CalendarEventEditor"
    class='clickable_background'
    id='event_editor'
    @event-editor-modal-new-event.window="create_new_event"
    @event-editor-modal-edit-event.window="edit_event"
    @event-editor-modal-delete-event.window="query_delete_event"
    x-show='open'
>

    <div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<form id="event-form" class="modal-wrapper container" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle" @click='callback_do_close'></i>

				<div class='row no-gutters mb-1 modal-form-heading'>
					<h2 class='event_action_type'><span x-text="creation_type"></span> <i class="fas fa-eye view_event_btn" @click='callback_do_view'></i></h2>
				</div>

				<div class='row no-gutters my-1'>
					<input type='text' class='form-control' x-model='working_event.name' placeholder='Event name' autofocus='' />
				</div>

				<div class='row no-gutters my-1'>
					<textarea class='form-control event_desc editable' x-ref='description' placeholder='Event description' autofocus=''></textarea>
				</div>

                @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('advance-date', $calendar)))

                    <h5 class='row no-gutters mt-2 modal-form-heading' x-show="new_event">Condition presets:</h5>

                    <div class='row no-gutters mb-1' x-show="new_event">
                        <select class="form-control" @change='condition_preset_changed' x-model="preset" x-ref="condition_presets">
                            <template x-for="key in Object.keys(presets)">
                                <option x-show='presets[key].enabled' x-text='presets[key].text' :value='key'></option>
                            </template>
                            <optgroup value='moons' label='Moons' x-show="moon_presets.length > 0">
                                <template x-for="moon_preset in moon_presets">
                                    <option x-text='moon_preset.text' :value='moon_preset.value' :moon_index="moon_preset.moon_index"></option>
                                </template>
                            </optgroup>
                        </select>
                    </div>

                    <div class='row no-gutters mb-1' x-show='selected_preset.nth' >
                        <input type='number' class='form-control' @change='nth_input_changed' x-model='nth' min='1' placeholder='Every nth' />
                    </div>

                    <h5 class='row no-gutters my-2 modal-form-heading'>Conditions:</h5>

                    <div class='row no-gutters my-2' id='non_preset_buttons'>
                        <div class='col-11 pr-1'>
                            <div class='row p-0'>
                                <div class='col-6 pr-1'>
                                    <button type='button' @click='add_condition_clicked' class='btn btn-primary full'>Add condition</button>
                                </div>
                                <div class='col-6 pl-1'>
                                    <button type='button' @click='add_group_clicked' class='btn btn-secondary full'>Add group</button>
                                </div>
                            </div>
                        </div>
                        <div class='col-1 pl-1'>
                            <button type='button' @click='remove_clicked' @mouseenter='remove_mouseover' @mouseleave='remove_mouseout' id='condition_remove_button' class='btn btn-danger full'><i class="icon fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class='row no-gutters my-2'>
                        <ol class='form-control group_list_root' id='event_conditions_container' x-ref='event_conditions_container'>
                        </ol>
                    </div>

                    <span class='hidden'></span>

                    <div class='event_occurrences' x-show='working_event.data.conditions != []'>

                        <div class='row no-gutters'>
                            <h5>Test event occurrences for the next:</h5>
                        </div>

                        <div class='row no-gutters'>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' @click="test_event(1)">This year</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' @click="test_event(10)">10 years</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' @click="test_event(100)">100 years</button>
                            </div>
                            <div class='col-md-3 px-1'>
                                <button type='button' class='btn btn-info full test_event_btn' @click="test_event(1000)">1000 years</button>
                            </div>
                        </div>

                        <div class='event_occurrences_list_container my-2' x-show='event_testing.text != ""'>
                            <div class='text' x-html='event_testing.text'></div>
                            <div class='list row no-gutters' x-show='event_testing.occurrences.length > 0'>
                                <ul class='col half col1 list-unstyled'>
                                    <template x-for='occurence in event_testing.visible_occurrences_1'>
                                        <li class='event_occurance' x-html="occurence"></li>
                                    </template>
                                </ul>
                                <ul class='col half col2 list-unstyled'>
                                    <template x-for='occurence in event_testing.visible_occurrences_2'>
                                        <li class='event_occurance' x-html="occurence"></li>
                                    </template>
                                </ul>
                                <div class='full page_number' x-text="'Page '+event_testing.page+'/'+event_testing.max_page"></div>
                                <div class='col half pr-1'>
                                    <button type='button' class='btn btn-info full' @click='prev_page()' :disabled="event_testing.page == 1">Previous</button>
                                </div>
                                <div class='col half pl-1'>
                                    <button type='button' class='btn btn-info full' @click='next_page()' :disabled="event_testing.page == event_testing.max_page">Next</button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div x-show="moons.length > 0">

                        <div class='row no-gutters mt-2'>
                            <div class='separator'></div>
                        </div>

                        <div class='row no-gutters mt-2'>
                            <h4 @click='moon_overrides_open = !moon_overrides_open' class='cursor-pointer user-select-none'>
                                <i class="icon fas" x-bind:class='{
                                    "fa-angle-right": !moon_overrides_open,
                                    "fa-angle-down": moon_overrides_open,
                                }'></i>
                                Moon Overrides
                            </h4>
                        </div>
                        <div class='container settings_container p-0' x-show="moon_overrides_open">
                            <template x-for="moon in moons">
                                <div class='p-2 mb-2 border rounded'>
                                    <div class='row no-gutters mb-2'>
                                        <div class='col-md-1 col-1 px-1'>
                                            <svg class="moon"
                                                    :moon_id="moon.index"
                                                    preserveAspectRatio="xMidYMid"
                                                    width="38"
                                                    height="38"
                                                    viewBox="0 0 32 32"
                                                    :class="{
                                                        'opacity-1': moon.hidden,
                                                        'opacity-5': !moon.hidden
                                                    }"
                                            >
                                                <circle cx="16" cy="16" r="10" :style="`fill:${moon.color};`" />
                                                <path x-show="moon.paths[moon.phase]" :d="moon.paths[moon.phase]" :style="`fill:${moon.shadow_color};`" />
                                                <circle cx="16" cy="16" r="10" class="lunar_border"/>
                                            </svg>
                                        </div>
                                        <div class='col-md-11 pl-0 pr-1'>
                                            <span style="opacity:0.65; font-size:1.4rem;" x-text='moon.name'></span>
                                        </div>
                                    </div>
                                    <div class='row no-gutters'>
                                        <div class='col-md-4 col-3 px-1'>
                                            <label class='form-control checkbox'>
                                                <input type='checkbox' class='event_setting' x-model='moon.hidden'> Hidden
                                            </label>
                                        </div>
                                        <div class='col-md-8 px-1'>
                                            <input type='text' class='form-control full' x-model='moon.phase_name' placeholder='Custom phase name' :disabled='moon.hidden'>
                                        </div>
                                    </div>
                                    <div class='row no-gutters'>
                                        <div class='col-md-4 px-1'>
                                            <label class='form-control checkbox' :class="{'disabled': moon.hidden}">
                                                <input type='checkbox' class='event_setting' x-model='moon.override_phase' :disabled='moon.hidden'> Override phase
                                            </label>
                                        </div>
                                        <div class='col-md-8 px-1'>
                                            <select class='form-control' x-model='moon.phase' :disabled='!moon.override_phase || moon.hidden'>
                                                <template x-for="(phase, index) in moon.phases">
                                                    <option x-text='phase' :value="index"></option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                    <div class='row no-gutters'>
                                        <div class='col-md-6 col-4 px-1'>
                                            <label class='form-control checkbox' :class="{'disabled': moon.hidden}">
                                                <input type='color' class='color inline_moon_color full' x-model="moon.shadow_color" :x-ref="`moon_shadow_color_${moon.index}`" :disabled='moon.hidden'/>
                                            </label>
                                        </div>
                                        <div class='col-md-6 col-4 px-1'>
                                            <label class='form-control checkbox' :class="{'disabled': moon.hidden}">
                                                <input type='color' class='color inline_moon_color full' x-model="moon.color" :x-ref="`moon_color_${moon.index}`" :disabled='moon.hidden'/>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                @endif

                    <div class='row no-gutters mt-2'>
                        <div class='separator'></div>
                    </div>

                    <div class='row no-gutters mt-2'>
                        <h4 @click='settings_open = !settings_open' class='cursor-pointer user-select-none'>
                            <i class="icon fas" x-bind:class='{
                                "fa-angle-right": !settings_open,
                                "fa-angle-down": settings_open,
                            }'></i>
                            Settings
                        </h4>
                    </div>

                    <div class='container settings_container p-0' x-show="settings_open">


                    @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('advance-date', $calendar)))
                        <div class='row no-gutters'>
                            <div class='col-md-6 pl-0 pr-1'>
                                <label class='form-control checkbox'>
                                    <input type='checkbox' class='event_setting' x-model='working_event.data.limited_repeat'> Limit repetitions
                                </label>
                            </div>
                            <div class='col-md-6 pl-1 pr-0 form-control'>
                                <label class='row no-gutters'>
                                    <div class='col-auto pl-4 pr-1'>Limit for</div>
                                    <div class='col-4'>
                                        <input type='number' min='1' value='1' class='form-control form-control-sm' x-model='working_event.data.limited_repeat_num' :disabled='!working_event.data.limited_repeat'>
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
                                    <input type='checkbox' class='event_setting' x-model='working_event.data.has_duration'> Has duration
                                </label>
                            </div>

                            <div class='col-md-6 pl-1 pr-0 form-control'>
                                <label class='row no-gutters'>
                                    <div class='col-auto pl-4 pr-1'>Lasts for</div>
                                    <div class='col-4'>
                                        <input type='number' min='1' value='1' class='form-control form-control-sm' x-model='working_event.data.duration' :disabled='!working_event.data.has_duration'>
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
                                    <input type='checkbox' class='event_setting' x-model='working_event.data.show_first_last'> Show only first and last event
                                </label>
                            </div>
                        </div>
                    @endif

                    <div class='row no-gutters my-2'>
                        <div class='separator'></div>
                    </div>

                    @if(!isset($calendar) || count($calendar->event_categories) || (Auth::user() != Null && Auth::user()->can('update', $calendar)))
                        <div class='row mb-2 no-gutters'>
                            <div class='col-auto pl-0 pr-1'>
                                <h5 class='modal-form-heading'>Event Category:</h5>
                            </div>
                            <div class='col pl-0 pl-1'>
                                <select class="form-control event-category-list" x-model='working_event.event_category_id' @change="event_category_changed" placeholder='Event Category'>

                                </select>
                            </div>
                        </div>
                    @endif

                    @if(!isset($calendar) || (Auth::user() != Null && Auth::user()->can('update', $calendar)))
                        <div class='row no-gutters'>
                            <div class='col'>
                                <label class='form-control checkbox'>
                                    <input type='checkbox' class='event_setting' x-model='working_event.settings.hide_full'> Hide ENTIRELY (useful for event-based-events)
                                </label>
                            </div>
                        </div>
                    @endif

                    <div class='row no-gutters'>
                        <div class='col'>
                            <label class='form-control checkbox'>
                                <input type='checkbox' class='event_setting' x-model='working_event.settings.hide'> Hide event
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
                                    <input type='checkbox' class='event_setting' x-model='working_event.settings.print'> Show when printing
                                </label>
                            </div>
                        </div>
                    @endif

                    <div class='row no-gutters'>
                        <div class='col pr-1'>
                            <h5 class='modal-form-heading'>Color:</h5>
                            <select x-model='working_event.settings.color' class='form-control'>
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
                            <select x-model='working_event.settings.text' class='form-control'>
                                <option value="text">Just text</option>
                                <option value="dot">• Dot with text</option>
                                <option value="background">Background</option>
                            </select>
                        </div>
                    </div>

                    <div class='row no-gutters mt-3'>
                        Event look:
                    </div>
                    <div class='row no-gutters mt-0'>
                        <div class='col-4'>
                            <div class='event-text-output event' :class='working_event.settings.color + " " + working_event.settings.text'>Event (visible)</div>
                        </div>
                        <div class='col-4 px-1'>
                            <div class='event-text-output hidden_event event' :class='working_event.settings.color + " " + working_event.settings.text'>Event (hidden)</div>
                        </div>
                    </div>

                    <div class='row no-gutters'>
                        <div class='col'>
                            <div id='event_messagebox'></div>
                        </div>
                    </div>
				</div>

                <div class='row no-gutters mt-2'>
                    <div class='separator'></div>
                </div>

				<div class='row no-gutters my-1'>
					<div class='btn btn-lg btn-primary btn-block' @click="save_event">Save</div>
				</div>
				<div class='row no-gutters my-1'>
					<div class='btn btn-sm btn-danger btn-block' id='btn_event_delete'>Delete</div>
				</div>
			</form>
		</div>
	</div>
</div>

<div
    x-data="CalendarHTMLEditor"
    class='clickable_background'
    id="html_edit_background"
    @html-editor-modal-edit-html.window="edit_html"
    x-show='open'
>
	<div class='modal-basic-container'>
		<div class='modal-basic-wrapper'>
			<form id="html-form" class="modal-wrapper" action="post">

				<div class='close-ui-btn-bg'></div>
				<i class="close_ui_btn fas fa-times-circle" @click='callback_do_close'></i>

				<div class='row no-gutters mb-1 modal-form-heading'>
					<h2 class='event_action_type'><span>Editing Era Description</span> <i class="fas fa-eye view_event_btn" @click='callback_do_view'></i></h2>
				</div>

				<div class='row'>
					<textarea class='form-control' x-ref='html_input' autofocus=''></textarea>
				</div>

				<div class='btn btn-lg btn-primary btn-block' @click="save_html">Save</div>
			</form>
		</div>
	</div>
</div>
