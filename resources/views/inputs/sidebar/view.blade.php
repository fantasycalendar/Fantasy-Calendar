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

	<div class='wrap-collapsible'>
		<input id="collapsible_date" class="toggle" type="checkbox" checked disabled>
		<label for="collapsible_date" class="lbl-toggle lbl-text">Current Date & Time <a target="_blank" title='Fantasy Calendar Wiki: Date' href='https://wiki.fantasy-calendar.com/index.php?title=Date' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div id='clock'></div>


			<div class='detail-row'>
	            <div class='detail-column quarter'>
                    <button id="btn_share" type="button" class='btn btn-sm btn-info btn-block'>Share</button>
	            </div>
	            <div class='detail-column threequarter'>
	                <input type="text" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
	            </div>
            </div>


			@if(Auth::check())

				<div class='detail-row'>
		            <div class='detail-column'>
		                <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class='full'>
		                    <button type="button" class='btn btn-sm btn-success btn-block'>Edit Mode</button>
		                </a>
		            </div>
	            </div>

				<div class='detail-row date_control' id='date_inputs'>

					<div class='detail-row center-text hidden calendar_link_explaination'>
						This calendar is using a different calendar's date to calculate the current date. Only the master calendar can set the date for this calendar.
					</div>

					<div class='detail-row'>

						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Year:</div>
						</div>
						<div class='detail-column fourfifths input_buttons' value='current'>
							<button type='button' class='btn btn-sm btn-danger sub-btn sub_year' id='sub_current_year'><i class="icon-minus"></i></button>
							<input class='form-control form-control-sm year-input' id='current_year' type='number'>
							<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_current_year'><i class="icon-plus"></i></button>
						</div>
					</div>

					<div class='detail-row'>


						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Month:</div>
						</div>
						<div class='detail-column fourfifths input_buttons' value='current'>
							<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
							<select class='form-control form-control-sm timespan-list inclusive date' id='current_timespan'></select>
							<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
						</div>

					</div>

					<div class='detail-row'>


						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Day:</div>
						</div>
						<div class='detail-column fourfifths input_buttons' value='current'>
							<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
							<select class='form-control form-control-sm timespan-day-list inclusive date' id='current_day'></select>
							<button type='button' class='btn btn-sm btn-success add-btn add_day' id='add_current_day'><i class="icon-plus"></i></button>
						</div>

					</div>

					<div class='separator'></div>

					<div class='detail-row'>

						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Time:</div>
						</div>
						<div class='detail-column fourfifths input_buttons'>
							<button type='button' class='btn btn-sm btn-danger sub-btn adjust_hour' val='-1'><i class="clocktext">1h</i></button>
							<button type='button' class='btn btn-sm btn-danger sub-btn adjust_minute' val='-30'><i class="clocktext">30m</i></button>
							<input class='form-control form-control-sm' type='number' id='current_hour'>:
							<input class='form-control form-control-sm' type='number' id='current_minute'>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_minute' val='30'><i class="clocktext">30m</i></button>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_hour' val='1'><i class="clocktext">1h</i></button>
						</div>

					</div>

				</div>

				<div class='separator'></div>

			@endif

			<div class='detail-row'>
				<h4>Preview date:</h4>
			</div>

			<div class='date_control'>
				<div class='detail-row'>

					<div class='detail-column fifth' value='target'>
						<div class='detail-text right-align full'>Year:</div>
					</div>
					<div class='detail-column fourfifths input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
						<input class='form-control form-control-sm year-input' id='target_year' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_target_year'><i class="icon-plus"></i></button>
					</div>
				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Month:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-list inclusive date' id='target_timespan'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Day:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
						<select class='form-control form-control-sm timespan-day-list inclusive date' id='target_day'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_day' id='add_target_day'><i class="icon-plus"></i></button>
					</div>

				</div>
			</div>

			<div class='detail-row'>
				<div class='detail-column half'>
					<div class='btn btn-danger full' id='reset_preview_date' disabled>Base date</div>
				</div>
				<div class='detail-column half'>
					<div class='btn btn-success full' id='go_to_preview_date'>Preview date</div>
				</div>
			</div>

		</div>

		<div class='separator'></div>

	</div>

	@if(Auth::check())
	<!---------------------------------------------->
	<!------------------ LOCATIONS ----------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_locations" class="toggle" type="checkbox" checked disabled>
		<label for="collapsible_locations" class="lbl-toggle lbl-text">Locations <a target="_blank" title='Fantasy Calendar Wiki: Locations' href='https://wiki.fantasy-calendar.com/index.php?title=Locations' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-row detail-select-container'>
				<div class='detail-label'>Location:</div>
				<div class='detail-select'>
					<select class='form-control' id='location_select'>
					</select>
				</div>
			</div>

		</div>

		<div class='separator'></div>

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

		@if(Auth::check())
			<div class='btn_container hidden'>
				<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='year' value='-1'>< Year</button>
				<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='timespan' value='-1'>< Month</button>
			</div>
		@endif

		<div id='top_follower_content'></div>

		@if(Auth::check())
			<div class='btn_container hidden'>
				<button class='btn btn-success btn_preview_date hidden' disabled fc-index='year' value='1'>Year ></button>
				<button class='btn btn-success btn_preview_date hidden' disabled fc-index='timespan' value='1'>Month ></button>
			</div>
		@endif

	</div>

	<div id="calendar">

	</div>

	@include('templates.footnote')

</div>
