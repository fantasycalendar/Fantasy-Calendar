
<nav class="navbar-expand navbar-dark bg-accent">
    <div class="collapse navbar-collapse" id="collapsemenu">
        <ul class="navbar-nav d-flex justify-content-between align-items-center w-100">
            <li class="nav-item active">
                @auth
                    <a class="nav-link" href="{{ route('calendars.index') }}"><i class="fa fa-arrow-left"></i> My Calendars</a>
                @endauth
                @guest
                    <a class="nav-link" href="{{ route('home') }}"><i class="fa fa-arrow-left"></i> Back To Fantasy-Calendar</a>
                @endguest
            </li>

            <li class="nav-item" x-data="{ toggle() { window.toggle_sidebar(); } }">
                <button class="nav-link btn py-0 mr-2" @click.prevent="toggle">
                    <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>
                </button>
            </span>
        </ul>
    </div>
</nav>
