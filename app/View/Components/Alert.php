<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Arr;
use Illuminate\View\Component;

class Alert extends Component
{
    public array $styles = [
        'warning' => [
            'outerClasses' => 'bg-yellow-100 border-l-4 border-yellow-400 dark:border-yellow-600 dark:bg-yellow-900 p-[1rem]',
            'innerClasses' => 'text-sm text-yellow-700 dark:text-yellow-300',
            'iconClasses' => 'text-yellow-400 dark:text-yellow-300',
            'icon' => 'fa exclamation-triangle'
        ],
        'notice' => [
            'outerClasses' => 'bg-blue-100 border-l-4 border-blue-400 dark:border-blue-600 dark:bg-blue-900 p-[1rem]',
            'innerClasses' => 'text-sm text-blue-700 dark:text-blue-300',
            'iconClasses' => 'text-blue-400 dark:text-blue-300',
            'icon' => 'fa info-circle'
        ],
        'danger' => [
            'outerClasses' => 'bg-red-100 border-l-4 border-red-400 dark:border-red-600 dark:bg-red-900 p-[1rem]',
            'innerClasses' => 'text-sm text-red-700 dark:text-red-300',
            'iconClasses' => 'fa fa-times-circle text-red-400 dark:text-red-300',
            'icon' => 'fa times-circle',
        ],
        'success' => [
            'outerClasses' => 'bg-green-100 border-l-4 border-green-400 dark:border-green-600 dark:bg-green-900 p-[1rem]',
            'innerClasses' => 'text-sm text-green-700 dark:text-green-300',
            'iconClasses' => 'fa fa-check-circle text-green-400 dark:text-green-300',
            'icon' => 'fa check-circle',
        ]
    ];

    /**
     * Create a new component instance.
     */
    public function __construct(public $type = 'notice', public $icon = 'fa fa-info-circle')
    {
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.alert', [
            'outerClasses' => Arr::get($this->styles, "{$this->type}.outerClasses"),
            'innerClasses' => Arr::get($this->styles, "{$this->type}.innerClasses"),
            'iconClasses' => $this->buildIconClasses(),
        ]);
    }

    private function buildIconClasses(): string
    {
        $icon = $this->icon ?? Arr::get($this->styles, "{$this->type}.icon");
        $iconClasses = Arr::get($this->styles, "{$this->type}.iconClasses");

        return "$icon $iconClasses";
    }
}
