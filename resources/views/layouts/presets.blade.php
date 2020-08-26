<div class='preset_background clickable_background hidden' :class="{ 'hidden':!open }" x-show='open'>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="modal-wrapper preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <div class="col-12 col-md-3" style="display: grid; place-items: center;">
                        <input type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                    </div>
                    <h2 class='text-right col-12 col-md-9' style="opacity: 0.5;">Calendar Presets <br><span style="font-size: 70%; font-weight: 400; opacity: 0.6;">Pre-made and ready to go!</span></h2>
                </div>

                <div class='row'>
                    <div class='col' :class="{ 'loading': !loaded }"></div>
                </div>

                <hr>

                <div class="row py-2" x-show="featured.length && !search.length">
                    <div class="col-12">
                        <h4 class="text-center w-100" style="opacity: 0.8;">Featured by the Fantasy Calendar team</h4>
                    </div>

                    <template x-if="loaded && featured.length" x-for="feature in featured" :key="feature.id">
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
                    </template>
                </div>

                <hr class="py-2" x-show="featured.length && !search.length">

                <div class='row justify-content-start'>
                    <template x-if="loaded" x-for="preset in filteredPresets" :key="preset.id">
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

                <div class='row mt-4 hidden' x-show="page_count > 1" :class="{ 'hidden': page_count <= 1 }">

                    <div class='col'>
                        <button
                            type="button"
                            x-on:click="prev_page"
                            :disabled="page_number==0"
                            class='btn'
                            :class="{ 'disabled cursor-not-allowed' : page_number==0 }"
                        >
                            <p class='p-0 m-0'><i class='fas fa-long-arrow-alt-left'></i> Previous</p>
                        </button>
                    </div>

                    <div class='col d-flex justify-content-center'>
                        <template x-for="(page,index) in pages" :key="index">
                            <button
                                type="button"
                                class="btn pagination-navigation px-3"
                                :class="{
                                        'font-bold pagination-navigation-active': index == page_number,
                                    }"
                                type="button"
                                x-on:click="view_page(index)"
                            >
                                <span x-text="index+1"></span>
                            </button>
                        </template>
                    </div>

                    <div class='col d-flex justify-content-end'>
                        <button
                            type="button"
                            x-on:click="next_page"
                            :disabled="page_number >= page_count -1"
                            class='btn'
                            :class="{ 'disabled cursor-not-allowed' : page_number >= page_count -1 }"
                        >
                            <p class='p-0 m-0'>Next <i class='fas fa-long-arrow-alt-right'></i></p>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>