<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="//unpkg.com/alpinejs" defer></script>
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
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
            .image_container {
                height: 400px;
                width: 600px;
                max-height: 400px;
                max-width: 600px;
            }
            #fantasy-calendar-embed {
                background-color: #323232;
                color: #f2f2f2;
                width: 100%;
                height: 100%;
                display: grid;
                place-items: center;
            }
        </style>
        <script src="{{ asset('/js/embed.js') }}"></script>
    </head>
    <body>
        <div class="image_grid" x-data="FantasyCalendar({
                hash: 'dfde30abfd3195d1543f8edb3b1ebd10',
                element: 'fantasy-calendar-embed',
            })">
            <div class="image_container">
                <div id="fantasy-calendar-embed">
                    The embed will appear here.
                </div>
            </div>
            <div class="btn btn-group">
                <div class="btn btn-primary" @click="embed">
                    <i class="fa fa-external-link"></i> Embed
                </div>
                <div class="btn btn-primary" @click="test">
                    Test
                </div>
                <div class="btn btn-primary" @click="getCurrentDate((result) => console.log(result))">
                    Get Current Date
                </div>
                <div class="btn btn-primary" @click="login_form">
                    API Test
                </div>
            </div>
        </div>
    </body>
</html>
