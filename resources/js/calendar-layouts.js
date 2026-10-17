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
        const layoutName = layout.name.toLowerCase();
        const validLayouts = this.layouts.map(l => l.name.toLowerCase());

        if (!validLayouts.includes(layoutName)) return;

        const store = this.$store.calendar;

        store.update({
            "static_data.settings.layout": layoutName,
        });

        store.rebuild_calendar();

        this.current_layout = layout;
        this.open = false;
    }

})
