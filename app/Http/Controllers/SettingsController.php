<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAccountRequest;
use App\Notifications\RequestEmailUpdate;
use App\Http\Requests\StoreUserSettings;
use App\Http\Requests\UpdateEmailRequest;
use Stripe\BillingPortal\Session as StripeBillingPortalSession;
use Illuminate\Http\Request;
use Hash;

class SettingsController extends Controller
{
    public function billing(Request $request) {
        return view('profile.billing', [
            'subscription' => auth()->user()->subscriptions()->active()->first(),
            'subscription_renews_at' => format_timestamp(auth()->user()->subscription_end)
        ]);
    }

    public function billingPortal(Request $request) {
        return redirect(StripeBillingPortalSession::create([
            'customer' => $request->user()->createOrGetStripeCustomer()->id,
            'return_url' => route('profile.billing'),
        ], $request->user()->stripeOptions())['url']);
    }

    public function updateEmail(UpdateEmailRequest $request) {
        $request->user()->update([
            'email' => $request->get('new_email')
        ]);

        return redirect(route('profile'))->with('alerts', ['email-success' => "Email successfully updated!"]);
    }

    public function updateAccount(UpdateAccountRequest $request) {
        $alerts = [];

        if($request->has('email') && $request->get('email') !== $request->user()->email) {
            $request->user()->notify(new RequestEmailUpdate($request->get('email')));

            $alerts['email'] = "We have sent an email to your current email with the details to update your email!";
        }

        if($request->get('password')) {
            $request->user()->update([
                'password' => Hash::make($request->get('password'))
            ]);

            $alerts['password'] = "Your password has been updated.";
        }

        return redirect(route('profile'))->with('alerts', $alerts);
    }

    public function updateSettings(StoreUserSettings $request) {
        $request->user()->setSettings([
            'dark_theme' => $request->has('dark_theme')
        ]);

        $request->user()->setMarketingStatus($request->has('marketing_acceptance'));

        return redirect('profile');
    }

    public function unsubscribeFromMarketing(Request $request) {
        $request->user()->setMarketingStatus(false);

        return redirect(route('marketing.subscription-updated'));
    }

    public function resubscribeToMarketing(Request $request) {
        $request->user()->setMarketingStatus(true);

        return redirect(route('marketing.subscription-updated'));
    }
}
