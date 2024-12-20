@props(['calendar' => null])

<div class='row no-gutters input-group'>
    <input type='text' class='form-control name' placeholder='New category name' x-model="new_category_name">

    <div class="input-group-append">
        <button type='button' class='btn btn-primary' @click="createNewCategory"><i class="fa fa-plus"></i></button>
    </div>
</div>

<div class='sortable list-group my-2'>
    <template x-for="category in categories" :key="category.id">
        <div class='sortable-container list-group-item collapsible p-2 first-of-type:rounded-t'
            :class="{'collapsed': !collapsed}"
            x-data='{ color: "${data.event_settings.color}", text_style: "${data.event_settings.text}", collapsed: false }'
            >

            <div class='flex items-center w-full gap-x-2' x-show="deleting !== category.id">
                <div class='handle fa fa-bars'></div>
                <div class='cursor-pointer text-xl fa'
                     :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                     @click="collapsed = !collapsed"></div>
                <input type='text' class='name-input small-input form-control' x-model.lazy='category.name'/>
                <button class="btn btn-danger w-10" @click="deleting = category.id">
                    <i class="fa fa-trash text-lg"></i>
                </button>
            </div>

            <div x-show="deleting === category.id" class="flex items-center w-full gap-x-2.5" x-cloak>
                <button class="btn btn-success w-10 !px-0 text-center" @click="removeCategory(category.id)">
                    <i class="fa fa-check text-lg"></i>
                </button>

                <div class="flex-grow">Are you sure?</div>

                <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                    <i class="fa fa-times text-lg"></i>
                </button>
            </div>


            <div class='collapse-container container mb-2'>
                <div class='row no-gutters my-1 bold-text'>
                    <div class='col'>
                        Settings:
                    </div>
                </div>

                <div class='row no-gutters mt-1 mb-2'>
                    <div class="list-group col-12">
                        <div class='form-check list-group-item py-2'>
                            <input type='checkbox' class='form-check-input' x-model='category.category_settings.hide' />

                            <label class='form-check-label ml-1'>
                                Hide category from viewers
                            </label>
                        </div>

                        <div class='form-check list-group-item py-2'>
                            <input type='checkbox' class='form-check-input' x-model='category.category_settings.hide' />

                            <label class='form-check-label ml-1'>
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
                            <input type='checkbox' class='form-check-input' x-model="category.event_settings.hide_full" />
                            <label class='form-check-label ml-1'>
                                Fully hide event
                            </label>
                        </div>

                        <div class='form-check list-group-item py-2'>
                            <input type='checkbox' class='form-check-input' x-model="category.event_settings.hide" />
                            <label class='form-check-label ml-1'>
                                Hide event
                            </label>
                        </div>

                        <div class='form-check list-group-item py-2'>
                            <input type='checkbox' class='form-check-input' x-model="category.event_settings.noprint" />
                            <label class='form-check-label ml-1'>
                                Show event when printing
                            </label>
                        </div>
                    </div>
                </div>

                <div class='row no-gutters my-2'>
                    <div class='col-md-6'>
                        Color:
                    </div>

                    <div class='col-md-6'>
                        Display:
                    </div>

                    <div class='input-group col-12 mt-1 mb-2' x-data="{ colorOptions: ['Dark-Solid', 'Red', 'Pink', 'Purple', 'Deep-Purple', 'Blue', 'Light-Blue', 'Cyan', 'Teal', 'Green', 'Light-Green', 'Lime', 'Yellow', 'Orange', 'Blue-Grey'] }">
                        <select x-model='category.event_settings.color' class='custom-select form-control color_display'>
                            <template x-for="colorOption in colorOptions">
                                <option x-text="colorOption" :value="colorOption"></option>
                            </template>
                        </select>

                        <select x-model='category.event_settings.text' class='custom-select form-control text_display'>
                            <option value="text">Just text</option>
                            <option value="dot">• Dot with text</option>
                            <option value="background">Background</option>
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
                        <div class='event-text-output event' :class='`${category.event_settings.color} ${category.event_settings.text}`'>Event (visible)</div>
                    </div>
                    <div class='col-6 px-1'>
                        <div class='event-text-output hidden_event event' :class='`${category.event_settings.color} ${category.event_settings.text}`'>Event (hidden)</div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>

<div class='row no-gutters py-2'>
    <div class='separator'></div>
</div>

<div class='row no-gutters bold-text'>
    <div class='col'>
        Default category
        <select class='form-control protip mt-1' data-pt-position="right" data-pt-title="This sets the category to be selected by default when a new event is created" >
            <option value="">No default category</option>

            <template x-for="category in categories">
                <option value="category.id" x-text="category.name"></option>
            </template>
        </select>
    </div>
</div>
