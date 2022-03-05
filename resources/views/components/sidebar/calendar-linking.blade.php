@props([ "calendar" ])

@push('head')
    <script lang="js">

        function calendarLinkingSection($data){
            return {

                expanded: {},

                link_data: $data.link_data,
                dynamic_data: $data.dynamic_data,
                static_data: $data.static_data,

                newLinkedCalendar: "",

                owned_calendars: [],
                unlinked_calendars: [],
                linked_calendars: [],
                new_linked_calendars: [],

                load_owned_calendars(){
                    $.ajax({
                        url:window.apiurl+"/calendar/"+window.calendar.hash+"/owned",
                        type: "get",
                        dataType: 'json',
                        data: {},
                        success: (calendars) => {

                            this.owned_calendars = Object.values(calendars)
                                .filter(calendar => calendar.hash !== window.calendar.hash)
                                .map(calendar => {
                                    if(calendar.parent_link_date){
                                        calendar.parent_link_date = JSON.parse(calendar.parent_link_date).map(num => Number(num));
                                    }
                                    return calendar;
                                });

                            this.unlinked_calendars = this.owned_calendars.filter(calendar => !calendar.parent_hash);

                            this.newLinkedCalendar = this.unlinked_calendars[0].hash;

                            this.linked_calendars = this.owned_calendars.filter((calendar) => {
                                return calendar.parent_hash === window.calendar.hash;
                            });

                            this.new_linked_calendars = [];
                        },
                        error: (error) => {
                            $.notify(error);
                        }
                    });
                },

                addNewLinkedCalendar(hash){
                    const calendar = this.unlinked_calendars.find(calendar => calendar.hash === hash);
                    if(!calendar) return;

                    calendar.parent_link_date = [this.dynamic_data.year, this.dynamic_data.timespan, this.dynamic_data.day];

                    this.new_linked_calendars.push(calendar);

                    this.unlinked_calendars.splice(this.unlinked_calendars.indexOf(calendar), 1);
                },

                queryUnlink(calendar){

                    swal.fire({
                        title: "Unlinking Calendar",
                        html: "<p>Are you sure you want to break the link to this calendar?</p><p>This cannot be undone.</p>",
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, unlink',
                        cancelButtonText: 'Leave linked',
                        icon: "warning"
                    })
                    .then((result) => {
                        if(!result.dismiss) {
                            window.dispatchEvent(new CustomEvent('unlink-calendar', { detail: { calendar: clone(calendar) }}))
                        }
                    });

                },

                queryLink(calendar){

                    swal.fire({
                        title: "Linking Calendar",
                        html:"<p>Linking calendars will disable all structural inputs on both calendars (month lengths, week lengths, hours per day, minutes) so the link can be preserved. The link can be broken again at any point.</p>"+
                            "<p>Are you sure you want link and save this calendar?</p>",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, link and save calendar',
                        cancelButtonText: 'Leave unlinked',
                        icon: "info"
                    })
                    .then((result) => {
                        if(!result.dismiss) {
                            window.dispatchEvent(new CustomEvent('link-calendar', { detail: { calendar: clone(calendar) }}))
                        }
                    });
                },

                linkCalendar($event){

                    const calendar = $event.detail.calendar;

                    const epoch = window.calendar.getEpochForDate(...calendar.parent_link_date).epoch;

                    show_loading_screen();

                    $.ajax({
                        url:window.baseurl+"calendars/"+calendar.hash,
                        type: "post",
                        dataType: 'json',
                        data: {
                            _method: "PATCH",
                            parent_hash: window.calendar.hash,
                            parent_link_date: calendar.parent_link_date,
                            parent_offset: epoch
                        },
                        success: function(){
                            window.location.reload();
                        },
                        error: function(error){
                            $.notify(error);
                        }
                    });

                },

                unlinkCalendar($event){

                    const calendar = $event.detail.calendar;

                    show_loading_screen();

                    $.ajax({
                        url:window.baseurl+"calendars/"+calendar.hash,
                        type: "post",
                        dataType: 'json',
                        data: {
                            _method: "PATCH",
                            parent_hash: "",
                            parent_link_date: "",
                            parent_offset: "",
                        },
                        success: function(){
                            window.location.reload();
                        },
                        error: function(error){
                            $.notify(error);
                        }
                    });

                }
            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-linking"
    name="linking"
    title="Calendar Linking"
    icon="fa fa-link"
    tooltip-title="More Info: Calendar Linking"
    helplink="calendar_linking"
    @click.once="$dispatch('load-owned-calendars')"
>

    <div class='row no-gutters'>
        <p class="m-0">Calendar linking allows you to connect two calendar's dates, making one follow the other!</p>
        <p><small>This is a complex feature, we recommend you check out the article on <a href='{{ helplink('calendar_linking') }}' target="_blank"><i class="icon-question-sign"></i> Calendar Linking</a>.</small></p>
    </div>

    <hr class="my-2">

    <div
        x-data="calendarLinkingSection($data)"
        @load-owned-calendars.window="load_owned_calendars"
        @link-calendar.window="linkCalendar"
        @unlink-calendar.window="unlinkCalendar"
    >

        @if(Auth::user()->can('link', $calendar))

            @if($calendar->parent != null)

                <div class='row no-gutters my-1' x-show="link_data.has_parent">
                    <p class='m-0'>This calendar is already linked to a <a href='/calendars/{{ $calendar->parent->hash }}/edit' target="_blank">parent calendar</a>. Before linking any calendars to this one, you must unlink this calendar from its parent.</p>
                </div>

            @else

                <div class='row no-gutters my-1 input-group'>
                    <select class='form-control' x-model="newLinkedCalendar">
                        <template x-for="unlinked_calendar in unlinked_calendars">
                            <option
                                :value="unlinked_calendar.hash"
                                x-text="unlinked_calendar.hash === window.calendar.hash ? 'This calendar' : unlinked_calendar.name"
                                :disabled="unlinked_calendar.parent_hash === window.calendar.hash"
                            ></option>
                        </template>
                    </select>
                    <div class="input-group-append">
                        <button type="button" class="btn btn-accent" @click="addNewLinkedCalendar(newLinkedCalendar)">Add</button>
                    </div>
                </div>

                <div class="row no-gutters my-1" x-show="new_linked_calendars.length">
                    New link:
                </div>

                <div class='sortable mt-1'>

                    <template x-for="(new_linked_calendar, index) in new_linked_calendars">

                        <div class='sortable-container list-group-item'>

                            <div class='main-container'>
                                <div class="input-group">
                                    <div class='name-container text-center'>
                                        <a :href="`${window.baseurl}calendars/${new_linked_calendar.hash}/edit`" target="_blank" x-text="new_linked_calendar.name"></a>
                                    </div>
                                </div>
                            </div>

                            <div class='container pb-2'>

                                <div class='row my-2 no-gutters'>
                                    <div class='col'>
                                        <strong>Relative Start Date:</strong>

                                        <div class='date_control'>
                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <input type='number' step="1.0" class='date form-control small-input' x-model="new_linked_calendar.parent_link_date[0]"/>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' x-model="new_linked_calendar.parent_link_date[1]">
                                                        <template x-for="(timespan, index) in window.calendar.getTimespansInYear(new_linked_calendar.parent_link_date[1])">
                                                            <option :value="timespan.index" :selected="timespan.index === new_linked_calendar.parent_link_date[1]" x-text="timespan.name"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' x-model="new_linked_calendar.parent_link_date[2]">
                                                        <template x-for="(day, index) in window.calendar.getDaysForTimespanInYear(new_linked_calendar.parent_link_date[0], new_linked_calendar.parent_link_date[1])">
                                                            <option :selected="(index+1) === new_linked_calendar.parent_link_date[2]" x-text="'Day ' + day"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <button type='button' class='btn btn-primary full' @click="queryLink(new_linked_calendar)">Link Calendar</button>
                                </div>

                            </div>

                        </div>

                    </template>

                </div>

                <hr class="my-2" x-show="new_linked_calendars.length">

                <div class='sortable'>

                    <template x-for="(linked_calendar, index) in linked_calendars">

                        <div class='sortable-container list-group-item'>

                            <div class='main-container'>
                                <i class='expand' :class="expanded[linked_calendar.hash] ? 'icon-collapse' : 'icon-expand'" @click="expanded[linked_calendar.hash] = !expanded[linked_calendar.hash]"></i>
                                <div class="input-group">
                                    <div class='name-container'>
                                        <a :href="`${window.baseurl}calendars/${linked_calendar.hash}/edit`" target="_blank" x-text="linked_calendar.name"></a>
                                    </div>
                                </div>
                            </div>

                            <div class='container pb-2' x-show="expanded[linked_calendar.hash]">

                                <div class='row my-2 no-gutters'>
                                    <div class='col'>
                                        <strong>Relative Start Date:</strong>

                                        <div class='date_control'>
                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <input type='number' step="1.0" class='date form-control small-input' disabled x-model="linked_calendar.parent_link_date[0]"/>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' disabled>
                                                        <template x-for="(timespan, index) in window.calendar.getTimespansInYear(linked_calendar.parent_link_date[1])">
                                                            <option :selected="timespan.index === linked_calendar.parent_link_date[1]" x-text="timespan.name"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class='row my-2'>
                                                <div class='col'>
                                                    <select type='number' class='date custom-select form-control' disabled>
                                                        <template x-for="(day, index) in window.calendar.getDaysForTimespanInYear(linked_calendar.parent_link_date[0], linked_calendar.parent_link_date[1])">
                                                            <option :selected="(index+1) === linked_calendar.parent_link_date[2]" x-text="'Day '+day"></option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class='row no-gutters my-1'>
                                    <button type='button' class='btn btn-danger full' @click="queryUnlink(linked_calendar)">Unlink Calendar</button>
                                </div>

                            </div>

                        </div>

                    </template>

                </div>

                <div class='row no-gutters my-1'>
                    <button type='button' class='btn btn-sm btn-secondary full' @click="load_owned_calendars()">Refresh</button>
                </div>

            @endif

        @else

            <div class='row no-gutters my-1'>
                <p>Link calendars together, and make this calendar's date drive the date of other calendars!</p>
                <p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe now</a> to unlock this feature!</p>
            </div>

        @endif

    </div>

</x-sidebar.collapsible>
