<div
	x-data='moon_tooltip'
	@moon-mouse-enter.window="
		element = $event.detail.element;
		title = $event.detail.title;
		show = true;
		$nextTick(() => { set_popper() });
	"
	@moon-mouse-leave.window="
		element = false;
		title = '';
		show = false;
	"
	@scroll.window="
		element = false;
		title = '';
		show = false;
	"
	id='moon_tooltip_box'
	x-show="show"
>
	<div x-text='title'></div>
</div>
