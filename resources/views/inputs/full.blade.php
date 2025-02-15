<div id="input_container" class='d-print-none' x-cloak x-data>
    @include('inputs.sidebar.header')

    @yield('label')

    <div class='wrap-collapsible step-hide'>
        <div class="view-tabs btn-group d-flex mb-2 w-100">
            <button type="button" data-pt-position='top' data-pt-title='What you, the owner, will always see'
                    data-view-type='owner' class="protip owner w-100 btn btn-sm btn-primary">Owner View
            </button>
            <button type="button" data-pt-position='top'
                    data-pt-title='A simulated view of what guests with the link to this calendar will see'
                    data-view-type='player' class="protip player w-100 btn btn-sm btn-secondary">Guest View
            </button>
            <button type="button" data-pt-position='top' data-pt-title='Graphs showing the weather curves'
                    data-view-type='weather' class="protip weather w-100 btn btn-sm btn-secondary">Climate view
            </button>
        </div>
    </div>

    <div class='wrap-collapsible step-hide'>
        <div class="d-flex mb-2 w-100">
            <label class="row no-gutters setting border rounded py-2 px-3 protip w-100" data-pt-position="right"
                   data-pt-title="If unchecked, you will be prompted to apply changes after making them, instead of loading the calendar every time.">
                <div class='col'>
                    <input type='checkbox' class='margin-right' data='settings' id='apply_changes_immediately' checked>
                    <span>
                        Apply changes immediately
                    </span>
                </div>
            </label>
        </div>
    </div>

    <div class="accordion">
        <x-collapsible :calendar="$calendar" contains="Statistics" icon="fa-chart-pie" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Current Date" icon="fa-hourglass-half"></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Clock" icon="fa-clock" done></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar" contains="Real-Time Advancement" icon="fa-history"
                           premium_feature="true" done></x-collapsible>
        @endif

        <x-collapsible :calendar="$calendar" contains="Weekdays" step="2" icon="fa-calendar-week" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Months" step="3" icon="fa-calendar-alt"></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Leap Days" icon="fa-calendar-day" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Eras" icon="fa-infinity" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Moons" icon="fa-moon" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Seasons" icon="fa-snowflake" wip></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Weather" icon="fa-cloud-sun-rain" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Locations" icon="fa-compass" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Cycles" icon="fa-redo" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Event Categories" icon="fa-th-list" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Events" icon="fa-calendar-check" done></x-collapsible>

        <x-collapsible :calendar="$calendar" contains="Settings" icon="fa-cog" done></x-collapsible>

        @if(request()->is('calendars/*/edit'))
            <x-collapsible :calendar="$calendar" contains="User Management" icon="fa-user"
                           premium_feature="true" wip></x-collapsible>

            <x-collapsible :calendar="$calendar" contains="Calendar Linking" icon="fa-link"
                           premium_feature="true"></x-collapsible>
        @endif
    </div>

    <div class="copyright text-center">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd <br>
            <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> -
            <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a>
        </small>
    </div>
</div>

<div id="calendar_container">

    <div x-data="{
        errors: {},
        hasErrors: false,
        addErrors($event) {
            this.errors[$event.detail.key] = $event.detail.errors;
        },
        removeErrors($event) {
            if(this.errors[$event.detail.key]){
                delete this.errors[$event.detail.key];
            }
        },
        getErrors(){
            // Unpack array of arrays
            return [].concat(...Object.values(this.errors));
        }
    }"
         @calendar-validation-failed.window="addErrors"
         @calendar-validation-succeeded.window="removeErrors"
         x-show="getErrors().length"
         x-cloak
         class='flexible_background blurred_background'>
        <div class="error">
            <ol>
                <template x-for="error in getErrors()">
                    <li x-text="error"></li>
                </template>
            </ol>
        </div>
    </div>

    <div id="reload_background"
         class='flexible_background blurred_background d-flex flex-column justify-content-center hidden d-print-none'>
        <div class='p-2 text-white'>You have made changes to your calendar.</div>
        <div class='p-2'>
            <button type='button' class='btn btn-primary' id='apply_changes_btn'>Update preview</button>
        </div>
    </div>

    <div id="top_follower" :class="{ 'single_month': apply == 'single_month' }"
         x-data="{ apply: '', toggle() { window.toggle_sidebar(); } }"
         @layout-change.window="apply = $event.detail.apply">


        <div class='flex-shrink-1 is-active' id='input_collapse_btn'>
            <button class="btn btn-secondary px-3">
                <i class="fa fa-bars"></i>
            </button>
        </div>

        <div class='parent_button_container hidden d-print-none'>
            <div class='container d-flex h-100 p-0'>
                <div class='col justify-content-center align-self-center full'>
                    <button class='btn btn-danger full' disabled id='rebuild_calendar_btn'>Parent data changed -
                        reload
                    </button>
                </div>
            </div>
        </div>

        <div class='btn_container hidden'>
            <button class='btn btn-outline-secondary btn_preview_date hidden d-print-none sub_year' disabled
                    fc-index='year'
                    value='-1'>&lt; Year
            </button>
            <button class='btn btn-outline-secondary btn_preview_date hidden d-print-none sub_month' disabled
                    fc-index='timespan'
                    value='-1'>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-left"></i></span>
            </button>
        </div>

        <div class='reset_preview_date_container left hidden'>
            <button type='button' class='btn btn-success reset_preview_date protip d-print-none'
                    data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar'>&lt;
                Current
            </button>
        </div>

        <div class="follower_center flex-grow-1">
            <div id='top_follower_content'>
                <div class='year'></div>
                <div class='cycle'></div>
            </div>
        </div>

        <div class='reset_preview_date_container right hidden'>
            <button type='button' class='btn btn-success reset_preview_date protip d-print-none'
                    data-pt-position="bottom" data-pt-title='Takes you back to the current date of this calendar'>
                Current &gt;
            </button>
        </div>

        <div class='btn_container hidden'>
            <button class='btn btn-outline-secondary btn_preview_date hidden d-print-none add_year' disabled
                    fc-index='year'
                    value='1'>Year >
            </button>
            <button class='btn btn-outline-secondary btn_preview_date hidden d-print-none add_month' disabled
                    fc-index='timespan'
                    value='1'>
                <span x-cloak x-show="apply == 'single_month'"><i class="fa fa-arrow-right"></i></span>
            </button>
        </div>

    </div>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))

    <div id="weather_container" class="hidden">

        <div id='day_length' class='hidden'>
            <h3 class='text-center mt-3'>Sunrise and Sunset</h3>
            <canvas class='chart'></canvas>
        </div>

        <div id='temperature' class='hidden'>
            <h3 class='text-center mt-3'>Temperature</h3>
            <canvas class='chart'></canvas>
        </div>

        <div id='precipitation' class='hidden'>
            <h3 class='text-center mt-3'>Precipitation</h3>
            <canvas class='chart'></canvas>
        </div>

    </div>

</div>
<div id='html_edit'></div>
