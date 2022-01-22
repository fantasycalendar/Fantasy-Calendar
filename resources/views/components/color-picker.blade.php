@push('head')
    <script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>
@endpush

<div {{ $attributes->merge(['class' => '']) }} x-data="{
            hexColor: '',
            picker: {},
            pickerOpen: false,
            init: function() {
                this.picker = new iro.ColorPicker($refs.picker_{{ $attributes->get('name') }}, {
                    width: {{ $attributes->get('width') ?? '$refs.picker_' . $attributes->get('name') . '.offsetWidth - 16' }},
                    color: '{{ $attributes->get('default') ?? '#2f855a' }}',
                    layout: [
                    {
                      component: iro.ui.Slider,
                      options: {
                        sliderType: 'hue'
                      }
                    },
                    {
                      component: iro.ui.Slider,
                      options: {
                        sliderType: 'saturation'
                      }
                    },
                    {
                      component: iro.ui.Slider,
                      options: {
                        sliderType: 'value'
                      }
                    },
                  ]
                });
                this.{{ $attributes->get('model') ?? 'hexColor' }} = this.picker.color.hexString;
                this.picker.on('color:change', function(color) {
                    this.{{ $attributes->get('model') ?? 'hexColor' }} = color.hexString;
                }.bind(this));
                this.$watch('{{ $attributes->get('model') ?? 'hexColor' }}', value => (value.length < 7 || (this.picker.color.hexString = value)));
            },
        }
    " @click.away="pickerOpen = false" class="relative">
    <input x-model="{{ $attributes->get('model') }}" type="text" name="{{ $attributes->get('name') }}" id="picker_{{ $attributes->get('name') }}" autocomplete="family-name" class="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
    <div class="absolute cursor-pointer inset-y-1 right-1.5 w-6 rounded shadow" x-bind:style="`background-color: ${ {{ $attributes->get('model') }} };`" @click="pickerOpen = !pickerOpen"></div>

    <div class="absolute mt-1 w-full p-2 border shadow rounded z-30 bg-white" x-ref="picker_{{ $attributes->get('name') }}"
         x-show="pickerOpen"
         x-transition:leave="transition ease-in duration-100"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
    >
        <div id="picker_{{ $attributes->get('name') }}"></div>
    </div>
</div>
