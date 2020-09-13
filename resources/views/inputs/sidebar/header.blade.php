
<nav class="navbar-expand navbar-dark bg-accent">
    <div class="collapse navbar-collapse" id="collapsemenu">
        <ul class="navbar-nav">
            <li class="nav-item active">
                @auth
                    <a class="nav-link" href="{{ route('calendars.index') }}"><i class="fa fa-arrow-left"></i> Return To Your Calendars</a>
                @endauth
                @guest
                    <a class="nav-link" href="{{ route('home') }}"><i class="fa fa-arrow-left"></i> Back To Fantasy-Calendar</a>
                @endguest
            </li>
        </ul>
    </div>
</nav>
