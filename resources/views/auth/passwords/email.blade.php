<x-app-fullwidth-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full m-auto md:mt-12 lg:mt-16">
        <div class="text-primary-700 mb-8">
            <x-app-logo class="mx-auto h-16 w-auto"></x-app-logo>
        </div>

        <x-panel>
            <div class="mb-4 text-sm text-gray-600">
                {{ __('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.') }}
            </div>

            @if (session('status'))
                <x-alert type="success">
                    {{ session('status') }}
                </x-alert>
            @endif

            <form method="POST" action="{{ route('password.email') }}">
                @csrf

                <div class="block">
                    <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus />
                </div>

                <div class="flex items-center justify-end mt-4">
                    <x-button type="submit" class="w-full justify-center">
                        {{ __('Email Password Reset Link') }}
                    </x-button>
                </div>
            </form>

            <x-slot name="footer"></x-slot>
        </x-panel>
    </div>
</x-app-fullwidth-layout>
