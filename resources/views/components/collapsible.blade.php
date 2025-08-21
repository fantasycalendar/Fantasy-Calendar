@props(['calendar' => null, 'contains' => null, 'step' => null, 'icon' => null, 'premium_feature' => false, 'polished' => false, 'done' => false, 'wip' => false])

@php($contains_clean = Str::replace("-", " ", $contains))

<div
    x-data="{
        open: false,
        toggle() {
            this.open = !this.open;

            $dispatch('{{ Str::slug($contains) }}-toggled', this.open);
        }
    }"
    @class([
        'wrap-collapsible card',
        $step ? "step-{$step}-step" : null,
        "settings-" . $contains
    ])
    >
    <div class="flex justify-between items-center cursor-pointer px-2.5 py-1.5 hover:bg-gray-400 hover:dark:bg-gray-600"
        @click="toggle"
        :class="{
            'bg-gray-300 dark:bg-gray-700': !open ,
            'bg-gray-400/80 dark:bg-gray-600/80': open,
        }"
    >
        <div class="flex items-center gap-2">
            <i class="w-5 text-center fas {{ $icon }}"></i>
            <span>{{ $contains }}</span>

        </div>

        <div class="grid place-items-center w-5 opacity-50 hover:opacity-100">
            @if($premium_feature && isset($calendar) && !$calendar->isPremium())
            <a href="{{ route('subscription.pricing') }}" target="_blank">
                <span style="color: rgb(56, 161, 105);" title="Subscriber-only feature">
                    <x-app-logo width="20" height="20"></x-app-logo>
                </span>
            </a>
            @else
                <a target="_blank"
                    title='View helpdocs'
                    href='{{ helplink(Str::slug($contains_clean)) }}'
                    class="text-gray-700 dark:text-gray-300">
                    <i class="fa fa-question-circle"></i>
                </a>
            @endif
        </div>
    </div>


    <!-- <label for="collapsible_{{ $contains }}" class="lbl-toggle py-2 pr-3 card-header"> -->
    <!--     <i class="mr-2 fas {{ $icon }}"></i> {{ $contains }} -->

    <!--     @if($premium_feature && isset($calendar) && !$calendar->isPremium()) -->
    <!--         <span style="color: rgb(56, 161, 105);" class="ml-2" title="Subscriber-only feature"> -->
    <!--             <x-app-logo class="hover-opacity" width="20" height="20"></x-app-logo> -->
    <!--         </span> -->
    <!--     @endif -->

    <!--     <!-1- TODO: make sure the "contains" values match our helpdocs page links -1-> -->
    <!--     <a target="_blank" -->
    <!--         title='View helpdocs' -->
    <!--         href='{{ helplink(Str::slug($contains_clean)) }}' -->
    <!--         class="wiki"> -->
    <!--         <i class="fa fa-question-circle"></i> -->
    <!--     </a> -->
    <!-- </label> -->

    <div x-data="{{ Str::snake($contains_clean) }}_collapsible"
        @calendar-loaded.window="load"
        @calendar-updated.window="load"
        x-show="open"
        class="p-2.5"
    >
        <x-dynamic-component :calendar="$calendar ?? null" :component="Str::kebab($contains_clean) . '-collapsible'"></x-dynamic-component>
    </div>
</div>
