<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Button extends Component
{
    public string $sizeClasses = 'bg-red-900';
    public array $sizeSpecific = [
        'xs' => 'px-2.5 py-1.5 text-xs rounded',
        'sm' => 'px-3 py-2 text-sm leading-4rounded-md',
        'md' => 'px-4 py-2 text-sm rounded-md',
        'lg' => 'px-4 py-2 text-base rounded-md',
        'xl' => 'px-6 py-3 text-base rounded-md',
    ];

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(public $size = 'md')
    {
        $this->sizeClasses = $this->sizeSpecific[$size] ?? '';
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.button');
    }
}
