@extends('templates._page')

@push('head')
    <script>
        function toggleSetting(name) {
            document.getElementById(name).value=1-document.getElementById(name).value;
            if(document.getElementById(name+'_input').getAttribute('checked') === 'checked') {
                document.getElementById(name+'_input').removeAttribute('checked');
            } else {
                document.getElementById(name+'_input').setAttribute('checked', 'checked');
            }
        }


        function ProfileManager() {

            return {

                changing_password: false,
                password_valid: false,
                new_password: '',
                new_password_confirmation: '',
                was_validated: false,

                confirm_password: function() {
                    this.was_validated = true;
                    this.password_valid = this.new_password.length > 7 && this.new_password !== '' && this.new_password_confirmation !== '' && this.new_password === this.new_password_confirmation
                },

                changing_email: false,
                email_valid: false,
                new_email: '',
                new_email_confirmation: '',
                was_validated: false,

                confirm_email: function() {
                    this.was_validated = true;
                    this.email_valid = validateEmail(this.new_email) && this.new_email === this.new_email_confirmation;
                }
            }

        }

    </script>
    @if(!empty(env('DISCORD_CLIENT_ID')))
        <script>
            function confirmDisconnect() {
                swal.fire({
                    title: "Are you sure?",
                    text: "Your Discord account will be disconnected from Fantasy Calendar. Commands will no longer work for you, but you will still need to remove the app from any servers you don't want it in in order to remove it completely.",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    icon: "warning",
                }).then((result) => {
                    if(!result.dismiss) {
                        self.location = '{{ route('discord.auth.remove') }}';
                    }
                });
            }
        </script>
    @endif
@endpush


@section('profile-card')
    <div class="row">
        <div class="col-12 col-md-4">
            <p><i class="fa fa-calendar"></i> Calendars: {{ $user->calendars_count }}</p>
        </div>
        <div class="col-12 col-md-8">
            <p><i class="fa fa-layer-group"></i> Subscription: {!! ($user->betaAccess()) ? "Timekeeper <br><small class='pl-3'>(Free for beta participation)</small>" : $user->paymentLevel() !!}</p>
            @empty($subscription)
                @unless($user->betaAccess())
                    <p><a class="btn btn-success form-control" href="{{ route('subscription.pricing') }}">Get subscribed</a></p>
                @else
                    <p><a href="{{ route('subscription.pricing', ['beta_override' => '1']) }}" class="btn btn-success form-control">Subscribe anyway</a></p>
                @endunless
            @else
                <p><i class="fa fa-credit-card"></i> {{ strtoupper($user->card_brand) }} (...{{ $user->card_last_four }})</p>
                @unless($subscription->onGracePeriod())
                    <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Cancel subscription</a></p>

                    <p>Renews on: {{ $subscription_renews_at }}</p>
                @endunless

                @if($subscription->onGracePeriod())
                    <p style="color: red;"><i class="fa fa-exclamation-triangle"></i> Cancelled, ending {{ $subscription->ends_at->format('Y-m-d') }}</p>
                    <p><a href="{{ route('subscription.resume') }}" class="btn btn-primary form-control">Resume Subscription</a></p>
                @endif

                @if(env('APP_ENV') !== 'production' && $subscription->onGracePeriod())
                    <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Immediately end benefits</a></p>
                @endif
            @endunless
        </div>
    </div>
    @if(!empty(env('DISCORD_CLIENT_ID')))
        <hr>
        <div class="row">
            <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between pt-3">
                @if(Auth::user()->discord_auth()->exists())
                    <div class="inner h-100 w-100 alert alert-success bg-accent p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                        <div class="d-flex justify-content-start align-items-center">
                            <h4 class="mb-0">
                                {{ Auth::user()->discord_auth->discord_username }}
                            </h4>
                        </div>
                        <hr class="d-md-none w-100 my-3" style="border-top-color: #246645;">
                        <a href="javascript:" onclick="confirmDisconnect()" class="btn btn-outline-danger alert-link">Disconnect</a>
                    </div>
                @else
                    <div>
                        <h4>Discord Integration</h4>
                        <p>You can connect your Fantasy Calendar account to Discord!</p>
                    </div>
                    <div>
                        <a href="{{ route('discord.index') }}" class="btn btn-primary">Check it out</a>
                    </div>
                @endif
            </div>
            @if(!Auth::user()->isPremium())
                <div class="col-12 alert alert-light">
                    <small>As a free user, you can use someone else's calendar, but you won't be able to use it for your own, nor add Fantasy Calendar to a new server.</small>
                </div>
            @endif
        </div>
    @endif
    <hr>
    <form id="settings" method="post">
        @csrf
        <div class="row">
            <div class="col-12"><h5>Preferences</h5></div>
            <div class="col-12">
                <div class="form-check pb-2" onclick="toggleSetting('dark_theme')">
                    <input id="dark_theme" type="hidden" name="dark_theme" @if(isset($user->settings['dark_theme']) && $user->settings['dark_theme']) value="1" @else value="0" @endisset>
                    <input id="dark_theme_input" type="checkbox" class="form-check-input" id="dark_theme" @if(isset($user->settings['dark_theme']) && $user->settings['dark_theme']) checked="checked" @endisset>
                    <label class="form-check-label" for="dark_theme">Enable dark theme</label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-check p-2 mb-3">
                    <input type="checkbox" class="form-check-input" name="marketing_acceptance" id="marketing_acceptance" @if($user->hasOptedInForMarketing()) checked="checked" @endisset>
                    <label class="form-check-label protip" data-pt-position="right" data-pt-title='Enabling this gives us consent to send you emails about our products and special offers - no spam! We hate inbox clutter as much as you do!' for="marketing_acceptance">
                        Send me product updates <i class="fas fa-question-circle"></i>
                    </label>
                </div>
            </div>
        </div>
        <button class="btn btn-primary float-right">Save Settings</button>
    </form>
@endsection

@section('profile-card-header')
    User information
@endsection

@section('content')
    <div class="container pt-5">
        @if(session()->has('alert'))
        <div class='row' x-data="{ 'dismissed': false }">
            <div class="col-12">
                <div class="alert alert-info" x-show="!dismissed"><a href="#" class="alert-link ml-2" style="float: right;" @click="dismissed = true"><i class="fa fa-times"></i></a> {{ session('alert') }} </div>
            </div>
        </div>
        @endif
        <div class="row">
            <div class="col-12 col-md-4">
                <div class="card">
                    <div class="card-header"><img class="rounded mr-1" style="max-height: 40px;" src="https://unavatar.now.sh/{{ $user->email }}?fallback=http://beta.fantasy-calendar.com/resources/logo-dark.png"> {{ $user->username }}</div>
                    <div class="card-body">

                        <p><i class="fa fa-envelope"></i>&nbsp;{{ Str::limit($user->email, 26) }}</p>
                        <p>Registered {{ ($user->created_at) ? $user->created_at->format('Y-m-d') : $user->date_register }}</p>

                        <div class="card-text" x-data="ProfileManager()">

                            <button class="btn btn-secondary w-100" x-show="!changing_password && !changing_email" @click="changing_password = !changing_password">Change Password</button>
                            <form action="/profile/password" method="POST" x-show="changing_password && !changing_email">
                                @csrf

                                <hr>
                                <label class="mt-2" for="new_password">New Password</label>
                                <input class="form-control required" required type="password" name="new_password" x-model="new_password" :class="{ 'is-invalid': was_validated && new_password.length < 7 }" @blur="confirm_password">

                                <div class="invalid-feedback" x-show="was_validated && new_password.length < 7">Password must be 8 characters long.</div>

                                <label class="mt-2" for="new_password_confirmation">Confirm New Password</label>
                                <input
                                    class="form-control required" required
                                    type="password"
                                    name="new_password_confirmation"
                                    x-model="new_password_confirmation"
                                    :class="{ 'is-invalid': was_validated && !password_valid }"
                                    @keyup="confirm_password"
                                    @blur="confirm_password">

                                <div class="invalid-feedback" x-show="was_validated && new_password !== new_password_confirmation">Passwords do not match.</div>

                                <button class="btn btn-primary mt-3 w-100" type="submit" :disabled="!was_validated || !password_valid">Update</button>
                            </form>

                            <button class="btn btn-secondary w-100 my-2" x-show="!changing_email && !changing_password" @click="changing_email = !changing_email">Change Email Address</button>
                            <form action="/profile/email" method="POST" x-show="changing_email && !changing_password">
                                @csrf

                                <hr>
                                <label class="mt-2" for="new_email">New Email Address</label>
                                <input class="form-control required" required type="email" name="new_email" x-model="new_email" :class="{ 'is-invalid': was_validated && new_email.length < 7 }" @blur="confirm_email">

                                <label class="mt-2" for="new_email_confirmation">Confirm New Email Address</label>
                                <input
                                    class="form-control required" required
                                    type="email"
                                    name="new_email_confirmation"
                                    x-model="new_email_confirmation"
                                    :class="{ 'is-invalid': was_validated && !email_valid }"
                                    @keyup="confirm_email"
                                    @blur="confirm_email">

                                <div class="invalid-feedback" x-show="was_validated && new_email !== new_email_confirmation">Emails do not match.</div>

                                <button class="btn btn-primary mt-3 w-100" type="submit" :disabled="!was_validated || !email_valid">Update</button>
                            </form>
                            <button class="btn btn-danger mt-3 w-100" type="submit" x-show="changing_email || changing_password" @click="
                                changing_password = false,
                                changing_email = false
                            ">Cancel</button>

                            <a href="/account-deletion-request" x-show="!(changing_email || changing_password)" class="btn btn-outline-danger w-100" style="border: 0;">Request Account Deletion</a>

                        </div>

                    </div>
                </div>
            </div>
            <div class="col-12 col-md-8">
                <div class="card">
                    <div class="card-header">@yield('profile-card-header')</div>
                    <div class="card-body">
                        <div class="card-text">
                            @yield('profile-card')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
