<?php

namespace App\Http\Requests;

use App\Models\CalendarInvite;
use Illuminate\Foundation\Http\FormRequest;

class RejectCalendarInviteRequest extends FormRequest
{
    /**
     * @var mixed
     */
    public $invitation;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->invitation = CalendarInvite::where('invite_token', $this->input('token'))->firstOrFail();

        return $this->user()->email === $this->invitation->email;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}
