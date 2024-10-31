@props(['calendar' => null])

<div class='row bold-text'>
	<div class="col">
		New moon:
	</div>
</div>

<div class='add_inputs moon'>
	<div class='row no-gutters'>
		<input type='text'
					 class='form-control name protip mb-1'
					 data-pt-position="top"
					 data-pt-title="The moon's name."
					 id='moon_name_input'
					 placeholder='Moon name'>
		<div class='input-group'>

			<input type='number'
						 class='form-control cycle protip'
						 data-pt-position="top"
						 data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.'
						 min='1'
						 id='moon_cycle_input'
						 placeholder='Cycle'>

			<input type='number'
						 class='form-control shift protip'
						 data-pt-position="top"
						 data-pt-title='This is how many days the cycle is offset by.'
						 id='moon_shift_input'
						 placeholder='Shift'>

			<div class='input-group-append'>
				<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
			</div>
		</div>
	</div>
</div>
<div class='sortable' id='moon_list'></div>
