@props(['calendar' => null])

<x-clock-canvas name="clock"></x-clock-canvas>

<div class='grid grid-cols-2 gap-4'>
    <div class="flex justify-between">
        <div>Enable:</div>

        <div class='text-right'>
            @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                <span>{{ Arr::get($calendar->static_data, 'clock.enabled') ? "Yes" : "No" }}</span>
            @else
            <label class="custom-control custom-checkbox text-center">
                <input type="checkbox" class="custom-control-input" x-model="clock.enabled"/>
                <span class="custom-control-indicator"></span>
            </label>
            @endif
        </div>
    </div>

    <div class="flex justify-between" x-show="clock.enabled" x-transition>
        <div>Render:</div>

        <div class='text-right'>
            <label class="custom-control custom-checkbox text-center">
                <input type="checkbox" class="custom-control-input" x-model="clock.render"/>
                <span class="custom-control-indicator"></span>
            </label>
        </div>
    </div>
</div>

<div x-show="clock.enabled" x-transition class="grid grid-cols-2 gap-4">
    <div class="w-full">
        <div>
            Hours:
        </div>
        <div class='input-group'>
            @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                {{ Arr::get($calendar->static_data, 'clock.hours') }}
            @else
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-sm btn-danger' @click="clock.hours = Math.max(0, clock.hours - 1)">
                    <i class="fa fa-minus"></i>
                </button>
            </div>
            <input class='form-control form-control-sm' min='1' :value="clock.hours" @change="clock.hours = Math.max(1, Number($event.target.value))"/>
            <div class='input-group-append'>
                <button type='button' class='btn btn-sm btn-success' @click="clock.hours += 1">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
            @endif
        </div>
    </div>

    <div>
        <div>
            Minutes:
        </div>

        <div class='input-group pl-0'>
            @if(request()->is('calendars/*/edit') && $calendar->isLinked())
            {{ Arr::get($calendar->static_data, 'clock.minutes') }}
            @else
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-sm btn-danger' @click="clock.minutes = Math.max(1, clock.minutes - 1)">
                    <i class="fa fa-minus"></i>
                </button>
            </div>
            <input class='form-control form-control-sm' type='number' :value="clock.minutes" @change="clock.minutes = Math.max(1, Number($event.target.value))"/>
            <div class='input-group-append'>
                <button type='button' class='btn btn-sm btn-success' @click="clock.minutes += 1">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
            @endif
        </div>
    </div>



    <div x-show="clock.render" x-transition>
        <div>
            Offset hours:
        </div>

        <div class='input-group'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-sm btn-danger' @click="clock.offset -= 1">
                    <i class="fa fa-minus"></i>
                </button>
            </div>

            <input class='form-control form-control-sm' type='number' :value="clock.offset" @change="clock.offset = Number($event.target.value)">

            <div class='input-group-append'>
                <button type='button' class='btn btn-sm btn-success' @click="clock.offset += 1">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
    </div>

    <div x-show="clock.render" x-transition>
        <div>
            Crowding:
        </div>

        <div class='pl-0 input-group'>
            <div class='input-group-prepend'>
                <button type='button' class='btn btn-sm btn-danger' @click="clock.crowding = Math.max(0, clock.crowding - 1)">
                    <i class="fa fa-minus"></i>
                </button>
            </div>

            <input class='form-control form-control-sm' type='number' :value="clock.crowding" @change="clock.crowding = Math.max(0, Number($event.target.value))">

            <div class='input-group-append'>
                <button type='button' class='btn btn-sm btn-success' @click="clock.crowding += 1">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
    </div>
</div>

@if(request()->is('calendars/*/edit') && $calendar->isLinked())
	<p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the clock?</a></p>
@endif
