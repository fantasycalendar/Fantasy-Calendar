import CollapsibleComponent from "./collapsible_component.js";

class EventCategoriesCollapsible extends CollapsibleComponent {

    inboundProperties = {
        "categories": "event_categories",
    };

    categories = [];

}

export default () => new EventCategoriesCollapsible();
