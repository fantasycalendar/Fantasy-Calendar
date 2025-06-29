<div class='wrap-collapsible step-hide' x-data="ViewOptions">
    <div class="btn-group d-flex mb-2 w-100">
        <button type="button" class="w-100 btn btn-sm" :class="{
                    'btn-primary': view_type == 'owner',
                    'btn-secondary': view_type != 'owner'
                }" @click="switch_view('owner')">
            Owner View
        </button>
        <button type="button" class="w-100 btn btn-sm" :class="{
                    'btn-primary': view_type == 'guest',
                    'btn-secondary': view_type != 'guest'
                }" @click="switch_view('guest')">
            Guest View
        </button>
        <button type="button" class="w-100 btn btn-sm" :class="{
                    'btn-primary': view_type == 'climate',
                    'btn-secondary': view_type != 'climate'
                }" @click="switch_view('climate')">
            Climate view
        </button>
    </div>
</div>