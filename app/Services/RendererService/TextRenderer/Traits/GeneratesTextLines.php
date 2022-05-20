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

    public function getLines(int $start = 0, int $end = 0)
    {
        if($start === 0 && $end === 0) return array_values($this->lines);

        return array_values(array_slice($this->lines, $start, $end));
    }

    public function getLine($index)
    {
        return $this->getLines($index, 1);
    }

    public function setLine($index, $line)
    {
        $this->lines[$index] = $line;

        return $this;
    }

    public function toArray()
    {
        return $this->getLines();
    }

    public function insertLine(string $line, $index = 0, $length = 0)
    {
        array_splice($this->lines, $index, $length, [$line]);

        return $this;
    }

    public function replaceLine(string $line, $index)
    {
        return $this->insertLine($line, $index, 1);
    }
}
