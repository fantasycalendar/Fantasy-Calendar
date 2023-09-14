import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core/index";

export const useCalendarStore = defineStore("calendar", {
    state: () => ({
        calendar: null,
        layout: useLocalStorage('calendarLayout', 'year'),
        sidebarVisible: useLocalStorage('showSidebar', false),
    }),

    actions: {
        setCalendar(calendar) {
            this.calendar = calendar;
        },
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        showSidebar() {
            this.sidebarVisible = true;
        },
        hideSidebar() {
            this.sidebarVisible = false;
        },
        setLayout(layout) {
            this.layout = layout;
        },
        backward() {
            if (this.layout === 'month' && visibleTimespan > 0) {
                visibleTimespan--;
            }

            if (this.layout === 'week') {
                if(visibleWeek === 0 && visibleTimespan > 0) {
                    visibleTimespan--;

                    visibleWeek = props.renderdata.timespans[visibleTimespan].days.length - 1;
                } else {
                    visibleWeek--;
                }
            }
        },
        forward() {
            if(this.layout === 'month' && visibleTimespan < props.renderdata.timespans.length - 1) {
                 visibleTimespan++;
            }

            if(this.layout === 'week') {
                console.log('forward week');
                if(visibleWeek === props.renderdata.timespans[visibleTimespan].days.length - 1) {
                    visibleTimespan++;

                    visibleWeek = 0;
                } else {
                    visibleWeek++;
                }
            }
        }
    },
});
