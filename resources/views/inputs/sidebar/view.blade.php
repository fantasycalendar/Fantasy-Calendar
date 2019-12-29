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

            <div id='clock'>
                <canvas style="z-index: 2;" id="clock_face"></canvas>
                <canvas style="z-index: 1;" id="clock_sun"></canvas>
                <canvas style="z-index: 0;" id="clock_background"></canvas>
            </div>

			<div class='detail-row'>
	            <div class='detail-column quarter'>
                    <button id="btn_share" type="button" class='btn btn-sm btn-info btn-block'>Share</button>
	            </div>
	            <div class='detail-column threequarter'>
	                <input type="text" class="form-control form-control share-body" readonly value="{{ url()->current() }}"/>
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
							<input class='form-control form-control year-input' id='current_year' type='number'>
							<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_current_year'><i class="icon-plus"></i></button>
						</div>
					</div>

					<div class='detail-row'>


						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Month:</div>
						</div>
						<div class='detail-column fourfifths input_buttons' value='current'>
							<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_current_timespan'><i class="icon-minus"></i></button>
							<select class='form-control form-control timespan-list inclusive date' id='current_timespan'></select>
							<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_current_timespan'><i class="icon-plus"></i></button>
						</div>

					</div>

					<div class='detail-row'>


						<div class='detail-column fifth'>
							<div class='detail-text right-align full'>Day:</div>
						</div>
						<div class='detail-column fourfifths input_buttons' value='current'>
							<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_current_day'><i class="icon-minus"></i></button>
							<select class='form-control form-control timespan-day-list inclusive date' id='current_day'></select>
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
							<input class='form-control form-control' type='number' id='current_hour'>:
							<input class='form-control form-control' type='number' id='current_minute'>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_minute' val='30'><i class="clocktext">30m</i></button>
							<button type='button' class='btn btn-sm btn-success add-btn adjust_hour' val='1'><i class="clocktext">1h</i></button>
						</div>

					</div>

				</div>

				<div class='separator'></div>

			@endif


			<div class='date_control hidden'>

				<div class='detail-row'>
					<h4>Preview date:</h4>
				</div>

				<div class='detail-row'>

					<div class='detail-column fifth' value='target'>
						<div class='detail-text right-align full'>Year:</div>
					</div>
					<div class='detail-column fourfifths input_buttons'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_year' id='sub_target_year'><i class="icon-minus"></i></button>
						<input class='form-control form-control year-input' id='target_year' type='number'>
						<button type='button' class='btn btn-sm btn-success add-btn add_year' id='add_target_year'><i class="icon-plus"></i></button>
					</div>
				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Month:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></button>
						<select class='form-control form-control timespan-list inclusive date' id='target_timespan'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_timespan' id='add_target_timespan'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>


					<div class='detail-column fifth'>
						<div class='detail-text right-align full'>Day:</div>
					</div>
					<div class='detail-column fourfifths input_buttons' value='target'>
						<button type='button' class='btn btn-sm btn-danger sub-btn sub_day' id='sub_target_day'><i class="icon-minus"></i></button>
						<select class='form-control form-control timespan-day-list inclusive date' id='target_day'></select>
						<button type='button' class='btn btn-sm btn-success add-btn add_day' id='add_target_day'><i class="icon-plus"></i></button>
					</div>

				</div>

				<div class='detail-row'>
					<div class='btn btn-success full' id='go_to_preview_date'>Preview date</div>
				</div>

			</div>


			<div class='wrap-collapsible card mt-2'>
                <input id="collapsible_add_units" class="toggle" type="checkbox">
                <label for="collapsible_add_units" class="lbl-toggle card-header small-lbl-text center-text">Add or subtract fixed units to calendar</label>
                <div class="collapsible-content card-body">

                    <div class='row mb-2'>

                        <div class='col px-1'>
                            <input type='number' class="form-control form-control full" id='unit_years' placeholder="Years">
                        </div>

                        <div class='col px-1'>
                            <input type='number' class="form-control form-control full" id='unit_months' placeholder="Months">
                        </div>

                        <div class='col px-1'>
                            <input type='number' class="form-control form-control full" id='unit_days' placeholder="Days">
                        </div>

                    </div>

                    <div class='row'>
                    	
						@if(Auth::check())

	                        <div class='col px-1'>
	                            <button type="button" step="1.0" class="btn btn-primary btn-sm full" id='current_date_btn'>To current date</button>
	                        </div>

						@endif

                        <div class='col px-1'>
                            <button type="button" step="1.0" class="btn btn-secondary btn-sm full" id='preview_date_btn'>To preview date</button>
                        </div>

                    </div>

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
				<div class='detail-label'>Current location:</div>
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
		
		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden' disabled fc-index='timespan' value='-1'>< Month</button>
		</div>
		

        <div class='reset_preview_date_container left'>
            <button type='button' class='btn btn-info hidden reset_preview_date protip' data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar' >< Current</button>
        </div>

		<div id='top_follower_content'></div>

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
