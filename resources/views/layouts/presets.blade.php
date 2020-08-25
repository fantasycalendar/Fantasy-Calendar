<div class='preset_background clickable_background' x-show='open'>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="modal-wrapper preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <h2 class='text-center col'>Calendar Presets</h2>
                </div>

                <div class='row no-gutters mb-1'>
                    <h4 class='text-center col'>Pre-made and ready to go!</h4>
                </div>
                
                <div class='row'>
                    <div class='col' x-bind:class="{ 'loading': !loaded }"></div>
                </div>

                <div class='row justify-content-start'>
                    
                    <template x-if="loaded" x-for="preset in presets" :key="preset.id">
                        <div class="col-md-4 col-sm-12 p-2 d-flex">
                            <button type="button" @click="fetch_preset(preset.id, preset.name)" class="full btn shadow p-3 preset flex-grow">
                                <p class="m-0" x-text="preset.name"></p>
                                <p class="m-0 font-italic"><small x-text="preset.author"></small></p>
                                <p class="m-0 mt-1"><small x-text="preset.description"></small></p>
                            </button>
                        </div>
                    </template>
                </div>

            </form>
        </div>
    </div>
</div>