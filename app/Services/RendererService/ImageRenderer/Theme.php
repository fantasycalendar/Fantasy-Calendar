<?php

namespace App\Services\RendererService\ImageRenderer;

use Illuminate\Support\Arr;

class Theme
{
    public array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function get($key, $default = '#FF0000')
    {
        return Arr::get($this->attributes, $key, $default);
    }
}
