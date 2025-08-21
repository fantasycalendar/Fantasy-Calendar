<div x-data="EventsManager"
     x-ref="events-manager"
     @open-events-manager.window="open_modal"
     @events-changed.window="refreshEvents"
     @events-changed.window="refreshCategories"
     @keydown.escape.window="open = false;"
>
    <div
        class="layout_background clickable_background hidden"
        :class="{'hidden': !open}"
        x-show="open"
    >
        <div class="modal-basic-container">
            <div class="modal-basic-wrapper" @mousedown="open = false; search = ''">
                <div class="modal-wrapper layout-wrapper"
                     @mousedown.stop="false"
                     x-show="open"
                     x-transition>

                    <div class="close-ui-btn-bg"></div>
                    <i class="close_ui_btn fas fa-times" @click="open = false; search = ''"></i>

                    <h4 class="mb-3 modal-form-heading opacity-80 leading-loose">Events</h4>

                    <div class="flex flex-col md:!flex-row gap-2">
                        <div class="flex justify-between w-full items-center gap-2 px-2">
                            <input type="checkbox" class="rounded-sm" style="width: 20px; height: 20px;" x-model="multiselect"></input>

                            <div class="relative items-center flex-grow">
                                <div class="absolute inset-y-0 right-0 items-center opacity-80" style="cursor: pointer; width: 50px;"
                                    @click="search = ''"
                                    :class="search.length ? 'grid' : 'hidden'">
                                    <i class="fa fa-times"></i>
                                </div>

                                <input id="eventManagerSearch" type="text" name="search" x-model="search" class="form-control w-full" placeholder="Search...">
                            </div>

                            <div class="sm:!hidden grid items-center cursor-pointer" @click="showFilters = !showFilters">
                                <i class="fa fa-filter" x-bind:style="showFilters ? 'color: rgb(5 150 105);' : ''"></i>
                            </div>
                        </div>

                        <div class="flex w-full gap-2 px-2">
                            <div class="flex-grow" x-show="showFilters || categories.length > 1" :class="{ 'sm:flex': categories.length > 1 }">
                                <select x-model="groupFilter" class="form-control">
                                    <option value="-1">All categories</option>
                                    <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)">
                                        <option :value="category_name" x-text="category_name"></option>
                                    </template>
                                </select>
                            </div>

                            <div class="flex-grow" x-show="!showFilters || categories.length > 1">
                                <select x-model="visibility" class="form-control">
                                    <option value="any">Any visibility</option>
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                                    <option value="entirely_hidden">Entirely Hidden</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-sm-row align-items-stretch mt-3 p-2 rounded border" :class="multiselect ? 'flex' : 'hidden'">
                        <div class="flex flex-grow-1 mb-1 mb-sm-0">
                            <select name="" class="form-control w-sm-auto" x-model="updateCategoryTo" id="" :disabled="!canUpdateCategory">
                                <option value="" x-text="updateCategoryText"></option>
                                <option value="-1">Remove from category</option>
                                <template x-for="category in categories">
                                    <option :value="category.id" x-text="category.name"></option>
                                </template>
                            </select>

                            <button class="btn btn-primary flex-shrink-0 ml-1" @click="updateCategory($event, $dispatch)" :disabled="!updateCategoryTo">
                                <i class="fa fa-check"></i> <span class="hidden md:inline">Move</span>
                            </button>
                        </div>

                        <div class="flex">
                            <div class="border-right ml-2 mr-1 hidden md:block"></div>

                            <button class="btn btn-primary flex-shrink-0 ml-2 ml-md-1 px-1 px-sm-2" @click="printSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-print hidden sm:inline"></i> <span class="inline sm:hidden lg:inline">Print</span>
                            </button>

                            <button class="btn btn-primary flex-shrink-0 ml-1 px-1 px-sm-2" @click="dontPrintSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <span class="position-relative"><i class="fa fa-print slashed hidden sm:inline"></i></span> <span class="inline sm:hidden lg:inline">Don't Print</span>
                            </button>

                            <div class="border-right ml-2 mr-1 hidden md:block"></div>

                            <button class="btn btn-primary flex-shrink-0 ml-2 ml-md-1 px-1 px-sm-2" @click="unhideSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-eye hidden sm:inline"></i> <span class="inline sm:hidden lg:inline">Unhide</span>
                            </button>

                            <button class="btn btn-primary flex-shrink-0 ml-1 px-1 px-sm-2" @click="hideSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-eye-slash hidden sm:inline"></i> <span class="inline sm:hidden lg:inline">Hide</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex" x-show="!Object.keys(categorizedEvents).length && (!search.length && visibility === 'any')">
                        <div class="text-center py-5 search-empty">
                            <h2>You have no events!</h2>
                        </div>
                    </div>

                    <div class="flex" x-show="(search.length || visibility !== 'any') && !Object.keys(categorizedEvents).length">
                        <div class="text-center py-5 search-empty">
                            <h2>No events match filters</h2>
                        </div>
                    </div>


                    <div class="modal-inlay px-md-3 py-md-2" style="max-height: 70vh; overflow-y: auto;">
                        <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)" :key="category_name">
                            <div class="flex flex-col mb-2" x-data="{
                                init: function() {
                                    this.pageIndex = 1;

                                    this.$watch('search', () => {
                                        this.pageIndex = 1;
                                    });

                                    this.$watch('groupFilter', () => {
                                        this.pageIndex = 1;
                                    });

                                    this.$watch('visibility', () => {
                                        this.pageIndex = 1;
                                    });
                                },
                                pageIndex: 1,
                                perpage: 7,
                                allSelected: false,
                                toggleSelectAll() {
                                    let isSelected = this.allSelected;

                                    this.matchedEvents.forEach(event => {
                                        selected[event.id] = !isSelected;
                                    });
                                },
                                get allSelected() {
                                    return this.matchedEvents.every(event => selected[event.id]);
                                },
                                get matchedEvents() {
                                    return category_events.filter(event => !search || inSearch(event));
                                },
                                get shownEvents() {
                                    return (groupFilter === '-1')
                                        ? this.currentPage
                                        : this.matchedEvents;
                                },
                                get currentPage() {
                                    if(!this.matchedEvents) return 0;

                                    let currentPageStart = (this.perpage * (this.pageIndex - 1));
                                    let currentPageEnd = (this.perpage * (this.pageIndex - 1)) + this.perpage;
                                    currentPageEnd = (currentPageEnd > this.matchedEvents.length ? this.matchedEvents.length : currentPageEnd);

                                    return this.matchedEvents.slice(currentPageStart, currentPageEnd)
                                },
                            }" x-show="matchedEvents.length && (groupFilter === '-1' || category_name === groupFilter)">

                                <div class="flex align-items-center mb-2 mt-3">
                                    <h5 class="col-md-6 mb-0">
                                        <span x-text="category_name"></span>

                                        <span class="small" x-text="(groupFilter === '-1') ? `(${matchedEvents.length} events)` : `(${matchedEvents.length}/${category_events.length} events)`"></span>
                                    </h5>

                                    <div class="flex md:justify-end justify-between mt-2 mt-md-0 flex-row-reverse flex-md-row">
                                        <div class="pr-md-3 flex align-items-center">
                                            <a href="javascript:;" @click="toggleSelectAll" x-text="allSelected ? 'Unselect all' : 'Select all'" x-show="multiselect"></a>
                                        </div>

                                        <div x-show="matchedEvents.length > perpage && groupFilter === '-1'">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <button class="btn btn-stock btn-outline-secondary" @click="pageIndex--" :disabled="pageIndex <= 1" title="previous">
                                                        &laquo;
                                                        <span class="sr-only">Previous</span>
                                                    </button>
                                                </div>

                                                <div class="input-group-append">
                                                    <span class="input-group-text form-control">
                                                        <span x-text="pageIndex"></span>&nbsp;/&nbsp;<span x-text="Math.ceil(matchedEvents.length / perpage)"></span>
                                                    </span>
                                                    <button class="btn btn-stock btn-outline-secondary" @click="pageIndex++" :disabled="pageIndex >= Math.ceil(matchedEvents.length / perpage)" title="previous">
                                                        &raquo;
                                                        <span class="sr-only">Previous</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr>

                                <div class="rounded overflow-hidden flex flex-col drop-shadow">
                                    <template x-for="event in shownEvents" :key="event.id">
                                        <div class="managed_event" @click="selectEvent(event, $dispatch)">
                                            <div class="flex align-items-center justify-content-start justify-self-start text-left" style="white-space: nowrap;" >
                                                <div class="icon"><i :class="{
                                                    'fas fa-calendar': !multiselect,
                                                    'far fa-calendar': multiselect && !isSelected(event.id),
                                                    'far fa-calendar-check valid': multiselect && isSelected(event.id)
                                                }"></i></div>
                                            </div>
                                            <div class="managed_event_description text-left flex-grow-1">
                                                <span class="pl-2 pl-md-3 inline" x-html="highlight_match(event.name)"></span>
                                                <span class="px-2 sm:inline" style="opacity: 0.4;">&bull;</span>
                                                <span class="truncate" :class="{'opacity-70': event.description, 'opacity-30': !event.description }" x-html="event.description ? highlight_match(event.description, event.name.length) : 'Event has no description'"></span>
                                            </div>
                                            <button class="managed_event_action_icon" :style="multiselect ? 'pointer-events: none;' : ''" @click.stop="toggleEventPrint(event, $dispatch)">
                                                <i class="fa fa-print" :class="{ 'slashed opacity-60': !event.settings.print }"></i>
                                            </button>
                                            <button class="managed_event_action_icon" :style="(multiselect || event.settings.hide_full) ? 'pointer-events: none;' : ''" @click.stop="toggleEventHidden(event, $dispatch)">
                                                <i class="fa" :title="eventVisibilityTooltip(event)" :class="{  'fa-eye-slash opacity-60': event.settings.hide || event.settings.hide_full, 'fa-eye': !event.settings.hide, 'opacity-50 pointer-events-none' : event.settings.hide_full }"></i>
                                            </button>
                                            <button class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-edit-event', { event_db_id: event.id, epoch: window.dynamic_data.epoch })">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-delete-event', { event_db_id: event.id })">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="flex mt-4">
                        <div class="px-md-3 flex justify-content-end">
                            <button class="btn btn-outline-secondary mr-2" @click="open = false; search = ''">Cancel</button>
                            <button class="btn btn-primary" @click="$dispatch('event-editor-modal-new-event', { epoch: dynamic_data.epoch })">Create new</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
