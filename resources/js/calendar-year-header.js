const calendarYearHeader = {

    static_data: undefined,
    eras: undefined,
    dynamic_data: undefined,
    preview_date: undefined,
    epoch_data: undefined,
    year_element: undefined,
    cycle_element: undefined,

    update: function(static_data, dynamic_data, preview_date, epoch_data){

        this.static_data = static_data;
        this.cycles = this.static_data.cycles;
        this.eras = this.static_data.eras;
        this.dynamic_data = dynamic_data;
        this.preview_date = preview_date;
        this.epoch_data = epoch_data;

        if(!this.year_element){
            this.year_element = $('#top_follower_content').find(".year");
        }

        if(!this.cycle_element){
            this.cycle_element = $('#top_follower_content').find(".cycle");
        }

        this.updateYearText();
        this.updateCycleText();

    },

    updateYearText(){
        this.year_element.text(this.getYearText());
    },

    getYearText(){

        const currentEra = this.era;

        if(currentEra !== -1){

            let era = this.eras[currentEra];

            if(!this.static_data.settings.hide_eras || Perms.player_at_least('co-owner')){

                let format = era.settings.restart
                    ? `Era year {{era_year}} (year {{year}}) - {{era_name}}`
                    : `Year {{year}} - {{era_name}}`;

                if(era.settings.use_custom_format && era.formatting){
                    format = era.formatting.replace(/{{/g, '{{{').replace(/}}/g, '}}}');
                }

                return this.renderYearMustache(format, era.name)

            }

        }

        return this.renderYearMustache(`Year {{year}}`);

    },

    updateCycleText(){

        let cycleText = this.getCycleText();

        if(!cycleText){
            this.cycle_element
                .html('')
                .addClass('hidden')
                .toggleClass('smaller', false);
        }

        this.cycle_element
            .html(cycleText)
            .removeClass('hidden')
            .toggleClass('smaller', cycleText.includes("<br>"));

    },

    getCycleText(){

        if(this.cycles.data.length === 0){
            return false;
        }

        return Mustache.render(
            this.cycles.format.replace(/{{/g, '{{{').replace(/}}/g, '}}}'),
            this.cycle
        );

    },

    get epoch(){
        return this.preview_date.epoch !== this.dynamic_data.epoch
            ? this.preview_date.epoch
            : this.dynamic_data.epoch;
    },

    get epochData(){
        return this.epoch_data[this.epoch];
    },

    get era(){
        return this.epochData.era ?? -1;
    },

    get cycle(){
        return get_cycle(this.static_data, this.epochData).text;
    },

    renderYearMustache(inFormat, eraName = false){

        let mustacheData = {
            "year": this.epochData.year,
            "nth_year": ordinal_suffix_of(this.epochData.year),
            "abs_year": Math.abs(this.epochData.year),
            "abs_nth_year": ordinal_suffix_of(Math.abs(this.epochData.year)),
            "era_year": this.epochData.era_year,
            "era_nth_year": ordinal_suffix_of(this.epochData.era_year),
            "abs_era_nth_year": ordinal_suffix_of(Math.abs(this.epochData.era_year))
        };

        if(eraName){
            mustacheData["era_name"] = eraName;
        }

        return Mustache.render(
            inFormat,
            mustacheData
        );

    }

}


module.exports = calendarYearHeader;
