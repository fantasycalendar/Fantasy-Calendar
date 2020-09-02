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
    }

}

module.exports = calendar_renderer;
