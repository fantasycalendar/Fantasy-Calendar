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
}
