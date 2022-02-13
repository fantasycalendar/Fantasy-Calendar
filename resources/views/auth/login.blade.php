<x-app-fullwidth-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="flex-1 grid place-items-center">
        <x-panel class="max-w-md w-full">
            <div class="grid">
                <form method="POST" action="{{ route('login') }}" x-data="{ remember: {{ old('remember') ? 'true' : 'false' }} }" class="flex flex-col space-y-4">
                    @csrf

                    <div>
                        <x-text-input name="identity" placeholder="{{ __('Username') }}" value="{{ old('username') ?? old('email') }}"></x-text-input>
                        @error('username')
                        <x-alert type="danger">
                            <strong>{{ $message }}</strong>
                        </x-alert>
                        @enderror
                    </div>

                    @error('email')
                        <div>
                            <x-alert type="danger">
                                <strong>{{ $message }}</strong>
                            </x-alert>
                        </div>
                    @enderror

                    <div>
                        <x-text-input placeholder="{{ __('Password') }}" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password"></x-text-input>
                    </div>

                    @error('password')
                        <div>
                            <x-alert type="danger">
                                <strong>{{ $message }}</strong>
                            </x-alert>
                        </div>
                    @enderror

                    <x-input-toggle class="form-check-input" type="checkbox" name="remember" id="remember" label="{{ __('Remember Me') }}"></x-input-toggle>

                    <x-button id="login" type="submit" class="justify-center">
                        {{ __('Login') }}
                    </x-button>

                    @if (Route::has('password.request'))
                        <x-app-link href="{{ route('password.request') }}" class="text-sm text-center">
                            {{ __('Forgot Your Password?') }}
                        </x-app-link>
                    @endif
                </form>
            </div>

            <x-slot name="footer"></x-slot>
        </x-panel>

    </div>
</x-app-fullwidth-layout>
