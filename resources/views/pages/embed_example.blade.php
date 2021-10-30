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
            .image_container {
                height: 400px;
                width: 600px;
                max-height: 400px;
                max-width: 600px;
            }
        </style>
        <script src="{{ asset('/js/embed.js') }}"></script>
    </head>
    <body>
        <div class="image_grid">
            <div class="image_container">
                <script>
                    FantasyCalendar({
                        hash: 'c9602f8a2a50009fbe06c01ce1d9e835'
                    });
                </script>
            </div>
        </div>
    </body>
</html>
