<?php

namespace App\Services\Discord\Commands\Command\Response\Component;

use App\Services\Discord\Commands\Command\Response\Component;

class TextInput extends Component
{
    public int $type = 4;
    public int $style = 1;

    public function __construct(
        public string $target = 'text_input',
        public string $label = 'Input label',
        public string $placeholder = 'Placeholder',
        public bool $required = false,
        public int $min_length = 0,
        public int $max_length = 256,
    )
    {
    }

    public function build($user_id): array
    {
        $response = [];

        $response['type'] = $this->type;
        $response['custom_id'] = config('services.discord.global_command') . '.' . $this->target . ':' . ($this->user_id ?? $user_id);
        $response['label'] = $this->label;
        $response['style'] = $this->style;
        $response['min_length'] = $this->min_length;
        $response['max_length'] = $this->max_length;
        $response['placeholder'] = $this->placeholder;
        $response['required'] = $this->required;

        return $response;
    }
}
