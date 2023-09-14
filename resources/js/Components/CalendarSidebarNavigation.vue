<template>
    <nav class="flex-1 space-y-1 px-2 py-4">
        <CalendarSidebarNavigationItem
            label="Calendar"
            icon="fa fa-calendar"
            href="#"
            :active="true"
        ></CalendarSidebarNavigationItem>
        <CalendarSidebarNavigationItem
            label="Events"
            icon="fa fa-calendar-check"
            href="#"
            :active="false"
        ></CalendarSidebarNavigationItem>
        <CalendarSidebarNavigationItem
            label="Settings"
            icon="fa fa-cog"
            href="#"
            :active="false"
        ></CalendarSidebarNavigationItem>
    </nav>
</template>

<script setup>
import { useCalendarStore } from '@/stores/calendar.js';
import CalendarSidebarNavigationItem from '@/Components/CalendarSidebarNavigationItem.vue';

const calendarStore = useCalendarStore();
</script>
