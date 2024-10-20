<div class="bg-primary-600 dark:bg-primary-800 flex justify-between items-center w-full h-[40px] px-3">
    @auth
        <a class="text-white font-semibold" href="{{ route('calendars.index') }}"><i class="fa fa-arrow-left"></i> My Calendars</a>
    @endauth
    @guest
        <a class="text-white font-semibold" href="{{ route('home') }}"><i class="fa fa-arrow-left"></i> Back To Fantasy-Calendar</a>
    @endguest

    <span x-data="{ toggle() { window.toggle_sidebar(); } }">
        <button class="text-white font-semibold py-0.5 px-1.5 rounded-sm hover:bg-primary-900 transition ease-in-out" @click.prevent="toggle">
            <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>
        </button>
    </span>
</div>
