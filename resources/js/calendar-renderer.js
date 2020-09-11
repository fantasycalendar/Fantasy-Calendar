const calendar_renderer = {

    loaded: false,
    loading_message: "Initializing...",

    render_data: {
        current_epoch: 0,
        preview_epoch: 0,
        render_style: "grid",
        timespans: [],
        event_epochs: [],
        timespan_event_epochs: [],
        only_reveal_today: false,
        hide_moons: false,
        hide_events: false,
        hide_all_weather: false,
        hide_future_weather: false,
        add_month_number: false,
        add_year_day_number: false,
        hide_weekdays: false
    },

    get render_execution_time(){
        if(this._render_execution_time === undefined){
            this._render_execution_time = new execution();
        }
        return this._render_execution_time;
    },

    get event_execution_time(){
        if(this._event_execution_time === undefined){
            this._event_execution_time = new execution();
        }
        return this._event_execution_time;
    },

    load_calendar: function(event){
        this.loading_message = "Building calendar...";
        this.render_data = event.detail;
    },

    create_event: function(epoch) {
        edit_event_ui.create_new_event('New Event', epoch);
    },

    view_event: function(event) {
        show_event_ui.clicked_event($(event.target));
    },

    weather_click: function(day, event) {
        if(day.weather_icon){
            calendar_weather.tooltip.sticky($(event.target));
        }
    },

    weather_mouse_enter: function(day, event) {
        if(day.weather_icon){
            calendar_weather.tooltip.show($(event.target));
        }
    },

    weather_mouse_leave: function() {
        calendar_weather.tooltip.hide();
    },

    moon_mouse_enter: function(moon, event){
        let title = moon.name + ', ' + moon.phase;
        window.dispatchEvent(new CustomEvent('moon-mouse-enter', {detail: {
            element: event.target,
            title: title
        }}));
    },

    moon_mouse_leave: function(){
        window.dispatchEvent(new CustomEvent('moon-mouse-leave'));
    },

    update_epochs: function(event){
        this.loading_message = "Structuring days...";
        this.render_data.current_epoch = event.detail.current_epoch;
        this.render_data.preview_epoch = event.detail.preview_epoch;
    },

    register_events: function(event){
        this.loading_message = "Placing events...";

        this.event_execution_time.start();
        let event_data = event.detail;
        for(let epoch in this.render_data.event_epochs){
            if(this.render_data.event_epochs[epoch].events.length > 0){
                this.render_data.event_epochs[epoch].events.splice(0, this.render_data.event_epochs[epoch].events.length)
            }
            if(this.render_data.timespan_event_epochs[epoch].events.length > 0){
                this.render_data.timespan_event_epochs[epoch].events.splice(0, this.render_data.timespan_event_epochs[epoch].events.length)
            }
            if(event_data[epoch] !== undefined){
                for(var index in event_data[epoch]){
                    let calendar_event = event_data[epoch][index];
                    this.render_data.event_epochs[epoch].events.push(calendar_event)
                    this.render_data.timespan_event_epochs[epoch].events.push(calendar_event)
                }
            }
        }
        this.event_execution_time.end("Event registration took:")
    },

    pre_render: function(){
        this.render_execution_time.start()
        show_loading_screen_buffered();
    },

    post_render: function(){
        this.loading_message = "Wrapping up rendering...";

        this.render_execution_time.end("Rendering DOM took:");
        hide_loading_screen();

		eras.evaluate_current_era(
            static_data,
            evaluated_static_data.year_data.start_epoch,
            evaluated_static_data.year_data.end_epoch
        );
		eras.set_up_position();
        eras.evaluate_position();

        //This is kludgy, but ... Yuck
        setTimeout(scroll_to_epoch, 50);
    },

    pre_event_load: function(){
        this.event_execution_time.start()
    },

    post_event_load: function(){
        this.event_execution_time.end("Event DOM took:")
        this.loaded = true;
    }

}

module.exports = calendar_renderer;
