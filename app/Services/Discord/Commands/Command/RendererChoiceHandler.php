<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Show\MonthHandler;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordException;
use Illuminate\Notifications\Action;
use Illuminate\Support\Arr;

class RendererChoiceHandler extends \App\Services\Discord\Commands\Command
{
    use PremiumCommand;
    private $typeDescriptions = [
        'image' => 'an image',
        'text' => 'a block of text'
    ];

    private $oppositeDescriptions = [
        'image' => 'a block of text',
        'text' => 'an image'
    ];

    /**
     * @inheritDoc
     */
    public function handle()
    {
        $typeDescription = Arr::get($this->typeDescriptions, $this->setting('renderer'), 'image');

        return Response::make("We're currently rendering your calendars as $typeDescription.")
            ->addRow(function(ActionRow $row){
                $image_renderer_enabled = $this->setting('renderer') == 'image';
                return $row->addButton(
                    static::target('switchRenderer'),
                    "Render as " . $this->oppositeDescriptions[$this->setting('renderer')] . " instead",
                    'success');
            })->ephemeral();
    }

    public function switchRenderer()
    {
        $previousRenderer = $this->setting('renderer') ?? 'image';
        $renderer = $previousRenderer == 'image'
            ? 'text'
            : 'image';

        $this->setting('renderer', $renderer);

        $response = Response::make(ucfirst($renderer) . ' renderer enabled!')
            ->singleButton(static::target('switchRenderer'), 'Nevermind', 'secondary')
            ->ephemeral();

        try {
            $calendar = $this->getDefaultCalendar();
        } catch (\Throwable $e) {
            return $response->appendText($this->newLine(2) . "If you had a calendar set (" . ChooseHandler::fullSignature() . "), we'd show you what that looks like.");
        }

        return MonthHandler::respondWith($renderer, $calendar)
            ->prependText(ucfirst($renderer) . " renderer enabled! Here's what it'll look like:" . $this->newLine())
            ->singleButton(static::target('switchRenderer'), 'Nevermind', 'secondary')
            ->ephemeral();
    }

    /**
     * @inheritDoc
     */
    public static function signature(): string
    {
        return "renderer";
    }
}
