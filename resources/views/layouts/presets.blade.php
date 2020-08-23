<script>

    const preset_loader = {
        open: false,
        loaded: false,
        preset_applied: false,
        presets: [],
        load: function(){
            this.open = true;
            if(this.loaded){
                return;
            }
            let loader = this;
            let callback = this.populate_presets;
            axios.get(window.apiurl+'/presets')
                .then(function (result){
                    if(!result.data.error && result.data != "") {
                        callback(loader, result.data);
                    } else if(result.data == ""){
                        $.notify(
                            "Error: Failed to load calendar presets - please try again later"
                        );
                    } else {
                        $.notify(
                            "Error: " + result.data.message
                        );
                        throw result.data.message;
                    }
                });
        },
        populate_presets: function(loader, data){

            loader.presets.push({
                id: -1,
                name: "Random Calendar",
                description: "This will generate a random calendar for you"
            })

            loader.presets.push({
                id: 0,
                name: "Load custom JSON",
                description: "Input a Donjon calendar, or another Fantasy Calendar JSON string to instantly load it"
            })

            for(var index in data){
                var preset = data[index];
                loader.presets.push({
                    id: preset.id,
                    name: preset.name,
                    description: preset.description ? preset.description : "Sad, no description"
                })
            }
            loader.loaded = true;
        },
        fetch_preset: function(id, name){

            if(id <= 0){

                if(name == "Load custom JSON"){

                    swal.fire({
                        text: "Input your JSON data below:",
                        input: "textarea",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Load',
                        dangerMode: true
                    })
                    .then(result => {

                        if(result.dismiss || !result.value) return;

                        var calendar = parse_json(result.value);
                        if(calendar){
                            console.log(calendar)
                            prev_dynamic_data = {}
                            prev_static_data = {}
                            calendar_name = clone(calendar.name);
                            static_data = clone(calendar.static_data);
                            dynamic_data = clone(calendar.dynamic_data);
                            dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
                            empty_edit_values();
                            set_up_edit_values();
                            set_up_view_values();
                            set_up_visitor_values();
                            $('#json_input').val('');
                            do_error_check('calendar', true);
                            this.open = false;
                            this.preset_applied = true;
                        }else{
                            swal.fire({
                                title: "Error!",
                                text: `Unrecognized JSON format! Please try again.`,
                                icon: "warning",
                            })
                            .then(result => {
                                this.fetch_preset(id, name);
                            });
                        }

                    });

                }else{

                    swal.fire({
                        title: "Are you sure?",
                        text: `This will randomly generate new weekdays, months, leap days, moons, and seasons which will override what you have, are you sure you want to do this?`,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Generate',
                        icon: "warning",
                    })
                    .then((result) => {
                        if(result.value) {

                            calendar_name = "Random Calendar";
                            static_data = randomizer.randomize(static_data);
                            dynamic_data = {
                                "year": 1,
                                "timespan": 0,
                                "day": 1,
                                "epoch": 0,
                                "custom_location": false,
                                "location": "Equatorial"
                            };
                            empty_edit_values();
                            set_up_edit_values();
                            set_up_view_values();
                            set_up_visitor_values();
                            do_error_check('calendar', true);
                            this.open = false;
                            this.preset_applied = true;

                        }
                    });

                }

            }else{
                if(this.preset_applied){
                    swal.fire({
                        title: "Are you sure?",
                        text: `Applying this preset will overwrite all of your current progress.`,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        icon: "warning",
                    })
                    .then((result) => {
                        if(result.value) {
                            get_preset_data(id, apply_preset);
                            this.open = false;
                            this.preset_applied = true;
                        }
                    });
                }else{
                
                    get_preset_data(id, apply_preset);
                    this.open = false;
                    this.preset_applied = true;

                }
            }
        }
    }

    function apply_preset(data){
        preset_applied = true;
        calendar_name = data.name;
        static_data = data.static_data;
        dynamic_data = data.dynamic_data;
        events = data.events;
        event_categories = data.categories;
        dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;

        for(var index in events){
            var event = events[index];
            delete event.preset_event_category_id;
            delete event.preset_id;
            delete event.created_at;
            delete event.updated_at;
            delete event.deleted_at;
        }
        
        for(var index in event_categories){
            var category = event_categories[index];
            category.id = category.label;
            delete category.label;
            delete category.preset_id;
            delete category.created_at;
            delete category.updated_at;
            delete category.deleted_at;
        }

        empty_edit_values();
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();
        do_error_check('calendar', true);
        evaluate_save_button();
        do_error_check();
        $.notify(
            "Calendar preset loaded!",
            "success"
        );
    }

</script>

<div class='preset_background clickable_background' x-show='open'>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <h2 class='text-center col'>Calendar Presets</h2>
                </div>
                
                <div class='row'>
                    <div class='col' x-bind:class="{ 'loading': !loaded }"></div>
                </div>

                <div class='row justify-content-start'>
                    
                    <template x-if="loaded" x-for="preset in presets" :key="preset.id">
                        <div class="col-4 p-1">
                            <button type="button" @click="fetch_preset(preset.id, preset.name)" class="full btn shadow hover:bg-indigo-100 hover:shadow-lg hover:rounded transition duration-150 ease-in-out transform hover:scale-105 p-3" x-text="preset.name">
                            </button>
                        </div>
                    </template>
                </div>

            </form>
        </div>
    </div>
</div>