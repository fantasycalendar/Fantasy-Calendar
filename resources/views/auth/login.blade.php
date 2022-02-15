@push('page-class', 'dark')

<x-app-fullwidth-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full m-auto md:mt-12 lg:mt-16">
        <div>
            <div class="text-primary-700">
                <x-app-logo class="mx-auto h-16 w-auto"></x-app-logo>
            </div>

            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-200">Sign in to your account</h2>
            <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Or
                <x-app-link href="{{ route('register') }}"> register for free </x-app-link>
            </p>
        </div>

        <x-panel class="mt-8">
            <form method="POST" action="{{ route('login') }}" class="flex flex-col space-y-4">
                @csrf

                <div>
                    <x-text-input name="identity" :placeholder="__('Username')" value="{{ old('username') ?? old('email') }}" error-on="username"></x-text-input>
                </div>

                <div>
                    <x-text-input :placeholder="__('Password')" id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password"></x-text-input>
                </div>

                <div>
                    <x-input-toggle name="remember" id="remember" label="{{ __('Remember Me') }}"></x-input-toggle>
                </div>

                <x-button id="login" type="submit" class="justify-center">
                    {{ __('Login') }}
                </x-button>

                @if (Route::has('password.request'))
                    <x-app-link href="{{ route('password.request') }}" class="text-sm text-center underline">
                        {{ __('Forgot Your Password?') }}
                    </x-app-link>
                @endif
            </form>

            <x-slot name="footer"></x-slot>
        </x-panel>
    </div>
</x-app-fullwidth-layout>
