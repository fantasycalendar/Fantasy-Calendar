<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{{ mix('css/app-tw.css') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script src="{{ mix('/js/app-tw.js') }}" defer></script>

        <style>
            * {
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
            html, body {
                max-width: 100%;
                min-height: 100%;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: black;
            }
            .image_grid {
                display: grid;
                grid-template-columns: 1fr;
                place-items: center;
                min-height: 100%;
                max-width: 100%;
                width: 100%;
            }
            .image_grid .image {
                margin: 15px 0;
                /*max-width: 500px;*/
            }
            .image_grid .image img {
                max-width: 100%;
                max-height: 100%;
                height: auto;
                width: auto;
                object-fit: contain;
            }

            .lds-ripple {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }
            .lds-ripple div {
                position: absolute;
                border: 4px solid #fff;
                opacity: 1;
                border-radius: 50%;
                animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }
            .lds-ripple div:nth-child(2) {
                animation-delay: -0.5s;
            }
            @keyframes lds-ripple {
                0% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    top: 0px;
                    left: 0px;
                    width: 72px;
                    height: 72px;
                    opacity: 0;
                }
            }

            *[x-cloak] {
                display: none;
            }
        </style>

        <script>
            function dispatch(name, detail = {}) {
                window.dispatchEvent(new CustomEvent(name, {
                    detail
                }));
            }

            window.FCEmbed = {
                show_login_form: false,
                image_loading: false,
                identity: "",
                password: "",
                api_token: "",
                notifications: [],
                image_url: new URL('{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png']) }}'),
                image_src: '',
                settings: @json($settings),
                date_change_details: {},
                date_changed: false,
                theme_settings: ['background_color', 'border_color', 'current_date_color', 'heading_text_color', 'inactive_text_color', 'placeholder_background_color', 'shadow_color', 'text_color'],
                init: function() {
                    this.notifications = [];
                    this.api_token = localStorage.getItem('api_token') ?? '';
                    this.identity = localStorage.getItem('identity') ?? '';

                    for (const name in this.settings) {
                        this.image_url.searchParams.set(name, this.settings[name]);
                    }

                    if(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes('{{ $size ?? '' }}')) {
                        this.changeImageOption('size', '{{ $size ?? '' }}');
                    } else if('{{ $height ?? '' }}' || '{{ $width ?? '' }}') {
                        if('{{ $height ?? '' }}') {
                            this.changeImageOption('height', '{{ $height ?? '' }}');
                        }

                        if('{{ $width ?? '' }}') {
                            this.changeImageOption('width', '{{ $width ?? '' }}');
                        }
                    } else {
                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

                        this.changeImageOption('width', vw + "");
                        this.changeImageOption('height', vh + "");
                    }


                    this.updateImage();
                },

                bubble: function(args) {
                    window.top.postMessage({
                        ...args,
                        source: 'fantasy-calendar-embed-child'
                    }, '*')
                },

                show: function() {
                    this.show_login_form = true;
                },

                login: function($event) {
                    $event.preventDefault();

                    fetch('/api/user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            identity: this.identity,
                            password: this.password
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.api_token = data.api_token;
                        localStorage.setItem('api_token', data.api_token);
                        this.identity = data.username;
                        localStorage.setItem('identity', data.username);

                        this.show_login_form = false;
                        this.password = '';

                        this.toast({
                            detail: {
                                "type": 'success',
                                "message": "Successfully authenticated as " + data.username
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        this.password = '';
                        this.toast({
                            detail: {
                                "type": 'error',
                                "message": error,
                            }
                        })
                    });
                },

                toast: function($event) {
                    console.trace();
                    this.notifications.push($event.detail);

                    setTimeout(function(){
                        this.notifications.pop();
                    }.bind(this), 5000);
                },

                updateSettings(event) {
                    console.log(event.detail);
                    for (const [name, value] of Object.entries(event.detail)) {
                        console.log(`Updating ${name} to ${value}`);
                        this.changeImageOption(name, value);
                    }

                    this.updateImage();
                },

                updateSetting(event) {
                    this.changeImageOption(event.detail.name, event.detail.value);
                    this.updateImage();
                },

                changeImageOption(name, value) {
                    if(name == 'theme' && value !== 'custom') {
                        ['background_color', 'border_color', 'current_date_color', 'heading_text_color', 'inactive_text_color', 'placeholder_background_color', 'shadow_color', 'text_color'].forEach(function(name){
                            this.image_url.searchParams.delete(name);
                        }.bind(this));
                    }

                    console.log(`Option ${name} changed to ${value}`);
                    this.image_url.searchParams.set(name, value);
                },

                updateImage: function() {
                    this.image_src = this.image_url.href;
                    this.image_loading = true;
                },

                imageLoaded: function ($event) {
                    this.bubble({
                        type: 'calendarLoaded',
                        data: {
                            width: $event.target.naturalWidth,
                            height: $event.target.naturalHeight
                        }
                    });

                    this.image_loading = false;

                    if(this.date_changed === true) {
                        this.toast({
                            detail: {
                                "type": 'success',
                                "message": `${this.date_change_details.count} ${this.date_change_details.unit} added.`
                            }
                        });

                        this.date_changed = false;
                        this.date_change_details = {};
                    }
                },

                dateChanged: function($event) {
                    this.date_changed = true;
                    this.date_change_details = $event.detail;
                },

                acceptMessage: function($event) {
                    console.log($event);
                    if(typeof $event.data === 'object' && $event.data.source === 'fantasy-calendar-embed-parent' && typeof window.embeddableActions[$event.data.does] === "function") {
                        window.embeddableActions[$event.data.does]($event.data.params);
                    }
                }
            }

            window.embeddableActions = {
                allowed_settings: ['theme', 'background_color', 'border_color', 'current_date_color', 'heading_text_color', 'inactive_text_color', 'placeholder_background_color', 'shadow_color', 'text_color'],
                toastify: function(params) {
                    dispatch('notify', params);
                },
                updateSettings: function(params) {
                    console.trace();
                    console.log(params);
                    for([name, value] of Object.entries(params)) {
                        if(!this.allowed_settings.includes(name)) {
                            throw new Error(`Updating setting ${name} is not allowed!`);
                            return;
                        }

                        console.log(`Setting ${name} encountered, safe`);
                    }

                    dispatch('updated-settings', params);
                },
                updateSetting: function(params) {
                    if(this.allowed_settings.includes(params.name)) {
                        dispatch('updated-setting', params);
                    }
                },
                removeSetting: function(params) {
                    this.image_url.searchParams.delete(params.name);
                },
                loginForm: function() {
                    dispatch('login');
                },
                apiRequest: function(params) {
                    let method = params.method;
                    let details = params.data;
                    let api_token = FCEmbed.api_token;

                    if(!api_token) {
                        embeddableActions.toastify({
                            type: 'error',
                            message: 'You must be signed in for this to work!'
                        });
                        return;
                    }

                    fetch('/api/calendar/{{ $calendar->hash }}/' + method, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + api_token
                        },
                        body: JSON.stringify(details)
                    })
                    .then(response => response.json())
                    .then(data => {

                        if(method.startsWith('get')){
                            FCEmbed.bubble({
                                type: `${method}Response`,
                                data
                            });
                            return;
                        }

                        dispatch('date-change', {
                            count: details.count,
                            unit: details.unit
                        })

                        dispatch('updated-setting', {
                            name: 'd',
                            value: (new Date().getTime())
                        });

                        FCEmbed.bubble({
                            type: 'calendarUpdated',
                            data
                        })
                    })
                    .catch((error) => {
                        console.error('Error:', error);

                        this.toastify({
                            type: 'error',
                            message: 'An error occurred trying to update the calendar.'
                        })
                    });
                }
            }
        </script>
    </head>
    <body x-data="FCEmbed"
          @login.window="show_login_form = true"
          @notify.window="toast"
          @updated-setting.window="updateSetting"
          @updated-settings.window="updateSettings"
          @message.window="acceptMessage"
          @date-change.window="dateChanged"
    >
        <div class="image_grid">
            <div class="image_container">
                <img id="calendar_image" x-bind:src="image_src" @load="imageLoaded">
            </div>
        </div>

        <div x-show="show_login_form" class="fixed top-0 right-0 bottom-0 left-0 flex flex-col items-center p-3 bg-white rounded m-6 shadow">
            <span @click="show_login_form = false;" class="absolute top-2 right-2 text-gray-100 cursor-pointer bg-gray-500 rounded-full leading-1 text-center align-top px-2 -pt-1 text-xl hover:bg-gray-700">&times;</span>

            <div class="login_form" x-show="api_token === ''" x-cloak>
                <div class="min-h-full flex items-center justify-center p-4 sm:px-6 lg:px-8">
                    <div class="max-w-md w-full space-y-4">
                        <div>
                            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Sign in to Fantasy Calendar
                            </h2>
                            <p class="mt-2 text-center text-sm text-gray-600">
                                Or
                                <a href="{{ route('subscription.pricing') }}" class="font-medium text-green-600 hover:text-green-500">
                                    subscribe ($2.49/month)
                                </a>
                            </p>
                        </div>
                        <form action="" @submit.prevent="login" class="space-y-2">
                            <input type="hidden" name="remember" value="true">
                            <div class="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label for="identity" class="sr-only">Email address</label>
                                    <input id="identity" name="identity" type="text" placeholder="Username/Email" autocomplete="email" x-model="identity" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Email address">
                                </div>
                                <div>
                                    <label for="password" class="sr-only">Password</label>
                                    <input id="password" name="password" type="password" placeholder="Password" autocomplete="current-password" x-model="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Password">
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div class="text-sm">
                                    <a href="#" class="font-medium text-green-600 hover:text-green-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                  <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <!-- Heroicon name: solid/lock-closed -->
                                    <svg class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                  </span>
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="w-full h-full p-5 grid place-items-center" x-show="api_token != ''" x-cloak>
                <div>
                    <div class="bg-green-100 border-green-300 text-green-600 p-2 rounded mt-12 ">
                        <div>
                            <i class="fa fa-check-circle"></i> You are already signed in as <span x-text="identity" class="font-bold"></span>.
                        </div>
                    </div>

                    <a class="inline-block pt-2 text-red-600 text-right w-full" href="javascript:" @click="api_token = ''; show_login_form = false; localStorage.removeItem('api_token'); localStorage.removeItem('identity');">Sign out</a>

                </div>
            </div>
        </div>

        <div class="fixed bottom-0 flex items-end px-4 py-6 sm:p-6 sm:items-start">
            <div class="w-full flex flex-col space-y-4 items-end">
                <template x-for="notification in notifications">
                    <div class="bg-gray-100 border border-gray-400 text-gray-700 rounded relative" style="box-shadow: 0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06);" :class="{
                        'bg-red-100 border-red-400 text-red-700': notification.type == 'error',
                        'bg-green-100 border-green-400 text-green-700': notification.type == 'success'
                    }">
                        <div class="py-2 px-4">
                            <p class="flex-1 text-sm font-medium" x-text="notification.message"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="absolute top-0 right-0 left-0 bottom-0 w-full h-full grid place-items-center" x-show="image_loading" x-cloak>
            <div class="bg-gray-800 absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60 z-10"></div>
            <div class="loading-wrapper flex flex-col z-30">
                <div class="lds-ripple"><div></div><div></div></div>
                <span class="w-full text-center text-white text-xl font-bold">Loading...</span>
            </div>
        </div>
    </body>
</html>
