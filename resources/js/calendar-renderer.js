const calendar_renderer = {
    
    loaded: false,
    
    render_data: {
        current_epoch: 0,
        preview_epoch: 0,
        render_style: "grid",
        timespans: [],
        event_epochs: []
    }

}

module.exports = calendar_renderer;