@props(['calendar' => null])

<div class='row no-gutters'>
	<p class="m-0">Calendar linking allows you to connect two calendar's dates, making one follow
		the other!</p>
	<p><small>This is a complex feature, we recommend you check out the article on <a
				href='{{ helplink('calendar_linking') }}' target="_blank"><i
					class="fa fa-question-circle"></i> Calendar Linking</a>.</small></p>
</div>

@if(Auth::user()->can('link', $calendar))

	<div id='calendar_link_hide'>

		@if($calendar->parent != null)
			<div class='row no-gutters my-1 center-text hidden calendar_link_explanation'>
				<p class='m-0'>This calendar is a child of
					<a href='/calendars/{{ $calendar->parent->hash }}/edit'
						 target="_blank">{{ $calendar->parent->name }}</a>.
					Before linking any calendars to this one, you must unlink this
					calendar from its parent.</p>
			</div>
		@else

			<div class='input-group my-1'>
				<select class='form-control' id='calendar_link_select'></select>
				<div class="input-group-append">
					<button type='button' class='btn btn-sm btn-secondary full'
									id='refresh_calendar_list_select'>Refresh
					</button>
				</div>
			</div>

			<div class='sortable' id='calendar_link_list'></div>
			<div class='sortable mt-1' id='calendar_new_link_list'></div>
		@endif
	</div>

@else

	<div class='row no-gutters my-1'>
		<p>Link calendars together, and make this calendar's date drive the date of other
			calendars!</p>
		<p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe
				now</a> to unlock this feature!</p>
	</div>

@endif
