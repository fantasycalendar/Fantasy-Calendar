<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountUpdateRequest;
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
        $subscription = $request->user()->subscriptions()->active()->first();

//        dd($request->user()->invoices()->first());

        return view('pages.profile', [
            'user' => $request->user(),
            'subscription' => $subscription,
            'subscription_renews_at' => format_timestamp($subscription?->asStripeSubscription()->current_period_end),
            'invoices' => $request->user()->invoices() ?? null
        ]);
    }

    public function updateEmail(Request $request) {

        if(!$request->hasValidSignature() || Auth::user()->email != $request->get('old_email')) {
            abort(401, 'Nope');
        }

        Auth::user()->email = $request->get('new_email');
        Auth::user()->save();

        return redirect(route('profile'))->with('alerts', ['email-success' => "Email successfully updated!"]);
    }

    public function updateAccount(AccountUpdateRequest $request) {
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
