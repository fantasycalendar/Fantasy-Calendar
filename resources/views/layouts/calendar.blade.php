<div id='calendar' x-data="CalendarRenderer"
     :class="{
        'single_month': render_data.current_month_only,
        'minimalistic': render_data.render_style === 'minimalistic'
     }"
     x-ref="calendar_renderer"
     @set-calendar-visible.window="set_calendar_visible($event.detail)"
     x-show="visible"
>

    <div class="modal_background w-100" x-show="!loaded && render_data.timespans.length">
        <div id="modal" class="creation mt-5 py-5 d-flex flex-column align-items-center justify-content-center">
            <h3 class="text-center" x-text="loading_message"></h3>
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    </div>

    <x-calendar-creation-steps></x-calendar-creation-steps>

    <template
        @render-data-change.window="
            pre_render();
            load_calendar($event);
            $nextTick(() => { post_render($dispatch) });
        "
        @update-epochs.window="update_epochs"
        x-for="timespan in render_data.timespans"
        :key="timespan.id"
    >
        <div style="display: contents;">

            <template x-if="render_data.render_style === 'grid'">
                @include('layouts.partials.grid')
            </template>

            <template x-if="render_data.render_style === 'vertical'">
                @include('layouts.partials.vertical')
            </template>

            <template x-if="render_data.render_style === 'minimalistic'">
                @include('layouts.partials.minimalistic')
            </template>

        </div>
    </template>
</div>
