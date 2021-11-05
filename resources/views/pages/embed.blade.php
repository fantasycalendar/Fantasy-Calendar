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
                width: 100vw;
                height: 100vh;
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
        </style>

        <script>
            window.addEventListener('DOMContentLoaded', function(event) {
                let image_holder = document.getElementById('image_holder');
                let image = document.createElement('img');
                let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

                image.setAttribute('src', "{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png']) }}?width=" + vw + "&height=" + vh)

                image_holder.replaceWith(image);
            });

            window.onmessage = function(event) {
                // $.notify("We got a message:" + event.data, "success");
                if(typeof event.data === 'object' && event.data.source === 'fantasy-calendar-embed' && typeof window.embeddableActions[event.data.does] === "function") {
                    console.log("Told to do " + event.data.does + " with " + JSON.stringify(event.data.params))
                    window.embeddableActions[event.data.does](event.data.params);
                }
            }

            window.FCEmbed = {
                show_login_form: false,
                identity: "",
                password: "",
                api_token: "",
                notifications: [],
                init: function() {
                    this.notifications = [];
                    this.api_token = localStorage.getItem('api_token') ?? '';
                    this.identity = localStorage.getItem('identity') ?? '';
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
                    console.log(message)
                    this.notifications.push(message);

                    var me = this;

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
                    @guest
                        window.embeddableActions.toastify({
                            type: 'error',
                            message: 'You must be signed in for this to work!'
                        });

                        return;
                    @else
                        let method = params.method;
                        let data = params.data;
                        let api_token = '{{ auth()->user()->api_token }}';
                        fetch('/api/calendars/{{ $calendar->hash }}/' + method, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Success:', data);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    @endguest
                }
            }
        </script>
    </head>
    <body x-data="FCEmbed" @login.window="console.log('here'); show_login_form = true" @notify.window="toast($event.detail)">
        <div class="image_grid">
            <div class="image_container">
                <div id="image_holder"></div>
            </div>
        </div>

        <div x-show="show_login_form" class="fixed top-0 right-0 bottom-0 left-0 flex flex-col items-center p-3 bg-white rounded mt-4 shadow">
            <div class="login_form" x-show="api_token === ''">
                <form class="flex flex-col" action="" @submit="login">
                    <input type="text" placeholder="Username/Email" x-model="identity" class="mb-2">
                    <input type="password" placeholder="Password" x-model="password">
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div class="p-5" x-show="api_token != ''">
                <div class="bg-green-300 border-green-600 text-green-800">
                    You are already signed in as <span x-text="identity" class="font-bold"></span>.
                    <br>
                    <a href="javascript:" @click="api_token = ''; show_login_form = false; localStorage.removeItem('api_token'); localStorage.removeItem('identity');">Sign out</a>
                    <a href="javascript:" @click="show_login_form = false;">Cancel</a>
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
    </body>
</html>
