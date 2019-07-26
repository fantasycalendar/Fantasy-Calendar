<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App\Calendar;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware(['calendarauth', 'auth']);
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
        // 
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
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
}
