<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App\Calendar;
use App\EventCategory;
use App\CalendarEvent;

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
        $categories = [];

        $static_data = json_decode(request('static_data'), true);
        if(array_key_exists('categories', $static_data['event_data'])) {
            $categories = $static_data['event_data']['categories'];
            unset($static_data['event_data']['categories']);
        }

        if(array_key_exists('events', $static_data['event_data'])) {
            $events = $static_data['event_data']['events'];
            unset($static_data['event_data']['events']);
        }

        $calendar = Calendar::create([
            'user_id' => Auth::user()->id,
            'name' => request('name'),
            'dynamic_data' => json_decode(request('dynamic_data')),
            'static_data' => $static_data,
            'hash' => $hash
        ]);

        $categoryidmap = [];
        $categoryId = 0;

        foreach($categories as $category) {
            $category['calendar_id'] = $calendar->id;
            $newCategory = EventCategory::create($category);
            $categoryidmap[] = $newCategory->id;
        }

        foreach($events as $event) {
            $event['calendar_id'] = $calendar->id;
            if(array_key_exists('category', $event)) {
                $event['event_category_id'] = ((int)$event['category'] < 0) ? NULL : $categoryidmap[(int)$event['category']];
            }
            CalendarEvent::create($event);
        }

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
            // Split out Categories first
            $static_data = json_decode($update_data['static_data'], true);
            $categories = $static_data['event_data']['categories'];
            unset($static_data['event_data']['categories']);

            $categoryids = [];
            foreach($categories as $category) {
                if(array_key_exists('id', $category)) {
                    $categoryids[] = $category['id'];
                    $category['category_settings'] = json_encode($category['category_settings']);
                    $category['event_settings'] = json_encode($category['event_settings']);
                    EventCategory::where('id', $category['id'])->update($category);
                } else {
                    $category['calendar_id'] = $calendar->id;
                    $category = EventCategory::Create($category);
                    $categoryids[] = $category->id;
                }
            }
            EventCategory::where('calendar_id', $calendar->id)->whereNotIn('id', $categoryids)->delete();

            // Now split out events
            $events = $static_data['event_data']['events'];
            $update_data['static_data'] = $static_data;
            unset($static_data['event_data']['events']);

            $eventids = [];
            foreach($events as $event) {
                if($event['event_category_id'] < 0) $event['event_category_id'] = null;
                if(array_key_exists('id', $event)) {
                    $eventids[] = $event['id'];
                    $event['data'] = json_encode($event['data']);
                    $event['settings'] = json_encode($event['settings']);
                    CalendarEvent::where('id', $event['id'])->update($event);
                } else {
                    $event['calendar_id'] = $calendar->id;
                    $event = CalendarEvent::Create($event);
                    $eventids[] = $event->id;
                }
            }
            CalendarEvent::where('calendar_id', $calendar->id)->whereNotIn('id', $eventids)->delete();
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
