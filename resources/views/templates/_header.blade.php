<header id="header">
			
	<div id="header_left_container">
		
		<a href="/" id="logo"><img src="/resources/calendar-logo.png" alt="Logo"/></a>
		
		<a href="{{ route('calendars.create') }}"><div class="button" id="new_calendar">New Calendar</div></a>
	</div>

	<div id="header_center_container">
		{!! $title ?? $calendar->name ?? "Fantasy Calendar" !!}
	</div>

	<div id="header_right_container">
	
	<a href='donate'><div id='donate-button' class='button'>Donate</div></a>

	@if(Auth::check())
		<div id="logout-button" class="button">Log Out</div>
		<a href="profile"><div class="button">Profile</div></a>
	@else
		<a href="signup"><div id="signup-show-button" class="button">Sign-up</div></a>
		<div class="button login-show-button">Log In</div>
	@endif

	</div>

</header>

<div id="alert_background">
	<div id="alert">
		<span id="alert_closebtn" onclick="this.parentElement.parentElement.style.display='none';">&times;</span>
		<span id="alert_text">
			This is an alert box.
		</span>
	</div>
</div>

@unless(Auth::check())
<div id="login-background" class="basic-background">
	<div class="basic-container">
		<div class="basic-wrapper">
			<form id="login-form" class="basic-form" method="POST">       
				<h3 class="basic-form-heading">Login</h3>
				<input type="text" class="form-control" id="login_username" name="username" placeholder="Username" autofocus="" autocomplete="username" />
				<input type="password" class="form-control" id="login_password" name="password" placeholder="Password" autocomplete="current-password"></input>
				<list id="login_messagebox"></list>
				<label class="form-control checkbox">
					<input type="checkbox" value="remember-me" id="login_rememberMe" name="rememberMe"> Remember me
				</label>
				<button class="btn btn-lg btn-primary btn-block" id="login_button" type="submit">Login</button>
				<a href="forgotten_password.php"><button class="btn btn-sm btn-default btn-block" id="forgotten_password" type="button">Forgotten Password</button></a>
			</form>
		</div>
	</div>
</div>
@endif