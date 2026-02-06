@props(['disabledWhen' => null, 'disabledWrapperClasses' => null, 'enabledWrapperClasses' => null])

@php
    $inputAttributes = $attributes
        ->whereDoesntStartWith('id')
        ->whereDoesntStartWith('x-show')
        ->whereDoesntStartWith('wrapper');

    $id = $attributes->get('id');

    if (!str_starts_with($id, '`') && !str_ends_with($id, '`')) {
        $id = '`' . $id . '`';
    }
@endphp

<div class='form-check py-2 dark:border-white/10 border-x border-t last-of-type:border-b first:rounded-t last:rounded-b {{ $attributes->get('wrapper-class') }}' {{ $attributes->whereStartsWith('x-show') }}
    @if($disabledWhen)
        :class="{
            'disabled {{ $disabledWrapperClasses }}': {{ $disabledWhen }},
            '{{ $enabledWrapperClasses }}': !{{ $disabledWhen }},
        }"
    @endif
    >
    <input type='checkbox'
        :id='{{ $id }}'
        class='form-check-input'
        {{ $inputAttributes }}
        @if($disabledWhen)
            :disabled="{{ $disabledWhen }}"
        @endif
    />
    <label :for='{{ $id }}' class='form-check-label ml-1'>
        {{ $slot }}
    </label>
</div>
