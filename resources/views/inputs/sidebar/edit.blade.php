@extends('inputs.full')


@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Edit Calendar</div>
    </div>

    <div class='wrap-collapsible'>
        <div class='detail-row'>
            <input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
        </div>
    </div>

    <div class='wrap-collapsible margin-below'>
        <button type="button" disabled id='btn_save' class='btn btn-lg btn-primary btn-block'>No changes to save</button>

        <button type="button" id='btn_delete' class='btn btn-sm btn-danger btn-block'>Delete</button>
    </div>
@endsection