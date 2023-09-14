<template>
    <a
        href="href"
        :class="{
            'bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md':
                active,
            'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md':
                !active,
        }"
    >
        <FontAwesomeIcon
            :icon="icon"
            class="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
        ></FontAwesomeIcon>
        {{ label }}
    </a>
</template>

<script setup>
const props = defineProps({
    label: String,
    icon: String,
    href: String,
    active: Boolean,
});
</script>
