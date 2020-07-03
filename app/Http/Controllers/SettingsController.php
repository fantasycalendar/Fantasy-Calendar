<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserSettings;
use Arr;
use Illuminate\Http\Request;
use Auth;

class SettingsController extends Controller
{
    public function index() {
        return view('pages.settings', [
            'user' => Auth::user(),
            'settings' => Auth::user()->settings ?? []
        ]);
    }

    public function update(StoreUserSettings $request) {
        Auth::user()->setSettings(Arr::only($request->all(), ['dark_theme']));

        return redirect('profile');
    }
}
