<?php

namespace App\Http\Controllers;

use App\Calendar;
use App\CalendarInvite;
use App\Http\Middleware\ValidateRelativeSignedUrl;
use App\Http\Requests\AcceptCalendarInviteRequest;
use App\Http\Requests\RejectCalendarInviteRequest;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InviteController extends Controller
{
    public function accept(AcceptCalendarInviteRequest $request) {
        if($request->invitation->calendar->users->contains(Auth::user())) {
            return view('invite.already-accepted', [
                'calendar' => $request->invitation->calendar
            ]);
        }

        if(!$request->invitation->validForUser(Auth::user())) {
            throw new AuthorizationException("Invitation invalid.");
        }

        $request->invitation->accept();

        return view('invite.accepted', [
            'calendar' => $request->invitation->calendar
        ]);
    }

    public function showRejectConfirmation(RejectCalendarInviteRequest $request) {
        return view('invite.confirm-reject', [
            'invitation' => $request->invitation
        ]);
    }

    public function reject(RejectCalendarInviteRequest $request) {
        $request->invitation->reject();

        return redirect(route('calendars.index'))->with('alert-warning', sprintf('Invitation to %s rejected', $request->invitation->calendar->name));
    }

    public function register(Request $request) {
        return redirect(\URL::signedRoute('invite.accept', $request->except(['signature','expires']), now()->addHour(), false));
    }
}
