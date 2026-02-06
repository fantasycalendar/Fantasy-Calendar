import { do_update_all } from "./calendar/calendar_ajax_functions";

export default () => ({

    open: false,
    current_layout: undefined,

    layouts: [
        {
            "name": "Grid",
            "description": "A familiar detailed view that resembles a traditional wall-hung calendar.",
            "image": "/images/layouts/light-grid.png"
        },
        {
            "name": "Vertical",
            "description": "A single column view for focusing on each day or for use on mobile devices.",
            "image": "/images/layouts/light-vertical.png"
        },
        {
            "name": "Minimalistic",
            "description": "Beautiful minimalism that zooms out a bit to fit the whole calendar on one page.",
            "image": "/images/layouts/light-minimal.png"
        }
    ],

    open_modal: function($event) {
        this.open = true;
        this.current_layout = this.layouts.find(layout => layout.name.toLowerCase() === this.$store.calendar.static_data.settings.layout);
    },

    apply_layout: function(layout) {

        this.$dispatch("app-busy-start");

        let previous_layout = this.$store.calendar.static_data.settings.layout;
        this.$store.calendar.update({
            "static_data.settings.layout": layout.name.toLowerCase(),
        });

        if(window.location.href.endsWith("/edit")) {
            do_update_all(window.hash)
                .then(() => {
                    window.onbeforeunload = function () {
                    }
                    window.location.reload(false);
                })
                .catch((error) => {
                    this.$store.calendar.update({
                        "static_data.settings.layout": previous_layout
                    });
                    this.$store.calendar.static_data.settings.layout = previous_layout;
                    this.$dispatch("app-busy-end");
                    this.$dispatch('notify', {
                        content: error.response.data.message,
                        type: "error"
                    });
                });
        }else{
            window.location = window.location.href.split("/create")[0] + "/create?resume=1";
            // window.onbeforeunload = function () {
            // }
            // window.location.reload(false);
        }
    }

})
