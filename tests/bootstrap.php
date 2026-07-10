<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Contracts\Console\Kernel;

// CreatesApplication forces the testing connection, so these run against the
// test database, not dev.
$createApplication = fn () => (new class() {
    use \Tests\CreatesApplication;
})->createApplication();

$createApplication()[Kernel::class]->call('db:create');

$createApplication()[Kernel::class]->call('migrate:fresh --seed');
