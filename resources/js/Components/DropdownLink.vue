<script setup>
import { Link } from '@inertiajs/inertia-vue3';
import {computed} from "vue";

const props = defineProps({
    role: {
        type: String,
        default: 'primary'
    }
})

const roleClasses = computed(() => {
    return {
        'primary': 'text-white disabled:hover:bg-primary-600 hover:bg-primary-700 disabled:dark:hover:bg-primary-900 dark:hover:bg-primary-800',
        'info': 'text-blue-600 disabled:hover:bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 disabled:dark:hover:bg-blue-900 dark:hover:bg-blue-800 focus:ring-blue-500 border-transparent shadow-sm',
        'secondary': 'text-gray-700 bg-white disabled:hover:bg-white hover:bg-gray-50 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 disabled:dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:border-gray-600 shadow-sm',
        'danger': 'text-white disabled:hover:bg-red-600 hover:bg-red-700 disabled:dark:hover:bg-red-900 dark:hover:bg-red-800 focus:ring-red-500',
        'custom': '',
    }[props.role];
})
</script>

<template>
    <Link class="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out" :class="roleClasses">
        <slot />
    </Link>
</template>
