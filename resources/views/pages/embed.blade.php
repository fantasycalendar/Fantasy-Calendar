<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
{{--        <link rel="stylesheet" href="{{ asset('css/app.css') }}">--}}
        <script src="//unpkg.com/alpinejs" defer></script>
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">

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
            window.frameElement.addEventListener('load', function(event) {
                console.log("Domcontentloaded");
                let image_holder = document.getElementById('image_holder');
                let image = document.createElement('img');

                image.setAttribute('id', 'calendar_image');

                let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

                image.onload = function(event){
                    console.log('loaded');
                    FCEmbed.bubble({
                        type: 'calendarLoaded',
                        data: { height: event.target.naturalHeight, width: event.target.naturalWidth }
                    })
                }

                image.setAttribute('src', "{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png']) }}?size={{ $size ?? 'md' }}")

                image_holder.replaceWith(image);
            }, {once: true});

            window.onmessage = function(event) {
                // $.notify("We got a message:" + event.data, "success");
                if(typeof event.data === 'object' && event.data.source === 'fantasy-calendar-embed-parent' && typeof window.embeddableActions[event.data.does] === "function") {
                    console.log("Told to do " + event.data.does + " with " + JSON.stringify(event.data.params))
                    window.embeddableActions[event.data.does](event.data.params);
                }
            }

            window.FCEmbed = {
                show_login_form: false,
                image_loading: false,
                identity: "",
                password: "",
                api_token: "",
                notifications: [],
                init: function() {
                    this.notifications = [];
                    this.api_token = localStorage.getItem('api_token') ?? '';
                    this.identity = localStorage.getItem('identity') ?? '';
                },

                bubble: function(args) {
                    console.trace()
                    window.top.postMessage({
                        ...args,
                        source: 'fantasy-calendar-embed-child'
                    }, '*')
                },

                show: function() {
                    console.log("Show called!");
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
                        console.log('Success:', data);
                        this.api_token = data.api_token;
                        localStorage.setItem('api_token', data.api_token);
                        this.identity = data.username;
                        localStorage.setItem('identity', data.username);

                        this.show_login_form = false;
                        this.password = '';

                        this.toast({
                            "type": 'success',
                            "message": "Successfully authenticated as " + data.username
                        });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        this.password = '';
                        this.toast({
                            "type": 'error',
                            "message": error,
                        })
                    });
                },

                toast: function(message) {
                    this.notifications.push(message);
                    const me = this;
                    setTimeout(function(){
                        me.notifications.pop();
                    }, 5000);
                }
            }

            window.embeddableActions = {
                toastify: function(params) {
                    console.log("Dispatching notify");
                    window.dispatchEvent(new CustomEvent('notify', {detail: params}));
                },
                login_form: function() {
                    console.log('Dispatching login')
                    window.dispatchEvent(new CustomEvent('login', {detail: 'Login time'}));

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
                        console.log('Success:', data);

                        if(method.startsWith('get')){
                            FCEmbed.bubble({
                                type: `${method}Response`,
                                data
                            });
                            return;
                        }

                        let image = document.getElementById('calendar_image');

                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

                        image.setAttribute('src', "{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png']) }}?width=" + vw + "&height=" + vh + "&d=" + (new Date()).getTime());

                        const loadingTimeout = setTimeout(function() {
                            window.dispatchEvent(new CustomEvent('image-load'));
                        }, 200)

                        image.onload = function() {
                            this.toastify({
                                type: 'success',
                                message: `${details.count} ${details.unit} added.`
                            });
                            clearTimeout(loadingTimeout);
                            window.dispatchEvent(new CustomEvent('image-loaded'));
                        }.bind(this);

                        FCEmbed.bubble({
                            type: 'calendarUpdated',
                            data
                        })
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        window.dispatchEvent(new CustomEvent('image-loaded'));

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
          @notify.window="toast($event.detail)"
          @image-loading.window="console.log('image-loading'); image_loading = true"
          @image-loaded.window="console.log('image-loaded'); image_loading = false"
    >
        <div class="image_grid">
            <div class="image_container">
                <div id="image_holder"></div>
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
                        <form action="" @submit="login" class="space-y-2">
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
                            You are already signed in as <span x-text="identity" class="font-bold"></span>.
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
