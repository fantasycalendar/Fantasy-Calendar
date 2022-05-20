<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use App\Services\Discord\Exceptions\DiscordException;
use App\Services\Discord\Exceptions\DiscordResponseTooLongException;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use phpDocumentor\Reflection\Types\Static_;

class Response
{
    public const PONG = ['type' => 1];
    public const FLAG_EPHEMERAL = 6;

    public array $types = [
        'pong' => 1,
        'basic' => 4,
        'deferred' => 5,
        'deferred_update' => 6,
        'update' => 7,
        'modal' => 9,
    ];

    private int $flags = 0;

    private string $text_content;
    private string $type;
    private Collection $components;
    private Collection $embeds;
    private int $user_id = 0;
    public string $target;
    public string $title;

    /**
     * @param string $text_content Text content to accompany a message
     * @param string $type One of 'basic', 'deferred', 'deferred_update', 'update'
     */
    public function __construct(string $text_content, string $type = 'basic')
    {
        $this->text_content = $text_content;
        $this->lengthCheck();

        $this->type = Arr::get($this->types, $type, 4);
        $this->components = collect();
        $this->embeds = collect();
    }

    /**
     * Makes a Response object with a simple string
     *
     * @param string $text_content
     * @param string $type
     * @return Response
     */
    public static function make(string $text_content, string $type = 'basic'): Response
    {
        return new self($text_content, $type);
    }

    /**
     * Creates a 'pong' type response, so Discord can ping us
     *
     * @return Response
     */
    public static function pong(): Response
    {
        return new self('', 'pong');
    }

    public static function deferred(): Response
    {
        return new self('', 'deferred');
    }

    /**
     * Sets the user ID that will be required for any buttons in this response
     *
     * @param int $user_id
     * @return $this
     */
    public function setUser(int $user_id): Response
    {
        logger("Response user set to " . $user_id);

        $this->user_id = $user_id;

        return $this;
    }

    /**
     * Converts this Response into Discord's API message format
     *
     * @return array
     */
    public function getMessage(): array
    {
        $response = [
            'type' => $this->type,
        ];

        if($this->hasTitle()) {
            $response['data']['title'] = $this->title;
        }

        if($this->hasTarget()) {
            $response['data']['custom_id'] = config('services.discord.global_command') . '.' . $this->target . ':' . $this->user_id;
        }

        if($this->hasTextContent()) {
            $response['data']['content'] = $this->getTextContent();
        }

        if($this->hasComponents()) {
            if(!$this->hasTextContent()) {
                $response['data']['content'] = 'Choose an item below:';
            }

            $response['data']['components'] = $this->buildComponents();
        }

        if($this->hasEmbeds()) {
            $response['data']['embeds'] = $this->embeds->toArray();
        }

        if($this->hasFlags()) {
            $response['data']['flags'] = $this->getFlags();
        }

        return $response;
    }

    public function embedMedia($url)
    {
        $this->embeds->push([
            'color' => 0x2f855a,
            'image' => [
                'url' => $url
            ]
        ]);

        return $this;
    }

    public function hasTarget(): bool
    {
        return !empty($this->target);
    }

    public function hasTitle(): bool
    {
        return !empty($this->title);
    }

    public function hasEmbeds(): bool
    {
        return $this->embeds->count() > 0;
    }

    /**
     * @return bool
     */
    public function hasTextContent(): bool
    {
        return !empty($this->text_content);
    }

    /**
     * Enables a bitwise response flag
     *
     * @param int $flagId
     * @return $this
     */
    public function enableFlag(int $flagId): Response
    {
        $this->flags = $this->flags | (1 << $flagId);

        return $this;
    }

    /**
     * Disables a bitwise response flag
     *
     * @param int $flagId
     * @return $this
     */
    public function disableFlag(int $flagId): Response
    {
        $this->flags = $this->flags ^ (1 << $flagId);

        return $this;
    }

    public function hasFlag(int $flagId): bool
    {
        return $this->flags & (1 << $flagId);
    }

    /**
     * Determines whether this response has any flags at all
     *
     * @return bool
     */
    public function hasFlags(): bool
    {
        return $this->flags > 0;
    }

    /**
     * @return int
     */
    public function getFlags(): int
    {
        return $this->flags;
    }

    /**
     * @return string
     */
    public function getTextContent(): string
    {
        return $this->text_content;
    }

    /**
     * Sets the type of response based on Discord's types
     *
     * @param Response
     */
    public function setType($type): Response
    {
        $this->type = $this->types[$type];

        return $this;
    }

    /**
     * Make the response ephemeral (Only visible to the user who initiated it)
     *
     * @return $this
     */
    public function ephemeral(): Response
    {
        return (app()->environment(['local']) && !config('services.discord.force_ephemeral_in_dev'))
            ? $this->prependText("_(Ephemeral messages not hidden during development)_\n")
            : $this->enableFlag(static::FLAG_EPHEMERAL);
    }

    /**
     * Tells discord to update the contents of the message whose component interaction we're responding to
     *
     * @return $this
     */
    public function updatesMessage(): Response
    {
        return $this->setType('update');
    }

    /**
     * Add an "Action Row" https://discord.com/developers/docs/interactions/message-components#action-rows
     *
     * @param callable $function
     * @return $this
     */
    public function addRow(callable $function): Response
    {
        $row = new ActionRow();

        $this->components->push($function($row));

        return $this;
    }

    /**
     * @return bool
     */
    public function hasComponents(): bool
    {
        return $this->components->count() > 0;
    }

    /**
     * Tells all of our components to 'build' themselves, resulting in a Discord-appropriate format
     *
     * @return mixed
     */
    public function buildComponents(): array
    {
        return $this->components
            ->map->build($this->user_id)
            ->toArray();
    }

    public function clearComponents(): self
    {
        $this->components = collect();

        return $this;
    }

    /**
     * Prepends text to our text content without affecting components
     *
     * @param string $text
     * @return $this
     */
    public function prependText(string $text): Response
    {
        $this->text_content = $text . $this->text_content;

        return $this;
    }

    /**
     * Appends text to our text content without affecting components
     *
     * @param string $text
     * @return $this
     */
    public function appendText(string $text): Response
    {
        $this->text_content .= $text;

        return $this->lengthCheck();
    }

    /* ********************************************************* *
     * Syntactic Sugar Methods - These just make life a bit better
     * ********************************************************* */

    /**
     * Sets this response up with a single button, even overriding existing ones.
     *
     * @param $target
     * @param $label
     * @param string $style
     * @return $this
     */
    public function singleButton(string $target, $label, string $style = 'primary'): Response
    {
        $this->components = collect();

        $this->addRow(function(ActionRow $row) use ($label, $target, $style){
            return $row->addButton($target, $label, $style);
        });

        return $this;
    }

    /**
     * Creates a simple select drop-down on the response. $options is an array of associative arrays,
     * each providing a label, a value, and a description.
     *
     * @param string $target
     * @param string $placeholder
     * @param array $options
     */
    public function singleSelectMenu(string $target, string $placeholder, array $options)
    {
        $this->addRow(function(ActionRow $row) use ($target, $placeholder, $options) {
            $row->addSelectMenu(function(SelectMenu $menu) use ($options) {
                foreach($options as $option) {
                    $menu->addOption(
                        $option['label'],
                        $option['value'],
                        $option['description']
                    );
                }
            }, $target, $placeholder);
        });
    }

    public function lengthCheck()
    {
        if(mb_strlen($this->text_content) > 2000) {
            throw new DiscordResponseTooLongException(mb_strlen($this->text_content));
        }

        return $this;
    }
}
