import { moon_phases } from "./calendar_variables";

export var day_data_tooltip = {

    elements: {},

    set_up: function(){
        if(Object.keys(this.elements).length === 0){
            this.tooltip_box = document.getElementById('day_data_tooltip_box');
            this.tooltip_box.querySelectorAll('.hidden').forEach(function(el){
                day_data_tooltip.elements[el.getAttribute('data_key')] = {
                    self: el,
                    container: el.querySelector('.data_container')
                };
            })
        }
    },

    hide: function(event){

        if(day_data_tooltip.ignore_first){
            day_data_tooltip.ignore_first = false;
            return;
        }



        if(event.target.closest('#day_data_tooltip_box')){
            return;
        }

        document.removeEventListener('click', day_data_tooltip.hide);

        day_data_tooltip.tooltip_box.style.display = 'none';
        Array.from(day_data_tooltip.tooltip_box.children[0].children).forEach(function(child){ child.classList.add('hidden'); });

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
                        html.push(sanitizeHtml(window.static_data.eras[data].name));
                    }
                }else if(key.indexOf('moon') > -1){
                    for(var moon_index in data){
                        var moon = window.static_data.moons[moon_index];
                        if(key == "moon_phase"){
                            var name_array = Object.keys(moon_phases[moon.granularity]);
                            var moon_data = `${sanitizeHtml(moon.name)}: ${name_array[data[moon_index]]}<br>`;
                        }else{
                            var moon_data = `${sanitizeHtml(moon.name)}: ${data[moon_index]}<br>`;
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

                        element.self.classList.remove("hidden");

                        html.push(season_data);

                        element.container.innerHTML = html.join('');

                    }

                }else if(key == "cycle"){

                    for(var cycle_index in data){

                        var cycle_key = data[cycle_index]

                        html.push(`${sanitizeHtml(window.static_data.cycles.data[cycle_index].names[cycle_key])}<br>`);

                    }

                }else{
                    html.push(data);
                }


                if(key != "season" && html.length > 0){
                    var element = this.elements[key];
                    element.self.classList.remove("hidden");
                    element.container.innerHTML = html.join('');
                }

            }

        }

        this.popper = new Popper(day_element, this.tooltip_box, {
            placement: 'right',
            modifiers: {
                preventOverflow: {
                    boundariesElement: document.getElementById('calendar'),
                },
                offset: {
                    enabled: true,
                    offset: '0, 14px'
                }
            }
        });

        this.tooltip_box.style.display = ''

        document.addEventListener('click', this.hide)

    }

}
