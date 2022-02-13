@push('head')
	<script>

		function register_form(){
			return {
                valid_form: false,
                username: "{{ old('username') }}",
                email: "{{ old('email') ?? session('email') }}",
                agreed: false,

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
        <div class="row justify-content-center">
            <x-panel>
                <form method="POST" action="{{ route('register') }}" class="container-fluid">
                    @csrf
                    @honeypot

                    <div class="col-md-6">
                        <x-text-input id="username" type="text" class="form-control @error('username') is-invalid @enderror" x-model='username' name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>
                    </div>

                    <div class="col-md-6">
                        <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" x-model='email' name="email" value="{{ old('email') ?? session('email') }}" required autocomplete="email">
                    </div>

                    <div class="col-md-6">
                        <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" x-model="password" name="password" required autocomplete="new-password" @blur="validate_password">
                    </div>

                    <div class="form-group row">
                        <label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>

                        <div class="col-md-6">
                            <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password"
                                x-model="password_confirmation"
                                :class="{ 'is-invalid': password_was_validated && !password_valid }"
                                @keyup="validate_password"
                                @blur="validate_password">

                            <div class="invalid-feedback" x-show="password_was_validated && password.length < 7">Password must be 8 characters long.</div>

                            <div class="invalid-feedback" x-show="password_was_validated && password !== password_confirmation">Passwords do not match.</div>
                        </div>
                    </div>

                    <input type='hidden' name='dark_theme' x-model='dark_theme'>

                    <div class="form-check p-2">
                        <input type="checkbox" class="form-check-input" name="policy_acceptance" id="policy_acceptance" x-model="agreed" required>
                        <label class="form-check-label" for="policy_acceptance">I agree to the <a target="_blank" href="{{ route('terms-and-conditions') }}">Terms and Conditions</a>, and the <a target="_blank" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></label>
                        <small>Residents of the EU are legally entitled to a 14-day cool off period, as explained in the T&Cs</small>
                    </div>

                    <div class="form-check p-2 mb-3">
                        <input type="checkbox" class="form-check-input" name="marketing_acceptance" id="marketing_acceptance">
                        <label class="form-check-label" for="marketing_acceptance">
                            <strong>(Optional)</strong> I would like to receive occasional emails about products and special offers
                            <small>(You can withdraw consent at any time on your profile)<small>
                        </label>
                    </div>

                    <div class="form-group row mb-0">
                        <div class="col-md-6 offset-md-4">
                            <button type="submit" :disabled="username === '' || email === '' || !password_valid || !agreed" class="btn btn-primary">
                                {{ __('Register') }}
                            </button>
                        </div>
                    </div>
                </form>
            </x-panel>
        </div>
    </div>
</x-app-fullwidth-layout>
