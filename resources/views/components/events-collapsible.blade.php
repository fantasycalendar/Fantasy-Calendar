@props(['calendar' => null])

<button type="button" class="btn btn-secondary col-12 mb-2" x-data @click="$dispatch('open-events-manager')">Manage
	Events
</button>

<div class="row no-gutters">
	<div class="separator mt-2"></div>
</div>

<div class='add_inputs events row no-gutters input-group mt-2'>
	<div class="col input-group-prepend">
		<input type='text' class='form-control name' id='event_name_input' placeholder='New event name'>
	</div>
	<div class="col-auto input-group-append">
		<button type='button' class='btn btn-primary add' x-data
						@click="$dispatch('event-editor-modal-new-event', { epoch: this.dynamic_data.epoch })"><i
				class="fa fa-plus"></i></button>
	</div>
</div>

<div class="sortable list-group border-t border-gray-600" x-ref="events-sortable">
    <template x-for="(event, index) in events" :key="index" x-ref="events-sortable-template">
        <div class='sortable-container border-t -mt-px list-group-item draggable-source' :data-id="index">
            <div class='main-container'>
                <i class='handle fa fa-bars'></i>
                <div class="input-group row no-gutters">
                    <div class="input-group-prepend col">
                        <button type="button"
                                        class='btn btn-outline-accent open-edit-event-ui event_name'
                                        x-text="event.name"
                                        @click="$dispatch('event-editor-modal-edit-event', { event_id: index, epoch: get_current_epoch() })">
                        </button>
                    </div>
                    <div class="input-group-append col-auto">
                        <div class='btn btn-danger fa fa-trash'
                                 @click="$dispatch('event-editor-modal-delete-event', { event_id: index })"></div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
