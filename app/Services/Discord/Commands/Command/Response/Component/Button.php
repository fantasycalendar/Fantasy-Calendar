<?php

namespace App\Services\Discord\Commands\Command\Response\Component;

use App\Services\Discord\Commands\Command\Response\Component;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class Button extends Component
{
    public array $styles = [
        'primary' => 1,
        'secondary' => 2,
        'success' => 3,
        'danger' => 4,
        'link' => 5
    ];
    private string $label;
    private $target;
    private string $style;
    private $emoji;
    private bool $disabled;

    public function __construct($target, $label, $style = 'secondary', $disabled = false)
    {
        $this->target = $target;
        $this->style = $this->styles[$style];
        $this->disabled = $disabled;

        $this->initLabel($label);
    }

    public function build(): array
    {
        $response = [
            'type' => $this->type,
            'style' => $this->style
        ];

        if(Str::startsWith($this->target, ['https://', 'http://'])) {
            $response['url'] = $this->target;
        }

        if($this->emoji) {
            $response['emoji'] = $this->emoji;
        }

        if($this->label) {
            $response['label'] = $this->label;
        }

        if($this->disabled) {
            $response['disabled'] = true;
        }

        return $response;
    }

    private function initLabel($label): void
    {
        if(is_array($label)) {
            $this->emoji = Arr::get($label, 'emoji', ':slightly_smiling_face:');
            $this->label = Arr::get($label, 'label', 'A Button');

            return;
        }

        if(Str::startsWith($label, ':') && Str::endsWith($label, ':')) {
            $this->emoji = $label;

            return;
        }

        $this->label = $label;
    }
}
