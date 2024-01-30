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

<form id="input_container" class="d-print-none">

    @include('inputs.sidebar.header')

	<div class='wrap-collapsible'>
		<div class='title-text center-text mt-0 mb-0'>{{ $calendar->name }}</div>
        <div class="center-text mt-0 mb-3">By {{ $calendar->user->username }}</div>

        <div class='row my-2'>
            <div class='col-3 pr-1'>
                <button id="btn_share" type="button" class='btn btn-sm btn-secondary btn-block'>Share</button>
            </div>
            <div class='col-9 pl-1'>
                <input type="text" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
            </div>
        </div>

        <div class='d-flex my-2 w-100'>
            @if($calendar->owned)
            <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class="btn w-100 btn-sm btn-success mr-2">
                Edit
            </a>
            @endif
            <button type='button' onclick="print()" class="btn w-100 btn-sm btn-secondary">
                Print
            </a>
        </div>

	</div>

	<!---------------------------------------------->
	<!---------------- CURRENT DATE ---------------->
	<!---------------------------------------------->

    <div id='clock' class='mb-2'>
        <canvas style="z-index: 2;" id="clock_face"></canvas>
        <canvas style="z-index: 1;" id="clock_sun"></canvas>
        <canvas style="z-index: 0;" id="clock_background"></canvas>
    </div>

    <div x-data="{ activeDateAdjustment: 'current' }">
        <ul class="nav justify-content-center nav-tabs px-3">
            @can('advance-date', $calendar)
            <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'current' }" @click="activeDateAdjustment = 'current'">Current date</a></li>
            @endcan
            <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'preview' }" @click="activeDateAdjustment = 'preview'">Preview date</a></li>
            <li class="nav-item"><a href="javascript:;" class="nav-link px-2 small" :class="{ 'active': activeDateAdjustment === 'relative' }" @click="activeDateAdjustment = 'relative'">Relative math</a></li>
        </ul>

        @can('advance-date', $calendar)
            <div class='date_control px-3 mt-3' id='date_inputs' :class="{ 'd-flex flex-column': activeDateAdjustment === 'current', 'd-none': activeDateAdjustment !== 'current' }">
                <div class='my-2 center-text hidden calendar_link_explanation'>
                    @if($calendar->parent != null)
                        <p class='m-0'>This calendar is using a different calendar's date to calculate the current date. Only the <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">parent calendar</a> can set the date for this calendar.</p>
                    @endif
                </div>

                <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current year">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-outline-danger sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
                    </div>
                    <input class='form-control year-input' id='current_year' type='number'>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-outline-success add_year' id='add_current_year'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current month in the year">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-outline-danger sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
                    </div>
                    <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-outline-success add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='input-group protip mt-2' value='current' data-pt-position='right' data-pt-title="The current day in the month">
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-outline-danger sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
                    </div>
                    <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                    <div class='input-group-append'>
                        <button type='button' class='btn btn-outline-success add_day' id='add_current_day'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='input-group protip mt-2'>
                    <div class='input-group-prepend'>
                        <button type='button' class='btn small-text btn-outline-danger adjust_hour' val='-1'>1hr</button>
                        <button type='button' class='btn small-text border-left btn-outline-danger adjust_minute' val='-30'>30m</button>
                    </div>

                    <input class='form-control form-control-sm text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                    <span class="px-1">:</span>
                    <input class='form-control form-control-sm protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">

                    <div class='input-group-append'>
                        <button type='button' class='btn small-text btn-outline-success adjust_minute' val='30'>30m</button>
                        <button type='button' class='btn small-text border-left btn-outline-success adjust_hour' val='1'>1h</button>
                    </div>
                </div>

            </div>
        @endcan


        <div class='date_control preview_date_controls px-3 mt-3' :class="{ 'd-flex flex-column': activeDateAdjustment === 'preview', 'd-none': activeDateAdjustment !== 'preview' }">
            <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview year">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-outline-danger sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
                </div>
                <input class='form-control year-input' id='target_year' type='number'>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-outline-success add_year' id='add_target_year'><i class="icon-plus"></i></button>
                </div>
            </div>

            <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The preview month of the preview year">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-outline-danger sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
                </div>
                <select class='form-control timespan-list inclusive date' id='target_timespan'></select>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-outline-success add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
                </div>
            </div>

            <div class='input-group protip mt-2' value='target' data-pt-position='right' data-pt-title="The current day of the preview month">
                <div class='input-group-prepend'>
                    <button type='button' class='btn btn-outline-danger sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
                </div>
                <select class='form-control timespan-day-list inclusive date' id='target_day'></select>
                <div class='input-group-append'>
                    <button type='button' class='btn btn-outline-success add_day' id='add_target_day'><i class="icon-plus"></i></button>
                </div>
            </div>

            <div class='btn btn-success full mt-3' id='go_to_preview_date'>Jump to preview date</div>
        </div>

        <div :class="{ 'd-flex flex-column': activeDateAdjustment === 'relative', 'd-none': activeDateAdjustment !== 'relative' }">
            <div class='mx-0'>
                <input type='number' class="form-control form-control-sm full" id='unit_years' placeholder="Years">
                <input type='number' class="form-control form-control-sm full" id='unit_months' placeholder="Months">
                <input type='number' class="form-control form-control-sm full" id='unit_days' placeholder="Days">
            </div>
            <div class='mx-0 my-2'>
                <div class='col-md-6 col-sm-12'>
                    <input type='number' class="form-control form-control-sm full" id='unit_hours' placeholder="Hours">
                </div>
                <div class='col-md-6 col-sm-12'>
                    <input type='number' class="form-control form-control-sm full" id='unit_minutes' placeholder="Minutes">
                </div>
            </div>

            @if($calendar->parent == null)
                <button type="button" step="1.0" class="btn btn-primary btn-block my-2" id='current_date_btn'>To current date</button>
            @endif
            <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" id='preview_date_btn'>To preview date</button>

        </div>

    </div>


    <div class="full d-flex flex-column px-3">
        <div class='btn btn-info hidden mt-2' disabled id='reset_preview_date_button'>Jump to current date</div>
    </div>


	@can('update', $calendar)
	<!---------------------------------------------->
	<!------------------ LOCATIONS ----------------->
	<!---------------------------------------------->

		<div class='wrap-collapsible card settings-locations mt-4'>
			<input id="collapsible_locations" class="toggle" type="checkbox" disabled checked>
			<label for="collapsible_locations" class="lbl-toggle card-header lbl-text"><i class="mr-2 fas fa-compass"></i> Locations <a target="_blank" data-pt-position="right" data-pt-title='More Info: Locations' href='{{ helplink('locations') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
			<div class="collapsible-content card-body">

                <div class='row bold-text'>
                    Current location:
                </div>
                <div class='row mb-2'>
                    <select class='form-control protip' id='location_select' data-pt-position="right" data-pt-title="The presets work with four seasons (winter, spring, summer, autumn) or two seasons (winter, summer). If you call your seasons the same, the system matches them with the presets' seasons, no matter which order.">
                    </select>
                </div>

            </div>


		</div>
	@endcan

    @if(Auth::check())
        @if($calendar->children->count() > 0 || $calendar->parent != null)
        <!---------------------------------------------->
        <!------------------ LINKING ------------------->
        <!---------------------------------------------->
        <div class='wrap-collapsible card'>
            <input id="collapsible_linking" class="toggle" type="checkbox" checked disabled>
            <label for="collapsible_linking" class="lbl-toggle card-header lbl-text">Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='More Info: Calendar Linking' href='{{ helplink('calendar_linking') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>
            <div class="collapsible-content card-body">

                @if($calendar->children->count() > 0)

                    Calendar links:<br>

                    @foreach($calendar->children as $child)

                        <a href='/calendars/{{ $child->hash }}' target="_blank">{{ $child->name }}</a><br>

                    @endforeach

                @endif

                @if($calendar->parent != null)

                    Parent Calendar: <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">{{ $calendar->parent->name }}</a>

                @endif

            </div>
        </div>
        @endif
	@endif

</form>




<div id="calendar_container">

	<div id="top_follower" :class="{ 'single_month': apply == 'single_month' }" x-data="{ apply: '', toggle() { window.toggle_sidebar(); } }" @layout-change.window="apply = $event.detail.apply">

        <div class='btn_container flex-shrink-1 is-active' id='input_collapse_btn'>
            <button class="btn btn-secondary px-3">
                <i class="fa fa-bars"></i>
            </button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-outline-secondary btn_preview_date hidden d-print-none sub_year' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-outline-secondary btn_preview_date hidden d-print-none sub_month' disabled fc-index='timespan' value='-1'>
                <span x-cloak x-show="apply != 'single_month'">< Month</span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-left"></i></span>
            </button>
		</div>

        <div class='reset_preview_date_container m-1 left hidden'>
            <button type='button' class='btn m-0 btn-success reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
        </div>

        <div class="follower_center flex-grow-1">
            <div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>
        </div>

        <div class='reset_preview_date_container m-1 right hidden'>
            <button type='button' class='btn m-0 btn-success reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-outline-secondary btn_preview_date hidden d-print-none add_year' disabled fc-index='year' value='1'>Year ></button>
			<button class='btn btn-outline-secondary btn_preview_date hidden d-print-none add_month' disabled fc-index='timespan' value='1'>
                <span x-cloak x-show="apply != 'single_month'">Month ></span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-right"></i></span>
            </button>
		</div>

	</div>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))

    <div class="copyright text-center">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd - <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></small>
    </div>

</div>
