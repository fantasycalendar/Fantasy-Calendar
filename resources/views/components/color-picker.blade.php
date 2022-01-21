@push('head')
    <script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>
@endpush

<div style="max-width: 300px;" x-ref="picker_{{ $attributes->get('name') }}" x-data="{
        hexColor: '',
        picker: {},
        init: function() {
            this.picker = new iro.ColorPicker('#picker_{{ $attributes->get('name') }}', {
                width: {{ $attributes->get('width') ?? '300' }},
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
        }
    }
" {{ $attributes->merge(['class' => '']) }}>
    <div id="picker_{{ $attributes->get('name') }}"></div>
</div>
