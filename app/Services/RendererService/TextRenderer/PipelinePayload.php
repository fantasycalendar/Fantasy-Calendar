<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PipelinePayload
{
    use GeneratesTextLines, Buildable;

    private Collection $parts;
    private int $dayLength;

    /**
     * PipelinePayload constructor.
     * @param array $parts
     * @param int $dayLength
     */
    public function __construct(array $parts, int $dayLength = 1)
    {
        $this->parts = collect($parts);
        $this->dayLength = $dayLength;
        $this->lines = $this->parts
            ->toArrays()
            ->flatten()
            ->toArray();
    }

    public function getFirstLineOf($name)
    {
        $classname = $this->studlyClass($name);

        return $this->parts->takeUntil(function($part, $key) use ($classname) {
            return $key === $classname;
        })->sum->lineCount();
    }

    public function getCurrentDayRow()
    {
        dump($this->get('weeks')->getCurrentDayRow());

        return $this->get('weeks')->getCurrentDayRow()
             + $this->parts->takeUntil(function($part, $key) { return $key == Weeks::class; })->sum->lineCount() - 1;
    }

    public function getCurrentDayCol()
    {
        return ($this->get('weeks')->getCurrentWeekday() * ($this->getCellLength() + 1)) + 1;
    }

    /**
     * @return int
     */
    public function getCellLength(): int
    {
        return $this->dayLength;
    }

    /**
     * Retrieves a portion of the payload by resolving a snake_case name to a class in the text renderer namespace
     * and then using that class to determine the key in the payload. For example, if you call ->get('weeks')
     * it retrieves the payload part with a key of 'TextWeeks::class'. 'header_block' -> HeaderBlock, etc.
     *
     * @param $name
     * @return mixed
     * @throws \Exception
     */
    public function get($name)
    {
        $classname = $this->studlyClass($name);

        if(class_exists($classname) && $this->parts->has($classname)) {
            return $this->parts->get($classname);
        }

        throw new \Exception("No such text element exists in text renderer pipeline payload: {$name} (resolved as '{$classname}')");
    }

    /**
     * Resolves a snake_case name to a class in the text renderer namespace
     *
     * @param $name
     * @return string
     */
    public function studlyClass($name): string
    {
        return __NAMESPACE__ . '\\' . Str::studly($name);
    }
}
