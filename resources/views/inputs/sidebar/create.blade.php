@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible content mt-3'>
        <div class='row no-gutters'>
            <div class='col-12 mb-2'>
                <div class="input-group" x-data>
                    <input
                        x-data="{
                            name: '',
                            change() {
                                this.$dispatch('calendar-updating', {
                                    calendar: {
                                        calendar_name: this.name
                                    }
                                });
                            },
                            calendar_loaded($event) {
                                this.name = $event.detail.calendar_name;
                            }
                        }"
                        x-model="name"
                        @change="change"
                        @calendar-loaded.window="calendar_loaded"
                        type='text' class='form-control form-control-lg'
                        placeholder='Calendar name'
                    />
                    <x-view-options create></x-view-options>
                </div>
            </div>
        </div>
    </div>

    <div class='wrap-collapsible mt-2'>
        <x-create-button></x-create-button>
    </div>
@endsection
