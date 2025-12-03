<div id="input_container" class="d-print-none">
    @include('inputs.sidebar.header')

    <div class='title-text center-text mt-0 mb-0'>{{ $calendar->name }}</div>
    <div class="center-text mt-0 mb-3">By {{ $calendar->user->username }}</div>

    <div class="accordion mt-3">
        <div class='d-flex flex-column mx-3 my-2'>
            <div class="input-group">
                <input type="text" x-ref="share_url_input" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
                <div class="input-group-append">
                    <button x-on:click="() => {
                        $refs.share_url_input.select();
                        document.execCommand('copy');
                        $dispatch('notify', {
                            content: 'Copied to clipboard!',
                            type: 'success'
                        });
                    }" id="btn_share" type="button" class='btn btn-sm btn-secondary btn-block'>Copy URL</button>
                </div>
            </div>
        </div>

        <div class='d-flex my-3 mx-3'>
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

        <x-collapsible :calendar="$calendar" contains="Current Date" icon="fa-hourglass-half" open></x-collapsible>

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
