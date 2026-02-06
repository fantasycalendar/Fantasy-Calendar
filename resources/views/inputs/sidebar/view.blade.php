<div id="input_container"
    :class='{
        "w-0 overflow-hidden p-0 min-w-0 max-w-0 m-0": !sidebar_open,
        "d-print-none relative overflow-y-auto order-1 max-h-full w-screen md:max-w-[400px] md:min-w-[400px] flex-grow": sidebar_open,
    }'>
    @include('inputs.sidebar.header')

    <div class='title-text text-center mt-0 mb-0'>{{ $calendar->name }}</div>
    <div class="text-center mt-0 mb-3">By {{ $calendar->user->username }}</div>

    <div class="accordion mt-3">
        <div class='d-flex flex-column mx-3 my-2'>
            <div class="input-group">
                <input type="text" x-ref="share_url_input" class="form-control form-control-sm share-body" readonly value="{{ url()->current() }}"/>
                <div class="input-group-append">
                    <button x-on:click="() => {
                        $refs.share_url_input.select();
                        document.execCommand('copy');
                        $dispatch('notify', {
                            content: 'Copied to clipboard!',
                            type: 'success'
                        });
                    }" id="btn_share" type="button" class='btn btn-sm btn-secondary btn-block'>Copy URL</button>
                </div>
            </div>
        </div>

        <div class='d-flex my-3 mx-3'>
            @if($calendar->owned)
            <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class="btn w-100 btn-sm btn-success mr-2">
                Edit
            </a>
            @endif
            <button type='button' onclick="print()" class="btn w-100 btn-sm btn-secondary">
                Print
                </a>
        </div>


        <!---------------------------------------------->
        <!---------------- CURRENT DATE ---------------->
        <!---------------------------------------------->

        <x-collapsible :calendar="$calendar" contains="Current Date" icon="fa-hourglass-half" open></x-collapsible>

        @can('update', $calendar)
        <!---------------------------------------------->
        <!------------------ LOCATIONS ----------------->
        <!---------------------------------------------->

            <div class="d-flex flex-column mx-3 mt-3">
                <x-current-location-select />
            </div>
        @endcan

        @if(Auth::check() && $calendar->isLinked())
        <!---------------------------------------------->
        <!------------------ LINKING ------------------->
        <!---------------------------------------------->

        <div class="d-flex flex-column mx-3 mt-3">
            <div class="separator w-full mb-3"></div>

            @if($calendar->isParent())
            <h5>
                Linked calendars:
            </h5>

            <ul>
                @foreach($calendar->children as $child)
                <li><a href='/calendars/{{ $child->hash }}' target="_blank">{{ $child->name }}</a></li>
                @endforeach
            </ul>
            @endif

            @if($calendar->isChild())
            Parent Calendar: <a href='/calendars/{{ $calendar->parent->hash }}' target="_blank">{{ $calendar->parent->name }}</a>
            @endif
        </div>
        @endif
    </div>

    <div class="text-center w-full mt-5" style="justify-self: end;">
        <small class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd <br> <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></small>
    </div>
</div>


<div id="calendar_container">
    <x-calendar-year-header></x-calendar-year-header>

    @include('layouts.calendar-' . (isset($calendar) ? $calendar->setting('layout', 'grid') : 'grid'))
</div>
