<div x-data="CalendarLayouts" x-ref="layouts" @open-layouts-modal.window="open_modal" x-init="open = true;">
    <div
        class="layout_background clickable_background hidden"
        :class="{ 'hidden':!open }"
        x-show="open"
    >
        <div class="modal-basic-container">
            <div class="modal-basic-wrapper">
                <form id="layout-form" class="modal-wrapper layout-wrapper container" action="post" @click.away="open = false;">

                    <div class="close-ui-btn-bg"></div>
                    <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                    <div class="row no-gutters mb-1 modal-form-heading">
                        <div class="text-center col-12 col-md-12">
                            <h2 style="opacity: 0.5; line-height: 0.8;">Calendar Layouts</h2>
                        </div>
                    </div>

                    <div class="row py-2">

                        <template x-for="layout in layouts">
                            <div class="col-12 col-md-4">
                                <button
                                    type="button"
                                    class="full rounded my-1 py-2 px-3 layout flex-grow text-left"
                                    :class="{'active_layout': layout == current_layout}"
                                    @click="apply_layout(layout)"
                                    :disabled="layout == current_layout"
                                >

                                    <div class="image">
                                        <img :src="layout.image" :alt="layout.name">
                                        <div class="img_fade"></div>
                                    </div>

                                    <h4 class="m-0" x-text="layout.name"></h4>
                                    <p class="m-0 mt-1"><small x-text="layout.description"></small></p>
                                </button>
                            </div>

                        </template>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>
