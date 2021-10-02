<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordException;
use Illuminate\Notifications\Action;

class RendererChoiceHandler extends \App\Services\Discord\Commands\Command
{
    use PremiumCommand;

    /**
     * @inheritDoc
     */
    public function handle()
    {
        return Response::make("The features below are experimental! Just a warning: These may not stick around, may change at any time, may break things, or just outright not work. \nHave fun!")
            ->addRow(function(ActionRow $row){
                $image_renderer_enabled = $this->setting('renderer') == 'image';
                return $row->addButton(
                    static::target('toggle_image_renderer'),
                    $image_renderer_enabled
                        ? 'Disable Image Renderer'
                        : 'Replace text rendering with images',
                    $image_renderer_enabled
                        ? 'danger'
                        : 'success');
            })->ephemeral();
    }

    public function toggle_image_renderer()
    {
        if($this->setting('renderer') != 'image') {
            $this->setting('renderer', 'image');

            $response = Response::make('Image renderer enabled!')
                ->singleButton(static::target('toggle_image_renderer'), 'Nevermind', 'secondary')
                ->ephemeral();

            try {
                $calendar = $this->getDefaultCalendar();
            } catch (\Throwable $e) {
                return $response->appendText($this->newLine(2) . "If you had a calendar set (" . ChooseHandler::fullSignature() . "), we'd show you what that looks like.");
            }

            return $response->appendText($this->newLine(2) . "Here's what it'll look like:" . $this->newLine())
                ->embedMedia($calendar->imageLink('png', ['theme' => 'discord']));
        }

        $this->setting('renderer', 'text');

        return Response::make("Image renderer disabled. If something was broken about it, please let us know in our Discord server! We definitely want to hear from you.")
            ->singleButton(route('discord.server'), 'Join Our Discord Server')
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
