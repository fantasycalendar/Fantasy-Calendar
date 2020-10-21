<?php

namespace App\Http\Requests;

use App\Calendar;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResendCalendarInvitationRequest extends FormRequest
{
    /**
     * @var mixed
     */
    public $calendar;
    /**
     * @var mixed
     */
    public $email;
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
        $this->calendar = Calendar::active()->hash($this->route('id'))->firstOrFail();
        $this->email = $this->input('email');
        $this->invitation = $this->calendar->invitations()->where('email', $this->email)->firstOrFail();

        return $this->user()->can('add-users', $this->calendar);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => [
                Rule::in($this->calendar->invitations()->get()->pluck('email')->toArray())
            ]
        ];
    }
}
