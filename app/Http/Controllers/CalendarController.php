<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CalendarController extends Controller
{

    /*
    TODO: User invites
    TODO: Pagination
    */
    public function index(Request $request) {
        return Inertia::render('CalendarsList', [
//        'invitations' => $request->user()->getInvitations(),
            'calendars' => $request->user()
                ->calendars()
                ->without(['events', 'event_categories'])
                ->with(['user'])
                ->withCount(['events', 'event_categories', 'users'])
                ->when($request->get('search'), function($query, $search) {
                    $query->search($search);
                })->get(),
            'shared_calendars' => $request->user()
                ->related_calendars()
                ->where('disabled', '=', 0)
                ->without(['events', 'event_categories'])
                ->with(['user'])
                ->withCount(['events', 'event_categories', 'users'])
                ->when($request->get('search'), function($query, $search) {
                    $query->search($search);
                })->get(),
        ]);
    }

    public function show(Calendar $calendar)
    {
        return Inertia::render('Calendar/Calendar', [
            'calendar_attributes' => $calendar,
            'renderdata' => json_decode(Storage::get('renderdata.json'), true),
        ]);
    }
}
