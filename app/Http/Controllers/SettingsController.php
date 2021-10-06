<?php

namespace App\Http\Controllers;

use App\Notifications\RequestEmailUpdate;
use App\Http\Requests\StoreUserSettings;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateEmailRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Hash;
use Auth;
use Carbon\Carbon;

class SettingsController extends Controller
{
    public function profile(Request $request) {
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

    public function requestUpdateEmail(UpdateEmailRequest $request) {
        $new_email = $request->get('new_email');

        Notification::route('mail', Auth::user()->email)->notify(new RequestEmailUpdate(Auth::user(), $new_email));

        return redirect(route('profile'))->with('alert', "We have sent an email to your current email with the details to update your email!");
    }

    public function updateEmail(Request $request) {

        if(!$request->hasValidSignature() || Auth::user()->email != $request->get('old_email')) {
            abort(401);
        }

        Auth::user()->email = $request->get('new_email');
        Auth::user()->save();

        return redirect(route('profile'))->with('alert', "Email successfully updated!");
    }

    public function update(StoreUserSettings $request) {
        Auth::user()->setSettings($request->only(['dark_theme']));

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
