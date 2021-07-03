<?php


namespace App\Services\RendererService\TextRenderer\Traits;


trait Buildable
{
    public static function build(...$args)
    {
        return (new static(...$args))->initialize();
    }

    public abstract function initialize(): self;
}
