@props(['calendar' => null, 'contains' => null, 'step' => null, 'icon' => null, 'premium_feature' => false])

@php($contains_clean = Str::replace("-", " ", $contains))

<div @class([
        'wrap-collapsible card',
        $step ? "step-{$step}-step" : null,
        "settings-" . $contains
    ])>
    <input id="collapsible_{{ $contains }}" class="toggle" type="checkbox">
    <label for="collapsible_{{ $contains }}" class="lbl-toggle py-2 pr-3 card-header">
        <i class="mr-2 fas {{ $icon }}"></i> {{ $contains }}

			@if($premium_feature && isset($calendar) && !$calendar->isPremium())
				<span style="color: rgb(56, 161, 105);" class="ml-2 protip" data-pt-position="right"
							data-pt-title="Subscriber-only feature">
                            <x-app-logo class="hover-opacity" width="20" height="20"></x-app-logo>
                        </span>
			@endif

        <!-- TODO: make sure the "contains" values match our helpdocs page links -->
        <a target="_blank"
            title='View helpdocs'
            href='{{ helplink(Str::slug($contains_clean)) }}'
            class="wiki">
            <i class="fa fa-question-circle"></i>
        </a>
    </label>

    <div class="collapsible-content card-body"
        x-data="{{ Str::snake($contains_clean) }}_collapsible"
        x-init="$nextTick(() => load(window.static_data))"
        @calendar-loaded.window="$nextTick(() => load(window.static_data))"
        @calendar-structure-changed.window="$nextTick(() => load(window.static_data))">
        <x-dynamic-component :calendar="$calendar ?? null" :component="Str::kebab($contains_clean) . '-collapsible'"></x-dynamic-component>
    </div>
</div>
