<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            html, body {
                max-height: 100vh;
                max-width: 100vw;
                height: 100%;
                width: 100%;
            }
            .image_grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                place-items: center;
                max-width: 100vw;
                width: 100%;
                height: 100%;
            }
            .image_grid .image {
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="image_grid">
            @foreach(\App\User::find(1)->calendars as $calendar)
                <div class="image"><img src="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png']) }}"></div>
            @endforeach
        </div>
    </body>
</html>
