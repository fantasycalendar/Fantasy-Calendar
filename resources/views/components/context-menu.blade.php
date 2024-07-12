<div
    x-data="context_menu"
    id='context_menu'
    x-ref='context_menu'
    x-show="show"
    x-cloak
    @context-menu.window="activate"
    @click.outside="deactivate"
    :style="`left: ${x}px; top: ${y}px; opacity: ${opacity};`"
    >
    <template x-for="item in items">
        <div class="d-flex align-items-center">
            <i :class="item.icon" class="pr-2"></i>
            <div
                x-text="item.name"
                @click="item.callback"
                :disabled="item.disabled()"
                x-show="item.visible()"
                ></div>
        </div>
    </template>
</div>
