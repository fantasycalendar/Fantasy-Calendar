<template>
    <li class="relative flex items-center dark:text-gray-500"
        :title="calendar.disabled ? 'Subscribe for more than 2 calendars' : calendar.name"
    >
        <Link :href="route('calendars.show', {calendar: calendar.hash})" class="cursor-pointer block flex-grow hover:bg-gray-50 dark:hover:bg-gray-700">
            <div class="flex items-center px-4 py-4 sm:px-6">
                <div class="min-w-0 flex-1 md:grid md:grid-cols-3 md:gap-4">
                    <div>
                        <!--                    Calendar and user name -->
                        <p class="text-lg font-medium pr-24 md:pr-0" :class="calendar.disabled ? 'text-orange-300 dark:text-orange-700' : 'text-primary-700 dark:text-primary-500'">
                            <i v-if="calendar.disabled" class="fa fa-exclamation-triangle text-orange-300 dark:text-orange-700" title="Subscribe for more than 2 calendars."></i>
                            {{ calendar.name }}
                        </p>
                        <p class="mt-1 flex items-center text-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-8 md:w-5 flex-shrink-0 md:mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                            </svg>
                            <span class="truncate">
                            {{ calendar.user.username }}
                            <span v-if="calendar.users_count">
                                <FontAwesomeIcon icon="fa fa-user" class="ml-4"></FontAwesomeIcon> {{ calendar.users_count }}
                            </span>
                        </span>
                        </p>
                    </div>

                    <!--                Current date/era -->
                    <div class="flex-grow">
                        <div class="flex text-md text-gray-600 dark:text-gray-400 mb-1 md:pt-0">
                            <FontAwesomeIcon icon="fa fa-calendar" class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center"></FontAwesomeIcon> <div>current_date here</div>
                        </div>

                        <div class="flex text-md text-gray-600 dark:text-gray-400 mb-1 md:pt-0">
                            <FontAwesomeIcon icon="fa fa-infinity" class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center"></FontAwesomeIcon> <div>current_era here</div>
                        </div>
                    </div>

                    <!--                Current time/date -->
                    <div class="text-gray-900 dark:text-gray-400 text-md">
                        <div class="flex text-md text-gray-600 dark:text-gray-400 mb-1 md:pt-0">
                            <FontAwesomeIcon icon="fa fa-clock" class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center"></FontAwesomeIcon> <div>current_time here</div>
                        </div>
                        <div class="flex text-md text-gray-600 dark:text-gray-400 mb-1 md:pt-0">
                            <FontAwesomeIcon icon="fa fa-calendar-alt" class="flex-shrink-0 pt-1 w-8 text-gray-400 text-center"></FontAwesomeIcon> <div>events_count here</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

        <div class="absolute top-0 bottom-0 right-4 grid place-items-center">
            <Dropdown>
                <template #trigger="triggerProps">
                    <FontAwesomeIcon class="cursor-pointer hover:bg-gray-700 text-gray-500 p-3 rounded-full active:ring-1 ring-primary-500" :class="triggerProps.classes" icon="fa fa-cog"></FontAwesomeIcon>
                </template>

                <template #content>
                    <DropdownLink :href="route('calendars.show', {calendar: calendar.hash})">Copy</DropdownLink>
                    <DropdownLink :href="route('calendars.show', {calendar: calendar.hash})">Embed</DropdownLink>
                    <DropdownLink :href="route('calendars.show', {calendar: calendar.hash})">Export</DropdownLink>
                    <DropdownLink role="danger" :href="route('calendars.show', {calendar: calendar.hash})">Delete</DropdownLink>
                </template>
            </Dropdown>
        </div>
    </li>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3';
import Dropdown from './Dropdown.vue';
import DropdownLink from './DropdownLink.vue';

const props = defineProps({
    calendar: Object,
})
</script>
