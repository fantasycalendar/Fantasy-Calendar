<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WelcomeController extends Controller
{
    public function welcome() {
        if(Auth::check()) {
            return redirect(route('calendars.index'));
        }

        return view('welcome');
    }

    public function account_migrated_acknowledge() {
        Auth::user()->acknowledgeMigration();

        return redirect(route('calendars.index'));
    }

    public function discord_announcement_acknowledge() {
        Auth::user()->acknowledgedDiscordAnnouncement();

        return redirect(route('calendars.index'));
    }
}
