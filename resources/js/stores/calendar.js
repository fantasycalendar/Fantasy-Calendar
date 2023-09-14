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
    },
});
