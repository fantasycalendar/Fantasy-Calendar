day_data_tooltip = {

    elements: {},

    set_up: function(){
        if(Object.keys(this.elements).length == 0){
            this.tooltip_box = $('#day_data_tooltip_box');
            this.tooltip_box.find('.hidden').each(function(){
                day_data_tooltip.elements[$(this).attr('data_key')] = {
                    self: $(this),
                    container: $(this).find('.data_container')
                };
            })
        }
    },

    hide: function(event){

        if(day_data_tooltip.ignore_first){
            day_data_tooltip.ignore_first = false;
            return;
        }

        if(event.path.indexOf(day_data_tooltip.tooltip_box[0]) > -1){
            return;
        }

        document.removeEventListener('click', day_data_tooltip.hide);

        day_data_tooltip.tooltip_box.hide();
        day_data_tooltip.tooltip_box.children().first().children().addClass('hidden');

    },

    show: function(day_element, epoch_data){

        this.ignore_first = true;

        this.set_up();

        var keys = Object.keys(epoch_data);

        for(var index in keys){

            var key = keys[index];
            var data = epoch_data[key];

            if(key == "weather"){
                continue;
            }

            var html = [];

            if(data !== undefined){

                if(key == "era"){
                    if(data > -1){
                        html.push(static_data.eras[data].name);
                    }
                }else if(key.indexOf('moon') > -1){
                    for(var moon_index in data){
                        var moon = static_data.moons[moon_index];
                        var name_array = moon_phases[moon.granularity];
                        if(key == "moon_phase"){
                            var moon_data = `${moon.name}: ${name_array[data[moon_index]]}<br>`;
                        }else{
                            var moon_data = `${moon.name}: ${data[moon_index]}<br>`;
                        }
                        html.push(moon_data)
                    }
                }else if(key == "season"){
                    
                    for(var season_key in data){

                        html = [];

                        var season_data = data[season_key]

                        var element = this.elements[season_key];

                        if(element === undefined){
                            continue;
                        }

                        element.self.removeClass("hidden");

                        html.push(season_data);

                        element.container.html(html.join(''));

                    }

                }else if(key == "cycle"){

                    for(var cycle_index in data){

                        var cycle_key = data[cycle_index]

                        html.push(`${static_data.cycles.data[cycle_index].names[cycle_key]}<br>`);

                    }

                }else{
                    html.push(data);
                }


                if(key != "season" && html.length > 0){
                    var element = this.elements[key];
                    element.self.removeClass("hidden");
                    element.container.html(html.join(''));
                }

            }

        }
        
        this.popper = new Popper(day_element, this.tooltip_box, {
            placement: 'right',
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

        this.tooltip_box.show()

        document.addEventListener('click', this.hide)

    }

}