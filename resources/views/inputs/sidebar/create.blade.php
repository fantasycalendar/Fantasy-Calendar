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
                            load() {
                                this.name = this.$store.calendar.calendar_name;
                            }
                        }"
                        x-model="name"
                        @change="change"
                        @calendar-loaded.window="load"
                        @calendar-updated.window="load"
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

    <div class='wrap-collapsible mt-2'>
        <button type='button' class='btn btn-primary btn-block' @click="$dispatch('open-presets')">Choose a calendar preset</button>
    </div>
@endsection
