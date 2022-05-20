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

    public string $roleClasses = '';
    public array $roleSpecific = [
        'primary' => 'text-white bg-primary-600 disabled:hover:bg-primary-600 hover:bg-primary-700 dark:bg-primary-900 disabled:dark:hover:bg-primary-900 dark:hover:bg-primary-800 focus:ring-primary-500 border-transparent shadow-sm',
        'primary-subtle' => 'text-blue-500 dark:text-blue-800 focus:ring-blue-500 hover:text-white dark:hover:text-white hover:bg-blue-600 border-0 focus:border-0 shadow-none',
        'info' => 'text-white bg-blue-600 disabled:hover:bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 disabled:dark:hover:bg-blue-900 dark:hover:bg-blue-800 focus:ring-blue-500 border-transparent shadow-sm',
        'secondary' => 'text-gray-700 bg-white disabled:hover:bg-white hover:bg-gray-50 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 disabled:dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:border-gray-600 shadow-sm',
        'secondary-subtle' => 'text-gray-500 dark:text-gray-800 focus:ring-gray-500 hover:text-white dark:hover:text-white hover:bg-gray-600 border-0 focus:border-0 shadow-none',
        'danger' => 'text-white bg-red-600 disabled:hover:bg-red-600 hover:bg-red-700 dark:bg-red-900 disabled:dark:hover:bg-red-900 dark:hover:bg-red-800 focus:ring-red-500 border-transparent shadow-sm',
        'danger-subtle' => 'text-red-500 dark:text-red-800 focus:ring-red-500 hover:text-white dark:hover:text-white hover:bg-red-600 border-0 focus:border-0 shadow-none',
        'custom' => '',
    ];

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(public $size = 'md', public $role = 'primary', public $customRole = null)
    {
        $this->sizeClasses = $this->sizeSpecific[$size] ?? '';
        $this->roleClasses = $customRole ?? $this->roleSpecific[$role] ?? '';
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
