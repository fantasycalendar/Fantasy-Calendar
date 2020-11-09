@component('mail::message')
# The 2.0 Update

Dear {{ $user->username }},

We are excited to announce that we've just released a vast update to Fantasy Calendar! It boasts a **huge** amount of upgrades, changes, quality of life improvements, and a whole new UI.

But don't worry! All of your calendars are safe, events and all, as we've taken great care to preserve them just as they were in the old system.

![Image showcasing the new 2.0 interface](https://app.fantasy-calendar.com/resources/whats-new-2-0.png)

@component('mail::button', ['url' => URL::route('whats-new')])
Check out what's new!
@endcomponent

Don't worry - we won't send you any more emails about our stuff, unless you sign up for it!

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent
