const calendar_day_data = {

    open: false,
    epoch_data: false,
    displayed_data: {
        "cycles": [],
        "era_name": false,
        "moon_phases": [],
        "moon_phase_num_epoch": [],
        "moon_phase_num_year": [],
        "moon_phase_num_month": []
    },
    popper: false,
    element: false,
    day_element: false,

    init($event){

        let epoch = $event.detail.epoch;
		this.epoch_data = evaluated_static_data.epoch_data[epoch];
        this.day_element = $event.detail.element;

        if(!this.element) {

            this.element = $("#day_data_tooltip_box");

            this.popper = new Popper(this.day_element, this.element, {
                placement: 'right-left-bottom-top',
                modifiers: {
                    preventOverflow: {
                        boundariesElement: $('#calendar')[0],
                    },
                    offset: {
                        enabled: true,
                        offset: '0, 14px'
                    }
                }
            });

        }

    },

    update_position(){

        this.popper.reference = this.day_element;
        this.popper.scheduleUpdate();

    },

    show_epoch($event){

        this.init($event)

        for(const [key, value] of Object.entries(this.epoch_data)){
            if(typeof value !== "object" && value !== null){
                this.displayed_data[key] = value;
            }
        }

        let restarting_eras = static_data.eras.filter(era => era.settings.restart);
        if(restarting_eras.length == 0){
            this.displayed_data['era_year'] = false;
        }

        this.displayed_data['era_name'] = false;
        if(this.epoch_data.era > -1){
            this.displayed_data['era_name'] = static_data.eras[this.epoch_data.era].name;
        }

        this.displayed_data['moon_phases'] = [];
        this.displayed_data['moon_phase_num_epoch'] = [];
        this.displayed_data['moon_phase_num_year'] = [];
        this.displayed_data['moon_phase_num_month'] = [];
        if(static_data.moons.length !== 0) {
            for(let moon_index in static_data.moons){
                let moon = static_data.moons[moon_index];

                let name_array = Object.keys(moon_phases[moon.granularity]);
                let phase = this.epoch_data.moon_phase[moon_index];
                let phase_text = `${moon.name}: ${name_array[phase]}`;
                this.displayed_data['moon_phases'].push(phase_text);

                let epoch_count = this.epoch_data.moon_phase_num_epoch[moon_index];
                let epoch_count_text = `${moon.name}: ${epoch_count}`;
                this.displayed_data['moon_phase_num_epoch'].push(epoch_count_text);

                let year_count = this.epoch_data.moon_phase_num_year[moon_index];
                let year_count_text = `${moon.name}: ${year_count}`;
                this.displayed_data['moon_phase_num_year'].push(year_count_text);

                let month_count = this.epoch_data.moon_phase_num_month[moon_index];
                let month_count_text = `${moon.name}: ${month_count}`;
                this.displayed_data['moon_phase_num_month'].push(month_count_text);
            }
        }

        this.displayed_data['cycles'] = [];
        if(static_data.cycles.length !== 0) {
            for (let cycle_index in this.epoch_data.cycle){
                let cycle_position = this.epoch_data.cycle[cycle_index];
                let cycle = static_data.cycles.data[cycle_index];
                this.displayed_data['cycles'].push(cycle.names[cycle_position]);
            }
        }


        this.displayed_data['season_name'] = this.epoch_data.season ? this.epoch_data.season.season_name : false;
        this.displayed_data['season_perc'] = this.epoch_data.season ? this.epoch_data.season.season_perc : false;
        this.displayed_data['season_day'] = this.epoch_data.season ? this.epoch_data.season.season_day : false;
        this.displayed_data['sunrise'] = this.epoch_data.season ? this.epoch_data.season.time.sunrise.string : false;
        this.displayed_data['sunset'] = this.epoch_data.season ? this.epoch_data.season.time.sunset.string : false;

    },

}

module.exports = calendar_day_data;
