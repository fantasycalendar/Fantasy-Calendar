<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CardSubscribeTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testFreeUser()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertSee('Fantasy Calendar')
                    ->loginAs($this->getFreeUser(true))
                    ->visitRoute('profile')
                    ->assertSee('Subscription: Free');
        });
    }

    public function testTimekeeperUser()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->getTimekeeperBrowser($browser);

            $browser->visitRoute('profile')
                ->screenshot('timekeeper')
                ->assertSee('Subscription: Timekeeper');
        });
    }
}
