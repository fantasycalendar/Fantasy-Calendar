export default () => ({
	clock: {},

	load (static_data) {
		if (!static_data) {
			return
		}
		this.clock = static_data.clock;
	},

	init() {

		this.$watch("clock", (current, previous) => {

			if(previous?.enabled === undefined){
				return;
			}

			window.static_data.clock = { ...current };

			window.dispatchEvent(new CustomEvent('clock-changed', {
				detail: {
					...current
				}
			}));

			window.dispatchEvent(new CustomEvent('calendar-rerender-requested', {
				detail: {
					rerender: previous.enabled !== current.enabled
						|| previous.hours !== current.hours
						|| previous.minutes !== current.minutes
				}
			}));

		});

	}
})
