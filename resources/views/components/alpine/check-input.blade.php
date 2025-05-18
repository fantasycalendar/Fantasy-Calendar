@props(['disabledWhen' => null, 'disabledWrapperClasses' => null, 'enabledWrapperClasses' => null])

@php
    $inputAttributes = $attributes
        ->whereDoesntStartWith('id')
        ->whereDoesntStartWith('x-show')
        ->whereDoesntStartWith('wrapper');
@endphp

<div class='form-check py-2 border rounded {{ $attributes->get('wrapper-class') }}' {{ $attributes->whereStartsWith('x-show') }}
    @if($disabledWhen)
        :class="{
            'disabled {{ $disabledWrapperClasses }}': {{ $disabledWhen }},
            '{{ $enabledWrapperClasses }}': !{{ $disabledWhen }},
        }"
    @endif
    >
    <input type='checkbox'
        :id='{{ $attributes->get('id') }}'
        class='form-check-input'
        {{ $inputAttributes }}
        @if($disabledWhen)
            :disabled="{{ $disabledWhen }}"
        @endif
    />
    <label :for='{{ $attributes->get('id') }}' class='form-check-label ml-1'>
        {{ $slot }}
    </label>
</div>
