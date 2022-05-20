<?php

namespace App\Services\Discord\Commands\Command\Response\Component\SelectMenu;

use App\Services\Discord\Commands\Command\Response\Emoji;

class Option
{
    private $label;
    private $value;
    private string $description;
    private $emoji;
    private bool $default;

    public function __construct($label, $value, $description = '', $emoji = null, $default = false)
    {
        $this->label = $label;
        $this->value = $value;
        $this->description = $description;
        $this->emoji = $emoji ? Emoji::make($emoji) : null;
        $this->default = $default;
    }

    /**
     * @return array
     */
    public function build(): array
    {
        return [
            'label' => $this->label,
            'value' => $this->value,
            'description' => $this->description,
            'emoji' => optional($this->emoji)->build(),
            'default' => $this->default,
        ];
    }
}
