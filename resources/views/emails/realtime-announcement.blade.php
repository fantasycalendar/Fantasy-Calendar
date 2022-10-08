@component('mail::marketing', ['user' => $user])
# Fantasy Calendar now exists in realtime!

Dear {{ $user->username }},

We are excited to announce that we have created one of the most requested features thus far; Real-Time Advancement - calendars can now be configured to automatically increment the date!

@if($user->isPremium())
It's quick to set up, easy to use, and available **right now** on all of your calendars!

As always, thank you for your support through your subscription - Fantasy-Calendar is a passion project, and we could not have gotten this far without you!
@else
Quick to set up, easy to use, and available **right now** for subscribers. Only $2.49/month (or $24.99/year)!
@endif

<img src="{{ asset('resources/screenshots/advancement.png') }}" alt="Where it's at">

Thanks,<br>
The {{ config('app.name') }} team

@endcomponent


