@props([ "calendar" ])

@push('head')
    <script lang="js">

        function clockSection($data){
            return {
                clock: $data.static_data.clock
            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-clock"
    name="clock"
    title="Clock"
    icon="fa fa-clock"
    tooltip-title="More Info: Clock"
    helplink="clock"
    @change="moveClock($event, 'clock')"
>

    <div x-data="clockSection($data)">

        <div id="alt_clock_container"></div>

        <div class='row'>
            <div class='col-3 bold-text'>Enable:</div>
            <div class='col-3 text-right'>
                @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                    {{ Arr::get($calendar->static_data, 'clock.enabled') ? "Yes" : "No" }}
                @else
                    <label class="custom-control custom-checkbox center-text">
                        <input type="checkbox" class="custom-control-input" x-model="clock.enabled">
                        <span class="custom-control-indicator"></span>
                    </label>
                @endif
            </div>
            <div class='render_clock col-3 bold-text' x-show="clock.enabled" x-transition.duration.200ms>Render:</div>
            <div class='render_clock col-3 text-right' x-show="clock.enabled" x-transition.duration.200ms>
                <label class="custom-control custom-checkbox center-text">
                    <input type="checkbox" class="custom-control-input" x-model="clock.render">
                    <span class="custom-control-indicator"></span>
                </label>
            </div>
        </div>

        <div x-show="clock.enabled" x-transition.duration.200ms>

            <div class='row mt-2'>
                <div class='col-6 bold-text'>
                    Hours:
                </div>
                <div class='col-6 pl-0 bold-text'>
                    Minutes:
                </div>
            </div>

            <div class='row mb-2'>
                <div class='col-6 input-group'>
                    @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                        {{ Arr::get($calendar->static_data, 'clock.hours') }}
                    @else
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-sm btn-danger' @click="clock.hours = Math.max(1, clock.hours-1)"><i class="icon-minus"></i></button>
                        </div>
                        <input type='number' class='form-control form-control-sm' min='1' x-model.number="clock.hours">
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-sm btn-success' @click="clock.hours++"><i class="icon-plus"></i></button>
                        </div>
                    @endif
                </div>

                <div class='col-6 input-group pl-0'>
                    @if(request()->is('calendars/*/edit') && $calendar->isLinked())
                        {{ Arr::get($calendar->static_data, 'clock.minutes') }}
                    @else
                        <div class='input-group-prepend'>
                            <button type='button' class='btn btn-sm btn-danger' @click="clock.minutes = Math.max(1, clock.minutes-1)"><i class="icon-minus"></i></button>
                        </div>
                        <input type='number' class='form-control form-control-sm' min='1' x-model.number="clock.minutes">
                        <div class='input-group-append'>
                            <button type='button' class='btn btn-sm btn-success' @click='clock.minutes++'><i class="icon-plus"></i></button>
                        </div>
                    @endif
                </div>
            </div>

            <div class='row mt-2' x-show="clock.render" x-transition.duration.200ms>
                <div class='col-6 bold-text'>
                    Offset hours:
                </div>
                <div class='col-6 pl-0 bold-text'>
                    Crowding:
                </div>
            </div>

            <div class='row mb-1' x-show="clock.render" x-transition.duration.200ms>

                <div class='col-6 input-group'>
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-sm btn-danger' @click='clock.offset--'><i class="icon-minus"></i></button>
                    </div>

                    <input class='form-control form-control-sm static_input' type='number' x-model="clock.offset">

                    <div class='input-group-append'>
                        <button type='button' class='btn btn-sm btn-success' @click='clock.offset++'><i class="icon-plus"></i></button>
                    </div>
                </div>

                <div class='col-6 pl-0 input-group'>
                    <div class='input-group-prepend'>
                        <button type='button' class='btn btn-sm btn-danger' @click='clock.crowding = Math.max(0, clock.crowding-1)'><i class="icon-minus"></i></button>
                    </div>

                    <input class='form-control form-control-sm static_input' type='number' min='0' x-model="clock.crowding">

                    <div class='input-group-append'>
                        <button type='button' class='btn btn-sm btn-success' @click='clock.crowding++'><i class="icon-plus"></i></button>
                    </div>
                </div>

            </div>

        </div>

    </div>

    @if(request()->is('calendars/*/edit') && $calendar->isLinked())
        <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the clock?</a></p>
    @endif

</x-sidebar.collapsible>