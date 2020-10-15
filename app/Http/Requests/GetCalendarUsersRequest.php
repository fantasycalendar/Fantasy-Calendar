<?php

namespace App\Http\Requests;

use App\Calendar;
use Illuminate\Foundation\Http\FormRequest;

class GetCalendarUsersRequest extends FormRequest
{
    /**
     * @var mixed
     */
    public $calendar;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->calendar = Calendar::active()->hash($this->route('id'))->firstOrFail();

        return $this->user()->can('update', $this->calendar);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [];
    }
}
