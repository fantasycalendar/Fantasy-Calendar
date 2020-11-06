<?php

namespace App\Http\Controllers;

use Auth;
use Stripe;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Exceptions\InvalidRequestException;
use Redirect;
use Stripe\Coupon;
use Stripe\StripeClient;

class SubscriptionController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except(['index', 'pricing', 'coupon']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function pricing(Request $request) {
        $subscribed = false;
        if(Auth::check() && Auth::user()->subscriptions()->active()->get()->count() > 0) {
            $subscribed = true;
        }

        $betaAccess = (!Auth::check() || $request->get('beta_override'))
            ? false
            : Auth::user()->betaAccess();

        return view('subscription.pricing', [
            'subscribed' => $subscribed,
            'earlySupporter' => Auth::check() && Auth::user()->isEarlySupporter(),
            'betaAccess' => $betaAccess,
        ]);
    }

    public function index() {
        $subscriptions = Auth::user()->subscriptions()->active()->get();

        if(count($subscriptions) < 1) {
            return Redirect::route('subscription.pricing');
        }

        return view('subscription.index', [
            'subscriptions' => $subscriptions
        ]);
    }

    /**
     * @param $level
     * @param $interval
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function subscribe($level, $interval) {
        // They're subscribed already, send 'em to the subscriptions list
        if(Auth::user()->subscribed('Timekeeper')) {
            return Redirect::route('profile');
        }

        $intent = Auth::user()->createSetupIntent();
        $plan = strtolower($level . "_" . $interval);

        return view('subscription.subscribe',[
            'intent' => $intent,
            'level' => $level,
            'plan' => $plan,
            'interval' => $interval,
            'user' => Auth::user(),
            'renew_at' => $interval == "yearly" ? now()->addYear()->toFormattedDateString() : now()->addMonth()->toFormattedDateString()
        ]);
    }

    /**
     * @param Request $request
     * @param $level
     * @param $plan
     * @return array|\Illuminate\Http\RedirectResponse
     * @throws Stripe\Exception\ApiErrorException
     */
    public function update(Request $request, $level, $plan) {
        $user = Auth::user();
        $stripe = new StripeClient(env('STRIPE_SECRET'));

        try {

            # If the users was registered before a certain point, apply the 25% off
            $sub = $user->newSubscription($level, $plan);

            if($user->isEarlySupporter()) {
                $coupons = collect($stripe->coupons->all()['data'])->filter(function($coupon) {
                    return $coupon['name'] == 'Early Supporter';
                });

                if($coupons->count()) {
                    $sub->withCoupon($coupons->first()->id);
                }
            }

            $sub->create($request->input('token'));

            $user->calendars()->each(function($calendar){
                $calendar->disabled = 0;
                $calendar->save();
            });

        } catch (IncompletePayment $exception) {

            return redirect()->route(
                'cashier.payment',
                [$exception->payment->id, 'redirect' => route('profile')]
            );
        }

        return ['success' => true, 'message' => 'Subscribed'];
    }

    /**
     * @param Request $request
     * @param $level
     * @param $plan
     * @return array
     */
    public function swap(Request $request, $level, $plan) {
        $user = Auth::user();

        $user->newSubscription($level, $plan)->create($request->input('token'));

        return ['success' => true, 'message' => 'Subscribed'];
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function cancellation() {
        return view('subscription.cancel', [
            'subscription' => Auth::user()->subscription('Timekeeper')
        ]);
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel() {
        $subscription = Auth::user()->subscription('Timekeeper');

        if($subscription->onGracePeriod()) {
            $subscription->cancelNow();
        } else {
            $subscription->cancel();
        }

        return Redirect::route('profile');
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resume() {
        if(!Auth::user()->subscription('Timekeeper')->onGracePeriod()) {
            return Redirect::route('profile');
        }

        Auth::user()->subscription('Timekeeper')->resume();

        return Redirect::route('profile');
    }
}
