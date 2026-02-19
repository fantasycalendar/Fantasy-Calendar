@props([
	'calendar' => null,
	'contains' => null,
	'step' => null,
	'icon' => null,
	'premium_feature' => false,
	'open' => false
])

@php($contains_clean = Str::replace("-", " ", $contains))

<div
    x-data="{
        open: {{ $open ? 'true' : 'false' }},
        show: true,
        step: Number(@js($step)),
        toggle() {
            this.open = !this.open;
            $dispatch('{{ Str::slug($contains) }}-toggled', this.open);
        },
        evaluate_calendar_step($event) {
            this.show = $event.detail.done || (this.step && $event.detail.step >= this.step);
            if(this.step && $event.detail.step === this.step){
                this.open = true;
            }
        }
    }"
    @calendar-step-changed.window="evaluate_calendar_step"
    x-show="show"
    x-cloak
    @class([
        'wrap-collapsible card',
        $step ? "step-{$step}-step" : null,
        "settings-" . $contains
    ])
    >
    <div class="flex justify-between items-center cursor-pointer px-2.5 py-1.5 hover:bg-gray-200/75 hover:dark:bg-gray-600"
        @click="toggle"
        :class="{
            'bg-gray-50 dark:bg-gray-700': !open ,
            'bg-gray-100 dark:bg-gray-600/80': open,
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

    <div x-data="{{ Str::snake($contains_clean) }}_collapsible"
        @calendar-loaded.window="load"
        @calendar-updated.window="load"
        x-show="open"
        class="p-2.5"
    >
        <x-dynamic-component :calendar="$calendar ?? null" :component="Str::kebab($contains_clean) . '-collapsible'"></x-dynamic-component>
    </div>
</div>
