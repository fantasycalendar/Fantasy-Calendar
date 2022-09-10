<template>
    <div class="grid h-full flex-1 w-full divide-y dark:divide-gray-700 grid-rows-[30px,1fr]">
        <div class="flex divide-x dark:divide-gray-700">
            <div class="flex-1 text-center grid items-center bg-gray-800" v-for="day in timespans.weekdays">
                {{ day }}
            </div>
        </div>
        <div class="flex divide-x dark:divide-gray-700">
            <div v-for="day in week" class="flex-1 flex flex-col relative" :class="{ 'bg-gray-800': day.type === 'day' ,'bg-gray-900': day.type === 'overflow', 'bg-orange-400 bg-opacity-[13%]' : day.epoch == currentEpoch }">
                <div class="absolute top-1 right-2 h-6 grid place-items-center text-xs">
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

                <div class="flex-1 w-full p-1">
                    <button class="flex-1 h-full w-full border-2 border-dotted rounded dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-400 opacity-0 hover:opacity-100">
                        <FontAwesomeIcon icon="fa fa-plus"></FontAwesomeIcon>
                    </button>
                </div>

                <div class="w-full h-1 bg-orange-400 justify-self-end" v-show="(day.epoch == currentEpoch)">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
    timespans: Object,
    visibleWeek: Number,
    currentEpoch: Number,
    previewEpoch: Number,
});

const week = computed(() => {
    return props.timespans.days[props.visibleWeek];
});
</script>

<style scoped>

</style>
