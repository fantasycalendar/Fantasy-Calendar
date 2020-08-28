const preset_loader = {

    open: false,
    loaded: false,
    preset_applied: false,
    presets: [],
    featured: [],
    search: "",
    total: 0,
    page_number: 0,
    size: 8,

    get filteredPresets() {

        const start = this.page_number * this.size;
        const end = start + this.size;

        if (this.search === "") {
            this.total = this.presets.length;
            return this.presets.slice(start, end);
        }

        let results = this.presets.filter((item) => {
            return item.name
                .toLowerCase()
                .includes(this.search.toLowerCase())
                ||
                item.description
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                ||
                item.author && item.author
                    .toLowerCase()
                    .includes(this.search.toLowerCase());
        });

        this.total = results.length;

        return results.slice(start, end);

    },

    get pages(){
        return Array.from({
            length: Math.ceil(this.total / this.size),
        });
    },

    next_page: function(){
        this.page_number++;
    },

    prev_page: function(){
        this.page_number--;
    },

    get page_count() {
        return Math.ceil(this.total / this.size);
    },

    //Return the start range of the paginated results
    get start_results(){
       return this.page_number * this.size + 1;
    },

    //Return the end range of the paginated results
    get end_results(){
        let resultsOnPage = (this.page_number + 1) * this.size;

        if (resultsOnPage <= this.total) {
            return resultsOnPage;
        }

        return this.total;
    },

    view_page: function(index){
        this.page_number = index;
    },

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
                    callback(loader, []);
                } else {
                    $.notify(
                        "Error: " + result.data.message
                    );
                    throw result.data.message;
                }
            });
    },

    populate_presets: function(loader, presets){

        for(let index in presets){
            presets[index]['author'] = `Author: ${presets[index]['author']}`;

            if(presets[index]['featured']) {
                presets[index].icon = "star";
                loader.featured.push(presets[index]);
            }
        }

        loader.presets = presets;

        loader.presets.splice(0, 0, {
            id: -1,
            name: "Random Calendar",
            icon: 'random',
            description: "This preset will generate a random calendar for you",
            featured: 0
        })

        loader.presets.splice(1, 0, {
            id: 0,
            name: "Load custom JSON",
            icon: 'file-import',
            description: "Input a Donjon calendar, or another Fantasy Calendar JSON string to import it",
            featured: 0
        })

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
                        get_preset_data(id, this.apply_preset);
                        this.open = false;
                        this.preset_applied = true;
                    }
                });
            }else{
                get_preset_data(id, this.apply_preset);
                this.open = false;
                this.preset_applied = true;
            }
        }
    },

    apply_preset: function(data){

        calendar_name = data.name;
        static_data = data.static_data;
        dynamic_data = data.dynamic_data;
        events = data.events;
        event_categories = data.categories;

        if(calendar_name.indexOf("Gregorian Calendar") > -1){
            let current_date = new Date();
            dynamic_data.year = current_date.getFullYear();
            dynamic_data.timespan = current_date.getMonth();
            dynamic_data.day = current_date.getDate();
            dynamic_data.hour = current_date.getHours();
            dynamic_data.minute = current_date.getMinutes();
        }

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
}

module.exports = preset_loader;
