@unless($attributes->has('noteleport'))
<template x-teleport="body">
@endunless
    <div class="fixed z-50 inset-0 overflow-y-auto"
         aria-labelledby="modal-title"
         role="dialog"
         aria-modal="true"
         {{ $attributes->merge(['class' => 'absolute w-full h-full']) }}
         x-show="show"
         x-data="{
                show: false,
                title: '',
                body: '',
                ok_event: {},
                cancel_event: {},
                form_info: {},
                validation_errors: [],
                validate_form() {
                    this.validation_errors = [];

                    for(var field in this.required_fields) {
                        if(!this.form_info[field].length) {
                            this.validation_errors.push(this.required_fields[field]);
                        }
                    }

                    return !this.validation_errors.length;
                },
                required_fields: {{ $attributes->get('required-fields') ?? '{}' }},
                ok($dispatch) {
                    if(!this.validate_form()) {
                        return;
                    }

                    this.show = false;

                    if(!this.ok_event.name) {
                        this.ok_event.name = '{{ $attributes->get('name') }}'
                    }

                    if(Object.entries(this.form_info).length > 0) {
                        this.ok_event.form_info = this.form_info;
                    }

                    $dispatch('modal-ok', this.ok_event);
                }
            }"
         @modal.window="if($event.detail.name === `{{ $attributes->get('name') }}`) {
                show = true;
                title = $event.detail.title ?? `{{ $attributes->get('title') }}`;
                body = $event.detail.body ?? `{{ $attributes->get('body') }}`;
                ok_event = $event.detail.ok_event ?? { name: `{{ $attributes->get('name') }}` };
                cancel_event = $event.detail.cancel_event ?? '';
                form_info = $event.detail.form_prefill ?? {};
                validation_errors = [];
            }"
         x-cloak>

        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!--
              Background overlay, show/hide based on modal state.
            -->
            <div class="fixed inset-0 bg-opacity-75 bg-gray-500 dark:bg-opacity-75 dark:bg-gray-900 transition-opacity"
                 x-show="show"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 md:max-w-xl md:p-8"
                 x-show="show"
                 x-transition:enter="ease-out duration-300"
                 x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                 x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave="ease-in duration-200"
                 x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                 @mousedown.outside="show = false;"
            >
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-{{ $attributes->get('icon-color') ?? 'primary' }}-100 dark:bg-{{ $attributes->get('icon-color') ?? 'primary' }}-700">
                        <i class="fa fa-{{ $attributes->get('icon') ?? 'check' }} text-{{ $attributes->get('icon-color') ?? 'primary' }}-600 dark:text-gray-800"></i>
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        @unless($slot->isNotEmpty())
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50 mb-2" x-html="title"></h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400" x-html="body"></p>
                        @else
                            {{ $slot }}
                        @endunless

                        @isset($form)
                            <form @submit.prevent action="#" x-ref="modal_{{ $attributes->get('name') }}_form" {{ $form->attributes->merge() }}>
                                {{ $form }}

                                <button class="hidden" @click="ok($dispatch)"></button>
                            </form>

                            <x-alert class="mt-2" type="danger" icon="test" x-show="validation_errors.length">
                                <template x-for="error in validation_errors">
                                    <div x-html="error" class="text-left"></div>
                                </template>
                            </x-alert>
                        @endisset
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense items-start">
                    @empty($buttons)
                        <button @click="ok($dispatch)" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-{{ $attributes->get('affirmative-color') ?? 'primary' }}-600 text-base font-medium text-white hover:bg-{{ $attributes->get('affirmative-color') ?? 'primary' }}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{{ $attributes->get('affirmative-color') ?? 'primary' }}-500 sm:col-start-2 sm:text-sm">
                            {{ $attributes->get('affirmative-label') ?? 'Ok' }}
                        </button>
                        <button @click="$dispatch('modal-cancel', { name: '{{ $attributes->get('name') }}' }); show = false; validation_errors = []" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                            {{ $attributes->get('cancel-label') ?? 'Cancel' }}
                        </button>
                    @else
                        {{ $buttons }}
                    @endempty
                </div>
            </div>
        </div>
    </div>
@unless($attributes->has('noteleport'))
</template>
@endunless
