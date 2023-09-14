import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core/index";

export const useCalendarStore = defineStore("calendar", {
    state: () => ({
        calendar: null,
        layout: useLocalStorage('calendarLayout', 'year'),
        sidebarVisible: useLocalStorage('showSidebar', false),
        sidebarItems: [
            {
                name: "Calendar",
                icon: "fa-calendar",
                route: "calendar.year",
            },
            {
                name: "Month",
                icon: "calendar",
                route: "calendar.month",
            },
            {
                name: "Week",
                icon: "calendar",
                route: "calendar.week",
            }
        ]
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
