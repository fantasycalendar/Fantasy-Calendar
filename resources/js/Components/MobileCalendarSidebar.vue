<template>
    <div class="relative z-40 md:hidden" role="dialog" aria-modal="true" v-show="calendarStore.showSidebar">
    <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        v-show="calendarStore.sidebarVisible"
    >
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </transition>

    <div class="fixed inset-0 z-40 flex">
        <transition
            enter-active-class="transition ease-in-out duration-300 transform"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out duration-300 transform"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
            v-show="calendarStore.sidebarVisible"
        >
            <div class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
                <transition
                    enter-active-class="ease-in-out duration-300"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="ease-in-out duration-300"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    v-show="calendarStore.sidebarVisible"
                >
                    <div class="absolute top-0 right-0 -mr-12 pt-2">
                        <button @click="calendarStore.toggleSidebar()" type="button" class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span class="sr-only">Close sidebar</span>
                            <!-- Heroicon name: outline/x-mark -->
                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </transition>

                <div class="flex flex-shrink-0 items-center px-4">
                    <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=primary&shade=500" alt="Your Company">
                </div>
                <div class="mt-5 h-0 flex-1 overflow-y-auto">
                    <CalendarSidebarNavigation></CalendarSidebarNavigation>
                </div>
            </div>
        </transition>

        <div class="w-14 flex-shrink-0" aria-hidden="true" @click="calendarStore.toggleSidebar()">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
    </div>
</div>
</template>

<script setup>
import { useCalendarStore } from '@/stores/calendar.js';
import CalendarSidebarNavigation from '@/Components/CalendarSidebarNavigation.vue';

const calendarStore = useCalendarStore();
</script>
