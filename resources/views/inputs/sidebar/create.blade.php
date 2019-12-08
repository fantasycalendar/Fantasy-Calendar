@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Create Calendar</div>
    </div>


    <div class='wrap-collapsible'>
        <div class='detail-row form-inline'>
            <input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
        </div>
    </div>


    <div class='wrap-collapsible margin-below'>

    @if(Auth::check())
        <button type="button" disabled id='btn_create' class='btn btn-lg btn-danger btn-block'>Cannot create yet</button>
    @else
        <button type='button' class='login-show-button btn btn-lg btn-info btn-block'>Log in to save</button>
    @endif

    <div id='preset_container'>

        <select class='form-control' id='presets'>
            <option>Presets</option>
            <option>Custom JSON</option>
        </select>
        
        <button id='json_apply' disabled type='button' class='btn btn-warning btn-sm' >Apply</button>

    </div>

    <div class='hidden' id='json_container'>
        <div>JSON input:</div>
        <textarea class='form-control' id='json_input'></textarea>
    </div>
</div>
@endsection