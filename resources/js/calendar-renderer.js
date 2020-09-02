const calendar_renderer = {

    loaded: false,

    render_data: {
        current_epoch: 0,
        preview_epoch: 0,
        render_style: "grid",
        timespans: [],
        event_epochs: []
    },

    load_calendar: function(event){
        this.render_data = event.detail;
        this.loaded = true;
    },

    create_event: function(epoch) {
        edit_event_ui.create_new_event('New Event', epoch);
    },

    register_events: function(event){
        execution_time.start();
        let event_data = event.detail;
        for(let epoch in this.render_data.event_epochs){
            this.render_data.event_epochs[epoch].splice(0, this.render_data.event_epochs[epoch].length)
            if(event_data[epoch] !== undefined){
                for(var index in event_data[epoch]){
                    let event = event_data[epoch][index];
                    this.render_data.event_epochs[epoch].push(event)
                }
            }
        }
        execution_time.end("Event registration took:")
    },

    post_load: function(){
        scroll_to_epoch();
        hide_loading_screen();
    }

}

module.exports = calendar_renderer;
