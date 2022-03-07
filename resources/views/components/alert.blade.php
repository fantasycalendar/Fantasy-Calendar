@props(['type' => 'notice', 'icon' => null, 'color' => null, 'padding' => 4])

@php
    $styles = [
        'warning' => [
            'color' => 'yellow',
            'icon' => 'fa fa-exclamation-triangle'
        ],
        'notice' => [
            'color' => 'blue',
            'icon' => 'fa fa-info-circle'
        ],
        'danger' => [
            'color' => 'red',
            'icon' => 'fa fa-times-circle'
        ],
        'success' => [
            'color' => 'green',
            'icon' => 'fa fa-check-circle'
        ]
    ];
    $color = $color ?? $styles[$type]['color'];
    $icon = $icon ?? $styles[$type]['icon'];
@endphp

<div {{ $attributes->except('x-text')->merge(['class' => "bg-$color-100 border-l-4 border-$color-400 dark:border-$color-600 dark:bg-$color-900 p-$padding"]) }}>
    <div class="flex">
        <div class="flex-shrink-0">
            <i class="{{ $icon }} text-{{ $color }}-400 dark:text-{{ $color }}-300"></i>
        </div>
        <div class="ml-3 flex-grow">
            <div class="text-sm text-{{ $color }}-700 dark:text-{{ $color }}-300" @if($attributes->has('x-text')) x-text="{{ $attributes->get('x-text') }}" @endif>
                {{ $slot }}
            </div>
        </div>
    </div>
</div>
