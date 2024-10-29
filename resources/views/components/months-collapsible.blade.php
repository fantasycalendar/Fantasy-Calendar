@props(['calendar' => null])

@if(request()->is('calendars/*/edit') && $calendar->isLinked())

    <ul class="list-group">

        @php
            $timespans = Arr::get($calendar->static_data, 'year_data.timespans');
        @endphp

        @foreach ($timespans as $timespan)
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ $timespan['name'] }}</strong>
                </div>
                @if($timespan['interval'] > 1)
                    <div class="d-flex justify-content-start align-items-center mt-2">
                        <div class='mr-4'>
                            Interval: {{ $timespan['interval'] }}
                        </div>
                        <div>
                            Offset: {{ $timespan['offset'] }}
                        </div>
                    </div>
                @endif
                @if(Arr::get($timespan, 'week'))
                    <div class="mt-2">
                        Custom week:
                        <ul>
                            @foreach ($timespan['week'] as $weekday)
                                <li style="list-style-type: circle; font-size:0.8rem;">{{ $weekday }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </li>
        @endforeach

    </ul>

    <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the months?</a></p>

@else

    <div class='row bold-text mb-3'>
        <div class="col">
            New month:
        </div>
    </div>

    <div class='add_inputs timespan row no-gutters input-group'>

        <input type='text' id='timespan_name_input' class='form-control name' placeholder='Name'>

        <select id='timespan_type_input' class='custom-select form-control type'>
            <option selected value='month'>Month</option>
            <option value='intercalary'>Intercalary</option>
        </select>

        <div class="input-group-append">
            <button type='button' class='btn btn-primary add full'><i class="fa fa-plus"></i></button>
        </div>
    </div>

    <div class="row no-gutters mb-2">
        <button class="full btn btn-secondary" @click="reordering = true" x-show="!reordering">
            <i class="fa fa-arrows-alt-v"></i> Change order
        </button>
        <button class="full btn btn-secondary" @click="reordering = false" x-show="reordering">
            <i class="fa fa-check"></i> Done
        </button>
    </div>
    <div class="row sortable-header timespan_sortable_header hidden">
        <div class='col-6' style="padding-left:55px">Name</div>
        <div class='col-6' style="padding-left:20%;">Length</div>
    </div>

    <div class='sortable list-group' id='timespan_sortable'></div>


@endif

