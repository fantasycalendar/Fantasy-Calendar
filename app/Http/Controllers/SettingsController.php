<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserSettings;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateEmailRequest;
use Arr;
use Hash;
use Illuminate\Http\Request;
use Auth;
use Carbon\Carbon;

class SettingsController extends Controller
{
    public function profile() {
        $invoices = null;

        if (Auth::user()->hasStripeId()) {
            $invoices = Auth::user()->invoices();
        }

        $subscription = Auth::user()->subscriptions()->active()->first();
        
        $renews_at = $subscription ? (new Carbon($subscription->asStripeSubscription()->current_period_end))->toFormattedDateString() : False;

        return view('pages.profile', [
            'user' => Auth::user(),
            'subscription' => $subscription,
            'subscription_renews_at' => $renews_at,
            'invoices' => $invoices
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request) {
        Auth::user()->password = Hash::make($request->get('new_password'));
        Auth::user()->save();

        return redirect()->to(route('profile'));
    }

    public function updateEmail(UpdateEmailRequest $request) {
        Auth::user()->email = $request->get('new_email');
        Auth::user()->save();

        return redirect()->to(route('profile'));
    }

    public function update(StoreUserSettings $request) {
        Auth::user()->setSettings($request->only(['dark_theme']));
        
        Auth::user()->setMarketingStatus($request->has('marketing_acceptance'));

        return redirect('profile');
    }
}
