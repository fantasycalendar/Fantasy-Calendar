<div x-data="EventsManager"
     x-ref="events-manager"
     @open-events-manager.window="open_modal"
     @events-changed.window="refreshEvents"
     @events-changed.window="refreshCategories"
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
                    <i class="close_ui_btn fas fa-times-circle" @click="open = false; search = ''"></i>

                    <div class="row no-gutters my-3 modal-form-heading">
                         <div class="col-12 mb-2">
                            <h4 style="opacity: 0.8; line-height: 0.8;">Events</h4>
                        </div>

                        <div class="col-12 col-sm-6 mb-1 mb-sm-0 pr-1" style="display: grid; place-items: end;">
                            <div class="w-100">
                                <span style="position: absolute; right: 0px; cursor: pointer; height: 50px; width: 50px; opacity: 0.8; line-height: 50px; text-align: center;" @click="search = ''" x-show="search.length"><i class="fa fa-times"></i></span>
                                <input type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                            </div>
                        </div>

                         <div class="col-12 col-sm-6 d-flex place-items-start align-items-stretch pl-1">
                             <select x-model="groupFilter" class="form-control w-100 w-sm-auto">
                                    <option value="-1">All Categories</option>
                                    <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)">
                                        <option :value="category_name" x-text="category_name"></option>
                                    </template>
                            </select>
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

                    <div class="d-flex border rounded-sm align-items-center py-2">
                        <div class="px-2 border-right">
                            <input type="checkbox" x-model="multiselect">
                        </div>
                        <div class="px-2 border-right">
                            <select name="" id="" @change="updateCategory($event, $dispatch)">
                                <option value="">Add selected to category...</option>
                                <option value="-1">Remove from category</option>
                                <template x-for="category in categories">
                                    <option :value="category.id" x-text="category.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="px-2 border-right">
                            <i class="fa fa-eye-slash" title="Toggle visibility"></i>
                        </div>
                        <div class="px-2">
                            <i class="fa fa-trash" title="Delete"></i>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 modal-inlay px-md-3 py-md-2" style="max-height: 70vh; overflow-y: auto;">
                            <template x-for="([category_name, category_events]) in Object.entries(categorizedEvents)" :key="category_name">
                                <div class="row mb-2" x-data="{
                                    pageIndex: 1,
                                    perpage: 7,
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

                                        <div class="col-12 col-md-6 d-flex justify-content-end">
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
                                                <div class="d-flex align-items-center justify-self-start text-left" style="white-space: nowrap;" >
                                                    <div class="icon d-none d-md-block"><i :class="{
                                                        'fas fa-calendar': !multiselect,
                                                        'far fa-calendar': multiselect && !isSelected(event_data.id),
                                                        'far fa-calendar-check valid': multiselect && isSelected(event_data.id)
                                                    }"></i></div>
                                                    <span class="py-1" style="padding-left: 0.8rem;" x-html="highlight_match(event_data.name)"></span>
                                                    <span class="px-2 d-none d-sm-inline" style="opacity: 0.4;">&bull;</span>
                                                </div>
                                                <div class="managed_event_description d-none d-sm-block" :class="{'opacity-70': event_data.description, 'opacity-30': !event_data.description }" style="font-size: 90%;" x-html="event_data.description ? highlight_match(event_data.description) : 'Event has no description'"></div>
                                                <div class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-edit-event', { event_id: event_data.sort_by, epoch: window.dynamic_data.epoch })">
                                                    <i class="fa fa-edit px-2"></i>
                                                </div>
                                                <div class="managed_event_action_icon" x-show="!multiselect" @click.stop="$dispatch('event-editor-modal-delete-event', { event_id: event_data.sort_by })">
                                                    <i class="fa fa-trash px-2"></i>
                                                </div>
                                            </div>
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
