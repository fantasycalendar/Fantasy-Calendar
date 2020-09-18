<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class AppBootsTest extends DuskTestCase
{
    /**
     * A basic browser test example.
     *
     * @return void
     */
    public function test()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertSee('Fantasy Calendar');

            $browser->screenshot('homepage');
            $browser->storeConsoleLog('test');
        });
    }
}
