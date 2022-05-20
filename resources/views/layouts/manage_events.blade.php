<div x-data="EventsManager" x-ref="events-manager" @open-events-manager.window="open_modal">
    <div
        class="layout_background clickable_background hidden"
        :class="{'hidden': !open}"
        x-show="open"
    >

        <div class="modal-basic-container">
            <div class="modal-basic-wrapper">
                <div class="modal-wrapper layout-wrapper container">

                    <div class="close-ui-btn-bg"></div>
                    <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                    <div class="row no-gutters my-3 modal-form-heading">
                        <div class="col-12 col-md-3 mb-3 mb-md-0" style="display: grid; place-items: center start;">
                            <span style="position: absolute; right: 0px; cursor: pointer; height: 50px; width: 50px; opacity: 0.8; line-height: 50px; text-align: center;" @click="search = ''" x-show="search.length"><i class="fa fa-times"></i></span>
                            <input type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                        </div>
                        <div class="text-center text-md-right col-12 col-md-9">
                            <h2 style="opacity: 0.5; line-height: 0.8;">Calendar Events</h2>
                        </div>
                    </div>

                    <div class="row" x-show="!grouped.length && !ungrouped.length && !search.length">
                        <div class="col-12 text-center py-5 py-2 search-empty">
                            <h2>You have no events!</h2>
                        </div>
                    </div>

                    <div class="row" x-show="search.length && !(grouped.length + ungrouped.length)">
                        <div class="col-12 text-center py-5 py-2 search-empty">
                            <h2>No events match search '<span x-text="search" class="event_manager_search"></span>'</h2>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <template x-for="(event_group, index) in grouped" :key="index">
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <h3 x-text="event_group.name"></h3>
                                    </div>

                                    <hr>

                                    <div class="col-12">
                                        <template x-for="event_data in event_group.events">
                                            <button type="button" class="w-100 rounded my-1 py-2 px-3 layout d-flex justify-content-between align-items-center text-left cursor-pointer" @click="$dispatch('event-editor-modal-edit-event', {event_id: event_data.sort_by})">
                                                <div class="label">
                                                    <h4 x-html="highlight_match(event_data.name)" class="py-1 my-0"></h4>
                                                    <p class="my-0" x-show="event_data.description.length > 1">
                                                        <span x-html="highlight_match(event_data.description)"></span>
                                                    </p>
                                                </div>

                                                <div class="edit-icon">
                                                    <i class="fa fa-edit py-1"></i>
                                                </div>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </template>

                            <div class="row mb-2" x-show="ungrouped.length">
                                <div class="col-12">
                                    <h3>No Category</h3>
                                </div>

                                <hr>

                                <div class="col-12">
                                    <template x-for="event_data in ungrouped" :key="event_data.id">
                                        <button type="button" class="w-100 rounded my-1 py-2 px-3 layout d-flex justify-content-between align-items-center text-left cursor-pointer" @click="$dispatch('event-editor-modal-edit-event', {event_id: event_data.sort_by})">
                                            <div class="label">
                                                <h4 x-html="highlight_match(event_data.name)" class="py-1 my-0"></h4>
                                                <p class="my-0" x-show="event_data.description.length > 1">
                                                    <span x-html="highlight_match(event_data.description)"></span>
                                                </p>
                                            </div>

                                            <div class="edit-icon">
                                                <i class="fa fa-edit py-1"></i>
                                            </div>
                                        </button>
                                    </template>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
