<template>
    <CalendarLayout>
        <div class="min-h-screen">
            <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
            <MobileCalendarSidebar></MobileCalendarSidebar>

            <!-- Static sidebar for desktop -->
            <div class="hidden" :class="{ 'md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-700': calendarStore.sidebarVisible }" v-show="calendarStore.sidebarVisible">
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <CalendarSidebar></CalendarSidebar>
            </div>

            <div class="flex flex-col min-h-screen" :class="{ 'md:pl-64': calendarStore.sidebarVisible }">
                <div class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
                    <button @click="calendarStore.toggleSidebar" type="button" class="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                        <span class="sr-only">Open sidebar</span>
                        <!-- Heroicon name: outline/bars-3-bottom-left -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                    </button>
                    <div class="flex flex-1 justify-between items-center px-4">
                        <div class="flex-1">
                            <button @click="backward" class="hover:bg-gray-700 rounded-full w-8 h-8 mr-1"><FontAwesomeIcon class="text-sm px-1.5" icon="fa fa-chevron-left"></FontAwesomeIcon></button>
                            <button @click="forward" class="hover:bg-gray-700 rounded-full w-8 h-8 mr-1"><FontAwesomeIcon class="text-sm px-1.5" icon="fa fa-chevron-right"></FontAwesomeIcon></button>
                            <span>
                                <span v-show="!calendarStore.sidebarVisible">{{ calendar.name }} -</span> <span v-show="calendarStore.layout !== 'year'">{{ renderdata.timespans[visibleTimespan].title }}</span> {{ renderdata.year }}
                            </span>
                        </div>

                        <div class="hidden md:flex">
                            <form class="flex md:ml-0 mr-2" action="#" method="GET">
                                <label for="search-field" class="sr-only">Search</label>
                                <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                        <!-- Heroicon name: mini/magnifying-glass -->
                                        <svg class="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input id="search-field" class="block dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 h-9 w-full border-gray-700 rounded-md pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm" placeholder="Search" type="search" name="search">
                                </div>
                            </form>
                        </div>

                        <Dropdown>
                            <template #trigger>
                                <button class="inline-flex items-center sm:text-sm rounded-md border border-transparent bg-gray-700 px-3 h-9 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <span v-text="calendarStore.layout.substring(0,1).toUpperCase() + calendarStore.layout.substring(1)"></span>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </template>

                            <template #content>
                                <DropdownLink class="pointer-events-none bg-gray-800 dark:text-gray-800 opacity-70" as="button" @click="calendarStore.layout = 'day'" preserve-state>Day (not impl.)</DropdownLink>
                                <DropdownLink as="button" @click="calendarStore.layout = 'week'" preserve-state>Week</DropdownLink>
                                <DropdownLink as="button" @click="calendarStore.layout = 'month'" preserve-state>Month</DropdownLink>
                                <DropdownLink as="button" @click="calendarStore.layout = 'year'" preserve-state>Year</DropdownLink>
                            </template>
                        </Dropdown>

                        <div class="ml-4 flex items-center md:ml-6 space-x-1">
                            <button type="button" class="rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 dark:text-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                <span class="sr-only">View notifications</span>
                                <!-- Heroicon name: outline/bell -->
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button>

                            <Dropdown>
                                <template #trigger>
                                    <FontAwesomeIcon icon="far fa-user-circle" class="p-1 text-lg hover:opacity-75 text-gray-400 dark:text-gray-300"></FontAwesomeIcon>
                                </template>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main class="flex-1 h-full flex flex-col">
                    <pre class="m-5 p-4 bg-gray-800 overflow-auto" v-show="debug">
                        <code>
                            {{ calendar.renderStructure() }}
                        </code>
                    </pre>

                    <CalendarViewport
                        v-show="!debug"
                        :layout="calendarStore.layout"
                        :timespans="renderable_data"
                        :visible-timespan="visibleTimespan"
                        :visible-week="visibleWeek"
                        :current-epoch="renderdata.current_epoch"
                        :preview-epoch="renderdata.preview_epoch"
                    ></CalendarViewport>
                </main>
            </div>
        </div>

    </CalendarLayout>
</template>

<script setup>
import CalendarLayout from '@/Layouts/CalendarLayout.vue';
import Calendar from '@/calendar/calendar';
import {computed, ref} from "vue";
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import CalendarViewport from '@/Components/CalendarViewport.vue';
import CalendarSidebar from '@/Components/CalendarSidebar.vue';
import MobileCalendarSidebar from '@/Components/MobileCalendarSidebar.vue';
import { useCalendarStore } from '@/stores/calendar.js';

const debug = (new URLSearchParams(window.location.search)).get('debug') === 'true';
const props = defineProps({
    calendar_attributes: Object,
    renderdata: Object,
})

const renderable_data = computed(() => {
    return calendar.renderStructure();
})
const calendar = new Calendar(props.calendar_attributes);
const calendarStore = useCalendarStore();
calendarStore.setCalendar(calendar);

const visibleTimespan = ref(8);
const visibleWeek = ref(1);

const backward = () => {
    console.log(calendarStore.layout);
    if (calendarStore.layout === 'month' && visibleTimespan > 0) {
        visibleTimespan--;
    }

    if (calendarStore.layout === 'week') {
        if(visibleWeek === 0 && visibleTimespan > 0) {
            visibleTimespan--;

            visibleWeek = props.renderdata.timespans[visibleTimespan].days.length - 1;
        } else {
            visibleWeek--;
        }
    }
};

const forward = () => {
    console.log(calendarStore.layout);
    if(calendarStore.layout === 'month' && visibleTimespan < props.renderdata.timespans.length - 1) {
         visibleTimespan++;
    }

    if(calendarStore.layout === 'week') {
        if(visibleWeek === props.renderdata.timespans[visibleTimespan].days.length - 1) {
            visibleTimespan++;

            visibleWeek = 0;
        } else {
            visibleWeek++;
        }
    }
}
</script>

<style scoped>

</style>
