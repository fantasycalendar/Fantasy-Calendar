<?php

namespace App\Http\Requests;

use App\Calendar;
use App\Rules\UserHasNoValidInvites;
use App\Rules\UserNotAlreadyPresentOnCalendar;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteCalendarUserRequest extends FormRequest
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
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->calendar = Calendar::active()->hash($this->route('id'))->firstOrFail();
        $this->email = $this->input('email');

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
                'required',
                'email:rfc,dns',
                new UserNotAlreadyPresentOnCalendar($this->calendar),
                new UserHasNoValidInvites($this->calendar)
            ]
        ];
    }
}
