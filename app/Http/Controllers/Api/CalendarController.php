<?php

namespace App\Http\Controllers\Api;

use App\Jobs\CloneCalendar;
use App\Notifications\CalendarInvitation;
use App\Notifications\UnregisteredCalendarInvitation;
use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarCollection;

use App\Calendar;
use Illuminate\Support\Facades\Notification;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api')->except('last_changed', 'children', 'show', 'dynamic_data');

        $this->authorizeResource(Calendar::class, 'calendar');
    }

    public function index(Request $request) {
        CalendarCollection::withoutWrapping();

        return new CalendarCollection($request->user()->calendars);
    }

    public function show(Request $request, Calendar $calendar) {
        return $calendar;
    }

    public function clone(Request $request, $id) {
        return $this->dispatchNow(new CloneCalendar($id, $request->get('new_calendar_name')));
    }

    public function last_changed(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        return [
            'last_dynamic_change' => $calendar->last_dynamic_change,
            'last_static_change' => $calendar->last_static_change,
        ];
    }

    public function children(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        return $calendar->children;

    }

    public function updateChildren(Request $request){

        $request = $request->only('data');

        $update_data = json_decode($request['data']);

        foreach($update_data as $hash => $dynamic_data){

            $calendar = Calendar::hash($hash)->firstOrFail();

            $calendar->update( ['dynamic_data' => $dynamic_data ]);

        }

        return [ 'success' => true, 'data' => true ];

    }

    public function owned(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        CalendarCollection::withoutWrapping();

        return new CalendarCollection($calendar->user->calendars->keyBy('hash'));
    }

    public function users(Request $request, $id) {
        return Calendar::active()
            ->hash($id)
            ->firstOrFail()->users;
    }

    public function inviteUser(Request $request, $id) {
        $calendar = Calendar::active()->hash($id)->firstOrFail();
        $email = $request->input('email');


        if(!auth('api')->user()->can('add-users', $calendar)) {
            return response()->json(['error' => true, 'message' => 'Action not authorized.'], 403);
        }


        try {
            $user = User::whereEmail($email)->firstOrFail();

            if($calendar->users->contains($user)) {
                return response()->json(['error' => true, 'message' => 'This calendar already has user "'.$user->email.'"']);
            }

            $user->notify(new CalendarInvitation($calendar));
        } catch (ModelNotFoundException $e) {
            Notification::route('mail', $email)
                ->notify(new UnregisteredCalendarInvitation($calendar, $email));
        }


        return response()->json(['error' => false, 'message' => 'Invite sent.']);
    }

    public function changeUserRole(Request $request, $id) {
        $calendar = Calendar::active()->hash($id)->firstOrFail();

        $calendar->users()->updateExistingPivot($request->input('user_id'), $request->only(['user_role']));

        $calendar->save();

        return $calendar->users;
    }

    public function removeUser(Request $request, $id) {
        $validatedData = $request->validate([
            'user_id' => ['required', 'integer']
        ]);

        $calendar = Calendar::active()->hash($id)->firstOrFail();

        $calendar->users()->detach($request->input('user_id'));

        $calendar->save();

        return $calendar->users;
    }

    public function dynamic_data(Request $request, $id) {
        return Calendar::active()
            ->hash($id)
            ->firstOrFail()->dynamic_data;
    }

    public function destroy(Request $request, Calendar $calendar) {
        return (string)$calendar->delete();
    }
}
