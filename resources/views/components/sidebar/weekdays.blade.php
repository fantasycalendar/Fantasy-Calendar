@props([ "calendar" ])

@push('head')
    <script lang="js">

        function weekdayList($data){

            return {

                weekdayName: "",
                weekdays: $data.static_data.year_data.global_week,
                deleting: null,

                add(name){
                    this.weekdays.push(name || `Weekday ${this.weekdays.length}`);
                },

                remove(index){
                    this.weekdays.splice(index, 1);
                }
            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-weekdays step-2-step"
    name="globalweek"
    title="Weekdays"
    icon="fas fa-calendar-week"
    tooltip-title="More Info: Weekdays"
    helplink="weekdays"
>

    <div class='row center-text hidden' id='overflow_explanation'>
        This calendar has a custom week in some months or a leap day is adding a week-day, this will disable overflows between months, because it makes no sense for two weeks that do not go together to overflow into each other. Sorry.
    </div>

    <div class='row protip month_overflow_container' data-pt-position="right" data-pt-title='Enabling this will continue the week in the next month, and disabling overflow will restart the week so that each month starts with the first week day.'>
        <div class='col-8 pr-1 bold-text'>
            Overflow weekdays:
        </div>
        @if(request()->is('calendars/*/edit') && $calendar->isLinked())
            {{ Arr::get($calendar->static_data, 'year_data.overflow') ? "Enabled" : "Disabled" }}
        @else
            <div class='col-4'>
                <label class="custom-control custom-checkbox right-text">
                    <input type="checkbox" class="custom-control-input" x-model='static_data.year_data.overflow'>
                    <span class="custom-control-indicator"></span>
                </label>
            </div>
        @endif
    </div>

    <div class='row no-gutters my-2'>
        <div class='separator'></div>
    </div>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())

        <ul class="list-group">
            <template x-for="weekday in static_data.year_data.global_week">
                <li class="list-group-item" x-text="weekday"></li>
            </template>
        </ul>

    @else

    @endif

    <div id='first_week_day_container' class='hidden'>

        <div class='row no-gutters my-2'>
            <div class='separator'></div>
        </div>

        <div class='row no-gutters my-2'>
            <div class='col'>
                <p class='bold-text m-0'>First week day:</p>
                @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                    <ul class="list-group">
                        <li class="list-group-item">{{ Arr::get($calendar->static_data, 'year_data.global_week')[Arr::get($calendar->static_data, 'year_data.first_day')-1] }}</li>
                    </ul>
                @else
                    <select type='number' class='form-control static_input protip' data-pt-position="right" data-pt-title='This sets the first weekday of the first year.' id='first_day' data='year_data' fc-index='first_day'></select>
                @endif
            </div>
        </div>
    </div>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())
        <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the weekdays?</a></p>
    @endif


    <div x-data="weekdayList($data)">

        <div class='row no-gutters mt-2 bold-text'>
            <div class="col">
                New weekday:
            </div>
        </div>

        <div class='row no-gutters add_inputs global_week'>
            <div class='col'>
                <input type='text' class='form-control name' x-model="weekdayName" placeholder='Weekday name'>
            </div>
            <div class='col-auto'>
                <button type='button' class='btn btn-primary add' @click="add(weekdayName)"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class="sortable list-group">
            <template x-for="(weekday, index) in weekdays">
                <div class='sortable-container list-group-item'>
                    <div class='main-container' x-show="deleting !== weekday">
                        <div class='handle icon-reorder'></div>
                        <div class='name-container'>
                            <input type='text' class='form-control name-input small-input' x-model="weekday"/>
                            </div>
                        <div class='remove-spacer'></div>
                    </div>

                    <div class='remove-container'>
                        <div class='remove-container-text' x-show="deleting === weekday">Are you sure you want to remove this?</div>
                        <div class='btn_remove btn btn-danger icon-trash' @click="deleting = weekday" x-show="deleting !== weekday"></div>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === weekday"></div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === weekday"></div>
                    </div>
                </div>

            </template>
        </div>
    </div>

</x-sidebar.collapsible>