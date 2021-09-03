@component('mail::marketing', ['user' => $user])
# Discord Integration & Large Update

Dear {{ $user->username }},

We are proud to announce our very own **Discord integration**! Access your calendars, set their dates, and show it off to your players — all from the comfort of your own Discord server.

![Image showing adding days and displaying a calendar in Discord]({{ asset('resources/discord/discord_show_month.png') }})

@if($user->isPremium())
It's quick to set up, easy to use, and available **right now**!

As you're a subscriber, we'd like to take this opportunity to thank you for your support. Fantasy-Calendar is a passion project, and we could not have done it without you!
@else
Quick to set up, easy to use, and available **right now** for subscribers. Only $2.49/month (or $24.99/year)!
@endif

@component('mail::button', ['url' => URL::route('discord')])
    Check it out!
@endcomponent

This release also contains a lot of bugfixes and updates, so be sure to read over the [changelog]({{URL::route('changelog')}})!

Thanks,<br>
The {{ config('app.name') }} team

@endcomponent


