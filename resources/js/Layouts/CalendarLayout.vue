<template>
    <div class="dark:text-gray-300" :class="JSON.parse($page.props.auth.user.settings).dark_theme ? 'dark' : ''">
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "CalendarLayout.vue"
}
</script>

<style scoped>

</style>
