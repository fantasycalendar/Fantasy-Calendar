<?php

namespace App\Services\Discord\Commands\Command;

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

        return $response;
    }

    public function hasComponents()
    {
        return $this->components->count() > 0;
    }

    public function buildComponents()
    {
        return $this->components->map->build();
    }
}
