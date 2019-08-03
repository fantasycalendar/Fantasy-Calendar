<?php

namespace App\Transformer;

use League\Fractal;
use App\CalendarEventComment;

use Auth;

class EventCommentTransformer extends Fractal\TransformerAbstract {
    public function transform(CalendarEventComment $comment) {
        $username = $comment->user->username;
        if($comment->calendar->user->id == $comment->user_id) {
            $username .= " (Owner)";
        }

        return [
            'id' => $comment->id,
            'username' => $username,
            'event_id' => $comment->event_id,
            'calendar_id' => $comment->calendar_id,
            'content' => $comment->content,
            'date' => date('Y-m-d H:i:s', strtotime($comment->created_at)),
            'comment_owner' => (auth('api')->check() && $comment->user->id == auth('api')->user()->id),
            'calendar_owner' => (auth('api')->check() && $comment->calendar->user->id == auth('api')->user()->id),
        ];
    }
}