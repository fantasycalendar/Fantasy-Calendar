<?php

require __DIR__ . '/../vendor/autoload.php';

(new class() {
    use \Tests\CreatesApplication;
})->createApplication()[\Illuminate\Contracts\Console\Kernel::class]->call('db:create');

(new class() {
    use \Tests\CreatesApplication;
})->createApplication()[\Illuminate\Contracts\Console\Kernel::class]->call('migrate:fresh --seed');
