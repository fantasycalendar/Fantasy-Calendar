<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\Calendar;
use App\Transformer\CalendarEventTransformer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\CalendarEvent;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\DataArraySerializer;

class CalendarEventController extends Controller
{
    public function __construct() {
        $this->manager = new Manager();
        $this->manager->setSerializer(new DataArraySerializer());
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        /* TODO-Alex - Double checking whether the user can add one-time events, or in the case of co-owners, full events */
        /* One time events have the property of 'date' in event['data']['date'] - if it's an empty array, it's not an one-time */
        /* Also useful to perhaps check what event category it's using, so they can't sneakily add events to an illegal category (ie, not user-usable) */

        if(Auth::user()->can('attach-event', Calendar::find($request->input('calendar_id')))) {
            return ['success' => false, 'message' => 'access denied'];
        }

        $event = CalendarEvent::create(json_decode($request->getContent(), true));

        $resource = new Item($event, new CalendarEventTransformer());

        return $this->manager->createData($resource)->toArray();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return CalendarEvent::findOrFail($id);
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
        /* TODO-Alex - Double checking whether the user can edit this event - either is the owner of the event, a co-owner, or the owner of the calendar */
        return CalendarEvent::findOrFail($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        /* TODO-Alex - Double checking whether the user can delete this event - either is the owner of the event, a co-owner, or the owner of the calendar */
        return CalendarEvent::findOrFail($id)->delete();
    }
}
