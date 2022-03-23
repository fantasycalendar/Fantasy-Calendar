<?php

namespace App\Rules;

use App\Models\Calendar;
use Illuminate\Contracts\Validation\Rule;

class UserNotAlreadyPresentOnCalendar implements Rule
{
    /**
     * @var Calendar
     */
    private $calendar;

    /**
     * Create a new rule instance.
     *
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return $this->calendar->users()->whereEmail($value)->count() === 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'A user with that email already exists on this calendar.';
    }
}
