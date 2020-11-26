<?php

namespace App\View\Components;

use Illuminate\View\Component;

class TimelineEvent extends Component
{
    private $title;
    private $date;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($title, $date = null)
    {
        $this->title = $title;
        $this->date = $date;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.timeline-event',[
            'title' => $this->title,
            'date' => $this->date
        ]);
    }
}
