@component('mail::marketing')
# Discord Integration & Large Update

Dear {{ $user->username }},

We are proud to announce that we've just released our very own **Discord integration**! Access your calendars, set the date, and show it off to your players, all from the comfort of your own servers.

![Image showing adding days and displaying a calendar in Discord]({{ asset('resources/discord/discord_show_month.png') }})

@if($user->isPremium())
Quick to setup, easy to use, and available for you **right now**!

As you're a subscriber, we'd like to take this opportunity to thank you for your support. Fantasy-Calendar is a passion project, and we could not have done it without you!
@else
Quick to setup, easy to use, and available **right now** to subscribers. Only $2.49/month (or $24.99/year)!
@endif

@component('mail::button', ['url' => URL::route('discord')])
    Check it out!
@endcomponent

This update brings a lot of fixes and updates, such as moon overrides, so be sure to take a look at the [changelog]({{URL::route('changelog')}})!

Thanks,<br>
The {{ config('app.name') }} team

@endcomponent


