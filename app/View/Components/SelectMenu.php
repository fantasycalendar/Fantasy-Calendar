<?php

namespace App\View\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class SelectMenu extends Component
{
    public array $options = [];

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        public $default,
        public $model = 'select',
        $options = []
    ){
        foreach($options as $value => $label) {
            $this->options[] = [
                'value' => $value,
                'label' => $label
            ];
        }
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.select-menu');
    }
}
