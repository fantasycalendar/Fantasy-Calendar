import { computePosition, flip, shift } from "@floating-ui/dom";

export default () => ({
    show: true,
    opacity: 1,
    x: -9999,
    y: -9999,
    items: [],

    activate($event) {
        console.log("Activating with", JSON.parse(JSON.stringify($event.detail)));

        this.items = $event.detail.items;

        this.$nextTick(() => {
            this.x = $event.detail.click.clientX;
            this.y = $event.detail.click.clientY;
            this.opacity = 1;
        });
    },

    deactivate() {
        this.items = [];
        this.content = "";
        this.opacity = 0;
        this.x = -9999;
        this.y = -9999;
    },

    shouldDisable(item) {
        if (typeof item.disabled == 'undefined') {
            return false;
        }

        if (typeof item.disabled == 'function') {
            return item.disabled();
        }

        return item.disabled;
    },

    shouldBeVisible(item) {
        if (typeof item.visible == 'undefined') {
            return false;
        }

        if (typeof item.visible == 'function') {
            return item.visible();
        }

        return item.visible;
    }
});
