<div id="input_container"
    :class='{
        "w-0 overflow-hidden p-0 min-w-0 max-w-0 m-0": !sidebar_open,
        "d-print-none relative overflow-y-auto order-1 max-h-full w-screen md:max-w-[400px] md:min-w-[400px] flex-grow": sidebar_open,
    }'>
    @include('inputs.sidebar.header')

    <div class='title-text text-center mt-0 mb-0'>{{ $calendar->name }}</div>
    <div class="text-center mt-0 mb-3">By {{ $calendar->user->username }}</div>

    <div class="accordion mt-3">
        <div class="flex gap-2 mx-3 my-2"
            x-data="{
                label: 'Share',
                icon: 'fa-share-alt',
                sharing: false,
                async share() {
                    if (this.sharing) return;

                    let url = @js(url()->current());
                    let shared = false;

                    if (navigator.share) {
                        try {
                            await navigator.share({ title: @js($calendar->name), url: url });
                            this.label = 'Shared!';
                            shared = true;
                        } catch (e) {
                            // User cancelled or share failed, fall back to clipboard
                        }
                    }

                    if (!shared && navigator.clipboard) {
                        try {
                            await navigator.clipboard.writeText(url);
                            this.label = 'Copied!';
                            shared = true;
                        } catch (e) {}
                    }

                    if (!shared) {
                        try {
                            let input = document.createElement('input');
                            input.value = url;
                            document.body.appendChild(input);
                            input.select();
                            shared = document.execCommand('copy');
                            document.body.removeChild(input);
                            if (shared) this.label = 'Copied!';
                        } catch (e) {}
                    }

                    if (shared) {
                        this.icon = 'fa-check';
                        this.sharing = true;
                        $dispatch('notify', { content: this.label.replace('!', '') + ' successfully!', type: 'success' });
                        setTimeout(() => {
                            this.label = 'Share';
                            this.icon = 'fa-share-alt';
                            this.sharing = false;
                        }, 2000);
                    }
                }
            }"
        >
            <button type="button" class="btn btn-sm btn-secondary w-full" x-on:click="share()">
                <i class="fa" :class="icon"></i> <span x-text="label"></span>
            </button>
            @if($calendar->owned)
            <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}" class="btn btn-sm btn-success w-full">
                <i class="fa fa-edit"></i> Edit
            </a>
            @endif
            <button type="button" onclick="print()" class="btn btn-sm btn-secondary w-full">
                <i class="fa fa-print"></i> Print
            </button>
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

    @include('layouts.calendar')
</div>
