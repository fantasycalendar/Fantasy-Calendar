<template>
    <div class="w-full max-w-full flex-1 overflow-y-auto flex p-6 content-start justify-center flex-wrap">
        <div v-for="timespan in timespans">
            <div class="m-2 border dark:border-gray-700 rounded divide-y dark:divide-gray-700">
                <div class="text-center">
                    {{ timespan.name }}
                </div>
                <div class="grid divide-x dark:divide-gray-700" :style="'grid-template-columns: repeat(' + timespan.rows[0].length + ', 1fr);'">
                    <div v-for="name in timespan.short_weekdays" class="grid place-items-center text-sm">
                        {{ name }}
                        <div class="w-8"></div>
                    </div>
                </div>
                <div v-for="week in timespan.rows" class="w-full grid divide-x dark:divide-gray-700" :style="'grid-template-columns: repeat(' + week.length + ', 1fr);'">
                    <div v-for="day in week" class="relative flex flex-col pb-1" :class="{ 'bg-gray-800': day.type === 'day', 'bg-gray-800 bg-opacity-40': day.type === 'overflow', 'bg-orange-300 bg-opacity-30' : day.epoch == currentEpoch }">
                        <div class="text-xs pl-0.5">
                            {{ day.number }}
                        </div>

                        <div class="flex flex-wrap w-full px-0.5 space-x-0.5">
                            <div v-for="event in day.events" class="w-2 h-2 rounded-full cursor-pointer event background" :class="[event.class]">

                            </div>

                            <div class="h-2"></div>
                        </div>
                    </div>
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
