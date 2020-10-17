<?php


namespace App\Transformer;


use App\User;

class CalendarUserTransformer extends \League\Fractal\TransformerAbstract
{
    public function transform(User $user) {
        return [
            'id' => $user->id,
            'user_role' => $user->pivot->user_role,
            'username' => $user->username
        ];
    }
}
