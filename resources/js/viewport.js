export default function () {
    return {
        errors: {},
        sidebar_open: this.$persist(true),

        open_sidebar() {
            this.sidebar_open = true;
        },
        close_sidebar() {
            this.sidebar_open = false;
        },

        init() {
            this.$nextTick(() => {
                window.onerror = (error, url, line) => {
                    this.$dispatch("notify", {
                        content: "Error:\n " + error + " \nin file " + url + " \non line " + line,
                        type: "error"
                    });
                }

                if (deviceType() == "Mobile Phone") {
                    this.sidebar_open = false;
                }
            })
        },

        add_errors($event) {
            this.errors[$event.detail.key] = $event.detail.errors;
        },

        remove_errors($event) {
            if(this.errors[$event.detail.key]){
                delete this.errors[$event.detail.key];
            }
        },

        get flattened_errors(){
            // Unpack array of arrays
            return [].concat(...Object.values(this.errors));
        }
    }
}
