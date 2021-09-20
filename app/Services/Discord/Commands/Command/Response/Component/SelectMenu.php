<?php

namespace App\Services\Discord\Commands\Command\Response\Component;

use App\Services\Discord\Commands\Command\Response\Component;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu\Option;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SelectMenu extends Component
{
    public int $type = 3;
    public Collection $options;
    private $customId;
    private $placeholder;
    private $minSelectedValues;
    private $maxSelectedValues;
    private bool $disabled;

    /**
     * @param string $customId
     * @param string $placeholder
     * @param int $minSelectedValues
     * @param int $maxSelectedValues
     * @param false $disabled
     */
    public function __construct(string $customId, string $placeholder, int $minSelectedValues = 1, int $maxSelectedValues = 1, $disabled = false)
    {
        $this->customId = config('services.discord.global_command') . '.' . $customId;
        $this->placeholder = Str::limit($placeholder, 97);
        $this->minSelectedValues = $minSelectedValues;
        $this->maxSelectedValues = $maxSelectedValues;
        $this->disabled = $disabled;
        $this->options = collect();
    }

    /**
     * @inheritDoc
     */
    public function build($user_id): array
    {
        return [
            'type' => $this->type,
            'custom_id' => $this->customId . ':' . $user_id,
            'options' => $this->options->map->build()->toArray(),
            'placeholder' => $this->placeholder,
            'min_selected_values' => $this->minSelectedValues,
            'max_selected_values' => $this->maxSelectedValues,
            'disabled' => $this->disabled
        ];
    }

    /**
     * Adds an option to the selection drop-down that will show up in Discord
     *
     * @param $label
     * @param $value
     * @param string $description
     * @param null $emoji
     * @param false $default
     * @return $this
     */
    public function addOption($label, $value, $description = '', $emoji = null, $default = false): SelectMenu
    {
        $this->options->push(new Option($label, $value, $description, $emoji, $default));

        return $this;
    }
}
