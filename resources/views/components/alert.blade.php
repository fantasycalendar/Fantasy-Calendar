@php
    $styles = [
        'warning' => [
            'color' => 'yellow',
            'icon' => 'exclamation-triangle'
        ],
        'notice' => [
            'color' => 'blue',
            'icon' => 'info-circle'
        ],
        'danger' => [
            'color' => 'red',
            'icon' => 'times-circle'
        ],
        'success' => [
            'color' => 'green',
            'icon' => 'check-circle'
        ]
    ];
    $color = $styles[$type ?? 'notice']['color'];
    $icon = $styles[$type ?? 'notice']['icon'];
@endphp

<div {{ $attributes->merge(['class' => "bg-$color-100 border-l-4 border-$color-400 p-4"]) }}>
    <div class="flex">
        <div class="flex-shrink-0">
            <i class="fa fa-{{ $icon }} text-{{ $color }}-400"></i>
        </div>
        <div class="ml-3">
            <p class="text-sm text-{{ $color }}-700">
                {{ $slot }}
            </p>
        </div>
    </div>
</div>
