<?php


namespace App\Services\RendererService\TextRenderer\Traits;


trait GeneratesTextLines
{
    protected array $lines = [];

    public function toString()
    {
        return implode("\n", $this->lines);
    }

    public function lineCount()
    {
        return count($this->lines);
    }

    public function getLines()
    {
        return $this->lines;
    }

    public function toArray()
    {
        return $this->getLines();
    }
}
