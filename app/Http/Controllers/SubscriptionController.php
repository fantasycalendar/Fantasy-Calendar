<?php

namespace App\Http\Controllers;

use App\Events\UserSubscribedEvent;
use Stripe;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;

class SubscriptionController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except(['pricing']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function pricing(Request $request) {
        return view('subscription.pricing', [
            'subscribed' => $request->user()?->subscriptions()->active()->count(),
            'earlySupporter' => $request->user()?->isEarlySupporter(),
            'betaAccess' => $request->user()?->betaAccess() && !$request->get('beta_override'),
        ]);
    }

    /**
     * @param $level
     * @param $interval
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function subscribe(Request $request, $level, $interval) {
        return $request->user()->subscribed('Timekeeper')
            ? redirect()->route('profile.billing') // They're subscribed already, send 'em to the subscriptions list
            : view('profile.billing-subscribe',[
                'intent' => $request->user()->createSetupIntent(),
                'level' => $level,
                'plan' => strtolower($level . "_" . $interval),
                'interval' => $interval,
                'user' => $request->user(),
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
        try {
            $request->user()->startSubscription($level, $plan, $request->input('token'));
        } catch (IncompletePayment $exception) {
            return redirect()->route(
                'cashier.payment',
                [$exception->payment->id, 'redirect' => route('profile.billing')]
            )->with('error', 'Error processing payment: ' . $exception->getMessage());
        }

        UserSubscribedEvent::dispatch($request->user(), $plan);

        return ['success' => true, 'message' => 'Subscribed'];
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel(Request $request) {
        $subscription = $request->user()->subscription('Timekeeper');

        if($subscription->onGracePeriod()) {
            $subscription->cancelNow();
        } else {
            $subscription->cancel();
        }

        return redirect()->route('profile.billing');
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resume(Request $request) {
        if($request->user()->subscription('Timekeeper')->onGracePeriod()) {
            $request->user()->subscription('Timekeeper')->resume();
        }

        return redirect()->route('profile.billing');
    }
}
