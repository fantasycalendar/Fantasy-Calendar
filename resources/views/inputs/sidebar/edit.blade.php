@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Edit Calendar</div>
    </div>

    <div class='wrap-collapsible content'>
        <div class='col-12 mb-1'>
            <div class='row'>
                <input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
            </div>
        </div>
    </div>

    <div class='wrap-collapsible content'>
        <div class='col-12 mb-1'>
            <div class='row'>
                <button type="button" disabled id='btn_save' class='btn btn-lg btn-success btn-block'>No changes to save</button>
            </div>
        </div>
    </div>

    <div class='wrap-collapsible content'>

        <div class='row'>
            <div class='col-4 mb-1 pr-0'>
                <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}" class='full'>
                    <button type="button" class='btn btn-sm btn-info btn-block'>View Mode</button>
                </a>
            </div>
            <div class='col-4 px-2 mb-1'>
                <a href="export" target="_blank" class='full'>
                    <button type="button" class='btn btn-sm btn-primary btn-block'>Export</button>
                </a>
            </div>
            <div class='col-4 mb-1 pl-0'>
                <button type="button" id='btn_delete' class='btn btn-sm btn-danger btn-block'>Delete</button>
            </div>
        </div>
    </div>

@endsection