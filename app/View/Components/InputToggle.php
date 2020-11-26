<?php

namespace App\View\Components;

use Illuminate\View\Component;

class InputToggle extends Component
{
    private $bind;
    private $label;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($bind, $label)
    {
        $this->bind = $bind;
        $this->label = $label;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.input-toggle', [
            'bind' => $this->bind,
            'label' => $this->label,
        ]);
    }
}
