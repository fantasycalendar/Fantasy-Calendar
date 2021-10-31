<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
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

            function toastify(params) {
                console.log("Dispatching notify");
                window.dispatchEvent(new CustomEvent('notify', {detail: params}));
            }

            window.onmessage = function(event) {
                // $.notify("We got a message:" + event.data, "success");
                if(typeof event.data === 'object' && event.data.source === 'fantasy-calendar-embed') {
                    console.log("Told to do " + event.data.does + " with " + JSON.stringify(event.data.params))
                    window[event.data.does](event.data.params);
                }
            }

            window.notificationStack = {
                init: function() {
                    this.notifications = [];
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
        </script>
    </head>
    <body>
        <div class="image_grid">
            <div class="image_container">
                <div id="image_holder"></div>
            </div>
        </div>

        <div x-data="notificationStack" x-init="init" class="fixed bottom-0 flex items-end px-4 py-6 sm:p-6 sm:items-start" @notify.window="toast($event.detail)">
            <div class="w-full flex flex-col space-y-4 items-end">
                <template x-for="notification in notifications">
                    <div class="bg-gray-100 border border-gray-400 text-gray-700 rounded relative" style="box-shadow: 0 10px 15px -3px  rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06);" :class="{
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
