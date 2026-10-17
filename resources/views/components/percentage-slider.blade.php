<div
    {{ $attributes->except(['label'])->merge(['class' => 'flex flex-col']) }}
    x-data="{
        percentage: 0,
        init() {
            this.percentage = Math.round(this.modelValue * 100);
            this.$watch('modelValue', (val) => {
                const rounded = Math.round(val * 100);
                if (rounded !== this.percentage) this.percentage = rounded;
            });
        },
        sync() {
            this.modelValue = Math.max(0, Math.min(1, this.percentage / 100));
        },
        modelValue: 0,
    }"
    x-modelable="modelValue"
>
    @if($attributes->has('label'))
        <div class="text-sm mt-2">{{ $attributes->get('label') }}</div>
    @endif

    <div class="flex items-center gap-2">
        <input
            type="range"
            class="percentage-slider w-full"
            :style="`background: linear-gradient(to right, var(--slider-accent) 0%, var(--slider-accent) ${percentage}%, var(--slider-track) ${percentage}%, var(--slider-track) 100%)`"
            step="1"
            min="0"
            max="100"
            x-model.number="percentage"
            @change="sync"
        />
        <div class="flex items-center gap-1 basis-[4.5rem] shrink-0">
            <input
                type="number"
                class="w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm px-1.5 py-1 text-right"
                step="1"
                min="0"
                max="100"
                x-model.number="percentage"
                @change="sync"
            />
            <span class="text-sm text-gray-500">%</span>
        </div>
    </div>
</div>
