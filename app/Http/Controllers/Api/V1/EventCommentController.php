<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\DataArraySerializer;

use App\Models\CalendarEventComment;
use App\Transformer\EventCommentTransformer;

class EventCommentController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $commentData = [
            'user_id' => auth()->user()->id,
            'event_id' => $request->get('event_id'),
            'calendar_id' => $request->get('calendar_id'),
            'content' => $request->get('content')
        ];

        if(!auth()->user()->can('add-comment', [$commentData])) {
            return response()->make(['success' => false, 'message' => "You're not authorized to comment on this event!"]);
        }

        $comment = CalendarEventComment::create($commentData);

        $resource = new Item($comment, new EventCommentTransformer);

        return $this->manager->createData($resource)->toArray();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id of the comment on
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $comments = CalendarEventComment::findOrFail($id);

        $resource = new Item($comments, new EventCommentTransformer);

        return $this->manager->createData($resource)->toArray();
    }

    /**
     * Display all the comments for a specific event
     *
     * @param int $id of the event to get comments for
     * @return \Illuminate\Http\Response
     */
    public function forEvent($id)
    {
        $comments = CalendarEventComment::with('user')->where('event_id', $id)->get();

        $resource = new Collection($comments, new EventCommentTransformer);

        return $this->manager->createData($resource)->toArray();
    }

    /**
     * Display all the comments for events on a specific calendar
     *
     * @param int $id of the event to get comments for
     * @return \Illuminate\Http\Response
     */
    public function forCalendar($id)
    {
        $comments = CalendarEventComment::with('user')->where('calendar_id', $id)->get();

        $resource = new Collection($comments, new EventCommentTransformer);

        return $this->manager->createData($resource)->toArray();
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
        $comment = CalendarEventComment::find($id);

        if(!auth()->user()->can('update', $comment)) {
            return response()->json(['success' => false, 'message' => "You're not authorized to edit that event comment!"]);
        }

        return response()->json(['success' => $comment->update($request->all())]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = CalendarEventComment::findOrFail($id);
        if(!auth()->user()->can('delete', $comment)) {
            return response()->json(['error' => true, 'message' => "You're not authorized to delete that event comment!"]);
        }

        return response()->json(['success' => $comment->delete(), 'message' => "Comment deleted."]);
    }
}
