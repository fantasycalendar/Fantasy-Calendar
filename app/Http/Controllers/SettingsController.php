<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserSettings;
use App\Http\Requests\UpdatePasswordRequest;
use Arr;
use Hash;
use Illuminate\Http\Request;
use Auth;

class SettingsController extends Controller
{
    public function profile() {
        $invoices = null;

        if (Auth::user()->hasStripeId()) {
            $invoices = Auth::user()->invoices();
        }

        return view('pages.profile', [
            'user' => Auth::user(),
            'subscription' => Auth::user()->subscriptions()->active()->first(),
            'invoices' => $invoices
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request) {
        Auth::user()->password = Hash::make($request->get('new_password'));
        Auth::user()->save();

        return redirect()->to(route('profile'));
    }

    public function update(StoreUserSettings $request) {
        Auth::user()->setSettings(Arr::only($request->all(), ['dark_theme']));

        return redirect('profile');
    }
}
