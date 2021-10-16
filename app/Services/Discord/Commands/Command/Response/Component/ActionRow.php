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

    public function build($user_id): array
    {
        return [
            'type' => $this->type,
            'components' => $this->components->map->build($user_id)->toArray()
        ];
    }

    /**
     * @param $target
     * @param $label
     * @param string $style
     * @param false $disabled
     * @return $this
     */
    public function addButton($target, $label, $style = 'secondary', $disabled = false): ActionRow
    {
        $this->components->push(new Button($target, $label, $style, $disabled));

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
    public function addSelectMenu(callable $function, string $customId, string $placeholder, int $minSelectedValues = 1, int $maxSelectedValues = 1, $disabled = false): ActionRow
    {
        $this->components->push($function(new SelectMenu($customId, $placeholder, $minSelectedValues, $maxSelectedValues, $disabled)));

        return $this;
    }
}
