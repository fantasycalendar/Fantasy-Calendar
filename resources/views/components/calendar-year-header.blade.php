<div id="top_follower"
     x-data="CalendarYearHeader"
     @calendar-loaded.window="update"
     @calendar-updated.window="update"
>

    <div class='flex-shrink-1 is-active' id='input_collapse_btn'>
        <button class="btn btn-secondary px-3">
            <i class="fa fa-bars"></i>
        </button>
    </div>

    <div class='parent_button_container d-print-none' x-cloak x-show="parent_data_changed">
        <div class='container d-flex h-100 p-0'>
            <div class='col justify-content-center align-self-center full'>
                <button class='btn btn-danger full'>Parent data changed -
                    reload
                </button>
            </div>
        </div>
    </div>

    <div class='btn_container'>
        <button class='btn btn-outline-secondary btn_preview_date d-print-none' @click="select_previous_year">
            &lt; Year
        </button>
        <button class='btn btn-outline-secondary btn_preview_date d-print-none' @click="select_previous_month"
                x-cloak x-show="layout === 'single_month'">
            <span><i class="fa fa-arrow-left"></i></span>
        </button>
    </div>

    <div class='reset_preview_date_container left' x-show="is_selected_date_ahead" x-cloak>
        <button type='button' class='btn btn-success reset_preview_date protip d-print-none'
                data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar'
                @click="go_to_current_date"
        >
            &lt; Current
        </button>
    </div>

    <div class="follower_center flex-grow-1">
        <div id='top_follower_content'>
            <div class='year' x-text="year_header_text"></div>
            <div class='cycle' x-show="this.cycles?.data?.length" x-text="cycle_header_text"></div>
        </div>
    </div>

    <div class='reset_preview_date_container right' x-show="is_selected_date_behind" x-cloak>
        <button type='button' class='btn btn-success reset_preview_date protip d-print-none'
                data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar'
                @click="go_to_current_date"
        >
            Current &gt;
        </button>
    </div>

    <div class='btn_container'>
        <button class='btn btn-outline-secondary btn_preview_date d-print-none' @click="select_next_year">
            Year >
        </button>
        <button class='btn btn-outline-secondary btn_preview_date d-print-none' @click="select_next_month"
                x-cloak x-show="layout === 'single_month'">
            <span><i class="fa fa-arrow-right"></i></span>
        </button>
    </div>

</div>