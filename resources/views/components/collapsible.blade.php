@props(['calendar' => null, 'contains' => null, 'step' => null, 'icon' => null])

<div @class([
        'wrap-collapsible card',
        $step ? "step-{$step}-step" : null,
        "settings-" . $contains
    ])>
    <input id="collapsible_{{ $contains }}" class="toggle" type="checkbox">
    <label for="collapsible_{{ $contains }}" class="lbl-toggle py-2 pr-3 card-header">
        <i class="mr-2 fas {{ $icon }}"></i> {{ $contains }}

        <!-- TODO: make sure the "contains" values match our helpdocs page links -->
        <a target="_blank"
            title='View helpdocs'
            href='{{ helplink(Str::slug($contains)) }}'
            class="wiki">
            <i class="fa fa-question-circle"></i>
        </a>
    </label>

    <div class="collapsible-content card-body"
        x-data="{{ Str::snake($contains) }}_collapsible"
        x-init="$nextTick(() => load(window.static_data))"
        @calendar-loaded.window="$nextTick(() => load(window.static_data))"
        @calendar-structure-changed.window="$nextTick(() => load(window.static_data))">
        <x-dynamic-component :calendar="$calendar ?? null" :component="Str::kebab($contains) . '-collapsible'"></x-dynamic-component>
    </div>
</div>
