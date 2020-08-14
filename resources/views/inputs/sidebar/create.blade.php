@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Create Calendar</div>
    </div>

    <div class='wrap-collapsible mb-1'>
        <div class='col-12'>
            <div class='row'>
                <input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
            </div>
        </div>
    </div>

    <div class='wrap-collapsible mb-1'>
        <div class='col-12'>
            <div class='row'>
                @if(Auth::check())
                    <button type='button' disabled id='btn_create' class='btn btn-lg btn-danger btn-block'>Cannot create yet</button>
                @else
                    <button type='button' disabled class='login-button btn btn-lg btn-info btn-block'>
                        <p class='m-0'>Log in to save calendar</p>
                        <small class='m-0'>Don't worry, your progress is stored</small>
                    </button>
                @endif
            </div>
        </div>
    </div>

    <div id='preset_container' class='wrap-collapsible mb-1'>

        <div class='row'>
            
            <div class='col pr-1'>

                <select class='form-control form-control-sm' id='presets'>
                    <option>Presets</option>
                    <option>Custom JSON</option>
                    <option>Random</option>
                </select>

            </div>

            <div class='col-auto pl-0'>
            
                <button id='json_apply' disabled type='button' class='btn btn-sm btn-warning full m-0' >Apply</button>

            </div>

        </div>

    </div>

    <div class='hidden wrap-collapsible mb-1' id='json_container'>
        <div class='row'>
            <div class='col'>
                <div>JSON input:</div>
                <textarea class='form-control' id='json_input'></textarea>
            </div>
        </div>
    </div>

@endsection