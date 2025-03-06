@props(['calendar' => null])

@if($calendar->isPremium())
	@if($calendar->parent()->exists())
        <p class="mb-0 mt-1"><a @click="linked_popup();" href='#'>Where are the real-time advancement options?</a></p>
	@else
        <x-input-toggle x-model="advancement.advancement_enabled" label="Enable real-time advancement:" name="advancement.advancement_enabled"></x-input-toggle>

        <div class="flex flex-col mt-[0.5rem]" x-data="{ discord_webhooks: @json($calendar->discord_webhooks()->count()) }" x-show="advancement.advancement_enabled">
            <x-separator></x-separator>

            <strong>For every</strong>

            <div class="input-group-sm input-group my-[0.5rem]">
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

            <strong> Advance this calendar by </strong>

            <div class="input-group-sm input-group my-[0.5rem]">
                <input type='number' class='form-control input-group-prepend'
                    placeholder='1'
                    x-model="advancement.advancement_rate"
                    @change="($event) => { advancement.advancement_rate = Math.max(1, Number($event.target.value)) }"/>
                <label class="input-group-text form-control text-black">calendar</label>
                <select class='custom-select form-control input-group-append' x-model="advancement.advancement_rate_unit">
                    <option :disabled='!clock_enabled' value='minutes' x-text="advancement.advancement_rate > 1 ? 'minutes' : 'minute'"></option>
                    <option :disabled='!clock_enabled' value='hours' x-text="advancement.advancement_rate > 1 ? 'hours' : 'hour'"></option>
                    <option value='days' x-text="advancement.advancement_rate > 1 ? 'days' : 'day'"></option>
                </select>
            </div>

            <div class="warning" x-show="!clock_enabled">
                <small>
                    <i class="fas fa-info-circle"></i> The clock is not enabled, so minutes and hours are not available for real
                    time advancement.
                </small>
            </div>

            <x-separator></x-separator>

            <strong> Notification webhooks </strong>

            <div class="input-group">
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

            @feature('discord')
                <div class="mt-[0.75rem] alert alert-info px-3" style="background-color: #5865F2;"
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
	@endif
@else
    <p>Make your calendar advance its time automatically, with settings to control how fast or
        slow it should advance!</p>
    <p class='mb-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe
            now</a> to unlock this feature!</p>
@endif
