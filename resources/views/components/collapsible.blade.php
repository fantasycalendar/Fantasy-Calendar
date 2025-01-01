@props(['calendar' => null, 'contains' => null, 'step' => null, 'icon' => null, 'premium_feature' => false, 'done' => false, 'wip' => false])

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

        @if($done)
            <!-- TODO: remove this and done property once we have converted all collapsibles -->
            <i class="fa fa-check" style="right: 40px; top: 10px; position: absolute; color: green;"></i>
        @endif

        @if($wip)
            <!-- TODO: remove this and done property once we have converted all collapsibles -->
            <i class="fa fa-question" style="right: 40px; top: 10px; position: absolute; color: yellow;"></i>
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
        @calendar-loaded.window="load"
        @calendar-structure-changed.window="load">
        <x-dynamic-component :calendar="$calendar ?? null" :component="Str::kebab($contains_clean) . '-collapsible'"></x-dynamic-component>
    </div>
</div>
