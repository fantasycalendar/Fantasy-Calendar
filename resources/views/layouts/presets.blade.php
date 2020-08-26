<div class='preset_background clickable_background hidden' :class="{ 'hidden':!open }" x-show='open'>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="modal-wrapper preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <h2 class='text-center col-12'>Calendar Presets</h2>
                    <h4 class='text-center col-12'>Pre-made and ready to go!</h4>
                </div>

                <div class='row'>
                    <div class='col' :class="{ 'loading': !loaded }"></div>
                </div>

                <hr x-show="feature.featured">

                <div class="row py-2" x-show="feature.featured">
                    <div class="col-12 col-md-6" style="display: grid; place-items: center;">
                        <h4 class="w-100">Featured by Fantasy Calendar</h4>
                    </div>

                    <div class="col-12 col-md-6">
                        <button type="button" @click="fetch_preset(feature.id, feature.name)" class="full btn p-3 preset flex-grow text-left">
                            <div class="icon">
                                <i class="fa fa-globe" :class="{
                                    ['fa-'+feature.icon]: feature.icon != false,
                                    'fa-globe': !feature.icon
                                }"></i>
                            </div>

                            <h4 class="m-0" x-text="feature.name"></h4>
                            <p class="m-0 small font-italic"><small x-text="feature.author"></small></p>
                            <p class="m-0 mt-1"><small x-text="feature.description"></small></p>
                        </button>
                    </div>
                </div>

                <hr class="py-2" x-show="feature.featured">

                <div class='row justify-content-start'>

                    <template x-if="loaded" x-for="preset in presets" :key="preset.id">
                        <div class="col-12 col-md-6 pb-2 d-flex">
                            <button type="button" @click="fetch_preset(preset.id, preset.name)" class="full btn p-3 preset flex-grow text-left">
                                <div class="icon">
                                    <i class="fa fa-globe" :class="{
                                        ['fa-'+preset.icon]: preset.icon != false,
                                        'fa-globe': !preset.icon
                                    }"></i>
                                </div>

                                <h4 class="m-0" x-text="preset.name"></h4>
                                <p class="m-0 small font-italic"><small x-text="preset.author"></small></p>
                                <p class="m-0 mt-1"><small x-text="preset.description"></small></p>
                            </button>
                        </div>
                    </template>
                </div>

            </form>
        </div>
    </div>
</div>
