@props(['calendar' => null, 'contains' => null, 'step' => null])

<div @class(['wrap-collapsible card', $step ? "step-{$step}-step" : null, "settings-" . $contains ])>
    <x-dynamic-component :calendar="$calendar ?? null" :component="$contains . '-collapsible'"></x-dynamic-component>
</div>
