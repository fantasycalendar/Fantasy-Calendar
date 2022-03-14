@push('head')
    <script lang="js">

        function eventsSection($data){

            return {

                events: $data.events,
                newEventName: "",
                searchString: "",
                deleting: null,

                get epoch(){
                    if(!$data.preview_date.follow) return $data.preview_date.epoch;
                    return $data.dynamic_data.epoch;
                },

                get shownEvents(){
                    return this.searchString === "" ? this.events : this.events.filter(event => event.name.toLowerCase().includes(this.searchString.toLowerCase()));
                },

                remove(index){
                    this.events.splice(index, 1);
                }

            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-events"
    name="events"
    title="Events"
    icon="fas fa-calendar-check"
    tooltip-title="More Info: Events"
    helplink="events"
>
    <div
        x-data="eventsSection($data)"
        @dragover.prevent="$event.dataTransfer.dropEffect = 'move';"
    >

        <div class='row no-gutters bold-text'>
            <div class='col'>
                New event:
            </div>
        </div>

        <div class='row no-gutters input-group'>
            <input type='text' class='form-control' placeholder='Event name' x-model="newEventName">
            <div class="input-group-append">
                <button type='button' class='btn btn-primary' @click="$dispatch('event-editor-modal-new-event', { name: newEventName, epoch: epoch })"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class='row no-gutters my-2'>
            <div class='separator'></div>
        </div>

        <div class='row no-gutters mb-2'>
            <div class="col">
                <input type='text' class='form-control name' placeholder='Search' x-model="searchString">
            </div>
        </div>

        <div
            x-data="sortableList($data.events)"
            @drop.prevent="dropped"
        >

            <div class="row sortable-header timespan_sortable_header no-gutters align-items-center">
                <div x-show="!reordering" @click="reordering = true; deleting = null;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
                <div x-show="reordering" @click="reordering = false;" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
                <div class='py-2 col-6 text-center'>Your events</div>
            </div>

            <div class="sortable list-group -mr-2" style="max-height: 500px; overflow-y: scroll;">
                <template x-for="(event, index) in events">

                    <div class='sortable-container list-group-item' x-show="shownEvents.indexOf(event) > -1">

                        <div class="bg-primary-500 w-full" x-show="reordering && dragging !== null && dropping === index && dragging > index">
                            <div class="border-2 rounded border-primary-800 border-dashed m-1 grid place-items-center p-3">
                                <span class="text-primary-800 font-medium" x-text="events[dragging]?.name"></span>
                            </div>
                        </div>

                        <div class='main-container'
                             x-show="deleting !== event"
                             @dragenter.prevent="dropping = index"
                             @dragstart="dragging = index"
                             @dragend="dragging = null; $nextTick(() => {dropping = null})"
                             :draggable="reordering"
                        >
                            <i class='handle icon-reorder'></i>
                            <div class="input-group">
                                <div class="input-group-prepend flex-1">
                                    <button type="button" class='btn btn-outline-accent open-edit-event-ui event_name' :disabled="reordering" x-text="event.name" @click="$dispatch('event-editor-modal-edit-event', { event_id: index, epoch: epoch })"></button>
                                </div>
                                <div class="input-group-append">
                                    <div class='btn btn-danger icon-trash' :disabled="reordering" @click="deleting = event" x-show="deleting !== event"></div>
                                </div>
                            </div>
                        </div>

                        <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                            <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === event"></div>
                            <div class='remove-container-text' x-show="deleting === event">Are you sure?</div>
                            <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === event"></div>
                        </div>

                        <div class="bg-primary-500 w-full" x-show="reordering && dragging !== null && dropping === index && dragging < index">
                            <div class="border-2 rounded border-primary-800 border-dashed m-1 grid place-items-center p-3">
                                <span class="text-primary-800 font-medium" x-text="events[dragging]?.name"></span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

    </div>

</x-sidebar.collapsible>
