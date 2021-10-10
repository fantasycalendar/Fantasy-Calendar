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

            iframe{
                width:100%;
                height:100%
            }

            .image {
                margin: 15px 0;
                /*max-width: 500px;*/
            }

            .image img {
                max-width: 100%;
                max-height: 100%;
                height: auto;
                width: auto;
                object-fit: contain;
            }

            .flexbox{
                display: flex;
                flex-direction: row;
                height: 100%;
            }

            .col-2{
                flex:1 0 75%;
                height: 100%;
            }

            .col-1{
                flex:1 0 25%;
                height: 100%;
            }
        </style>
    </head>
    <body>
        @php
            if(request()->has('randomize')) {
                $calendars = [\App\Calendar::inRandomOrder()->first()];
            }else if(request()->has('hash')) {
                $calendars = \App\Calendar::where("hash", request()->input('hash'))->get();
            } else {
                $calendars = [\App\User::find(1)->calendars->first()];
            }
            $sizes = ['xs', 'xxl'];
        @endphp

        @foreach($calendars as $calendar)
            <div class="flexbox">
                <div class="col-2">
                    <iframe src="{{ route('calendars.show', ['calendar' => $calendar ])  }}">
                    </iframe>
                </div>
                <div class="col-1">
                    <a href="{{ route("integrationtest", ["randomize" => 1]) }}"><button type="button">Randomize</button></a>

                    @foreach($sizes as $size)
                        <div class="image">
                            <a href="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => request()->input('size', $size), 'theme' => request()->input('theme', 'discord')]) }}">
                                <img src="{{ route('calendars.image', ['calendar' => $calendar, 'ext' => 'png', 'size' => request()->input('size', $size), 'theme' => request()->input('theme', 'discord')]) }}" alt="">
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    </body>
</html>
