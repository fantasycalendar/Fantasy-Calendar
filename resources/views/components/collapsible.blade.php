@props(['calendar' => null, 'contains' => null, 'step' => null, 'icon' => null])

<div @class([
        'wrap-collapsible card',
        $step ? "step-{$step}-step" : null,
        "settings-" . $contains
    ])>
    <input id="collapsible_{{ $contains }}" class="toggle" type="checkbox">
    <label for="collapsible_{{ $contains }}" class="lbl-toggle py-2 pr-3 card-header">
        <i class="mr-2 fas {{ $icon }}"></i> {{ Str::headline($contains) }}
        <a target="_blank"
            title='More Info: Months & Intercalaries'
            href='{{ helplink('months') }}'
            class="wiki protip">
            <i class="fa fa-question-circle"></i>
        </a>
    </label>

    <div class="collapsible-content card-body" x-data="{{ $contains }}_collapsible">
        <x-dynamic-component :calendar="$calendar ?? null" :component="$contains . '-collapsible'"></x-dynamic-component>
    </div>
</div>
