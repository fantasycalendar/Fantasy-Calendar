<?php

namespace App\Http\Controllers\Api;

use App\CalendarInvite;
use App\Http\Requests\ChangeUserRoleRequest;
use App\Http\Requests\GetCalendarUsersRequest;
use App\Http\Requests\InviteCalendarUserRequest;
use App\Http\Requests\RemoveUserFromCalendarRequest;
use App\Http\Requests\ResendCalendarInvitationRequest;
use App\Jobs\CloneCalendar;
use App\Notifications\CalendarInvitation;
use App\Notifications\UnregisteredCalendarInvitation;
use App\Transformer\CalendarUserTransformer;
use App\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarCollection;

use App\Calendar;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\DataArraySerializer;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api')->except('last_changed', 'children', 'show', 'dynamic_data');

        $this->authorizeResource(Calendar::class, 'calendar');

        $this->manager = new Manager();
        $this->manager->setSerializer(new DataArraySerializer());
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

    public function users(GetCalendarUsersRequest $request, $id) {
        $users = $request->calendar->users;

        $usersResource = new Collection($users, new CalendarUserTransformer());

        $result = array_merge(
            $this->manager->createData($usersResource)->toArray()['data'],
            $request->calendar->invitations()->active()->get()->map(function($invite) { return $invite->transformForCalendar(); })->toArray()
        );

        return $result;
    }

    public function inviteUser(InviteCalendarUserRequest $request) {
        $invitation = CalendarInvite::generate($request->calendar, $request->email);

        $invitation->send();

        return response()->json(['message' => 'Invite sent.']);
    }

    public function resend_invite(ResendCalendarInvitationRequest $request) {
        if(!$request->invitation->canBeResent()) {
            return response()->json(['error' => true, 'message' => "You're doing that too much. Try again later."], 422);
        }

        $request->invitation->resend();

        return $request->invitation->transformForCalendar();
    }

    public function changeUserRole(ChangeUserRoleRequest $request, $id) {

        $request->calendar->users()->updateExistingPivot($request->input('user_id'), $request->only(['user_role']));

        $request->calendar->save();

        return $request->calendar->users;
    }

    public function removeUser(RemoveUserFromCalendarRequest $request) {
        return $request->calendar->removeUser($request->input('user_id'), $request->input('remove_all'), $request->input('email'));
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
