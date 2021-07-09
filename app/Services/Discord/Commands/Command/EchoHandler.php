<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;
use Illuminate\Support\Arr;

class EchoHandler extends Command
{
    public function handle(): string
    {
        return $this->option('echo');
    }
}
