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

            function doNotify(params) {

            }

            window.onmessage = function(event) {
                // $.notify("We got a message:" + event.data, "success");
                if(typeof event.data === 'object' && event.data.source === 'fantasy-calendar-embed') {

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
        <div class="notifications_container absolute right-0 bottom-0 w-full h-full flex flex-column content-end" x-data="{ notifications: [] }" @message.window="if(typeof event.data === 'object' && event.data.action === 'notify') { notifications.push(event.data.params); console.log(notifications) }">
            <template x-for="notification in notifications">
                <div class="border rounded mt-4 bg-gray-500 text-white" x-text="notification.text"></div>
            </template>
        </div>
    </body>
</html>
