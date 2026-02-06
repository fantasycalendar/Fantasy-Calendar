export default () => ({
    chosen_view: "owner",
    open: false,
    enabled: true,
    view_modes: {
        owner: {
            icon: 'fa-user',
            label: 'Calendar as Owner',
        },
        guest: {
            icon: 'fa-users',
            label: 'Calendar as Guest',
        },
        climate: {
            icon: 'fa-chart-line',
            label: 'Climate graphs',
        },
    },

    get view_mode() {
        return this.view_modes[this.chosen_view];
    },

    switch_to_owner() {
        // TODO: Change this to an event to the calendar, instead?
        this.$store.calendar.perms.owner = true;

        this.$dispatch("rebuild-calendar");
        this.$dispatch("set-calendar-visible", true);
        this.$dispatch("set-weather-graph-visible", false);
    },

    switch_to_guest() {
        this.$store.calendar.perms.owner = false;

        this.$dispatch("rebuild-calendar");
        this.$dispatch("set-calendar-visible", true);
        this.$dispatch("set-weather-graph-visible", false);
    },

    switch_to_climate() {
        this.$dispatch("set-calendar-visible", false);
        this.$dispatch("set-weather-graph-visible", true);
    },

    switch_view(type) {
        if (type === this.chosen_view) return;
        this.chosen_view = type;

        switch (type) {
            case "owner":
                return this.switch_to_owner();
            case "guest":
                return this.switch_to_guest();
            case "climate":
                return this.switch_to_climate();
        }
    },

    delete_calendar() {

        return swal.fire({
            text: `If you're sure about deleting this calendar, please type "${this.$store.calendar.calendar_name}" below:`,
            input: "text",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            dangerMode: true
        })
            .then(result => {

                if (result.dismiss || !result.value) throw null;

                if (result.value !== this.$store.calendar.calendar_name) {
                    throw `"${result.value}" isn't the same as "${this.$store.calendar.calendar_name}"`;
                }

                return axios.delete(window.apiurl + '/calendar/' + this.$store.calendar.hash);

            })
            .then(results => {
                if (results.data.error) {
                    throw "Error: " + results.data.message;
                }

                swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: `The calendar ${this.$store.calendar.calendar_name} has been deleted.`,
                    button: true
                })
                    .then(() => {
                        window.location = '/calendars';
                    })
            })
            .catch(err => {
                if (err) {
                    swal.fire("Oh no!", err, "error");
                } else {
                    swal.hideLoading();
                    swal.close();
                }
            });
    },

    step_changed(event) {
        this.enabled = !!event.detail.done;
    },

    get title() {
        return this.enabled
            ? 'Actions'
            : 'Actions are disabled through step 3';
    }
})
