@push('head')
    <script>

    $(document).ready(function(){

        $('#btn_share, .share-body').click(function(){
            var copyText = document.querySelector(".share-body");
            copyText.select();
            document.execCommand("copy");
            $.notify(
                "Copied to clipboard!",
                "success"
            );
        });

    })

    </script>
@endpush

<div id="input_container" class="d-print-none d-flex flex-column justify-content-between">
    <div>
        @include('inputs.sidebar.header')

        <div class='title-text center-text mt-0 mb-0'>{{ $calendar->name }}</div>
        <div class="center-text mt-0 mb-3">By {{ $calendar->user->username }}</div>

        <div class='d-flex flex-column mx-3 my-2'>
            <div class="input-group">
                <input type="text" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
                <div class="input-group-append">
                    <button id="btn_share" type="button" class='btn btn-sm btn-secondary btn-block'>Copy URL</button>
                </div>
            </div>
        </div>

        <div class='d-flex mt-3 mx-3'>
            @if($calendar->owned)
                <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class="btn w-100 btn-sm btn-success mr-2">
                    Edit
                </a>
            @endif
            <button type='button' onclick="print()" class="btn w-100 btn-sm btn-secondary">
                Print
                </a>
        </div>


        <!---------------------------------------------->
        <!---------------- CURRENT DATE ---------------->
        <!---------------------------------------------->

        <div id='clock' class='mt-3'>
            <canvas style="z-index: 2;" id="clock_face"></canvas>
            <canvas style="z-index: 1;" id="clock_sun"></canvas>
            <canvas style="z-index: 0;" id="clock_background"></canvas>
        </div>

        <div x-show="shouldShow" x-data="{
        activeDateAdjustment: @can('advance-date', $calendar) 'current' @else 'preview' @endcan,
        shouldShow: false,
        calculateShouldShow: function () {
        this.shouldShow = window.Perms.player_at_least('co-owner') || static_data.settings.allow_view;
        },
        }" @calendar-loaded.window="calculateShouldShow">
            <ul class="nav justify-content-center nav-tabs mx-3 mt-3">
                @can('advance-date', $calendar)
                    <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'current' }" @click="activeDateAdjustment = 'current'">Current date</a></li>
                @endcan
                <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'preview' }" @click="activeDateAdjustment = 'preview'">Preview date</a></li>
                <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'relative' }" @click="activeDateAdjustment = 'relative'">Relative math</a></li>
            </ul>

            @can('advance-date', $calendar)
                <div class='date_control mx-3 mt-3' id='date_inputs' :class="{ 'd-flex flex-column': activeDateAdjustment === 'current', 'd-none': activeDateAdjustment !== 'current' }">
                    @if($calendar->isChild())
                        <div class='mb-3 center-text hidden calendar_link_explanation'>
                            <p class='m-0'>This calendar follows the date of a <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">parent calendar</a>.</p>
                        </div>

                        <div class="input-group">
                            <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                            <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                            <input class='form-control year-input' id='current_year' type='number'>
                        </div>

                        <div class="input-group mt-2">
                            <input class='form-control text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                            <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                            <input class='form-control protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">
                        </div>
                    @else
                        <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
                            </div>
                            <input class='form-control year-input' id='current_year' type='number'>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_year' id='add_current_year'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                        <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current month in the year">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                        <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current day in the month">
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
                            </div>
                            <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                            <div class='input-group-append'>
                                <button type='button' class='btn btn-success add_day' id='add_current_day'><i class="icon-plus"></i></button>
                            </div>
                        </div>

                        <div class='input-group protip mt-2'>
                            <div class='input-group-prepend'>
                                <button type='button' class='btn btn-danger adjust_hour' val='-1'>1hr</button>
                                <button type='button' class='btn border-left btn-danger adjust_minute' val='-30'>30m</button>
                            </div>

                            <input class='form-control text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                            <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                            <input class='form-control protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">

                            <div class='input-group-append'>
                                <button type='button' class='btn small-text btn-success adjust_minute' val='30'>30m</button>
                                <button type='button' class='btn small-text border-left btn-success adjust_hour' val='1'>1h</button>
                            </div>
                        </div>
                    @endif
                </div>
            @endcan


            <div class='date_control preview_date_controls mx-3 mt-3' :class="{ 'd-flex flex-column': activeDateAdjustment === 'preview', 'd-none': activeDateAdjustment !== 'preview' || (!Perms.player_at_least('co-owner') && !static_data.settings.allow_view) }">
                <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview year">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-danger sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
                    </div>
                    <input class='form-control year-input' id='target_year' type='number'>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-success add_year' id='add_target_year'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview month of the preview year">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-danger sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
                    </div>
                    <select class='form-control timespan-list inclusive date' id='target_timespan'></select>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-success add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The current day of the preview month">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-danger sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
                    </div>
                    <select class='form-control timespan-day-list inclusive date' id='target_day'></select>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-success add_day' id='add_target_day'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='btn btn-success full mt-2' id='go_to_preview_date'>Jump to preview date</div>
            </div>

            <div class="mx-3 mt-3" :class="{ 'd-flex flex-column': activeDateAdjustment === 'relative', 'd-none': activeDateAdjustment !== 'relative' }">
                <div class="input-group">
                    <input type='number' class="form-control mt-2" id='unit_years' placeholder="Years">
                    <input type='number' class="form-control mt-2" id='unit_months' placeholder="Months">
                    <input type='number' class="form-control mt-2" id='unit_days' placeholder="Days">
                </div>
                <div class='my-2 row no-gutters'>
                    <div class="input-group">
                        <input type='number' class="form-control" id='unit_hours' placeholder="Hours">
                        <div class="input-group-prepend input-group-append"><span class="input-group-text">:</span></div>
                        <input type='number' class="form-control" id='unit_minutes' placeholder="Minutes">
                    </div>
                </div>

                <div class="d-flex mt-3">
                    <span class="full text-center">Apply the above to</span>
                </div>

                <div class="d-flex">
                    @if($calendar->parent == null && auth()->check() && auth()->user()->can('advance-date', $calendar))
                        <button type="button" step="1.0" class="btn btn-primary btn-block mt-2 mr-1" id='current_date_btn'>Current date</button>
                        <button type="button" step="1.0" class="btn btn-secondary btn-block mt-2 ml-1" id='preview_date_btn'>Preview date</button>
                    @else
                        <button type="button" step="1.0" class="btn btn-secondary btn-block mt-2" id='preview_date_btn'>Preview date</button>
                    @endif
                </div>
            </div>

            <div class="d-flex flex-column mx-3">
                <div class='btn btn-info hidden mt-2' disabled id='reset_preview_date_button'>Jump to current date</div>
            </div>

            <div class="full px-3 mt-3">
                <div class="separator full"></div>
            </div>

        </div>


        @can('update', $calendar)
            <!---------------------------------------------->
            <!------------------ LOCATIONS ----------------->
            <!---------------------------------------------->

            <div class="mx-3 mt-3">
                <h5>
                    Current location:
                </h5>
                <select class='form-control protip' id='location_select' data-pt-position="right" data-pt-title="The presets work with four seasons (winter, spring, summer, autumn) or two seasons (winter, summer). If you call your seasons the same, the system matches them with the presets' seasons, no matter which order."></select>
            </div>

        @endcan

        @if(Auth::check() && $calendar->isLinked())
            <!---------------------------------------------->
            <!------------------ LINKING ------------------->
            <!---------------------------------------------->

            <div class="d-flex flex-column mx-3 mt-3">
                <div class="separator full mb-3"></div>

                @if($calendar->isParent())
                    <h5>
                        Linked calendars:
                    </h5>

                    <ul>
                        @foreach($calendar->children as $child)
                            <li><a href='/calendars/{{ $child->hash }}' target="_blank">{{ $child->name }}</a></li>
                        @endforeach
                    </ul>
                @endif

                @if($calendar->isChild())
                    Parent Calendar: <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">{{ $calendar->parent->name }}</a>
                @endif
            </div>
        @endif
    </div>

    <div class="text-center full mt-5" style="justify-self: end;">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd <br> <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></small>
    </div>
</div>


<div id="calendar_container">
	<div id="top_follower" :class="{ 'single_month': apply == 'single_month' }" x-data="{ apply: '', toggle() { window.toggle_sidebar(); } }" @layout-change.window="apply = $event.detail.apply">

        <div class='flex-shrink-1 is-active' id='input_collapse_btn'>
            <button class="btn btn-secondary">
                <i class="fa fa-bars"></i>
            </button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-secondary btn_preview_date hidden d-print-none sub_year' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-secondary btn_preview_date hidden d-print-none sub_month' disabled fc-index='timespan' value='-1'>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-left"></i></span>
            </button>
		</div>

        <div class='reset_preview_date_container btn_container left hidden'>
            <button type='button' class='btn btn-success reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
        </div>

        <div class="follower_center flex-grow-1">
            <div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>
        </div>

        <div class='reset_preview_date_container btn_container right hidden'>
            <button type='button' class='btn btn-success reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-secondary btn_preview_date hidden d-print-none add_year' disabled fc-index='year' value='1'>Year ></button>
			<button class='btn btn-secondary btn_preview_date hidden d-print-none add_month' disabled fc-index='timespan' value='1'>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-right"></i></span>
            </button>
		</div>

	</div>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))
</div>
