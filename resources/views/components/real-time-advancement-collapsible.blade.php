@props(['calendar' => null])

@if(isset($calendar) && $calendar->isPremium())
	@if(request()->is('calendars/*/edit') && $calendar->parent()->exists())
        <p class="mb-0 mt-3"><a onclick="linked_popup();" href='#'>Why can't I edit the real time advancement?</a></p>
	@else
		<div x-data="{ discord_webhooks: @json($calendar->discord_webhooks()->count()) }">

        <div class='row mb-1'>
            <div class='col bold-text'>Enable real-time advancement:</div>

            <div class='col-auto text-right'>
                @if(request()->is('calendars/*/edit') && $calendar->isChild())
                    <span x-text="advancement.advancement_enabled ? 'Yes' : 'No'"></span>
                @else
                    <label class="custom-control custom-checkbox center-text">
                        <input type="checkbox" class="custom-control-input" x-model="advancement.advancement_enabled">
                        <span class="custom-control-indicator"></span>
                    </label>
                @endif
            </div>
        </div>

        <div x-show="advancement.advancement_enabled">
            <div class="row no-gutters mt-3">
                <div class="separator"></div>
            </div>

            <div class='row mt-2 mb-1 bold-text no-gutters text-center w-100'>
                For every
            </div>

            <div class='row no-gutters protip' data-pt-position="right"
                data-pt-title="This is how often in real world time that the calendar's time will be updated with the amount configured above">
                <div class="input-group-sm input-group">
                    <input type='number' class='form-control input-group-prepend'
                    placeholder='1'
                    x-model="advancement.advancement_real_rate"
                    @change="($event) => { advancement.advancement_real_rate = Math.max(1, Number($event.target.value)) }"/>
                    <label class="input-group-text form-control text-black">real world</label>
                    <select class='custom-select form-control input-group-append'
                        x-model="advancement.advancement_real_rate_unit">
                        <option value='minutes' x-text="advancement.advancement_real_rate > 1 ? 'minutes' : 'minute'">minutes</option>
                        <option selected value='hours' x-text="advancement.advancement_real_rate > 1 ? 'hours' : 'hour'">hours</option>
                        <option value='days' x-text="advancement.advancement_real_rate > 1 ? 'days' : 'day'">days</option>
                    </select>
                </div>
            </div>

            <div class='row bold-text no-gutters text-center w-100 my-2 pr-4'>
                Advance this calendar by
            </div>

            <div class='row no-gutters protip' data-pt-position="right"
                data-pt-title="This is the amount of time that will be added to the calendar's date, based on the real-time amount configured above">
                <div class="input-group-sm input-group">
                    <input type='number' class='form-control input-group-prepend'
                    placeholder='1'
                    x-model="advancement.advancement_rate"
                    @change="($event) => { advancement.advancement_rate = Math.max(1, Number($event.target.value)) }"/>
                    <label class="input-group-text form-control text-black">calendar</label>
                    <select class='custom-select form-control input-group-append'
                        x-model="advancement.advancement_rate_unit">
                        <option :disabled='!clock_enabled' value='minutes'
                        x-text="advancement.advancement_rate > 1 ? 'minutes' : 'minute'">minutes
                        </option>
                        <option :disabled='!clock_enabled' value='hours' x-text="advancement.advancement_rate > 1 ? 'hours' : 'hour'">
                        hours
                        </option>
                        <option value='days' x-text="advancement.advancement_rate > 1 ? 'days' : 'day'">days</option>
                    </select>
                </div>
            </div>

            <div class="my-2 warning" x-show="!clock_enabled">
                <small>
                    <i class="fas fa-info-circle"></i> The clock is not enabled, so minutes and hours are not available for real
                    time advancement.
                </small>
            </div>

            <div class="row no-gutters mt-3">
                <div class="separator"></div>
            </div>

            <div class='row mt-2 mb-1 bold-text no-gutters'>
                <div class="col">
                    Notification webhooks
                </div>
            </div>

            <div class='row no-gutters'>
                <div class="col input-group">
                    <select x-model="advancement.advancement_webhook_format" class='form-control form-control-sm'>
                        <option value="raw_json" :disabled="discord_webhooks > 0">Raw JSON</option>
                        @feature('discord')
                            <option value="discord">Discord</option>
                        @endfeature
                    </select>

                    <input
                    @feature('discord')
                    x-show="advancement.advancement_webhook_format != 'discord'"
                @endfeature
                type='text' x-model="advancement.advancement_webhook_url" class='form-control form-control-sm input-group-append
                flex-grow-2' style="flex:2;" placeholder='http://my-web-hook.com/'>
                    @feature('discord')
                    <a target="_blank" x-show="advancement.advancement_webhook_format == 'discord'"
                        class="btn btn-sm flex-grow input-group-append px-3"
                        style="background-color: #5865F2; border-color: #5865F2;"
                        href="{{ route('discord.webhookRedirect', ['calendarHash' => $calendar->hash]) }}">
                        Setup a Discord webhook
                    </a>
                @endfeature
                </div>
            </div>

            @feature('discord')
            <div class="row no-gutters mt-3 alert alert-info px-3" style="background-color: #5865F2;"
                x-show="discord_webhooks > 0">
                <div class="col-1">
                    <i class="fab fa-discord"></i>
                </div>
                <div class="col-11">
                    This calendar has <strong x-text="discord_webhooks"></strong> <span
                        x-text="discord_webhooks > 1 ? 'webhooks' : 'webhook'"></span> configured through the Discord integration.
                    You can manage <span x-text="discord_webhooks > 1 ? 'them' : 'it'"></span> via <a target="_blank"
                        href="{{ route('profile.integrations', ['discord_panel_open' => true]) }}">your
                        profile</a>.
                </div>
            </div>
        @endfeature

        </div>

    </div>
	@endif
@else

    <div class='row no-gutters my-1'>
        <p>Make your calendar advance its time automatically, with settings to control how fast or
            slow it should advance!</p>
        <p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe
                now</a> to unlock this feature!</p>
    </div>

@endif
