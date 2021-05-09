<?php


namespace App\Services\EpochService\Traits;


use Illuminate\Support\Str;

trait CalculatesAndCachesProperties
{
    protected \Illuminate\Support\Collection $statecache;

    protected function flushCache()
    {
        $this->previousState = $this->statecache;

        $this->statecache = collect();
    }

    public function getState()
    {
        return $this->statecache;
    }

    public function __set($name, $value)
    {
        $this->statecache->put($name, $value);
    }

    public function __get($name)
    {
        if(!$this->statecache->has($name)) {
            $this->{$name} = $this->{'calculate'.Str::studly($name)}();
        }

        return $this->statecache->get($name);
    }
}
