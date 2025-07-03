export default function () {
    return {
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
        }
    }
}