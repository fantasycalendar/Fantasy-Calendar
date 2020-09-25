<?php

namespace App\Http\Controllers;

use App\Calendar;
use App\CalendarInvite;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InviteController extends Controller
{
    protected $routeMiddleware = [
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
    ];

    public function accept(Request $request) {
        $invitation = CalendarInvite::where('invite_token', $request->input('token'))->firstOrFail();

        if($invitation->calendar->users->contains(Auth::user())) {
            return view('invite.already-accepted', [
                'calendar' => $invitation->calendar
            ]);
        }

        if(
            !$invitation->validForCalendar($request->input('calendar'))
            || !$invitation->validForUser(Auth::user()))
        {
            throw new AuthorizationException("Invitation invalid.");
        }

        $invitation->accept();

        return view('invite.accepted', [
            'calendar' => $invitation->calendar
        ]);
    }

    public function register(Request $request) {
        return redirect(route('invite.accept', ['calendar' => $request->input('calendar')]));
    }
}
