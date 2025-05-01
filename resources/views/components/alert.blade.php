<div {{ $attributes->except('x-text')->merge(['class' => $outerClasses ]) }}>
    <div class="flex">
        <div class="flex-shrink-0">
            <i class="{{ $iconClasses }}"></i>
        </div>
        <div class="ml-[0.75rem] flex-grow">
            <div class="{{ $innerClasses }}" @if($attributes->has('x-text')) x-text="{{ $attributes->get('x-text') }}" @endif>
                {{ $slot }}
            </div>
        </div>
    </div>
</div>

