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

            <template x-for="child in children">
                <div x-data="{
                        locked: true,
                        year: $store.calendar.dynamic_data.year,
                        timespan: 0,
                        day: 0,
                    }">
                    <div class='sortable-container list-group-item collapsible '
                        :class="{
                            'collapsed': locked,
                            'expanded': !locked,
                        }">
                        <div class='main-container'>
                            <div class='expand  ml-2'
                                :class="{
                                    'expand': locked,
                                    'collapse': !locked,
                                }"
                                ></div>
                            <div class='name-container'>
                                <div><a :href="`/calendars/${calendar.hash}/edit`" target="_blank" x-text="calendar.name"></a></div>
                            </div>
                        </div>

                        <div class='collapse-container container mb-2'>
                            <div class='row my-1 bold-text'>
                                <div class='col'>
                                    Relative Start Date:

                                    <div class='date_control'>
                                        <div class='row my-2'>
                                            <div class='col'>
                                                <input type='number' step="1.0" class='form-control small-input year-input' x-model="year" :disabled="locked">
                                            </div>
                                        </div>

                                        <div class='row my-2'>
                                            <div class='col'>
                                                <select type='number' class='custom-select form-control' :disabled="locked" x-model="timespan"></select>
                                            </div>
                                        </div>

                                        <div class='row my-2'>
                                            <div class='col'>
                                                <select type='number' class='custom-select form-control' :disabled="locked" x-model="day"></select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class='row no-gutters my-1'>
                                <button type='button' class='btn btn-danger full' @click="unlinkChildCalendar(child.hash)" x-show="locked">Unlink</button>
                                <button type='button' class='btn btn-primary full' @click="linkChildCalendar(child.hash, [year, timespan, day])" x-show="!locked">Link</button>
                            </div>
                        </div>
                    </div>
            </template>
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
