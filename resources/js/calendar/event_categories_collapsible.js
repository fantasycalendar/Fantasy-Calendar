import CollapsibleComponent from "./collapsible_component.js";
import { slugify } from "./header.js";

class EventCategoriesCollapsible extends CollapsibleComponent {

    inboundProperties = {
        "categories": "event_categories",
    };

    outboundProperties = {
        "categories": "event_categories",
    };

    deleting = null;
    categories = [];
    new_category_name = "";

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

    deleteCategory(categoryId) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
    };
}

export default () => new EventCategoriesCollapsible();
