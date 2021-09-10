<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class Response
{
    public const PONG = ['type' => 1];

    public array $types = [
        'pong' => 1,
        'basic' => 4,
        'deferred' => 5,
        'deferred_update' => 6,
        'update' => 7
    ];

    private int $flags = 0;

    private string $text_content;
    private string $type;
    private Collection $components;

    /**
     * @param string $text_content Text content to accompany a message
     * @param string $type One of 'basic', 'deferred', 'deferred_update', 'update'
     */
    public function __construct(string $text_content, string $type = 'basic')
    {
        $this->text_content = $text_content;
        $this->type = Arr::get($this->types, $type, 4);
        $this->components = collect();
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

        if($this->hasTextContent()) {
            $response['data']['content'] = $this->getTextContent();
        }

        if($this->hasComponents()) {
            if(!$this->hasTextContent()) {
                $response['data']['content'] = 'Choose an item below:';
            }

            $response['data']['components'] = $this->buildComponents();
        }

        if($this->hasFlags()) {
            $response['data']['flags'] = $this->getFlags();
        }

        return $response;
    }

    /**
     * @return bool
     */
    public function hasTextContent(): bool
    {
        return !empty($this->text_content);
    }

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
        $this->flags = 1 << 6;

        return $this;
    }

    /**
     * Tells discord to update the contents of the message we're responding to
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
    public function buildComponents()
    {
        return $this->components->map->build()->toArray();
    }

    /**
     * Appends text to our text content
     *
     * @param string $text
     * @return $this
     */
    public function appendText(string $text): Response
    {
        $this->text_content .= $text;

        return $this;
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
}
