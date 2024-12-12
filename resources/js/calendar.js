// TODO: ABSOLUTELY rewrite this
export default class Calendar {
    get static_data(){
        return window.static_data;
    }

    get dynamic_data(){
        return window.dynamic_data;
    }

    get events(){
        return window.events;
    }

    get event_categories(){
        return window.event_categories;
    }
}
