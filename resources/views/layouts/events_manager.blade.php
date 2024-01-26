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
                <div class="modal-wrapper layout-wrapper container"
                     @mousedown.stop="false"
                     x-show="open"
                     x-transition>

                    <div class="close-ui-btn-bg"></div>
                    <i class="close_ui_btn fas fa-times" @click="open = false; search = ''"></i>

                    <div class="row no-gutters mb-3 modal-form-heading">
                        <div class="col-12 mb-2">
                            <h4 style="opacity: 0.8; line-height: 0.8;">Events</h4>
                        </div>
                    </div>
                    <div class="row no-gutters mt-3">
                        <div class="col-11 mb-1 mb-md-0 mt-2 mt-lg-0 d-flex align-items-center" :class="categories.length > 0 ? 'col-sm-5' : 'col-sm-9'">
                            <input type="checkbox" class="form-check mx-2" style="width: 20px; height: 20px;" x-model="multiselect"></input>

                            <div style="position: absolute; right: 0px; top: 0px; bottom: 0px; place-items: center; cursor: pointer; width: 50px; opacity: 0.8;"
                                 @click="search = ''"
                                 :class="search.length ? 'grid' : 'hidden'">
                                <i class="fa fa-times"></i>
                            </div>

                            <input id="eventManagerSearch" type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                        </div>

                        <div class="col-1 d-sm-none mb-1 mt-2 grid" style="place-items: center; cursor: pointer;" @click="showFilters = !showFilters">
                            <i class="fa fa-filter" x-bind:style="showFilters ? 'color: rgb(5 150 105);' : ''"></i>
                        </div>

                        <div class="pl-sm-1 mb-1 mb-md-0 mt-2 mt-lg-0 d-none " :class="{ 'd-none': !showFilters || categories.length < 2, 'col-12 col-sm-4 d-sm-flex': categories.length > 1 }">
                            <select x-model="groupFilter" class="form-control">
                                <option value="-1">All categories</option>
                                <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)">
                                    <option :value="category_name" x-text="category_name"></option>
                                </template>
                            </select>
                        </div>

                        <div class="col-12 col-sm-3 pl-sm-1 mb-1 mb-md-0 mt-sm-2 mt-lg-0 d-none d-sm-flex" :class="{ 'd-none': !showFilters }">
                            <select x-model="visibility" class="form-control">
                                <option value="any">Any visibility</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                                <option value="entirely_hidden">Entirely Hidden</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex flex-column flex-sm-row align-items-stretch mt-3 p-2 rounded border" :class="multiselect ? 'd-flex' : 'hidden'">
                        <div class="d-flex flex-grow-1 mb-1 mb-sm-0">
                            <select name="" class="form-control w-sm-auto" x-model="updateCategoryTo" id="" :disabled="!canUpdateCategory">
                                <option value="" x-text="updateCategoryText"></option>
                                <option value="-1">Remove from category</option>
                                <template x-for="category in categories">
                                    <option :value="category.id" x-text="category.name"></option>
                                </template>
                            </select>

                            <button class="btn btn-primary flex-shrink-0 ml-1" @click="updateCategory($event, $dispatch)" :disabled="!updateCategoryTo">
                                <i class="fa fa-check"></i> <span class="d-none d-md-inline">Move</span>
                            </button>
                        </div>

                        <div class="d-flex">
                            <div class="border-right ml-2 mr-1 hidden md-block"></div>

                            <button class="btn btn-primary flex-shrink-0 ml-2 ml-md-1 px-1 px-sm-2" @click="printSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-print d-none d-sm-inline"></i> <span class="d-inline d-sm-none d-lg-inline">Print</span>
                            </button>

                            <button class="btn btn-primary flex-shrink-0 ml-1 px-1 px-sm-2" @click="dontPrintSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <span class="position-relative"><i class="fa fa-print slashed d-none d-sm-inline"></i></span> <span class="d-inline d-sm-none d-lg-inline">Don't Print</span>
                            </button>

                            <div class="border-right ml-2 mr-1 hidden md-block"></div>

                            <button class="btn btn-primary flex-shrink-0 ml-2 ml-md-1 px-1 px-sm-2" @click="unhideSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-eye d-none d-sm-inline"></i> <span class="d-inline d-sm-none d-lg-inline">Unhide</span>
                            </button>

                            <button class="btn btn-primary flex-shrink-0 ml-1 px-1 px-sm-2" @click="hideSelected($dispatch)" :disabled="!Object.keys(selected).length">
                                <i class="fa fa-eye-slash d-none d-sm-inline"></i> <span class="d-inline d-sm-none d-lg-inline">Hide</span>
                            </button>
                        </div>
                    </div>

                    <div class="row no-gutters" x-show="!Object.keys(categorizedEvents).length && (!search.length && visibility === 'any')">
                        <div class="col-12 text-center py-5 search-empty">
                            <h2>You have no events!</h2>
                        </div>
                    </div>

                    <div class="row no-gutters" x-show="(search.length || visibility !== 'any') && !Object.keys(categorizedEvents).length">
                        <div class="col-12 text-center py-5 search-empty">
                            <h2>No events match filters</h2>
                        </div>
                    </div>


                    <div class="row no-gutters">
                        <div class="col-12 modal-inlay px-md-3 py-md-2" style="max-height: 70vh; overflow-y: auto;">
                            <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)" :key="category_name">
                                <div class="row no-gutters mb-2" x-data="{
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

                                    <div class="col-12 row no-gutters d-flex align-items-center mb-2 mt-3">
                                        <h5 class="col-12 col-md-6 mb-0">
                                           <span x-text="category_name"></span>

                                            <span class="small" x-text="(groupFilter === '-1') ? `(${matchedEvents.length} events)` : `(${matchedEvents.length}/${category_events.length} events)`"></span>
                                        </h5>

                                        <div class="col-12 col-md-6 d-flex justify-content-md-end justify-content-between mt-2 mt-md-0 flex-row-reverse flex-md-row">
                                            <div class="pr-md-3 d-flex align-items-center">
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

                                    <div class="col-12 rounded overflow-hidden d-flex flex-column drop-shadow">
                                        <template x-for="event_data in shownEvents" :key="event_data.id">
                                            <div class="managed_event" @click="selectEvent(event_data, $dispatch)">
                                                <div class="d-flex align-items-center justify-content-start justify-self-start text-left" style="white-space: nowrap;" >
                                                    <div class="icon"><i :class="{
                                                        'fas fa-calendar': !multiselect,
                                                        'far fa-calendar': multiselect && !isSelected(event_data.id),
                                                        'far fa-calendar-check valid': multiselect && isSelected(event_data.id)
                                                    }"></i></div>
                                                </div>
                                                <div class="managed_event_description text-left flex-grow-1">
                                                    <span class="pl-2 pl-md-3" x-html="highlight_match(event_data.name)"></span>
                                                    <span class="px-2 d-none d-sm-inline" style="opacity: 0.4;">&bull;</span>
                                                    <span class="d-none d-sm-inline" :class="{'opacity-70': event_data.description, 'opacity-30': !event_data.description }" x-html="event_data.description ? highlight_match(event_data.description, event_data.name.length) : 'Event has no description'"></span>
                                                </div>
                                                <button class="managed_event_action_icon" :style="multiselect ? 'pointer-events: none;' : ''" @click.stop="toggleEventPrint(event_data, $dispatch)">
                                                    <i class="fa fa-print" :class="{ 'slashed opacity-60': !event_data.settings.print }"></i>
                                                </button>
                                                <button class="managed_event_action_icon" :style="(multiselect || event_data.settings.hide_full) ? 'pointer-events: none;' : ''" @click.stop="toggleEventHidden(event_data, $dispatch)">
                                                    <i class="fa" :title="eventVisibilityTooltip(event_data)" :class="{  'fa-eye-slash opacity-60': event_data.settings.hide || event_data.settings.hide_full, 'fa-eye': !event_data.settings.hide, 'opacity-50 pointer-events-none' : event_data.settings.hide_full }"></i>
                                                </button>
                                                <button class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-edit-event', { event_db_id: event_data.id, epoch: window.dynamic_data.epoch })">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                                <button class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-delete-event', { event_db_id: event_data.id })">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="row no-gutters mt-4">
                        <div class="col-12 px-md-3 d-flex justify-content-end">
                            <button class="btn btn-outline-secondary mr-2" @click="open = false; search = ''">Cancel</button>
                            <button class="btn btn-primary" @click="$dispatch('event-editor-modal-new-event', { epoch: dynamic_data.epoch })">Create new</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
