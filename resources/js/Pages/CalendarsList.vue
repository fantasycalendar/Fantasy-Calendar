<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/inertia-vue3';
import ButtonLink from '../Components/ButtonLink.vue';
import CalendarsListItem from '../Components/CalendarsListItem.vue';

const props = defineProps({
    user: Object,
    calendars: Object,
    shared_calendars: Object,
})
</script>

<template>
    <Head title="My Calendars" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <div class="font-semibold text-xl text-gray-800 dark:text-gray-100">
                    My Calendars
                </div>

                <ButtonLink href="#" size="sm">
                    <FontAwesomeIcon class="mr-1" icon="fa fa-plus"></FontAwesomeIcon> Create New
                </ButtonLink>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div v-show="calendars.length">
                        <div class="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                            <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                                <CalendarsListItem v-for="calendar in calendars" :calendar="calendar"></CalendarsListItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
