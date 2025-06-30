<div class='dropdown input-group-append' x-data="ViewOptions" @click.away="open = false">
    <button class="btn btn-secondary dropdown-toggle w-full h-full" @click="open = !open">
        <i class="fa" :class="view_mode.icon"></i>
    </button>

    <div x-show="open" :class="{ 'show': open }" class="dropdown-menu !left-auto right-0 w-56">
        <h6 class="dropdown-header">Preview mode</h6>

        <template x-for="(mode, name) in view_modes">
            <button type="button" class="dropdown-item" @click="switch_view(name)" :class="{ 'active': mode == view_mode }">
                <div class="flex items-center space-x-2">
                    <i class="fa w-6 text-center" :class="mode.icon"></i>
                    <span x-text="mode.label"></span>
                </div>
            </button>
        </template>

        <div class="dropdown-divider"></div>

        <h6 class="dropdown-header">Actions</h6>

        <a :href="`/calendars/${$store.calendar.hash}`" class="dropdown-item">
            <div class="flex items-center space-x-2">
                <i class="fa fa-eye w-6 text-center"></i>
                <span>View</span>
            </div>
        </a>

        <button type="button" @click="print" class="dropdown-item">
            <div class="flex items-center space-x-2">
                <i class="fa fa-print w-6 text-center"></i>
                <span>Print</span>
            </div>
        </button>

        <button type="button" @click="call_delete_calendar" class="dropdown-item btn-danger">
            <div class="flex items-center space-x-2">
                <i class="fa fa-trash w-6 text-center"></i>
                <span>Delete</span>
            </div>
        </button>
    </div>
</div>
