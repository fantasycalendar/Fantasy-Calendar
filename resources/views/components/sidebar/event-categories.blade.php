@push('head')
    <script lang="js">

        function eventCategorySection($data){

            return {

                event_categories: $data.event_categories,
                default_category: $data.static_data.settings.default_category,

                newCategoryName: "",

                expanded: {},
                deleting: null,
                reordering: false,

                add(inName){
                    const name = inName || `Category ${this.event_categories.length+1}`
                    this.event_categories.push({
                        "name": name,
                        "category_settings":{
                            "hide": false,
                            "player_usable": false
                        },
                        "event_settings": {
                            "color": "Dark-Solid",
                            "text": "text",
                            "hide": false,
                            "print": false
                        },
                        "id": slugify(name)
                    })
                },

                remove(index){
                    this.event_categories.splice(index, 1);
                }

            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-categories"
    name="categories"
    title="Event Categories"
    icon="fas fa-th-list"
    tooltip-title="More Info: Event Categories"
    helplink="event_categories"
>

    <div x-data="eventCategorySection($data)">

        <div class='row no-gutters bold-text'>
            <div class='col'>
                New event category:
            </div>
        </div>
        <div class='add_inputs event_categories input-group'>
            <input type='text' class='form-control name' placeholder='Event category name' x-model="newCategoryName">

            <div class="input-group-append">
                <button type='button' class='btn btn-primary' @click="add(newCategoryName)"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div x-data="sortableList($data.event_categories, 'event-categories-sortable')">

            <div class="row sortable-header no-gutters align-items-center">
                <div x-show="!reordering" @click="reordering = true; deleting = null;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
                <div x-show="reordering" @click="reordering = false;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
                <div class="col-11 pl-2">Your Categories</div>
            </div>

            <div class="sortable list-group border-t border-gray-600" x-ref="event-categories-sortable">
                <template x-for="(category, index) in event_categories" x-ref="event-categories-sortable-template">
                    <div class='sortable-container border-t -mt-px list-group-item draggable-source' :data-id="index">

                        <div class='main-container' x-show="deleting !== category">
                            <i class='handle icon-reorder' x-show="reordering"></i>
                            <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                            <div class="input-group">
                                <input class='name-input small-input form-control' :disabled="reordering" x-model="category.name">
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' :disabled="reordering" @click="deleting = category" x-show="deleting !== category"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === category"></div>
                            <div class='remove-container-text' x-show="deleting === category">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === category"></div>
                        </div>

                        <div class='container pb-2' x-show="expanded[index] && deleting !== category && !reordering">

                            <div class='row no-gutters my-1 bold-text'>
                                <div class='col'>
                                    Category settings (global):
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_cat_global_hide"' class='form-check-input' x-model='category.category_settings.hide'/>
                                    <label :for='index + "_cat_global_hide"' class='form-check-label ml-1'>
                                        Hide from viewers
                                    </label>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_cat_player_usable"' class='form-check-input' x-model='category.category_settings.player_usable'/>
                                    <label :for='index + "_cat_player_usable"' class='form-check-label ml-1'>
                                        Usable by players
                                    </label>
                                </div>
                            </div>

                            <div class='row no-gutters my-2'>
                                <div class='col'>
                                    <div class='separator'></div>
                                </div>
                            </div>

                            <div class='row no-gutters mb-2 bold-text'>
                                <div class='col'>
                                    Event settings (local):
                                </div>
                            </div>

                            <div class='row no-gutters mb-2 small-text bold-text warning'>
                                <div class='col'>
                                    This will override the settings on any events using this category!
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_cat_hide_full"' class='form-check-input' x-model='category.event_settings.hide_full'/>
                                    <label :for='index + "_cat_hide_full"' class='form-check-label ml-1'>
                                        Fully hide event
                                    </label>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_cat_hide"' class='form-check-input' x-model='category.event_settings.hide'/>
                                    <label :for='index + "_cat_hide"' class='form-check-label ml-1'>
                                        Hide event
                                    </label>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='index + "_cat_print"' class='form-check-input' x-model='category.event_settings.print'/>
                                    <label :for='index + "_cat_print"' class='form-check-label ml-1'>
                                        Show event when printing
                                    </label>
                                </div>
                            </div>

                            <div class='row no-gutters my-2'>
                                <div class='col-md-6 col-sm-12'>
                                    <div>Color:</div>
                                </div>

                                <div class='col-md-6 col-sm-12'>
                                    <div>Display:</div>
                                </div>
                            </div>

                            <div class="input-group">
                                <select class='custom-select form-control' x-model='category.event_settings.color'>
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

                                <select class='custom-select form-control' x-model='category.event_settings.text'>
                                    <option value="text">Just text</option>
                                    <option value="dot">• Dot with text</option>
                                    <option value="background">Background</option>
                                </select>
                            </div>

                            <div class='row no-gutters mt-2'>
                                <div class='col'>
                                    What the events will look like:
                                </div>
                            </div>

                            <div class='row no-gutters'>
                                <div class='col-6'>
                                    <div class='event' :class="category.event_settings.color + ' ' + category.event_settings.text">Event (visible)</div>
                                </div>
                                <div class='col-6 px-1'>
                                    <div class='hidden_event event' :class="category.event_settings.color + ' ' + category.event_settings.text">Event (hidden)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>


        <div class='row no-gutters my-2'>
            <div class='separator'></div>
        </div>

        <div class='row no-gutters bold-text'>
            <div class='col'>
                Default category:
                <select class='form-control protip' x-model="default_category" data-pt-position="right" data-pt-title="This sets the category to be selected by default when a new event is created">
                    <template x-for="(category, index) in event_categories">
                        <option :selected="(category.id ?? slugify(category.name)) == default_category" :value="category.id ?? slugify(category.name)" x-text="category.name"></option>
                    </template>
                </select>
            </div>
        </div>

    </div>

</x-sidebar.collapsible>
