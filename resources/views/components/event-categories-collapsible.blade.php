@props(['calendar' => null])

<div class='row no-gutters bold-text'>
    <div class='col'>
        New event category:
    </div>
</div>

<div class='add_inputs event_categories row no-gutters input-group'>
    <input type='text' class='form-control name' id='event_category_name_input'
    placeholder='Event category name'>
    <div class="input-group-append">
        <button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
    </div>
</div>

<div class='sortable list-group'>
    <template x-for="category in categories">

    </template>
</div>

<div class='row no-gutters my-2'>
    <div class='separator'></div>
</div>

<div class='row no-gutters bold-text'>
    <div class='col'>
        Default category:
        <select class='form-control event-category-list protip' data-pt-position="right"
            data-pt-title="This sets the category to be selected by default when a new event is created"
            id='default_event_category'></select>
    </div>
</div>


{{--

<div class='sortable-container list-group-item category_inputs collapsed collapsible' index='${key}' x-data='{ color: "${data.event_settings.color}", text_style: "${data.event_settings.text}" }'>

		<div class='main-container'>
			<div class='expand fa fa-caret-square-down'></div>
			<div class='name-container'>
				<input value='${data.name}' type='text' name='name_input' fc-index='name' class='form-control name-input small-input category_name_input' data='${key}' tabindex='${(700 + key)}'/>
			</div>
			<div class="remove-spacer"></div>
		</div>
		<div class='remove-container'>
			<div class='remove-container-text'>Are you sure you want to remove this?</div>
			<div class='btn_remove btn btn-danger fa fa-trash'></div>
			<div class='btn_cancel btn btn-danger fa fa-xmark'></div>
			<div class='btn_accept btn btn-success fa fa-check'></div>
		</div>
		<div class='collapse-container container mb-2'>

			<div class='row no-gutters my-1 bold-text'>
				<div class='col'>
					Settings:
				</div>
			</div>

			<input type='hidden' class='category_id' value='${key}'>

			<div class='row no-gutters mt-1 mb-2'>
                <div class="list-group col-12">
                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_global_hide' class='form-check-input category_dynamic_input dynamic_input global_hide' data='${key}.category_settings' fc-index='hide' ${(data.category_settings.hide ? "checked" : "")} />
                        <label for='${key}_cat_global_hide' class='form-check-label ml-1'>
                            Hide category from viewers
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_player_usable' class='form-check-input category_dynamic_input dynamic_input player_usable' data='${key}.category_settings' fc-index='player_usable' ${(data.category_settings.player_usable ? "checked" : "")} />
                        <label for='${key}_cat_player_usable' class='form-check-label ml-1'>
                            Category usable by players
                        </label>
                    </div>
                </div>
			</div>

			<div class='row no-gutters bold-text'>
				<div class='col'>
					Event overrides:
				</div>
			</div>

			<div class='row no-gutters mt-1 mb-2'>
                <div class="list-group col-12">
                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_hide_full' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='hide_full' ${(data.event_settings.hide_full ? "checked" : "")} />
                        <label for='${key}_cat_hide_full' class='form-check-label ml-1'>
                            Fully hide event
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_hide' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='hide' ${(data.event_settings.hide ? "checked" : "")} />
                        <label for='${key}_cat_hide' class='form-check-label ml-1'>
                            Hide event
                        </label>
                    </div>

                    <div class='form-check list-group-item py-2'>
                        <input type='checkbox' id='${key}_cat_print' class='form-check-input category_dynamic_input dynamic_input' data='${key}.event_settings' fc-index='print' ${(data.event_settings.noprint ? "checked" : "")} />
                        <label for='${key}_cat_print' class='form-check-label ml-1'>
                            Show event when printing
                        </label>
                    </div>
                </div>
			</div>

			<div class='row no-gutters my-2'>
				<div class='col-md-6 col-sm-12'>
					Color:
				</div>

				<div class='col-md-6 col-sm-12'>
                    Display:
				</div>

                <div class='input-group col-12 mt-1 mb-2' x-data="{ colorOptions: ['Dark-Solid', 'Red', 'Pink', 'Purple', 'Deep-Purple', 'Blue', 'Light-Blue', 'Cyan', 'Teal', 'Green', 'Light-Green', 'Lime', 'Yellow', 'Orange', 'Blue-Grey'] }">
                    <select x-model='color' class='custom-select form-control category_dynamic_input dynamic_input event-text-input color_display' data='${key}.event_settings' fc-index='color'>
                        <template x-for="colorOption in colorOptions">
                            <option x-text="colorOption" :value="colorOption" :selected="colorOption == color"></option>
                        </template>
                    </select>
                    <select x-model='text_style' class='custom-select form-control category_dynamic_input dynamic_input event-text-input text_display' data='${key}.event_settings' fc-index='text'>
                        <option value="text"${(data.event_settings.text == 'text' ? ' selected' : '')}>Just text</option>
                        <option value="dot"${(data.event_settings.text == 'dot' ? ' selected' : '')}>• Dot with text</option>
                        <option value="background"${(data.event_settings.text == 'background' ? ' selected' : '')}>Background</option>
                    </select>
                </div>
			</div>

			<div class='row no-gutters mt-1'>
				<div class='col'>
					Event appearance:
				</div>
			</div>

			<div class='row no-gutters'>
				<div class='col-6'>
                    <div class='event-text-output event' :class='color + " " + text_style'>Event (visible)</div>
				</div>
				<div class='col-6 px-1'>
					<div class='event-text-output hidden_event event' :class='color + " " + text_style'>Event (hidden)</div>
				</div>
			</div>
		</div>

	</div>

--}}
