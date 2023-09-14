<template>
    <div class="grid h-full flex-1 divide-y divide-gray-700 bg-gray-800 border-t border-gray-700" :style="'grid-template-rows: 30px repeat(' + timespans.rows.length + ', 1fr);'">
        <div class="w-full grid divide-x divide-gray-700" :style="'grid-template-columns: repeat(' + timespans.rows[0].length + ', 1fr);'">
            <div v-for="name in timespans.weekdays" class="grid place-items-center">
                {{ name }}
            </div>
        </div>
        <div v-for="week in timespans.rows" class="w-full grid divide-x divide-gray-700" :style="'grid-template-columns: repeat(' + week.length + ', 1fr);'">
            <div v-for="day in week" class="relative flex flex-col pb-1" :class="{ 'bg-gray-900 bg-opacity-40 cursor-no-drop': day.type === 'overflow', 'bg-orange-400 bg-opacity-[13%]' : day.epoch == currentEpoch }">
                <div class="absolute top-1 right-2 h-6 grid place-items-center text-xs xl:text-base">
                    {{ day.number }}
                </div>

                <div class="h-8">
                    <!-- Phantom element to force everything else down -->
                </div>

                <div class="flex flex-col w-full px-1 space-y-2">
                    <div v-for="event in day.events" class="w-full p-1 text-sm rounded cursor-pointer event background" :class="[event.class]">
                        {{ event.name }}
                    </div>
                </div>

                <div class="flex-1 w-full p-1" v-show="day.type != 'overflow'">
                    <button class="flex-1 h-full w-full border-2 border-dotted rounded dark:border-gray-500 hover:border-gray-300 dark:text-gray-500 dark:hover:border-gray-500 opacity-0 hover:opacity-100">
                        <FontAwesomeIcon icon="fa fa-plus"></FontAwesomeIcon>
                    </button>
                </div>

                <div class="w-full h-1 bg-orange-400 absolute bottom-0" v-show="(day.epoch == currentEpoch)">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    timespans: Object,
    currentEpoch: Number,
    previewEpoch: Number,
});
</script>

<style scoped>

</style>
