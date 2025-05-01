@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible content mt-3'>
        <div class='row no-gutters'>
            <div class='col-12 mb-2'>
                <div class="input-group">
                    <input type='text' class='form-control form-control-lg' id='calendar_name' placeholder='Calendar name' />
                    <div class="dropdown input-group-append" x-data="{ open: false }">
                        <button class="btn btn-secondary dropdown-toggle" id="calendarMenuToggle" @click="open = !open">
                            <i class="fa fa-cog"></i>
                        </button>
                        <div x-show="open" :class="{ 'show': open }" class="dropdown-menu !left-auto right-0" aria-labelleddby="calendarMenuToggle" @click.away="open = false" x-cloak>
                            <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}" class="dropdown-item">
                                View
                            </a>
                            <a href="#" onclick="print()" class="dropdown-item">
                                Print
                            </a>
                            <a href="#" id='btn_delete' class="dropdown-item">
                                Delete
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class='wrap-collapsible content'>
        <div class='col-12 my-2'>
            <div class='row'>
                <button type="button" disabled id='btn_save' class='btn btn-lg btn-success btn-block'>No changes to save</button>
            </div>
        </div>
    </div>
@endsection
