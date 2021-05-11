<button
    type="button"
    data-command="{{ $command }}"
    data-active-class="{{ $active }}"
    {{ $attributes->merge(['class' => 'btn']) }}
    style="background-color: transparent !important; border-radius: 0 !important;"
>
    <i class="fa fa-{{ $icon }}"></i>
</button>
