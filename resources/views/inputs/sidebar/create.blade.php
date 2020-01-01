@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Create Calendar</div>
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
                @if(Auth::check())
                    <button type="button" disabled id='btn_create' class='btn btn-lg btn-danger btn-block'>Cannot create yet</button>
                @else
                    <button type='button' class='login-show-button btn btn-lg btn-info btn-block'>Log in to save</button>
                @endif
            </div>
        </div>
    </div>

    <div id='preset_container' class='d-flex px-3 mb-1'>

        <div class='flex-column flex-grow-1'>

            <select class='form-control form-control-sm' id='presets'>
                <option>Presets</option>
                <option>Custom JSON</option>
                <option>Random</option>
            </select>

        </div>

        <div class='flex-column pl-1'>
        
            <button id='json_apply' disabled type='button' class='btn btn-sm btn-warning full m-0' >Apply</button>

        </div>

    </div>

    <div class='hidden' id='json_container'>
        <div>JSON input:</div>
        <textarea class='form-control' id='json_input'></textarea>
    </div>

@endsection