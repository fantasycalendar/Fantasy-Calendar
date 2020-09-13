<?php

namespace App\Http\Controllers;

use App\Calendar;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InviteController extends Controller
{
    protected $routeMiddleware = [
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
    ];

    public function accept(Request $request) {
        $calendar = Calendar::hash($request->input('calendar'))->firstOrFail();

        if($calendar->users->contains(Auth::user())) {
            return view('invite.already-accepted', [
                'calendar' => $calendar
            ]);
        }

        if(Auth::user()->email != $request->input('email')) {
            throw new AuthorizationException("Invitation invalid for your user account.");
        }

        $calendar->users()->attach(Auth::user(), ['user_role' => 'observer']);
        $calendar->save();

        return view('invite.accepted', [
            'calendar' => $calendar
        ]);
    }

    public function register(Request $request) {
        return redirect(route('invite.accept', ['calendar' => $request->input('calendar')]));
    }
}
