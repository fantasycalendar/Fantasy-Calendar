<!DOCTYPE HTML>

<html lang="en">

    @include('templates._head_content')

	<body class="page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')">

		@include('templates._header')
		<div id="content">
			<div id="loading_background" class='basic-background hidden'>
				<img src='{{ asset("resources/icons/loader_white.png") }}'>
				<div id='loading_text' class='italics-text'>Random text</div>

				<div class="ldBar" data-precision="0.1"></div>

				<div class='loading_cancel_button_container'>
					<button type='button' class='btn btn-danger full loading_cancel_button hidden'>Cancel</button>
				</div>
			</div>

			@yield('content')
		</div>
    </body>
</html>
