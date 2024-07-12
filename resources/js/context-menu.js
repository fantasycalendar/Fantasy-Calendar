import { computePosition, flip, shift } from "@floating-ui/dom";

export default () => ({
    show: true,
    opacity: 1,
    x: -9999,
    y: -9999,
    items: [],

    activate($event) {
        console.log($event);
        this.items = $event.detail.items;

        console.log(this.items[0].name);

        computePosition(
            $event.detail.element,
            this.$refs.context_menu,
            {
                placement: 'top',
                middleware: [flip(), shift()],
            }
        ).then(({ x, y }) => {
            this.x = x;
            this.y = y;
            this.opacity = 1;
        });
    },

    deactivate() {
        this.content = "";
        this.opacity = 0;
        this.x = -9999;
        this.y = -9999;
    }
});
