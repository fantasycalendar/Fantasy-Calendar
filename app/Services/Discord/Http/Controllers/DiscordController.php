<?php


namespace App\Services\Discord\Http\Controllers;


class DiscordController extends \App\Http\Controllers\Controller
{
    public function ping()
    {
        return ['type' => 1];
    }
}
