<script setup>
import CalendarMonth from "@/Components/CalendarMonth.vue";
import CalendarYear from "@/Components/CalendarYear.vue";
import CalendarWeek from "@/Components/CalendarWeek.vue";
import {computed} from "vue";

const props = defineProps({
    timespans: Object,
    layout: String,
    currentEpoch: Number,
    previewEpoch: Number,
    visibleTimespan: Number,
    visibleWeek: Number,
})

const displayedTimespans = computed(() => {
    if(props.layout === 'week') {
        return props.timespans[props.visibleTimespan];
    }

    if(props.layout === 'month') {
        return props.timespans[props.visibleTimespan];
    }

    if(props.layout === 'year') {
        return props.timespans;
    }
})

const viewportLayouts = {
    'year': CalendarYear,
    'month': CalendarMonth,
    'week': CalendarWeek,
}

console.log(props);
</script>

<template>
    <component
        :is="viewportLayouts[layout]"
        :timespans="displayedTimespans"
        :current-epoch="currentEpoch"
        :preview-epoch="previewEpoch"
        :visible-week="visibleWeek"
    ></component>
</template>
