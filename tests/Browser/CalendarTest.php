<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CalendarTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testCalendarCreate()
    {
        $this->browse(function (Browser $browser) {
            $user = $this->getFreeUser();

            $browser->loginAs($user)
                    ->visitRoute('calendars.create')
                    ->assertSee('Create Calendar')
                    ->select('presets', 'Forgotten Realms (Calendar of Harptos)')
                    ->press('Apply')
                    ->assertSee('Calendar of Harptos')
                    ->press('Create calendar');
        });
    }
}
