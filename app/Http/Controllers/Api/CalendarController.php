<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarCollection;

use App\Calendar;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api')->except('last_changed', 'children');

        $this->authorizeResource(Calendar::class, 'calendar');
    }

    public function index(Request $request) {
        CalendarCollection::withoutWrapping();

        return new CalendarCollection($request->user()->calendars);
    }

    public function show(Request $request, Calendar $calendar) {
        return $calendar;
    }

    public function children(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        return $calendar->child_calendars->keyBy('id');
    }

    public function last_changed(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        $last_changed = [
            'last_dynamic_change' => $calendar->last_dynamic_change,
            'last_static_change' => $calendar->last_static_change,
        ];

        return $last_changed;
    }

    public function owned(Request $request, $id) {
        $calendar = Calendar::hash($id)->firstOrFail();

        CalendarCollection::withoutWrapping();

        return new CalendarCollection($calendar->user->calendars->keyBy('hash'));
    }

    public function dynamic_data(Request $request, $id) {
        return Calendar::active()
            ->hash($id)
            ->user($request->user()->id)
            ->firstOrFail()->dynamic_data;
    }

    public function destroy(Request $request, $id) {
        return (string)Calendar::active()
        ->hash($id)
        ->user($request->user()->id)
        ->firstOrFail()->delete();
    }
}
