<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App\Calendar;
use App\EventCategory;
use App\CalendarEvent;

use App\Jobs\SaveEventCategories;
use App\Jobs\SaveCalendarEvents;

class CalendarController extends Controller
{
    public function __construct() {
        // $this->middleware('calendarauth');
        
        $this->middleware('auth')->except('show');

        $this->middleware('verified')->only('edit');

        $this->authorizeResource(Calendar::class, 'calendar');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $calendars = (Auth::user()->permissions == 1) ? Calendar::active()->with('user')->get() : Auth::user()->calendars;

        return view('home', [
            'title' => "Fantasy Calendar",
            'calendars' => $calendars,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('calendar.create', [
            'title' => 'New Calendar'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $hash = md5(request('calendar_name').request('dynamic_data').request('static_data').(Auth::user()->id).date("D M d, Y G:i"));

        $static_data = json_decode(request('static_data'), true);
        if(array_key_exists('categories', $static_data['event_data'])) {
            $categories = $static_data['event_data']['categories'];
            unset($static_data['event_data']['categories']);
        }

        if(array_key_exists('events', $static_data['event_data'])) {
            $events = $static_data['event_data']['events'];
            unset($static_data['event_data']);
        }

        $calendar = Calendar::create([
            'user_id' => Auth::user()->id,
            'name' => request('name'),
            'dynamic_data' => json_decode(request('dynamic_data')),
            'static_data' => $static_data,
            'hash' => $hash
        ]);

        // Split out Categories first
        $categoryids = SaveEventCategories::dispatchNow($categories, $calendar->id);


        // Now split out events
        $eventids = SaveCalendarEvents::dispatchNow($events, $categoryids, $calendar->id);

        return [
            'success' => true,
            'hash' => $hash
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Calendar $calendar)
    {
        return view('calendar.view', [
            'calendar' => $calendar,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Calendar $calendar)
    {
        return view('calendar.edit', [
            'calendar' => $calendar,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Calendar $calendar)
    {
        $update_data = $request->only(['name', 'dynamic_data', 'static_data', 'children', 'master_hash']);

        if(array_key_exists('dynamic_data', $update_data)) {
            $update_data['dynamic_data'] = json_decode($update_data['dynamic_data']);
        }

        if(array_key_exists('static_data', $update_data)) {
            $static_data = json_decode($update_data['static_data'], true);

            // Split out Categories first
            $categoryids = SaveEventCategories::dispatchNow($static_data['event_data']['categories'], $calendar->id);

            // Now split out events
            SaveCalendarEvents::dispatchNow($static_data['event_data']['events'], $categoryids, $calendar->id);

            unset($static_data['event_data']);
            $update_data['static_data'] = $static_data;
        }


        $calendar_was_updated = $calendar->update($update_data);

        if($calendar_was_updated == 0) {
            return [ 'success' => false, 'error' => 'Error - Unable to update calendar. Please try again later.'];
        }
         
        return [ 'success' => true, 'data'=> true ];

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function print(Calendar $calendar) {
        return view('calendar.print', [
            'calendar' => $calendar
        ]);
    }
}
