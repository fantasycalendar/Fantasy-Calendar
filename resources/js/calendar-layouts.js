import { do_update_all } from "./calendar/calendar_ajax_functions";
import { evaluate_save_button } from "./calendar/calendar_inputs_edit";
import { hide_loading_screen } from "./calendar/header";

export default () => ({

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
            this.current_layout = this.layouts.find(layout => layout.name.toLowerCase() === window.static_data.settings.layout);
        }else{
            $('#btn_layouts').notify(
                "Please save your calendar before applying a preset.",
                { position: "top-center" }
            )
        }
    },

    apply_layout: function(layout){
        show_loading_screen();
        let previous_layout = window.static_data.settings.layout;
        window.static_data.settings.layout = layout.name.toLowerCase();
        do_update_all(window.hash, function(){
            window.onbeforeunload = function () {}
            window.location.reload(false);
        }, function(){
                window.static_data.settings.layout = previous_layout;
                hide_loading_screen();
            });
    }

})
