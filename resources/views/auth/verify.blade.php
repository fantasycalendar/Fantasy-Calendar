<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full m-auto md:mt-12 lg:mt-16">
        <div class="text-primary-700">
            <x-app-logo class="mx-auto h-16 w-auto"></x-app-logo>
        </div>

        <h2 class="mt-4 mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-200">Verify your email</h2>
    </div>

    <div class="max-w-md m-auto">
        <x-panel>
            <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ __('Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.') }}
            </div>

            @if (session('resent'))
                <x-alert type="success">
                    {{ __('A fresh verification link has been sent to your email address.') }}
                </x-alert>
            @endif

            <form action="{{ route('verification.resend') }}" class="d-inline" method="POST">
                @csrf

                <x-button type="submit" role="secondary" class="w-full justify-center">
                    {{ __('Resend Verification Email') }}
                </x-button>
            </form>

            <x-slot name="footer">
            </x-slot>
        </x-panel>
    </div>
</x-app-layout>
