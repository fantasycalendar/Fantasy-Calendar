<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class Response
{
    public const PONG = ['type' => 1];

    public array $types = [
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

    public function getMessage()
    {
        $response = [
            'type' => $this->type,
            'data' => [
                'content' => $this->text_content
            ]
        ];

        if($this->hasComponents()) {
            $response['data']['components'] = $this->buildComponents();
        }

        if($this->flags > 0) {
            $response['data']['flags'] = $this->flags;
        }

        return $response;
    }

    /**
     * Make the response ephemeral (Only visible to the user)
     *
     * @return $this
     */
    public function ephemeral(): Response
    {
        $this->flags = 1 << 6;

        return $this;
    }

    public function addRow(callable $function)
    {
        $row = new ActionRow();

        $this->components->push($function($row));

        return $this;
    }

    public function hasComponents()
    {
        return $this->components->count() > 0;
    }

    public function buildComponents()
    {
        return $this->components->map->build()->toArray();
    }

    public static function make(string $text_content, string $type = 'basic')
    {
        return new self($text_content, $type);
    }
}
