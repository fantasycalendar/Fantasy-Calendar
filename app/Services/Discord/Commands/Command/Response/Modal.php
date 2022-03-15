<?php

namespace App\Services\Discord\Commands\Command\Response;

use App\Services\Discord\Commands\Command\Response;

class Modal extends \App\Services\Discord\Commands\Command\Response
{
    public function __construct(string $title, $target, string $type = 'modal')
    {
        parent::__construct("", $type);

        $this->title = $title;
        $this->target = $target;
    }

    public function getMessage(): array
    {
        $message = parent::getMessage();

        $message['data']['title'] = $this->title;

        return $message;
    }

    public static function create($title, $custom_id): self
    {
        return new self($title, $custom_id);
    }
}
