<?php

namespace App\Console\Commands;

use Cache;
use \Illuminate\Foundation\Console\DownCommand as Down;

class DownCommand extends Down
{
    /**
     * The console command signature.
     *
     * @var string
     */
    protected $signature = 'down {--redirect= : The path that users should be redirected to}
                                 {--render= : The view that should be prerendered for display during maintenance mode}
                                 {--retry= : The number of seconds after which the request may be retried}
                                 {--secret= : The secret phrase that may be used to bypass maintenance mode}
                                 {--status=503 : The status code that should be used when returning the maintenance mode response}
                                 {--message=We\'ll be right back. : A message to display on the maintenance page}';


    /**
     * Execute the console command.
     *
     * Overrides Laravel's DownCommand to use the cache instead of the
     * filesystem so that maintenance mode is propagated across all
     * servers and job queues.
     *
     * @return mixed
     */
    public function handle()
    {
        Cache::forever(config('app.maintenance_key'), json_encode($this->getDownFilePayload()));
        $this->comment('Application is now in maintenance mode.');
    }

    /**
     * Get the payload to be placed in the "down" file.
     *
     * @return array
     */
    protected function getDownFilePayload()
    {
        return [
            'redirect' => $this->redirectPath(),
            'retry' => $this->getRetryTime(),
            'secret' => $this->option('secret'),
            'status' => (int) $this->option('status', 503),
            'template' => $this->option('render') ? $this->prerenderView() : null,
            'message' => $this->option('message'),
        ];
    }
}
