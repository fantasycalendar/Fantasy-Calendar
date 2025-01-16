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
    default_category = -1;

    createNewCategory() {
        if (this.categoryCreationIsDisabled) {
            return;
        }

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

    get categoryCreationIsDisabled() {
        return !this.new_category_name || this.categories.some(category => category.id === slugify(this.new_category_name));
    };

    removeCategory(categoryId) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.deleting = null;
    };
}

export default () => new EventCategoriesCollapsible();
