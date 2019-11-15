<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request) {
        $intent = (Auth::check()) ? Auth::user()->createSetupIntent() : false;

        return view('subscriptions.subscribe',[
            'intent' => $intent
        ]);
    }

    public function update(Request $request) {
        $user = Auth::user();

        $user->newSubscription('Timekeeper', 'plan_GBI6szgndC5JSt')->create($request->input('token'));

        return ['success' => true, 'message' => 'Subscribed'];
    }
}
