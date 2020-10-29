@extends('templates._page')

@push('head')
	<script>

		function register_form(){
			return {
                valid_form: false,
                username: '',
                email: '',
                agreed: false,

                password: '',
                password_confirmation: '',
                password_was_validated: false,
                password_valid: false,

                validate_password: function(){
                    this.password_was_validated = true;
                    this.password_valid = this.password.length > 7 && this.password !== '' && this.password_confirmation !== '' && this.password === this.password_confirmation
                }
			}
        }

	</script>
@endpush

@section('content')
<div class="container pt-4" x-data='register_form()'>
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">{{ __('Register') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('register') }}" class="container-fluid">
                        @csrf

                        <div class="form-group row">
                            <label for="username" class="col-md-4 col-form-label text-md-right">{{ __('Username') }}</label>

                            <div class="col-md-6">
                                <input id="username" type="text" class="form-control @error('username') is-invalid @enderror" x-model='username' name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>

                                @error('username')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" x-model='email' name="email" value="{{ old('email') ?? session('email') }}" required autocomplete="email">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" x-model="password" name="password" required autocomplete="new-password" @blur="validate_password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                            </div>
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

                        <div class="form-check p-2">
                            <input type="checkbox" class="form-check-input" name="policy_acceptance" id="policy_acceptance" x-model="agreed" required>
                            <label class="form-check-label" for="policy_acceptance">By clicking <strong>Register</strong>, I agree to the <a target="_blank" href="{{ route('terms-and-conditions') }}">Terms and Conditions</a>, and the <a target="_blank" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></label>
                        </div>

                        <div class="form-check p-2 mb-3">
                            <input type="checkbox" class="form-check-input" name="marketing_acceptance" id="marketing_acceptance">
                            <label class="form-check-label" for="marketing_acceptance">
                                <strong>Optional</strong> - Tick here if you would like us to send you emails about our products and special offers<br>
                                <small>You can withdraw consent at any time on your profile<small>
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
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
