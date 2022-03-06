const calendar_layouts = {

    open: false,
    current_layout: undefined,

    layouts: [
        {
            "name": "Grid",
            "description": "A familiar detailed view that resembles a traditional wall-hung calendar.",
            "image": "/resources/layouts/light-grid.png"
        },
        {
            "name": "Vertical",
            "description": "A single column view for focusing on each day or for use on mobile devices.",
            "image": "/resources/layouts/light-vertical.png"
        },
        {
            "name": "Minimalistic",
            "description": "Beautiful minimalism that zooms out a bit to fit the whole calendar on one page.",
            "image": "/resources/layouts/light-minimal.png"
        }
    ],

    open_modal: function($event){

        if(evaluate_save_button()){
            this.open = true;
            this.current_layout = this.layouts.find(layout => layout.name.toLowerCase() === window.calendar.static_data.settings.layout);
        }else{
            $('#btn_layouts').notify(
                "Please save your calendar before applying a preset.",
                { position: "top-center" }
            )
        }
    },

    apply_layout: function(layout){
        show_loading_screen();
        let previous_layout = window.calendar.static_data.settings.layout;
        window.calendar.static_data.settings.layout = layout.name.toLowerCase();
        do_update_all(window.calendar.hash, function(){
            window.onbeforeunload = function () {}
            window.location.reload(false);
        }, function(){
            window.calendar.static_data.settings.layout = previous_layout;
            hide_loading_screen();
        });
    }

}

module.exports = calendar_layouts;
