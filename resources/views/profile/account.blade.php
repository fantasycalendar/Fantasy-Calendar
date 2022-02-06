<x-profile-layout>
    <section aria-labelledby="user-details-heading">
        <form action="{{ route('profile.updateAccount') }}" method="POST">
            @csrf

            <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white dark:bg-gray-800 py-6 px-4 sm:p-6">
                    <div>
                        <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">{{ auth()->user()->username }}</h2>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400"><i class="fa fa-user-circle"></i> Registered {{ auth()->user()->created_at->format('Y-m-d') }} <i class="fa fa-ellipsis-h px-2"></i> <i class="fa fa-calendar"></i> {{ auth()->user()->calendars()->count() }} {{ \Illuminate\Support\Str::plural('Calendar', auth()->user()->calendars()->count()) }}</p>
                    </div>

                    <div class="mt-6 grid grid-cols-4 gap-6">
                        <div class="col-span-4 sm:col-span-2">
                            <x-text-input value="{{ old('email') ?? auth()->user()->email }}" label="Email Address" type="text" name="email" id="email" autocomplete="email"></x-text-input>
                        </div>

                        <div class="col-span-4 sm:col-span-2">
                            <x-text-input label="Confirm Email" value="{{ old('email_confirmation') ?? auth()->user()->email }}" type="text" name="email_confirmation" id="email_confirmation" autocomplete="email"></x-text-input>
                        </div>

                        @if(session('alerts') && array_key_exists('email-success', session('alerts')))
                            <div class="col-span-4">
                                <x-alert type="success">{{ session('alerts')['email-success'] }}</x-alert>
                            </div>
                        @endif

                        @if(session('alerts') && array_key_exists('email', session('alerts')))
                            <div class="col-span-4">
                                <x-alert type="notice">{{ session('alerts')['email'] }}</x-alert>
                            </div>
                        @endif

                        <div class="col-span-4 sm:col-span-2">
                            <x-text-input label="New Password" type="password" name="password" id="password" placeholder="************"></x-text-input>
                        </div>

                        <div class="col-span-4 sm:col-span-2">
                            <x-text-input label="Confirm New Password" type="password" name="password_confirmation" id="password_confirmation" placeholder="************"></x-text-input>
                        </div>

                        @if(session('alerts') && array_key_exists('password', session('alerts')))
                            <div class="col-span-4">
                                <x-alert type="success">{{ session('alerts')['password'] }}</x-alert>
                            </div>
                        @endif

                    </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 text-right sm:px-6">
                    <x-button type="submit">Save</x-button>
                </div>
            </div>
        </form>
    </section>

    <section aria-labelledby="preferences-heading">
        <form action="{{ route('profile.updateSettings') }}" method="POST">
            @csrf

            <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white dark:bg-gray-800 py-6 px-4 sm:p-6">
                    <div>
                        <h2 id="preferences-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Preferences</h2>
                    </div>

                    <div class="mt-6 grid grid-cols-4 gap-6">
                        <x-input-toggle name="dark_theme" label="Dark theme" description="Your retinas will thank you later." value="{{ auth()->user()->setting('dark_theme') ? 'true' : 'false' }}"></x-input-toggle>
                        <x-input-toggle name="marketing_acceptance" label="Send me product updates" description="We'll only send you stuff when it's a super big deal - No spam here." value="{{ auth()->user()->marketing ? 'true' : 'false' }}"></x-input-toggle>
                    </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 text-right sm:px-6">
                    <x-button type="submit">Save</x-button>
                </div>
            </div>
        </form>
    </section>
</x-profile-layout>
