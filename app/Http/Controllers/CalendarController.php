<?php

namespace App\Http\Controllers;

use App\Jobs\PrepCalendarForExport;
use GrahamCampbell\Markdown\Facades\Markdown;
use Illuminate\Http\Request;

use Auth;
use App\Calendar;
use App\EventCategory;
use App\CalendarEvent;

use App\Jobs\SaveEventCategories;
use App\Jobs\SaveCalendarEvents;
use Illuminate\Support\Facades\Storage;

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
    public function index(Request $request)
    {
        $calendars = Calendar::active()->search($request->input('search'));

        $calendars = (Auth::user()->permissions == 1) ? $calendars->with('user') : $calendars->where('user_id', Auth::user()->id);

        $calendarSimplePagination = $calendars->simplePaginate(10);
        $calendars = $calendars->paginate(10);


        $changelog = Markdown::convertToHtml(Storage::disk('base')->get('public/changelog.md'));

        return view('calendar.list', [
            'title' => "Fantasy Calendar",
            'calendars' => $calendars,
            'calendar_pagination' => $calendarSimplePagination,
            'changelog' => $changelog,
            'search' => $request->input('search'),
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

        $calendar = Calendar::create([
            'user_id' => Auth::user()->id,
            'name' => request('name'),
            'dynamic_data' => json_decode(request('dynamic_data')),
            'static_data' => $static_data,
            'hash' => $hash
        ]);

        // Split out Categories first
        $categoryids = SaveEventCategories::dispatchNow(json_decode(request('event_categories'), true), $calendar->id);


        // Now split out events
        $eventids = SaveCalendarEvents::dispatchNow(json_decode(request('events'), true), $categoryids, $calendar->id);

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
     * Show the form for exporting the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function export($id)
    {
        $exportdata = PrepCalendarForExport::dispatchNow(Calendar::hash($id)->firstOrFail());

        return view('calendar.export', [
            'exportdata' => $exportdata,
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
        $update_data = $request->only(['name', 'dynamic_data', 'static_data', 'children', 'master_hash', 'event_categories', 'events']);
        $categoryids = [];

        if(array_key_exists('dynamic_data', $update_data)) {
            $update_data['dynamic_data'] = json_decode($update_data['dynamic_data']);
        }

        if(array_key_exists('static_data', $update_data)) {
            $static_data = json_decode($update_data['static_data'], true);
            unset($static_data['event_data']);
            $update_data['static_data'] = $static_data;
        }

        if(array_key_exists('event_categories', $update_data)) {
            $categoryids = SaveEventCategories::dispatchNow(json_decode($update_data['event_categories'], true), $calendar->id);
        }

        if(array_key_exists('events', $update_data)) {
            SaveCalendarEvents::dispatchNow(json_decode($update_data['events'], true), $categoryids, $calendar->id);
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
