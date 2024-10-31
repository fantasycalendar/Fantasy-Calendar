@props(['calendar' => null])

<div class='row no-gutters bold-text'>
	Cycle format:
</div>
<div class="row no-gutters">
	<input type='text' id='cycle_format' class='form-control name static_input protip' data='cycles'
				 fc-index='format' placeholder='Cycle &lcub;&lcub;1&rcub;&rcub;' data-pt-position="right"
				 data-pt-title="This is the template for the cycles you have. Each cycle part has a set of names which you can add to the top of the calendar. Add one with this field empty to see how this works!">
</div>

<div class='row no-gutters my-2'>
	<div class='separator'></div>
</div>

<div class='add_inputs cycle row no-gutters'>
	<input type='button' value='Add new cycle' class='btn btn-primary full add'>
</div>

<div class='sortable' id='cycle_sortable'></div>
