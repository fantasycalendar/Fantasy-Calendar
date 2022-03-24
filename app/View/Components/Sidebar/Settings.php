<?php

namespace App\View\Components\Sidebar;

use App\Models\Calendar;
use Illuminate\View\Component;

class Settings extends Component
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
        return view('components.sidebar.settings');
    }
}
