@push('head')
	<script>

		function register_form(){
			return {
                valid_form: false,
                username: "{{ old('username') }}",
                email: "{{ old('email') ?? session('email') }}",
                policy_acceptance: false,

                password: '',
                password_confirmation: '',
                password_was_validated: false,
                password_valid: false,

                get dark_theme(){
                    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
                },

                validate_password: function(){
                    this.password_was_validated = true;
                    this.password_valid = this.password.length > 7 && this.password !== '' && this.password_confirmation !== '' && this.password === this.password_confirmation
                }
			}
        }

	</script>
@endpush

<x-app-fullwidth-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="flex-1 grid place-items-center" x-data='register_form()'>
        <div class="max-w-md w-full grid">
            <div>
                <div class="text-primary-700">
                    <x-app-logo class="mx-auto h-12 w-auto"></x-app-logo>
                </div>

                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Register for your free account</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Or
                    <x-app-link href="{{ route('register') }}"> sign in to an existing account </x-app-link>
                </p>
            </div>

            <x-panel class="mt-8">
                <form method="POST" action="{{ route('register') }}" class="space-y-4">
                    @csrf
                    @honeypot

                    <div>
                        <x-text-input id="username" type="text" x-model='username' placeholder="{{ __('Username') }}" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus></x-text-input>
                    </div>

                    <div>
                        <x-text-input id="email" type="email" x-model='email' placeholder="{{ __('Email') }}" name="email" value="{{ old('email') ?? session('email') }}" required autocomplete="email"></x-text-input>
                    </div>

                    <div>
                        <x-text-input id="password" type="password" x-model="password" placeholder="{{ __('Password') }}" name="password" required autocomplete="new-password" @blur="validate_password"></x-text-input>
                    </div>

                    <div>
                        <x-text-input id="password-confirm" type="password" class="form-control" placeholder="{{ __('Confirm Password') }}" name="password_confirmation" required autocomplete="new-password"
                            x-model="password_confirmation"
                            ::class="{ 'is-invalid': password_was_validated && !password_valid }"
                            @keyup="validate_password"
                            @blur="validate_password"></x-text-input>

                            <div class="text-red-500" x-show="password_was_validated && password.length < 7"><i class="fa fa-times-circle text-red-600"></i> Password must be 8 characters long.</div>
                            <div class="text-red-500" x-show="password_was_validated && password !== password_confirmation"><i class="fa fa-times-circle text-red-600"></i> Passwords do not match.</div>
                    </div>

                    <input type='hidden' name='dark_theme' x-model='dark_theme'>

                    <div>
                        <x-input-toggle right class="flex-row-reverse space-x-6 space-x-reverse" name="policy_acceptance" id="policy_acceptance" x-model="policy_acceptance" required>
                            <div>
                                I agree to the <x-app-link target="_blank" href="{{ route('terms-and-conditions') }}">Terms and Conditions</x-app-link>,
                                and the <x-app-link target="_blank" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</x-app-link>
                            </div>
                        </x-input-toggle>

                    </div>

                    <div class="pb-4">
                        <x-input-toggle right class="flex-row-reverse space-x-6 space-x-reverse" name="marketing_acceptance" id="marketing_acceptance">
                            <div>
                                <strong>(Optional)</strong> I would like to receive occasional emails about products and special offers
                            </div>
                        </x-input-toggle>
                    </div>

                    <x-button type="submit" ::disabled="username === '' || email === '' || !password_valid || !policy_acceptance" class="w-full justify-center">
                        {{ __('Register') }}
                    </x-button>
                </form>

                <x-slot name="footer"></x-slot>
            </x-panel>

            <div class="text-xs mt-6 px-10 text-center text-gray-400 dark:text-gray-700">You can withdraw marketing consent at any time on your profile. Residents of the EU are legally entitled to a 14-day cool off period, as explained in the T&Cs.</div>
        </div>
    </div>
</x-app-fullwidth-layout>
