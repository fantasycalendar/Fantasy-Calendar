import {
    computePosition,
    flip,
    shift,
} from "@floating-ui/dom";

export default () => ({
    element: false,
    title: "",
    show: true,
    x: 0,
    y: 0,
    opacity: 0,

    activate: function($event) {
        this.title = $event.detail.title;

        computePosition(
            $event.detail.element,
            this.$refs.moon_tooltip_box,
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

    deactivate: function() {
        this.title = '';
        this.opacity = 0;
    }
});
