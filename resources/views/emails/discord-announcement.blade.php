@component('mail::marketing')
# Discord Integration

Dear {{ $user->username }},

We are proud to announce that we've just released our very own Discord integration! Access your calendars, set the date, and show it off to your players, all from the comfort of your own servers.

@if($user->hasDiscord())
Since you're a subscriber, you have access to it **right now**!
@else
Quick to setup, easy to use, and available **right now** to subscribers.
@endif

![Image showing adding days and displaying a calendar in Discord]({{ asset('resources/discord/discord_show_month.png') }})

@component('mail::button', ['url' => URL::route('discord')])
Check it out!
@endcomponent

Thanks,<br>
The {{ config('app.name') }} team

@endcomponent


