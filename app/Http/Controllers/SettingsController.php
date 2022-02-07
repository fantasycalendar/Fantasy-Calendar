<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAccountRequest;
use App\Notifications\RequestEmailUpdate;
use App\Http\Requests\StoreUserSettings;
use App\Http\Requests\UpdateEmailRequest;
use Stripe\BillingPortal\Session as StripeBillingPortalSession;
use Illuminate\Http\Request;
use Hash;
use Auth;
use Stripe\PromotionCode;
use Stripe\StripeClient;

class SettingsController extends Controller
{
    public function billing(Request $request) {
        $promoCode = (!$request->user()->isPremium() && $request->user()->isEarlySupporter())
            ? cache()->remember('stripePromoCode_' . $request->user()->username, 86400, function() use ($request){
                $stripe = new StripeClient(env('STRIPE_SECRET'));

                $coupon = collect($stripe->coupons->all()['data'])->filter(function($coupon) {
                    return $coupon['name'] == 'Early Supporter';
                })->first()->id;

                return PromotionCode::create([
                    'coupon' => $coupon,
                    'customer' => $request->user()->stripeId(),
                    'expires_at' => now()->addDay()->timestamp,
                ], $request->user()->stripeOptions())['code'];
            })
            : false;

        return view('profile.billing', [
            'promoCode' => $promoCode
        ]);
    }

    public function billingPortal(Request $request) {
        return redirect(StripeBillingPortalSession::create([
            'customer' => $request->user()->createOrGetStripeCustomer()->id,
            'return_url' => route('profile'),
        ], $request->user()->stripeOptions())['url']);
    }

    public function integrations(Request $request) {
        return view('profile.integrations');
    }

    public function updateEmail(UpdateEmailRequest $request) {
        Auth::user()->email = $request->get('new_email');
        Auth::user()->save();

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
        Auth::user()->setSettings([
            'dark_theme' => $request->has('dark_theme')
        ]);

        Auth::user()->setMarketingStatus($request->has('marketing_acceptance'));

        return redirect('profile');
    }

    public function unsubscribeFromMarketing(Request $request) {
        Auth::user()->setMarketingStatus(false);

        return redirect(route('marketing.subscription-updated'));
    }

    public function resubscribeToMarketing(Request $request) {
        Auth::user()->setMarketingStatus(true);

        return redirect(route('marketing.subscription-updated'));
    }
}
