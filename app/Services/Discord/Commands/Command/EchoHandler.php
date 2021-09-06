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

    // Echo should work for anyone
    public function authorize(): bool
    {
        return true;
    }

    // Should never happen.
    public function unauthorized_response(): string
    {
        return '';
    }
}
