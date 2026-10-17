<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;

trait CreatesApplication
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        // .env's DB_CONNECTION overrides phpunit.xml, so force the testing
        // connection here (before RefreshDatabase reads it) to keep tests off
        // the dev database.
        $app['config']->set('database.default', 'testing');

        return $app;
    }
}
