@push('head')
    <script>

    $(document).ready(function(){

        $('#btn_share').click(function(){
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

<form id="input_container">

	<div class='wrap-collapsible'>
		<div class='title-text center-text'>View Calendar</div>
	</div>

	<!---------------------------------------------->
	<!---------------- CURRENT DATE ---------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible card'>
		<input id="collapsible_date" class="toggle" type="checkbox" checked disabled>
		<label for="collapsible_date" class="lbl-toggle card-header lbl-text">Current Date & Time <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Date' href='https://wiki.fantasy-calendar.com/index.php?title=Date' class="wiki protip"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content container card-body">

			<div id='clock' class='mb-2'>
				<canvas style="z-index: 2;" id="clock_face"></canvas>
				<canvas style="z-index: 1;" id="clock_sun"></canvas>
				<canvas style="z-index: 0;" id="clock_background"></canvas>
			</div>

			<div class='row my-2'>
	            <div class='col-3 pr-1'>
                    <button id="btn_share" type="button" class='btn btn-sm btn-info btn-block'>Share</button>
	            </div>
	            <div class='col-9 pl-1'>
	                <input type="text" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
	            </div>
            </div>

			@if(Auth::check())

			<div class='row'>
	            <div class='col'>
	                <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class='full'>
	                    <button type="button" class='btn btn-sm btn-success btn-block'>Edit Mode</button>
	                </a>
	            </div>
            </div>

			<div class='date_control container' id='date_inputs'>

				<div class='row mt-2'>
					<h4>Current date:</h4>
				</div>

				<div class='row my-2 center-text hidden calendar_link_explaination'>
                    @if($calendar->parent != null)
                        <p class='m-0'>This calendar is using a different calendar's date to calculate the current date. Only the <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">parent calendar</a> can set the date for this calendar.</p>
                    @endif
				</div>

                <div class='row'>

                    <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current year">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
                        </div>
                        <input class='form-control year-input' id='current_year' type='number'>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_year' id='add_current_year'><i class="icon-plus"></i></button>
                        </div>
                    </div>
                </div>

                <div class='row mt-2'>

                    <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current month in the year">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
                        </div>
                        <select class='form-control timespan-list inclusive date' id='current_timespan'></select>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
                        </div>
                    </div>

                </div>

                <div class='row mt-2'>

                    <div class='input-group protip' value='current' data-pt-position='right' data-pt-title="The current day in the month">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
                        </div>
                        <select class='form-control timespan-day-list inclusive date' id='current_day'></select>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_day' id='add_current_day'><i class="icon-plus"></i></button>
                        </div>
                    </div>

                </div>

                <div class='row mt-2 clock_inputs'>

                    <div class='input-group protip'>
                        <div class='input-group-prepend'>
                            <button type='button' class='btn small-text btn-danger adjust_hour' val='-1'>1hr</button>
                            <button type='button' class='btn small-text border-left btn-danger adjust_minute' val='-30'>30m</button>
                        </div>

                        <input class='form-control form-control-sm text-right protip' type='number' id='current_hour' data-pt-position='top' data-pt-title="The current hour of day">
                        <span class="px-1">:</span>
                        <input class='form-control form-control-sm protip' type='number' id='current_minute' data-pt-position='top' data-pt-title="The current minute of the hour">

                        <div class='input-group-append'>
                            <button type='button' class='btn small-text btn-success adjust_minute' val='30'>30m</button>
                            <button type='button' class='btn small-text border-left btn-success adjust_hour' val='1'>1h</button>
                        </div>
                    </div>
                </div>
			</div>

			@endif


			<div class='date_control container mt-3'>

				<div class='row'>
					<h4 class="my-0 py-0">Preview date:</h4>
				</div>

                <div class='row mt-2'>

                    <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The preview year">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
                        </div>
                        <input class='form-control year-input' id='target_year' type='number'>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_year' id='add_target_year'><i class="icon-plus"></i></button>
                        </div>
                    </div>
                </div>

                <div class='row mt-2'>

                    <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The preview month of the preview year">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
                        </div>
                        <select class='form-control timespan-list inclusive date' id='target_timespan'></select>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
                        </div>
                    </div>

                </div>

                <div class='row mt-2'>

                    <div class='input-group protip' value='target' data-pt-position='right' data-pt-title="The current day of the preview month">
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-danger sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
                        </div>
                        <select class='form-control timespan-day-list inclusive date' id='target_day'></select>
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-success add_day' id='add_target_day'><i class="icon-plus"></i></button>
                        </div>
                    </div>

                </div>

				<div class='row my-2'>
					<div class='btn btn-success full' id='go_to_preview_date'>Go To Preview date</div>
				</div>

				<div class='row my-2'>
                    <div class='btn btn-info full hidden' disabled id='reset_preview_date_button'>Go To Current Date</div>
				</div>

			</div>

            <div class='wrap-collapsible date_control card full'>
                <input id="collapsible_add_units" class="toggle" type="checkbox">
                <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed units to calendar dates</label>
                <div class="collapsible-content container card-body">

                    <div class='row no-gutters input-group mx-0'>
                        <input type='number' class="form-control form-control-sm full" id='unit_years' placeholder="Years">
                        <input type='number' class="form-control form-control-sm full" id='unit_months' placeholder="Months">
                        <input type='number' class="form-control form-control-sm full" id='unit_days' placeholder="Days">
                    </div>

                    @if($calendar->parent == null)
                        <button type="button" step="1.0" class="btn btn-primary btn-block my-2" id='current_date_btn'>To current date</button>
                    @endif
                    <button type="button" step="1.0" class="btn btn-secondary btn-block my-2" id='preview_date_btn'>To preview date</button>

                </div>

            </div>

		</div>

	</div>

	@if(Auth::check())
	<!---------------------------------------------->
	<!------------------ LOCATIONS ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_locations" class="toggle" type="checkbox" checked disabled>
		<label for="collapsible_locations" class="lbl-toggle lbl-text">Locations <a target="_blank" title='Fantasy Calendar Wiki: Locations' href='https://wiki.fantasy-calendar.com/index.php?title=Locations' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content container">

			<div class="col-12">

				<div class='row mt-2 detail-select-container'>
					<div class='detail-label'>Current location:</div>
				</div>
				<div class='row mb-2'>
					<select class='form-control' id='location_select'>
					</select>
				</div>

			</div>

		</div>

	</div>
	@endif

    @if(Auth::check())
    <!---------------------------------------------->
    <!------------------ LINKING ------------------->
    <!---------------------------------------------->
    <div class='wrap-collapsible card'>
        <input id="collapsible_linking" class="toggle" type="checkbox" checked disabled>
        <label for="collapsible_linking" class="lbl-toggle card-header lbl-text">Calendar Linking <a target="_blank" data-pt-position="right" data-pt-title='Fantasy Calendar Wiki: Calendar Linking' href='https://wiki.fantasy-calendar.com/index.php?title=Calendar_Linking' class="wiki protip"><i class="icon-question-sign"></i></a></label>
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

</form>


<button id='input_collapse_btn' class="hamburger hamburger--arrowturn is-active" type="button">
    <span class="hamburger-box">
        <span class="hamburger-inner"></span>
    </span>
</button>


<div id="calendar_container">

	<div id="top_follower">
		
		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='timespan' value='-1'>< Month</button>
		</div>
		

        <div class='reset_preview_date_container left'>
            <button type='button' class='btn btn-info hidden reset_preview_date protip' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
        </div>

        <div id='top_follower_content'><div class='year'></div><div class='cycle'></div></div>

        <div class='reset_preview_date_container right'>
            <button type='button' class='btn btn-info hidden reset_preview_date protip' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >Current ></button>
        </div>
		
		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden' disabled fc-index='year' value='1'>Year ></button>
			<button class='btn btn-success btn_preview_date hidden' disabled fc-index='timespan' value='1'>Month ></button>
		</div>
		
	</div>

	<div id="calendar">

	</div>

	@include('templates.footnote')

</div>
