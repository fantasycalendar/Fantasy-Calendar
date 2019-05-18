<div id="input_container_parent">
	<form id="input_container">


		<div class='wrap-collapsible'>
			<div class='title-text center-text'>View Calendar</div>
		</div>


		


	<!---------------------------------------------->
	<!---------------- CURRENT DATE ---------------->
	<!---------------------------------------------->

	<div class='wrap-collapsible'>
		<input id="collapsible_date" class="toggle" type="checkbox" checked>
		<label for="collapsible_date" class="lbl-toggle lbl-text">Current Date <a target="_blank" title='Fantasy Calendar Wiki: Date' href='https://wiki.fantasy-calendar.com/index.php?title=Date' class="wiki"><i class="icon-question-sign"></i></a></label>
		<div class="collapsible-content">

			<div class='detail-row'>

				<div class='detail-column fifth'>
					<div class='detail-text right-align full'>Year:</div>
				</div>
				<div class='detail-column fourfifths input_buttons'>
					<div class='btn btn-sm btn-info sub-btn' id='sub_year'><i class="icon-minus"></i></div>
					<input class='form-control form-control-sm date_control' id='current_year' type='number'>
					<div class='btn btn-sm btn-info add-btn' id='add_year'><i class="icon-plus"></i></div>
				</div>
			</div>

			<div class='detail-row'>


				<div class='detail-column fifth'>
					<div class='detail-text right-align full'>Month:</div>
				</div>
				<div class='detail-column fourfifths input_buttons'>
					<div class='btn btn-sm btn-info sub-btn' id='sub_timespan'><i class="icon-minus"></i></div>
					<select class='form-control form-control-sm date_control' id='current_timespan'></select>
					<div class='btn btn-sm btn-info add-btn' id='add_timespan'><i class="icon-plus"></i></div>
				</div>

			</div>

			<div class='detail-row'>


				<div class='detail-column fifth'>
					<div class='detail-text right-align full'>Day:</div>
				</div>
				<div class='detail-column fourfifths input_buttons'>
					<div class='btn btn-sm btn-info sub-btn' id='sub_day'><i class="icon-minus"></i></div>
					<select class='form-control form-control-sm date_control' id='current_day'></select>
					<div class='btn btn-sm btn-info add-btn' id='add_day'><i class="icon-plus"></i></div>
				</div>

			</div>

		</div>

		<div class='separator'></div>

	</div>

	</form>
	<div class="input_collapse_btn btn btn-outline-primary"></div>
</div>

<div id="calendar_container">

	<div id="top_follower">

	</div>

	<div id="calendar">

	</div>

	<?php include('footnote.php') ?>

</div>