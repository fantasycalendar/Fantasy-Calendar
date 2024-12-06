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
						@click="$dispatch('event-editor-modal-new-event', { epoch: dynamic_data.epoch })"><i
				class="fa fa-plus"></i></button>
	</div>
</div>

<div x-data='{

                    events: [],
                    draggable: null,

                    init(){
                        this.draggable = Sortable.create(this.$refs["events-sortable"], {
                            animation: 150,
                            handle: ".handle",
                            onEnd: (event) => {
                                this.dropped(event.oldIndex, event.newIndex);
                            }
                        });
                    },

                    refresh_events() {
                        this.events = [...window.events];
                    },

                    get_current_epoch() {
                        let epoch = window.dynamic_data.epoch;
                        if (typeof window.preview_date !== "undefined" && window.preview_date.follow) {
                            epoch = window.dynamic_date_manager.epoch;
                        } else if (typeof window.preview_date_manager !== "undefined") {
                            epoch = window.preview_date_manager.epoch;
                        }
                        return epoch;
                    },

                    dropped(start, end){

											if(start === end) return;

											let order = this.draggable.toArray();
											order.shift()
											const elem = this.events.splice(start, 1)[0];
											this.events.splice(end, 0, elem);
											this.$refs["events-sortable-template"]._x_prevKeys = order;

											for(let i = 0; i < this.events.length; i++){
													const event = this.events[i];
													if(event.data.connected_events.length > 0){
															for(let connected_id = 0; connected_id < event.data.connected_events.length; connected_id++){
																	const old_index = event.data.connected_events[connected_id];
																	if(old_index === null) continue;
																	event.data.connected_events[connected_id] = this.events.findIndex(event => event.sort_by === old_index);
															}
													}
											}

											for(let i = 0; i < this.events.length; i++){
													const event = this.events[i];
													event.sort_by = i;
											}

	                    window.events = _.cloneDeep(this.events);

	                    rerender_calendar();

	                    evaluate_save_button();

                    }

                }'
		 @events-changed.window="refresh_events"
>
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
</div>
