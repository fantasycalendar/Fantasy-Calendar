import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core/index";

export const useCalendarStore = defineStore("calendar", {
    state: () => ({
        calendar: null,
        layout: useLocalStorage('calendarLayout', 'year'),
        sidebarVisible: useLocalStorage('showSidebar', false),
        sidebarItems: [
            {
                label: "Calendar",
                icon: "fa-calendar",
                route: "#",
            },
            {
                label: "Events",
                icon: "fa-calendar-check",
                route: "#",
            },
            {
                label: "Settings",
                icon: "fa-cog",
                route: "#",
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
