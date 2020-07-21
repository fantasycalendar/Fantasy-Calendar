<nav class="navbar navbar-expand-lg navbar-dark bg-accent">
    <a class="navbar-brand" href="{{ route('home') }}">
        <img class="navbar-logo mr-2" src="{{ asset('resources/header_logo.png') }}">
        Fantasy Calendar
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsemenu" aria-controls="collapsemenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="collapsemenu">
        <ul class="navbar-nav mr-auto">
            @auth
                <li class="nav-item my-calendars">
                    <a class="nav-link" href="{{ route('calendars.index') }}">My Calendars</a>
                </li>
            @endauth
            <li class="nav-item new-calendar">
                <a class="nav-link" href="{{ route('calendars.create') }}">New Calendar</a>
            </li>
        </ul>
        <ul class="navbar-nav">
            @auth
                @if(Auth::user()->isAdmin())
                    <li class="nav-item"><a href="{{ route('code16.sharp.home') }}" class="nav-link">Admin Panel</a></li>
                @endif
                <li class="nav-item"><a href="{{ route('settings') }}" class="nav-link">Settings</a></li>
                <li class="nav-item"><a href="/profile" class="nav-link">Profile</a></li>
                @unless(request()->is('/calendar/*'))
                        <li class="nav-item"><a href="{{ route('logout') }}" class="nav-link">Logout</a></li>
                @else
                        <li class="nav-item"><a href="javascript:" id="logout-button" class="nav-link">Logout</a></li>
                @endunless
            @else
                @unless(request()->is('/calendar/*'))
                    <li class="nav-item"><a href="{{ route('login') }}" class="nav-link">Login</a></li>
                @else
                    <li class="nav-item"><a href="javascript:" id="login-show-button" class="nav-link">Login</a></li>
                @endunless

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

@guest
<div id="login-background" class="basic-background blurred_background">
	<div class="basic-container">
		<div class="basic-wrapper">
			<form id="login-form" class="basic-form" method="POST">
				<h3 class="basic-form-heading">Login</h3>
				<input type="text" class="form-control" id="login_identity" name="identity" placeholder="Username or E-mail" autofocus="" autocomplete="username" />
				<input type="password" class="form-control" id="login_password" name="password" placeholder="Password" autocomplete="current-password" />
				<div id="login_messagebox"></div>
				<label class="form-control checkbox">
					<input type="checkbox" value="remember-me" id="login_rememberMe" name="rememberMe"> Remember me
				</label>
				<button class="btn btn-lg btn-primary btn-block mt-2" id="login_button" type="submit">Login</button>
				<a href="/password/reset"><button class="btn btn-sm btn-secondary btn-block" id="forgotten_password" type="button">Forgotten Password</button></a>
			</form>
		</div>
	</div>
</div>
@endguest
