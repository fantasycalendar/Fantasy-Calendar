const calendar_layouts = {

    open: false,
    current_layout: undefined,

    layouts: [
        {
            "name": "Grid",
            "description": "The classic layout"
        },
        {
            "name": "Vertical",
            "description": "For when every day is important"
        },
        {
            "name": "Minimalistic",
            "description": "Beautiful minimalism that fits on one page"
        }
    ],

    open_modal: function(){

        if(evaluate_save_button()){
            this.open = true;
            this.current_layout = this.layouts.find(layout => layout.name.toLowerCase() == static_data.settings.layout);
        }else{
            $('#btn_layouts').notify(
                "Please save your calendar before applying a preset.",
                { position: "top-center" }
            )
        }
    },
    
    apply_layout: function(layout){
        show_loading_screen();
        let previous_layout = static_data.settings.layout;
        static_data.settings.layout = layout.name.toLowerCase();
        do_update_all(hash, function(){
            window.onbeforeunload = function () {}
            window.location.reload(false);
        }, function(){
            static_data.settings.layout = previous_layout;
            hide_loading_screen();
        });
    }

}

module.exports = calendar_layouts;
