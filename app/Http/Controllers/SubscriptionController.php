<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Redirect;

class SubscriptionController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except(['index', 'pricing']);
    }

    public function pricing(Request $request) {
        $subscribed = false;
        if(Auth::check() && Auth::user()->subscriptions()->active()->get()->count() > 0) {
            $subscribed = true;
        }

        return view('subscription.pricing', [
            'subscribed' => $subscribed
        ]);
    }

    public function index(Request $request) {
        $subscriptions = Auth::user()->subscriptions()->active()->get();

        if(count($subscriptions) < 1) {
            return Redirect::route('subscription.pricing');
        }

        return view('subscription.index', [
            'subscriptions' => $subscriptions
        ]);
    }

    public function subscribe($level, $interval) {
        // They're subscribed already, send 'em to the subscriptions list
        if(Auth::user()->subscriptions()->active()->get()->count() > 0) {
            return Redirect::route('profile');
        }

        $intent = Auth::user()->createSetupIntent();
        $plan = strtolower($level . "_" . $interval);

        return view('subscription.subscribe',[
            'intent' => $intent,
            'level' => $level,
            'plan' => $plan,
            'interval' => $interval,
            'user' => Auth::user()
        ]);
    }

    public function update(Request $request, $level, $plan) {
        $user = Auth::user();

        try {
            $user->newSubscription($level, $plan)->create($request->input('token'));
        } catch (IncompletePayment $exception) {
            
            return redirect()->route(
                'cashier.payment',
                [$exception->payment->id, 'redirect' => route('profile')]
            );
        }
        return ['success' => true, 'message' => 'Subscribed'];
    }

    public function swap(Request $request, $level, $plan) {
        $user = Auth::user();

        $user->newSubscription($level, $plan)->create($request->input('token'));

        return ['success' => true, 'message' => 'Subscribed'];
    }

    public function cancellation() {
        return view('subscription.cancel', [
            'subscriptions' => Auth::user()->subscriptions()->active()->get()
        ]);
    }

    public function cancel() {
        $subscription = Auth::user()->subscriptions()->active()->first();

        if($subscription->onGracePeriod()) {
            $subscription->cancelNow();
        } else {
            $subscription->cancel();
        }

        return Redirect::route('profile');
    }

    public function resume($level) {
        $subscription = Auth::user()->subscription($level);

        $subscription->resume();

        return Redirect::route('profile');
    }
}
