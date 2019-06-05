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

				<div class='detail-column fifth' value='target'>
					<div class='detail-text right-align full'>Year:</div>
				</div>
				<div class='detail-column fourfifths input_buttons'>
					<div class='btn btn-sm btn-danger sub-btn sub_year' id='sub_target_year'><i class="icon-minus"></i></div>
					<input class='form-control form-control-sm date_control' id='target_year' type='number'>
					<div class='btn btn-sm btn-success add-btn add_year' id='add_target_year'><i class="icon-plus"></i></div>
				</div>
			</div>

			<div class='detail-row'>


				<div class='detail-column fifth'>
					<div class='detail-text right-align full'>Month:</div>
				</div>
				<div class='detail-column fourfifths input_buttons' value='target'>
					<div class='btn btn-sm btn-danger sub-btn sub_timespan' id='sub_target_timespan'><i class="icon-minus"></i></div>
					<select class='form-control form-control-sm date_control' id='target_timespan'></select>
					<div class='btn btn-sm btn-success add-btn add_timespan' id='add_target_timespan'><i class="icon-plus"></i></div>
				</div>

			</div>

			<div class='detail-row'>


				<div class='detail-column fifth'>
					<div class='detail-text right-align full'>Day:</div>
				</div>
				<div class='detail-column fourfifths input_buttons' value='target'>
					<div class='btn btn-sm btn-danger sub-btn sub_day' id='sub_target_day'><i class="icon-minus"></i></div>
					<select class='form-control form-control-sm date_control' id='target_day'></select>
					<div class='btn btn-sm btn-success add-btn add_day' id='add_target_day'><i class="icon-plus"></i></div>
				</div>

			</div>

			<div class='detail-row'>
				<div class='detail-column half'>
					<div class='btn btn-danger full' id='reset_preview_date'>Go to base date</div>
				</div>
				<div class='detail-column half'>
					<div class='btn btn-success full' id='go_to_preview_date'>Go to preview date</div>
				</div>
			</div>

		</div>

		<div class='separator'></div>

	</div>

</form>


<div id='input_collapse_btn' class="btn btn-outline-primary"></div>


<div id="calendar_container">

	<div id="top_follower">

		<div class='btn_container hidden'>
			<button class='btn btn-danger btn_preview_date hidden' disabled key='year' value='-1'>< Year</button>
			<button class='btn btn-danger btn_preview_date hidden' disabled key='timespan' value='-1'>< Month</button>
		</div>

		<div id='top_follower_content'></div>

		<div class='btn_container hidden'>
			<button class='btn btn-success btn_preview_date hidden' disabled key='year' value='1'>Year ></button>
			<button class='btn btn-success btn_preview_date hidden' disabled key='timespan' value='1'>Month ></button>
		</div>

	</div>

	<div id="calendar">

	</div>

	<?php include('footnote.php') ?>

</div>