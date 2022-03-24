<?php

namespace App\Transformer;

use League\Fractal;
use App\Models\CalendarEventComment;

use Auth;

class EventCommentTransformer extends Fractal\TransformerAbstract {
    public function transform(CalendarEventComment $comment) {
        $username = $comment->user->username;
        $calendar_owner = false;
        if($comment->calendar->user->id == $comment->user_id) {
            $username;
            $calendar_owner = true;
        }

        return [
            'id' => $comment->id,
            'username' => $username,
            'event_id' => $comment->event_id,
            'calendar_id' => $comment->calendar_id,
            'content' => $comment->content,
            'date' => date('Y-m-d H:i:s', strtotime($comment->created_at)),
            'comment_owner' => (auth()->check() && $comment->user->id == auth()->user()->id),
            'calendar_owner' => $calendar_owner,
        ];
    }
}
