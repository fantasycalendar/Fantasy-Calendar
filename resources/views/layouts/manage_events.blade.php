<div x-data="EventsManager" x-ref="events-manager" @open-events-manager.window="open_modal" @render-data-change.window="refreshEvents">
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
                    <i class="close_ui_btn fas fa-times-circle" @click="open = false; search = ''"></i>

                    <div class="row no-gutters my-3 modal-form-heading">
                        <div class="col-12 col-md-3 mb-3 mb-md-0" style="display: grid; place-items: center start;">
                            <span style="position: absolute; right: 0px; cursor: pointer; height: 50px; width: 50px; opacity: 0.8; line-height: 50px; text-align: center;" @click="search = ''" x-show="search.length"><i class="fa fa-times"></i></span>
                            <input type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                            <select x-model="groupFilter">
                                <option value="-1">All Categories</option>
                                <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)">
                                    <option value="category_name" x-text="category_name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="text-center text-md-right col-12 col-md-9">
                            <h3 style="opacity: 0.5; line-height: 0.8;">Calendar Events</h3>
                        </div>
                    </div>

                    <div class="row" x-show="!Object.keys(categorizedEvents).length && !search.length">
                        <div class="col-12 text-center py-5 py-2 search-empty">
                            <h2>You have no events!</h2>
                        </div>
                    </div>

                    <div class="row" x-show="search.length && !Object.keys(categorizedEvents).length">
                        <div class="col-12 text-center py-5 py-2 search-empty">
                            <h2>No events match search '<span x-text="search" class="event_manager_search"></span>'</h2>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 modal-inlay" style="max-height: 70vh; overflow-y: auto;">
                            <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)" :key="category_name">
                                <div class="row mb-2" x-data="{
                                    pageIndex: 1,
                                    perpage: 5,
                                    get matchedEvents() {
                                        return category_events.filter(event => inSearch(event));
                                    },
                                    get currentPage() {
                                        if(!this.matchedEvents) return 0;

                                        let currentPageStart = (this.perpage * (this.pageIndex - 1));
                                        let currentPageEnd = (this.perpage * (this.pageIndex - 1)) + this.perpage;
                                        currentPageEnd = (currentPageEnd > this.matchedEvents.length ? this.matchedEvents.length : currentPageEnd);

                                        return this.matchedEvents.slice(currentPageStart, currentPageEnd)
                                    },
                                }" x-show="matchedEvents.length">

                                    <div class="col-12 row no-gutters d-flex align-items-center mb-2 mt-3">
                                        <h5 class="col-12 col-md-6" >
                                           <span x-text="category_name"></span>

                                            <span class="small" x-text="`(${matchedEvents.length} matchedEvents)`"></span>
                                        </h5>

                                        <div class="col-12 col-md-6 d-flex justify-content-end">
                                            <div x-show="matchedEvents.length > perpage">
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <button class="btn btn-secondary" @click="pageIndex--" :disabled="pageIndex <= 1" title="previous">
                                                            &laquo;
                                                            <span class="sr-only">Previous</span>
                                                        </button>
                                                    </div>

                                                    <div class="input-group-append">
                                                        <span class="input-group-text form-control">
                                                            <span x-text="pageIndex"></span>&nbsp;/&nbsp;<span x-text="Math.ceil(matchedEvents.length / perpage)"></span>
                                                        </span>
                                                        <button class="btn btn-secondary" @click="pageIndex++" :disabled="pageIndex >= (Math.ceil(matchedEvents.length / perpage) + 1)" title="previous">
                                                            &raquo;
                                                            <span class="sr-only">Previous</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr>

                                    <div class="col-12 rounded overflow-hidden">
                                        <template x-for="event_data in currentPage" :key="event_data.id">
                                            <button type="button" style="margin-bottom: 1px;" class="w-100 py-2 px-2 managed_event position-relative d-flex justify-content-between align-items-center text-left cursor-pointer" @click="$dispatch('event-editor-modal-edit-event', {event_id: event_data.sort_by})">
                                                <div class="icon">
                                                    <i class="fa fa-calendar-day"></i>
                                                </div>


                                                <div class="label">
                                                    <strong x-html="highlight_match(event_data.name)" class="py-1 my-0"></strong>
                                                    <p class="my-0" x-show="event_data.description?.length > 1">
                                                        <span style="opacity: 0.8;" x-html="highlight_match(event_data.description)"></span>
                                                    </p>
                                                    <p class="my-0" x-show="event_data.description?.length < 1">
                                                        <span style="opacity: 0.4; font-style: italic;">Event has no description</span>
                                                    </p>
                                                </div>

                                                <div class="edit-icon" style="position: absolute; top: 6px; right: 14px; opacity: 0.6;">
                                                    <i class="fa fa-edit py-1"></i>
                                                </div>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
