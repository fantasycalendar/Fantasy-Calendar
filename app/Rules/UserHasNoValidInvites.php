<?php

namespace App\Rules;

use App\Models\Calendar;
use App\Models\CalendarInvite;
use Illuminate\Contracts\Validation\Rule;

class UserHasNoValidInvites implements Rule
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
        return $this->calendar->invitations()->active()->where('email', $value)->count() === 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'An invitation has already been sent for that user.';
    }
}
