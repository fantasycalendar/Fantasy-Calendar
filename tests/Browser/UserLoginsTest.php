<?php

namespace Tests\Browser;

use App\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Hash;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class UserLoginsTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @group login
     * @return void
     */
    public function testUserLogin()
    {
        $this->browse(function (Browser $browser) {
            $user = $this->getFreeUser();

            $browser->loginAs($user)
                    ->visitRoute('calendars.index')
                    ->assertDontSee('Admin Panel')
                    ->assertSee('Logout');
        });
    }

    /**
     * A Dusk test to make sure our admin user can see the admin panel
     *
     * @group login
     * @return void
     */
    public function testAdminUserLogin()
    {
        $this->browse(function (Browser $browser) {
            $user = User::firstOrNew([
                'username' => 'TestAdminUser',
                'email' => 'admin@example.com',
                'beta_authorised' => 1,
                'permissions' => 1,
                'reg_ip' => '127.0.0.1'
            ]);

            $user->password = $user->password ?? Hash::make('ATestPassword');
            $user->email_verified_at = Carbon::now();
            $user->save();

            $browser->loginAs($user)
                ->visitRoute('calendars.index')
                ->assertSee('Admin Panel')
                ->assertSee('Logout');
        });
    }
}
