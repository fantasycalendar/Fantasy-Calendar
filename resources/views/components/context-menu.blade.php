<div
    x-data="context_menu"
    id='context_menu'
    x-ref='context_menu'
    x-show="show"
    x-cloak
    @context-menu.window="activate"
    @date-context-menu.window="activate_for_date"
    @click.outside="deactivate"
    :style="`left: ${x}px; top: ${y}px; opacity: ${opacity};`"
    >
    <template x-for="item in items">
        <div
            class="context_menu_item"
            x-show="shouldBeVisible(item)"
            :disabled="shouldDisable(item)"
        >
            <i :class="item.icon"></i>
            <div
                x-text="item.name"
                @click="item.callback(); deactivate();"
                ></div>
        </div>
    </template>
</div>
