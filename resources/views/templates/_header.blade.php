<nav class="navbar navbar-expand-lg navbar-dark bg-accent">
    <a class="navbar-brand" href="{{ route('home') }}">
        <img class="navbar-logo mr-2" src="{{ asset('resources/calendar-logo-white.png') }}">
        Fantasy Calendar
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsemenu" aria-controls="collapsemenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="collapsemenu">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="{{ route('calendars.index') }}">My Calendars</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="{{ route('calendars.create') }}">New Calendar</a>
            </li>
        </ul>
        <ul class="navbar-nav">
            @auth
                <li class="nav-item"><a href="javascript:" id="logout-button" class="nav-link">Logout</a></li>
                <li class="nav-item"><a href="/profile" class="nav-link">Profile</a></li>
            @else
                <li class="nav-item"><a href="javascript:" id="login-show-button" class="nav-link">Login</a></li>
                <li class="nav-item"><a href="{{ route('register') }}" class="nav-link">Register</a></li>
            @endauth

        </ul>
    </div>
</nav>

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
				<div id="login_messagebox"></div>
				<label class="form-control checkbox">
					<input type="checkbox" value="remember-me" id="login_rememberMe" name="rememberMe"> Remember me
				</label>
				<button class="btn btn-lg btn-primary btn-block" id="login_button" type="submit">Login</button>
				<a href="/password/reset"><button class="btn btn-sm btn-default btn-block" id="forgotten_password" type="button">Forgotten Password</button></a>
			</form>
		</div>
	</div>
</div>
@endif
