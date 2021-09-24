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
                margin: 0;
                padding: 0;
            }
            .image_grid {
                display: grid;
                grid-template-columns: 2fr 3fr 4fr 5fr 6fr;
                place-items: center;
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
            @foreach(['small', 'medium', 'large', 'xl', 'xxl'] as $size)
                <div class="image">
                    <a href="{{ route('calendars.image', ['calendar' => \App\User::find(1)->calendars->first(), 'ext' => 'png', 'size' => $size, 'theme' => request()->input('theme', 'discord')]) }}">
                        <img src="{{ route('calendars.image', ['calendar' => \App\User::find(1)->calendars->first(), 'ext' => 'png', 'size' => $size, 'theme' => request()->input('theme', 'discord')]) }}" alt="">
                    </a>
                </div>
            @endforeach

            @foreach(\App\User::find(1)->calendars->first()->children as $calendar)
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
