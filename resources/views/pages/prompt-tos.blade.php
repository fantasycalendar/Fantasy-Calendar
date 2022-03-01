<x-app-layout>
    <form method="GET" action="{{ route('agreement-accepted', ['intended' => $intended]) }}" x-data="{
				agreed: false,
				dismissed: false
			}">
        <x-panel>
            <div class="p-4 space-y-6">

                <x-alert x-show="!dismissed">
                    <a href="#" class="alert-link" style="float: right;" @click="dismissed = true"><i class="fa fa-times"></i></a> Sorry - a lot has changed in the 2.0 update, and since those changes involve collaboration and optional paid services, we had to get our lawyers involved. You'll need to accept the Terms and Conditions, and the Privacy and Cookies Policy before you can continue using the site.
                </x-alert>

                <div class="prose dark:prose-invert mx-auto max-w-none border border-gray-200 dark:border-gray-700 p-4 rounded max-h-96 overflow-y-scroll">
                    <h1>{{ $title }}</h1>
                    <p><i>Document Version {{ $version }}.0 — {{ $date }}</i></p>
                    <div class="mb-2">{!! Markdown::convertToHtml($markdown); !!}</div>
                </div>

                <div class="form-check border border-gray-200 dark:border-gray-700 rounded p-4">
                    <div class="relative flex items-start">
                        <div class="flex items-center h-5">
                            <input x-model="agreed" id="policy_acceptance" aria-describedby="policy_acceptance-description" name="policy_acceptance" type="checkbox" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="policy_acceptance" class="font-medium text-gray-700 dark:text-gray-200">Agree and Continue</label>
                            <p id="policy_acceptance-description" class="text-gray-500 dark:text-gray-300">By clicking <strong>Agree and Continue</strong>, I agree to the <x-app-link target="_blank" href="{{ route('terms-and-conditions') }}">Terms and Conditions</x-app-link>, and the <x-app-link target="_blank" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</x-app-link></p>
                        </div>
                    </div>
                </div>

                <div class="border border-gray-200 dark:border-gray-700 rounded p-4">

                    <div class="relative flex items-start">
                        <div class="flex items-center h-5">
                            <input id="marketing_acceptance" aria-describedby="marketing_acceptance-description" name="marketing_acceptance" type="checkbox" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="marketing_acceptance" class="font-medium text-gray-700 dark:text-gray-200"><strong>Optional</strong> - Check here if you would like us to send you emails about our products and special offers</label>
                            <p id="marketing_acceptance-description" class="text-gray-500 dark:text-gray-300"><small>Don't worry - We won't spam you. We'll only send emails for major updates or new products we develop, and you can withdraw consent anytime on your profile.</small></p>
                        </div>
                    </div>
                </div>
            </div>

            <x-slot name="footer_buttons">
                <x-button type="submit"
                    ::disabled="!agreed">
                    Agree and Continue</x-button>
            </x-slot>
        </x-panel>
    </form>
</x-app-layout>
