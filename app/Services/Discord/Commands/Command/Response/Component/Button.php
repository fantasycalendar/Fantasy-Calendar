<?php

namespace App\Services\Discord\Commands\Command\Response\Component;

use App\Services\Discord\Commands\Command\Response\Component;
use App\Services\Discord\Commands\Command\Response\Emoji;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class Button extends Component
{
    public int $type = 2;
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

    /**
     * Target is a 'target string' for the Discord button to relate back to
     * @see Command::target()
     *
     *
     * @param $target
     * @param $label
     * @param string $style
     * @param false $disabled
     * @throws \Exception
     */
    public function __construct($target, $label, $style = 'secondary', $disabled = false)
    {
        $this->target = $target;
        $this->style = $this->styles[$style];
        $this->disabled = $disabled;

        $this->initLabel($label);
    }

    /**
     * Turns the Button into the appropriate array format for Discord
     *
     * @return int[]
     */
    public function build(): array
    {
        $response = [
            'type' => $this->type,
        ];

        if(Str::startsWith($this->target, ['https://', 'http://'])) {
            $response['url'] = $this->target;
            $this->style = $this->styles['link']; // Override if it's a link or it borks
        } else {
            $response['custom_id'] = config('services.discord.global_command') . '.' . $this->target;
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

        $response['style'] = $this->style;

        return $response;
    }

    /**
     * @param $label
     * @throws \Exception
     */
    private function initLabel($label): void
    {
        if(is_array($label)) {
            $this->emoji = Emoji::make(Arr::get($label, 'emoji', ':slightly_smiling_face:'));
            $this->label = Arr::get($label, 'label', 'A Button');

            return;
        }

        if(Str::startsWith($label, ':') && Str::endsWith($label, ':')) {
            $this->emoji = Emoji::make($label);

            return;
        }

        $this->label = $label;
    }
}
