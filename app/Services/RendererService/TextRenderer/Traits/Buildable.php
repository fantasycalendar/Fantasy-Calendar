<?php


namespace App\Services\RendererService\TextRenderer\Traits;


trait Buildable
{
    public static function build(...$args)
    {
        return (new static(...$args))->initialize();
    }

    /**
     * Stub to satisfy Buildable trait
     *
     * @return $this
     */
    public function initialize()
    {
        return $this;
    }
}
