@component('mail::message')
# The 2.0 Update

Dear {{ $user->username }},

We are excited to announce that we've just released a vast update to Fantasy Calendar! It boasts a huge amount of upgrades, changes, quality of life improvements, and a whole new UI.

But don't worry! All of your calendars are safe, events and all, as we've taken great care to preserve them just as they were in the old system.

@component('mail::button', ['url' => URL::route('whats-new')])
What's New
@endcomponent

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent
