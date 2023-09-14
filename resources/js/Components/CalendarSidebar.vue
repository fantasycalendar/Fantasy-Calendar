<template>
    <div class="flex min-h-0 flex-1 flex-col bg-gray-900" v-show="calendarStore.sidebarVisible">
        <div class="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
            <ApplicationLogo class="h-8 mr-2"></ApplicationLogo>

            <div class="truncate" :title="calendarStore.calendar.name">
                {{ calendarStore.calendar.name }}
            </div>
        </div>
        <div class="flex flex-1 flex-col overflow-y-auto border-t border-gray-700">
            <CalendarSidebarNavigation></CalendarSidebarNavigation>
        </div>
    </div>
</template>

<script setup>
import { useCalendarStore } from '@/stores/calendar.js';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import CalendarSidebarNavigation from '@/Components/CalendarSidebarNavigation.vue';

const calendarStore = useCalendarStore();
</script>
