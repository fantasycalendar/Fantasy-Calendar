<div class='preset_background clickable_background hidden' :class="{ 'hidden':!open }" x-show='open'>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="modal-wrapper preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <div class="col-10 col-md-3 mb-3 mb-md-0" style="display: grid; place-items: center;">
                        <span style="position: absolute; right: 0px; cursor: pointer; height: 50px; width: 50px; opacity: 0.8; line-height: 50px; text-align: center;" @click="search = ''" x-show="search.length"><i class="fa fa-times"></i></span>
                        <input type="text" name="search" x-model="search" class="form-control" placeholder="Search...">
                    </div>
                    <div class="text-center text-md-right col-12 col-md-9">
                        <h2 style="opacity: 0.5; line-height: 0.8;">Calendar Presets</h2>
                        <h3 style="font-size: 1.3rem; font-weight: 400; opacity: 0.6;">Pre-made and ready&nbsp;to&nbsp;go!</h3>
                    </div>
                </div>

                <div class='row'>
                    <div class='col' :class="{ 'loading': !loaded }"></div>
                </div>

                <hr>

                <div class="row py-2" x-show="featured.length && !search.length && page_number==0">
                    <div class="col-12">
                        <h4 class="text-center w-100" style="opacity: 0.8;">Featured by the Fantasy Calendar team</h4>
                    </div>

                    <template x-if="loaded && featured.length" x-for="feature in featured" :key="feature.id">
                        <div class="col-12 col-md-6">
                            <button type="button" @click="fetch_preset(feature.id, feature.name)" class="full rounded my-1 py-2 px-3 preset flex-grow text-left">
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

                <hr class="py-2" x-show="featured.length && !search.length && page_number==0">

                <div class="row" x-show="!filteredPresets.length && search.length">
                    <div class="col-12 text-center py-5 py-2 search-empty">
                        <h2>No presets matching '<span x-text="search"></span>'</h2>
                    </div>
                </div>

                <div class='row justify-content-start'>
                    <template x-if="loaded" x-for="preset in filteredPresets" :key="preset.id">
                        <div class="col-12 col-md-6 pb-2 d-flex">
                            <button type="button" @click="fetch_preset(preset.id, preset.name)" class="full rounded my-1 py-2 px-3 preset flex-grow text-left">
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
                    <div class="col-12">
                        <hr>
                    </div>

                    <div class='col'>
                        <button
                            type="button"
                            x-on:click="prev_page"
                            :disabled="page_number==0"
                            class='btn btn-stock pagination-navigation'
                            :class="{ 'disabled cursor-not-allowed' : page_number==0 }"
                        >
                            <p class='p-0 m-0'><i class='fas fa-long-arrow-alt-left'></i> Previous</p>
                        </button>
                    </div>

                    <div class='col d-none d-md-flex justify-content-center'>
                        <template x-for="(page,index) in pages" :key="index">
                            <button
                                type="button"
                                class="btn btn-stock pagination-navigation pagination-number px-3"
                                :class="{
                                        'font-bold pagination-number-active': index == page_number,
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
                            class='btn btn-stock pagination-navigation'
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
