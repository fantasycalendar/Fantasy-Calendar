<?php

namespace Tests;

use App\User;
use Carbon\Carbon;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Dusk\Browser;
use Laravel\Dusk\TestCase as BaseTestCase;

abstract class DuskTestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Prepare for Dusk test execution.
     *
     * @beforeClass
     * @return void
     */
    public static function prepare()
    {
        static::startChromeDriver();
    }

    /**
     * Create the RemoteWebDriver instance.
     *
     * @return \Facebook\WebDriver\Remote\RemoteWebDriver
     */
    protected function driver()
    {
        $options = (new ChromeOptions)->addArguments([
            '--disable-gpu',
            '--headless',
            '--window-size=1920,1080',
        ]);

        return RemoteWebDriver::create(
            'http://selenium:4444/wd/hub', DesiredCapabilities::chrome()
        );
    }

    public function getUserLike($criteria) {
        $user = User::firstOrNew($criteria);

        $user->password = $user->password ?? Hash::make('ATestPassword');
        $user->email_verified_at = Carbon::now();
        $user->save();

        return $user;
    }

    public function getFreeUser($new = false)
    {
        $username = $new ? Str::random(20) : 'TestFreeUser';

        return $this->getUserLike([
            'username' => $username,
            'email' => $username.'@example.com',
            'beta_authorised' => 1,
            'reg_ip' => '127.0.0.1'
        ]);
    }

    public function getTimekeeperBrowser($browser, $new = false)
    {
        $username = $new ? Str::random(20) : 'TestTimekeeperUser';

        $user = $this->getUserLike([
            'username' => $username,
            'email' => $username.'@example.com',
            'beta_authorised' => 1,
            'reg_ip' => '127.0.0.1'
        ]);

        $browser->loginAs($user);

        if($user->paymentLevel() != 'Timekeeper') {
            $browser->visitRoute('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'monthly'])
                ->assertSee('Subscribe to Timekeeper on a monthly basis.')
                ->type('#card-holder-name', $user->username);

            $browser->waitFor('iframe[name=__privateStripeFrame5]');

            $browser->withinFrame('iframe[name=__privateStripeFrame5]', function($browser){
                $browser->type('cardnumber', '4242424242424242')
                    ->type('exp-date', '424')
                    ->type('cvc', '242')
                    ->type('postal', '42424');
            });

            $browser->press('Get subscribed');

            $browser->waitForLocation('/profile');
        }

        return $browser;
    }

    public function getWorldbuilderBrowser($browser, $new = false)
    {
        $username = $new ? Str::random(20) : 'TestWorldbuilderUser';

        $user = $this->getUserLike([
            'username' => $username,
            'email' => $username.'@example.com',
            'beta_authorised' => 1,
            'reg_ip' => '127.0.0.1'
        ]);

        $browser->loginAs($user);

        if($user->paymentLevel() != 'Worldbuilder') {
            $browser->visitRoute('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'monthly'])
                ->assertSee('Subscribe to Worldbuilder on a monthly basis.')
                ->type('#card-holder-name', $user->username);

            $browser->waitFor('iframe[name=__privateStripeFrame5]');

            $browser->withinFrame('iframe[name=__privateStripeFrame5]', function($browser){
                $browser->type('cardnumber', '4242424242424242')
                    ->type('exp-date', '424')
                    ->type('cvc', '242')
                    ->type('postal', '42424');
            });

            $browser->press('Get subscribed');

            $browser->waitForLocation('/profile');
        }

        return $browser;
    }
}
