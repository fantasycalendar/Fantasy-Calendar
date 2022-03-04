<form id="input_container" class='d-print-none'>

	@include('inputs.sidebar.header')

	@yield('label')

	<div class='wrap-collapsible step-hide'>
		<div class="view-tabs btn-group d-flex mb-2 w-100">
            <button type="button" data-pt-position='top' data-pt-title='What you, the owner, will always see' data-view-type='owner' class="protip owner w-100 btn btn-sm btn-primary">Owner View</button>
            <button type="button" data-pt-position='top' data-pt-title='A simulated view of what guests with the link to this calendar will see' data-view-type='player' class="protip player w-100 btn btn-sm btn-secondary">Guest View</button>
            <button type="button" data-pt-position='top' data-pt-title='Graphs showing the weather curves' data-view-type='weather' class="protip weather w-100 btn btn-sm btn-secondary">Climate view</button>
		</div>
	</div>

    <div class='wrap-collapsible step-hide'>
        <div class="d-flex mb-2 w-100">
            <label class="row no-gutters setting border rounded py-2 px-3 protip w-100" data-pt-position="right" data-pt-title="If unchecked, you will be prompted to apply changes after making them, instead of loading the calendar every time.">
                <div class='col'>
                    <input type='checkbox' class='margin-right' data='settings' id='apply_changes_immediately' checked>
                    <span>
                        Apply changes immediately
                    </span>
                </div>
            </label>
        </div>
    </div>

	<div class="accordion">

        <!---------------------------------------------->
        <!----------------- STATISTICS ----------------->
        <!---------------------------------------------->

        <x-sidebar.statistics></x-sidebar.statistics>


		<!---------------------------------------------->
		<!---------------- CURRENT DATE ---------------->
		<!---------------------------------------------->

        <x-sidebar.date :calendar="$calendar"></x-sidebar.date>


		<!---------------------------------------------->
		<!-------------------- CLOCK ------------------->
		<!---------------------------------------------->

        <x-sidebar.clock :calendar="$calendar"></x-sidebar.clock>



		<!---------------------------------------------->
		<!------------------- WEEKDAYS ----------------->
		<!---------------------------------------------->

        <x-sidebar.weekdays :calendar="$calendar"></x-sidebar.weekdays>


		<!---------------------------------------------->
		<!----------------- TIMESPANS ------------------>
		<!---------------------------------------------->

        <x-sidebar.timespans :calendar="$calendar"></x-sidebar.timespans>


		<!---------------------------------------------->
		<!------------------ LEAP DAYS ----------------->
		<!---------------------------------------------->

        <x-sidebar.leap-days :calendar="$calendar"></x-sidebar.leap-days>


		<!---------------------------------------------->
		<!-------------------- ERAS -------------------->
		<!---------------------------------------------->

        <x-sidebar.eras :calendar="$calendar"></x-sidebar.eras>


		<!---------------------------------------------->
		<!------------------- MOONS -------------------->
		<!---------------------------------------------->

        <x-sidebar.moons :calendar="$calendar"></x-sidebar.moons>


		<!---------------------------------------------->
		<!------------------- SEASONS ------------------>
		<!---------------------------------------------->

        <x-sidebar.seasons :calendar="$calendar"></x-sidebar.seasons>


		<!---------------------------------------------->
		<!------------------- WEATHER ------------------>
		<!---------------------------------------------->

		<x-sidebar.weather :calendar="$calendar"></x-sidebar.weather>


		<!---------------------------------------------->
		<!------------------ LOCATIONS ----------------->
		<!---------------------------------------------->

        <x-sidebar.locations :calendar="$calendar"></x-sidebar.locations>


		<!---------------------------------------------->
		<!------------------- CYCLES ------------------->
		<!---------------------------------------------->

        <x-sidebar.cycles :calendar="$calendar"></x-sidebar.cycles>


		<!---------------------------------------------->
		<!----------------- CATEGORIES ----------------->
		<!---------------------------------------------->

        <x-sidebar.event-categories></x-sidebar.event-categories>


		<!---------------------------------------------->
		<!------------------- EVENTS ------------------->
		<!---------------------------------------------->

        <x-sidebar.events></x-sidebar.events>


		<!---------------------------------------------->
		<!------------------ SETTINGS ------------------>
		<!---------------------------------------------->

        <x-sidebar.settings></x-sidebar.settings>

		@if(request()->is('calendars/*/edit'))

			<!---------------------------------------------->
			<!--------------- User Management -------------->
			<!---------------------------------------------->
            <x-sidebar.user-management :calendar="$calendar"></x-sidebar.user-management>

		@endif

		@if(request()->is('calendars/*/edit'))
			<!---------------------------------------------->
			<!------------------ LINKING ------------------->
			<!---------------------------------------------->
			<div class='wrap-collapsible card settings-linking'>
				<input id="collapsible_linking" class="toggle" type="checkbox">

				<label for="collapsible_linking" class="lbl-toggle py-2 px-3 card-header"><i class="mr-2 fas fa-link"></i> Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='More Info: Calendar Linking' href='{{ helplink('calendar_linking') }}' class="wiki protip"><i class="icon-question-sign"></i></a></label>

                <div class="collapsible-content card-body">

                    <div class='row no-gutters'>
                        <p class="m-0">Calendar linking allows you to connect two calendar's dates, making one follow the other!</p>
                        <p><small>This is a complex feature, we recommend you check out the article on <a href='{{ helplink('calendar_linking') }}' target="_blank"><i class="icon-question-sign"></i> Calendar Linking</a>.</small></p>
                    </div>

					@if(Auth::user()->can('link', $calendar))

						<div id='calendar_link_hide'>

							@if($calendar->parent != null)
								<div class='row no-gutters my-1 center-text hidden calendar_link_explanation'>
									<p class='m-0'>This calendar is already linked to a <a href='/calendars/{{ $calendar->parent->hash }}/edit' target="_blank">parent calendar</a>. Before linking any calendars to this one, you must unlink this calendar from its parent.</p>
								</div>
							@else

								<div class='row no-gutters my-1'>
									<select class='form-control' id='calendar_link_select'></select>
								</div>
								<div class='row no-gutters my-1'>
									<button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_list_select'>Refresh</button>
								</div>

								<div class='sortable' id='calendar_link_list'></div>
								<div class='sortable mt-1' id='calendar_new_link_list'></div>
							@endif
						</div>

					@else

						<div class='row no-gutters my-1'>
							<p>Link calendars together, and make this calendar's date drive the date of other calendars!</p>
							<p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe now</a> to unlock this feature!</p>
						</div>

					@endif
				</div>
			</div>
		@endif
	</form>
</div>

<button id='input_collapse_btn' class="hamburger hamburger--arrowturn is-active d-print-none" type="button">
	<span class="hamburger-box">
		<span class="hamburger-inner"></span>
	</span>
</button>

<div id="calendar_container">

	<div id="modal_background" class='flexible_background blurred_background'>
		<div id="modal">
			<span id="modal_text">
				This is an alert box.
			</span>
		</div>
	</div>

    <div id="reload_background" class='flexible_background blurred_background d-flex flex-column justify-content-center hidden d-print-none'>
        <div class='p-2 text-white'>You have made changes to your calendar.</div>
        <div class='p-2'><button type='button' class='btn btn-primary' id='apply_changes_btn'>Update preview</button></div>
    </div>

    <div id="top_follower" :class="{ 'single_month': apply == 'single_month' }" x-data="{ apply: '' }" @layout-change.window="apply = $event.detail.apply">

		<div class='parent_button_container hidden d-print-none'>
			<div class='container d-flex h-100 p-0'>
				<div class='col justify-content-center align-self-center full'>
					<button class='btn btn-danger full' disabled id='rebuild_calendar_btn'>Parent data changed - reload</button>
				</div>
			</div>
		</div>

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden d-print-none sub_year' disabled fc-index='year' value='-1'>< Year</button>
            <button class='btn btn-danger btn_preview_date hidden d-print-none sub_month' disabled fc-index='timespan' value='-1'>
                <span x-cloak x-show="apply != 'single_month'">< Month</span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-left"></i></span>
            </button>
		</div>

		<div class='reset_preview_date_container m-1 left'>
			<button type='button' class='btn m-0 btn-info hidden reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
		</div>

        <div class="follower_center">
            <div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>
        </div>

		<div class='reset_preview_date_container m-1 right'>
            <button type='button' class='btn m-0 btn-info hidden reset_preview_date protip d-print-none' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
        </div>

		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden d-print-none add_year' disabled fc-index='year' value='1'>Year ></button>
            <button class='btn btn-success btn_preview_date hidden d-print-none add_month' disabled fc-index='timespan' value='1'>
                <span x-cloak x-show="apply != 'single_month'">Month ></span>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-right"></i></span>
            </button>
        </div>

	</div>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))

	<div id="weather_container" class="hidden">

		<div id='day_length' class='hidden'>
			<h3 class='text-center mt-3'>Sunrise and Sunset</h3>
			<canvas class='chart'></canvas>
		</div>

		<div id='temperature' class='hidden'>
			<h3 class='text-center mt-3'>Temperature</h3>
			<canvas class='chart'></canvas>
		</div>

		<div id='precipitation' class='hidden'>
			<h3 class='text-center mt-3'>Precipitation</h3>
			<canvas class='chart'></canvas>
		</div>

	</div>
    <div class="copyright text-center">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd - <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></small>
    </div>

</div>
<div id='html_edit'></div>
