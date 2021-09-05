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
            'components' => $this->components->map->build()->toArray()
        ];
    }

    /**
     * @see Button
     * @param ...$args
     * @return $this
     */
    public function addButton(...$args): ActionRow
    {
        $this->components->push(new Button(...$args));

        return $this;
    }

    /**
     * @see SelectMenu
     * @param string $customId
     * @param string $placeholder
     * @param int $minSelectedValues
     * @param int $maxSelectedValues
     * @param bool $disabled
     * @return $this
     */
    public function addSelectMenu(callable $function, ...$args): ActionRow
    {
        $this->components->push($function(new SelectMenu(...$args)));

        return $this;
    }
}
