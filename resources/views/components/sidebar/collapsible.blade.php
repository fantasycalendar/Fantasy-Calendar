@props([
    "name" => "timespans",
    "title" => "GOTTA PUT THIS",
    "icon" => "fas fa-calendar-alt",
    "tooltipTitle" => "",
    "helplink" => "",
])

<div {{ $attributes->merge([
    'class' => 'wrap-collapsible card'
]) }} x-data="{ opened: false }">

    <input id="collapsible_{{ $name }}" class="toggle" type="checkbox" x-model="opened">
    <label for="collapsible_{{ $name }}" class="lbl-toggle py-2 px-3 card-header">
        <i class="mr-2 {{ $icon }}"></i>
        {{ $title }}

        <a target="_blank" data-pt-position="right" data-pt-title='{{ $tooltipTitle }}' href='{{ helplink($helplink) }}' class="wiki protip">
            <i class="icon-question-sign"></i>
        </a>
    </label>
    <div class="collapsible-content card-body">

        {{ $slot }}

    </div>

</div>
