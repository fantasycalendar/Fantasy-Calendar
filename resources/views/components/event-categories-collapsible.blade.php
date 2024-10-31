@props(['calendar' => null])

<div class='row no-gutters bold-text'>
	<div class='col'>
		New event category:
	</div>
</div>
<div class='add_inputs event_categories row no-gutters input-group'>
	<input type='text' class='form-control name' id='event_category_name_input'
				 placeholder='Event category name'>
	<div class="input-group-append">
		<button type='button' class='btn btn-primary add'><i class="fa fa-plus"></i></button>
	</div>
</div>

<div class='sortable list-group' id='event_category_list'></div>

<div class='row no-gutters my-2'>
	<div class='separator'></div>
</div>

<div class='row no-gutters bold-text'>
	<div class='col'>
		Default category:
		<select class='form-control event-category-list protip' data-pt-position="right"
						data-pt-title="This sets the category to be selected by default when a new event is created"
						id='default_event_category'></select>
	</div>
</div>
