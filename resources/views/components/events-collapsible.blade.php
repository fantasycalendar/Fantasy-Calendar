@props(['calendar' => null])

<button type="button" class="btn btn-secondary w-full" x-data @click="$dispatch('open-events-manager')">
    Manage Events
</button>

<div class="separator mt-2"></div>

<div class='w-full input-group mt-2'>
    <input type='text' class='form-control name' x-model='new_event_name' placeholder='New event name'>

    <div class="input-group-append">
        <button type='button'
            class='btn btn-primary add'
            @click="$dispatch('event-editor-modal-new-event', { name: new_event_name, epoch: this.dynamic_data.epoch })"
        ><i class="fa fa-plus"></i></button>
    </div>
</div>

<div class="sortable list-group border-gray-600 mt-2" x-ref="events-sortable">
    <template x-for="(event, index) in events" :key="index" x-ref="events-sortable-template">
        <x-sortable-item delete-function="$dispatch('event-editor-modal-delete-event', { event_id: index })">
            <x-slot:inputs>
                <button type="button"
                    class='btn btn-outline-accent open-edit-event-ui event_name'
                    x-text="event.name"
                    @click="$dispatch('event-editor-modal-edit-event', { event_id: index, epoch: get_current_epoch() })">
                </button>
            </x-slot:inputs>
        </x-sortable-item>
    </template>
</div>
