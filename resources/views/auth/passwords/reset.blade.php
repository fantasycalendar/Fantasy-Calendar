@push('page-class', 'dark')

<x-app-fullwidth-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full m-auto md:mt-12 lg:mt-16">
        <div class="text-primary-700">
            <x-app-logo class="mx-auto h-16 w-auto"></x-app-logo>
        </div>

        <x-panel class="mt-8">
            <form method="POST" action="{{ route('password.update') }}" class="space-y-4">
                @csrf
                @honeypot

                <input type="hidden" name="token" value="{{ request()->route('token') }}">

                <div class="block">
                    <x-text-input id="email" :placeholder="__('Email')" class="block mt-1 w-full" type="email" name="email" :value="old('email', request()->email)" required autofocus />
                </div>

                <div class="mt-4">
                    <x-text-input id="password" :placeholder="__('Password')" class="block mt-1 w-full" type="password" name="password" required autocomplete="new-password" />
                </div>

                <div class="mt-4">
                    <x-text-input id="password_confirmation" :placeholder="__('Confirm Password')" class="block mt-1 w-full" type="password" name="password_confirmation" required autocomplete="new-password" />
                </div>

                <x-button type="submit" class="w-full justify-center">
                    {{ __('Reset Password') }}
                </x-button>
                <x-slot name="footer"></x-slot>
            </form>
        </x-panel>

        <div class="text-xs mt-6 px-10 text-center text-gray-400 dark:text-gray-700">You can withdraw marketing consent at any time on your profile. Residents of the EU are legally entitled to a 14-day cool off period, as explained in the T&Cs.</div>
    </div>
    </div>
</x-app-fullwidth-layout>
