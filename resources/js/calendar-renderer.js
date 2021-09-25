const calendar_renderer = {

    loaded: false,
    loading_message: "Initializing...",

    render_callbacks: [],

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

    register_render_callback(callback){
        this.render_callbacks.push(callback)
    },

    load_calendar: function(event){
        this.loading_message = "Building calendar...";
        this.render_data = event.detail;
    },

    view_event: function(event) {
        show_event_ui.clicked_event($(event.target));
    },

    weather_click: function(day, event) {
        calendar_weather.tooltip.sticky($(event.target));
    },

    weather_mouse_enter: function(day, event) {
        calendar_weather.tooltip.show($(event.target));
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
        CalendarYearHeader.update(
            static_data,
            dynamic_data,
            preview_date,
            evaluated_static_data.epoch_data
        );
    },

    pre_render: function(){
        show_loading_screen_buffered();
    },

    post_render: function(){
        this.loading_message = "Wrapping up rendering...";

        hide_loading_screen();
        scroll_to_epoch();

        CalendarYearHeader.update(
            static_data,
            dynamic_data,
            preview_date,
            evaluated_static_data.epoch_data
        );

        for(let index in this.render_callbacks){
            let callback = this.render_callbacks[index];
            if(callback){
                callback();
            }
        }
        this.render_callbacks = [];
        this.loaded = true;

	    execution_time.end("Calculating and rendering calendar took:")
    }

}

module.exports = calendar_renderer;
