<?php

namespace App\Services\Discord\Commands\Command\Response;

abstract class Component
{
    public int $type;

    /**
     * Builds the component into Discord's format
     *
     * @return array
     */
    public abstract function build($user_id): array;
}
