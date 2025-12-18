@props(["name" => null])

<div id='clock' x-data="clock_canvas('{{ $name }}')"
    x-show="visible"
    @calendar-loaded.window="load"
    @calendar-updated.window="load"
    @clock-toggled.window="load"
    @current-date-toggled.window="load"
    x-transition
>
    <canvas style="z-index: 2;" x-ref="clock_face"></canvas>
    <canvas style="z-index: 1;" x-ref="clock_sun"></canvas>
    <canvas style="z-index: 0;" x-ref="clock_background"></canvas>
</div>
