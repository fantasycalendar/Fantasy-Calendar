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
                max-height: 100%;
                height: 100%;
                width: 100%;
            }
            .image_grid {
                display: grid;
                grid-template-columns: 1fr 1fr 2fr 2fr 3fr;
                place-items: center;
                max-width: 100%;
                width: 100%;
            }
            .image_grid .image {
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="image_grid">
            @foreach(\App\User::find(1)->calendars as $calendar)
                @foreach(['small', 'medium', 'large', 'xl', 'xxl'] as $size)
                    <div class="image">
                        <a href="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => $size, 'theme' => request()->input('theme', 'discord')]) }}">
                            <img src="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => $size, 'theme' => request()->input('theme', 'discord')]) }}" alt="">
                        </a>
                    </div>
                @endforeach
            @endforeach
        </div>
    </body>
</html>
