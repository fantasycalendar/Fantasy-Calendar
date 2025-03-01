@props(['calendar' => null])

<div class='row no-gutters'>
    <p class="m-0">Calendar linking allows you to connect two calendar's dates, making one follow
        the other!</p>
    <p><small>This is a complex feature, we recommend you check out the article on <a
                href='{{ helplink('calendar_linking') }}' target="_blank"><i
                    class="fa fa-question-circle"></i> Calendar Linking</a>.</small></p>
</div>

@if(Auth::user()->can('enable-linking', $calendar))
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
                <select class='form-control' x-model="selectedCalendarHash">
                    <option value="">Choose an available calendar</option>

                    <template x-for="calendar in linkable" x-key="calendar.hash">
                        <option :value="calendar.hash" x-text="calendar.name"></option>
                    </template>
                </select>

                <div class="input-group-append">
                    <button type='button' class='btn btn-sm btn-secondary full' @click.prevent="load">Refresh</button>
                </div>
            </div>

            <template x-for="child in children">
                <div x-data="{
                        locked: !!child.parent_hash,
                        collapsed: !!child.parent_hash,
                        date: getRelativeStartDate(child),
                    }">
                    <div class='sortable-container list-group-item collapsible '
                        :class="{
                            'collapsed': locked && collapsed,
                            'expanded': !locked || !collapsed,
                        }">
                        <div class='main-container'>
                            <div class='cursor-pointer text-xl fa'
                                 :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                                 @click="collapsed = !collapsed"
                                 x-show="locked"
                                 ></div>
                            <div class='name-container'>
                                <div><a :href="`/calendars/${child.hash}/edit`" target="_blank" x-text="child.name"></a></div>
                            </div>
                        </div>

                        <div class='collapse-container container mb-2'>
                            <div class='row my-1 bold-text'>
                                <x-alpine.date-selector model="date" title="Relative Start Date:"></x-alpine.date-selector>
                            </div>

                            <div class='row no-gutters my-1'>
                                <button type='button' class='btn btn-danger full' @click="unlinkChildCalendar(child.hash)" x-show="locked">Unlink</button>
                                <button type='button' class='btn btn-primary full' @click="linkChildCalendar(child.hash, date)" x-show="!locked">Link</button>
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
