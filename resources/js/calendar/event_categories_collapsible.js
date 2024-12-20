import CollapsibleComponent from "./collapsible_component.js";
import { slugify } from "./header.js";

class EventCategoriesCollapsible extends CollapsibleComponent {

    inboundProperties = {
        "categories": "event_categories",
        "default_category": "static_data.settings.default_category",
    };

    outboundProperties = {
        "categories": "event_categories",
        "default_category": "static_data.settings.default_category",
    };

    deleting = null;
    categories = [];
    new_category_name = "";
    default_category = null;

    createNewCategory() {
        let calendar_id = this.$store.calendar.id;

        this.categories.push({
            name: this.new_category_name,
            category_settings: {
                hide: false,
                player_usable: false,
            },
            event_settings: {
                color: "Dark-Solid",
                text: "text",
                hide: false,
                print: false
            },
            calendar_id: typeof calendar_id != "undefined" ? calendar_id : null,
            id: slugify(this.new_category_name)
        });

        this.new_category_name = "";
    };

    removeCategory(categoryId) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
    };
}

export default () => new EventCategoriesCollapsible();
