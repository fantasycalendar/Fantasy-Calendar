<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ListEnvVars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'env:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lists env vars';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $vars = [];
        foreach($_ENV as $name => $value) {
            $vars[] = [
                'name' => $name,
                'value' => $value
            ];
        }

        $this->table(
            ['Name', 'Value'],
            $vars
        );

        return 0;
    }
}
