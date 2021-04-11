<?php

namespace App\View\Components\Wysiwyg;

use Illuminate\View\Component;

class ActionButton extends Component
{
    public $command;
    public $active;
    public $class;
    public $icon;

    /**
     * Create a new component instance.
     *
     * @param string $command
     * @param string $active
     * @param string $class
     * @param string $icon
     */
    public function __construct($command, $active, $class, $icon)
    {
        $this->command = $command;
        $this->active = $active;
        $this->class = $class;
        $this->icon = $icon;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.wysiwyg.action-button');
    }
}
