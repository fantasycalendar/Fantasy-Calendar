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

    public function account_migrated() {
        if(!Auth::check()) {
            return redirect('/');
        }

        if(!Auth::user()->migrated) {
            return redirect('https://www.fantasy-calendar.com/');
        }

        if(Auth::user()->acknowledged_migration) {
            return redirect(route('calendars.index'));
        }

        return view('pages.account-migrated');
    }
}
