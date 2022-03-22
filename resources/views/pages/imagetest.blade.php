<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
    </head>
    <body>
        <div class="image_grid">
            @php
                if(request()->has('id')) {
                    $calendars = \App\Models\Calendar::whereId(request()->input('id'))->get();
                } else {
                    $calendars = \App\Models\User::find(1)->calendars;
                }
            @endphp

            @foreach($calendars as $calendar)
                <div class="image">
                    <a href="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => request()->input('size', 'xxl'), 'theme' => request()->input('theme', 'discord')]) }}">
                        <img src="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => request()->input('size', 'xxl'), 'theme' => request()->input('theme', 'discord')]) }}" alt="">
                    </a>
                </div>
            @endforeach
        </div>
    </body>
</html>
