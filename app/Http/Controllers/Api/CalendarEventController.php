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
        $event = new CalendarEvent($request->all());

        if(!auth('api')->user()->can('attach-event', $event)) {
            return response()->make(['success' => false, 'message' => "You don't have permission to make that event!"]);
        }

        $event->creator_id = auth('api')->user()->id;

        $event->save();

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

        if(!auth('api')->user()->can('update', $event)) {
            return response()->json(['error' => true, 'message' => 'Action not authorized.']);
        }

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
        $event = CalendarEvent::findOrFail($id);
        if(!auth('api')->user()->can('delete', $event)) {
            return response()->json(['error' => true, 'message' => "You're not authorized to delete that event!"]);
        }

        return $event->delete();
    }
}
