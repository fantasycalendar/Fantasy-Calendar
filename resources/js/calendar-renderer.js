const calendar_renderer = {

    loaded: false,

    render_data: {
        current_epoch: 0,
        preview_epoch: 0,
        render_style: "grid",
        timespans: [],
        event_epochs: []
    },

    render_settings: {
        only_reveal_today: false,
        hide_moons: false,
        hide_events: false,
        hide_all_weather: false,
        hide_future_weather: false,
        add_month_number: false,
        add_year_day_number: false,
        hide_weekdays: false
    },

    render_day(day){
        console.log(!this.render_settings.only_reveal_today || (this.render_settings.only_reveal_today && day.epoch > this.render_data.current_epoch))
        return !this.render_settings.only_reveal_today || (this.render_settings.only_reveal_today && day.epoch > this.render_data.current_epoch);
    },

    update_render_settings: function(event){

        let settings = event.detail;

        this.render_settings.only_reveal_today   = settings.only_reveal_today   ? settings.only_reveal_today : false
        this.render_settings.hide_moons          = settings.hide_moons          ? settings.hide_moons : false
        this.render_settings.hide_events         = settings.hide_events         ? settings.hide_events : false
        this.render_settings.hide_all_weather    = settings.hide_all_weather    ? settings.hide_all_weather : false
        this.render_settings.hide_future_weather = settings.hide_future_weather ? settings.hide_future_weather : false
        this.render_settings.add_month_number    = settings.add_month_number    ? settings.add_month_number : false
        this.render_settings.add_year_day_number = settings.add_year_day_number ? settings.add_year_day_number : false
        this.render_settings.hide_weekdays       = settings.hide_weekdays       ? settings.hide_weekdays : false

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
        this.render_data = event.detail;
        this.loaded = true;
    },

    create_event: function(epoch) {
        edit_event_ui.create_new_event('New Event', epoch);
    },

    update_epochs: function(event){
        this.render_data.current_epoch = event.detail.current_epoch;
        this.render_data.preview_epoch = event.detail.preview_epoch;
    },

    register_events: function(event){
        this.event_execution_time.start();
        let event_data = event.detail;
        for(let epoch in this.render_data.event_epochs){
            if(this.render_data.event_epochs[epoch].length > 0){
                this.render_data.event_epochs[epoch].splice(0, this.render_data.event_epochs[epoch].length)
            }
            if(event_data[epoch] !== undefined){
                for(var index in event_data[epoch]){
                    let event = event_data[epoch][index];
                    this.render_data.event_epochs[epoch].push(event)
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
        this.render_execution_time.end("Rendering DOM took:")
        scroll_to_epoch();
        hide_loading_screen();
    },

    pre_event_load: function(){
        this.event_execution_time.start()
    },

    post_event_load: function(){
        this.event_execution_time.end("Event DOM took:")
    }

}

module.exports = calendar_renderer;
