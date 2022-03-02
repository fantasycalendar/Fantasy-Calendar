<?php

namespace App\View\Components\Sidebar;

use App\Calendar;
use Illuminate\View\Component;

class Eras extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        public Calendar $calendar
    ){}

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.sidebar.eras');
    }
}
