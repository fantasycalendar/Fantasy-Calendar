export default () => ({
    clock: {},
    initialized: false,

    load(static_data) {
        if (!static_data) {
            return
        }

        this.clock = static_data.clock;

        if (!this.initialized) {
            this.$watch("clock", (current, previous) => {
                this.$dispatch('clock-changed', {
                    ...current
                });

                this.$dispatch('calendar-rerender-requested', {
                    rerender: previous.enabled !== current.enabled
                        || previous.hours !== current.hours
                        || previous.minutes !== current.minutes,
                    calendar: { clock: { ...current } },
                });
            });

            this.initialized = true;
        }
    },
})
