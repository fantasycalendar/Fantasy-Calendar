<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function loginas($userid) {
        Auth::logout();

        Auth::loginUsingId($userid);

        return redirect()->route('home');
    }
}
