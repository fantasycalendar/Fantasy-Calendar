<!DOCTYPE HTML>

<html lang="en">

    @include('templates._head_content')

	<body class="page-{{ str_replace('.', '-', Route::currentRouteName()) }}">
	
		@include('templates._header')
		<div id="content">
			<div id="loading_background" class='basic-background hidden'>
				<img src='{{ asset("resources/icons/loader_white.png") }}'>
				<div id='loading_text' class='italics-text'>Random text</div>
			</div>

			@yield('content')
		</div>
    </body>
</html>