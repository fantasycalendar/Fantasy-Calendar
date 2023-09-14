<template>
    <nav class="flex-1 space-y-1 px-2 py-4">
        <CalendarSidebarNavigationItem
            label="Return to Calendars"
            icon="fa fa-arrow-left"
            href="/calendars"
            class="mb-6"
        >
        </CalendarSidebarNavigationItem>

        <CalendarSidebarNavigationItem
            v-for="item in calendarStore.sidebarItems"
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
            :active="item.active ?? false"
        ></CalendarSidebarNavigationItem>
    </nav>
</template>

<script setup>
import { useCalendarStore } from '@/stores/calendar.js';
import CalendarSidebarNavigationItem from '@/Components/CalendarSidebarNavigationItem.vue';

const calendarStore = useCalendarStore();
</script>
