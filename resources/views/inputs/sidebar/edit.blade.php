@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible content mt-3'>
        <div class='row no-gutters'>
            <div class='col-12 mb-2'>
                <div class="input-group" x-data>
                    <input
                        x-data="{
                            name: '{{ $calendar->name }}',
                            change() {
                                this.$dispatch('calendar-updating', {
                                    calendar: {
                                        calendar_name: this.name
                                    }
                                });
                            }
                        }"
                        x-model="name"
                        @change="change"
                        type='text' class='form-control form-control-lg'
                        placeholder='Calendar name'
                    />
                    <x-view-options></x-view-options>
                </div>
            </div>
        </div>
    </div>

    <div class='wrap-collapsible mt-2'>
        <x-save-button></x-save-button>
    </div>
@endsection
