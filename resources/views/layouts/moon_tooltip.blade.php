<div
	x-data='moon_tooltip'
	@moon-mouse-enter.window="activate"
	@moon-mouse-leave.window="deactivate"
	@scroll.window="deactivate"
    id='moon_tooltip_box'
	x-ref='moon_tooltip_box'
	x-show="show"
    x-cloak
    :style="`left: ${x}px; top: ${y}px; opacity: ${opacity}; pointer-events: none;`"
>
	<div x-text='title'></div>
</div>
