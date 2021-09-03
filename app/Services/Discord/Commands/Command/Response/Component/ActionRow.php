<?php

namespace App\Services\Discord\Commands\Command\Response\Component;

use App\Services\Discord\Commands\Command\Response\Component;
use Illuminate\Support\Collection;

class ActionRow extends Component
{
    public int $type = 1;
    public Collection $components;

    public function __construct()
    {
        $this->components = collect();
    }

    public function build(): array
    {
        return [
            'type' => $this->type,
            'components' => $this->components->map->build()
        ];
    }

    public function addButton($target, $label, $style = 'secondary', $disabled = false)
    {
        $this->components->push(new Button($target, $label, $style = 'secondary', $disabled = false));
    }
}
