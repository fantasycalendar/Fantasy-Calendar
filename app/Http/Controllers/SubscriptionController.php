<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Redirect;

class SubscriptionController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except(['index', 'pricing']);
    }

    public function pricing(Request $request) {
        return view('subscription.pricing');
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

    public function subscribe($level) {
        // They're subscribed already, send 'em to the subscriptions list
        if(Auth::user()->subscriptions()->active()->get()->count() > 0) {
            return Redirect::route('subscription.index');
        }

        $intent = Auth::user()->createSetupIntent();

        return view('subscription.subscribe',[
            'intent' => $intent,
            'level' => $level,
            'plan' => 'plan_GBI6szgndC5JSt'
        ]);
    }

    public function update(Request $request) {
        $user = Auth::user();

        $user->newSubscription('Timekeeper', 'plan_GBI6szgndC5JSt')->create($request->input('token'));

        return ['success' => true, 'message' => 'Subscribed'];
    }

    public function cancellation() {
        return view('subscription.cancel', [
            'subscriptions' => Auth::user()->subscriptions()->active()->get()
        ]);
    }

    public function cancel($level) {
        $subscription = Auth::user()->subscription($level);

        if($subscription->onGracePeriod()) {
            $subscription->cancelNow();
        } else {
            $subscription->cancel();
        }

        return Redirect::route('subscription.index');
    }

    public function resume($level) {
        $subscription = Auth::user()->subscription($level);

        $subscription->resume();

        return Redirect::route('subscription.index');
    }
}
