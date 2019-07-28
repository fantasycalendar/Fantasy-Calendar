<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App\Calendar;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('calendarauth');
        
        $this->middleware('auth')->except('show');
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

        Calendar::create([
            'user_id' => Auth::user()->id,
            'name' => request('name'),
            'dynamic_data' => request('dynamic_data'),
            'static_data' => request('static_data'),
            'hash' => $hash
        ]);

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
    public function show($id)
    {
        $calendar = Calendar::where('hash',$id)->firstOrFail();

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
    public function edit($id)
    {
        $calendar = Calendar::where('hash',$id)->firstOrFail();

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
    public function update(Request $request, $id)
    {
        $calendars_updated = Calendar::where('hash', $id)
            ->update($request->only(['name', 'dynamic_data', 'static_data', 'children', 'master_hash']));
        
        if($calendars_updated == 0) {
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

    public function print($id) {
        $calendar = Calendar::where('hash', $id)->firstOrFail();

        return view('calendar.print', [
            'calendar' => $calendar
        ]);
    }
}
