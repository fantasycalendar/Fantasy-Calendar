<?php

namespace App\Http\Controllers\Api;

use App\EventCategory;
use App\Http\Resources\Calendar;
use App\Transformer\CalendarEventTransformer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\CalendarEvent;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\DataArraySerializer;

class CalendarEventController extends Controller
{
    public $manager;

    public function __construct() {
        $this->manager = new Manager();
        $this->manager->setSerializer(new DataArraySerializer());

//        $this->authorizeResource(CalendarEvent::class, 'event');
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
        if(auth('api')->user()->can('attach-event', $request->all())) {
            return response()->make(['success' => false, 'message' => 'Access denied']);
        }

        $event = CalendarEvent::create(json_decode($request->getContent(), true));

        $resource = new Item($event, new CalendarEventTransformer());

        return response()->make($this->manager->createData($resource)->toArray());
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
        $event = CalendarEvent::findOrFail($id);

        if(auth('api')->user()->can('update', $event)) {
            return response()->json(['error' => true, 'message' => 'Action not authorized.']);
        }

        dd($request->all());

        return response()->json(['success' => $event->update($request->all()) > 0, 'message' => 'Event updated.']);
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
