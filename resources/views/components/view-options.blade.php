<div class='dropdown step-hide flex-shrink' x-data="ViewOptions" @click.away="open = false">
    <button class="btn btn-secondary dropdown-toggle w-full h-full" @click="open = !open">
        <i class="fa" :class="view_icon(view_type)"></i>
    </button>

    <div x-show="open" :class="{ 'show': open }" class="dropdown-menu !left-auto right-0">
        <button type="button" class="dropdown-item" :class="{
                    'btn-primary': view_type == 'owner',
                    'btn-secondary': view_type != 'owner'
                }" @click="switch_view('owner')">
            <i class="fa w-6 text-center" :class="view_icon('owner')"></i>
            Calendar as Owner
        </button>

        <button type="button" class="dropdown-item" :class="{
            'btn-primary': view_type == 'guest',
            'btn-secondary': view_type != 'guest'
        }" @click="switch_view('guest')">
            <i class="fa w-6 text-center" :class="view_icon('guest')"></i>
            Calendar as Guest
        </button>

        <button type="button" class="dropdown-item" :class="{
                    'btn-primary': view_type == 'climate',
                    'btn-secondary': view_type != 'climate'
                }" @click="switch_view('climate')">
            <i class="fa w-6 text-center" :class="view_icon('climate')"></i>
            Climate graphs
        </button>
    </div>
</div>
