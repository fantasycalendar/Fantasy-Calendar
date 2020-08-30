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

    <div class='wrap-collapsible mb-1'>
        <div class='col-12'>
            <div class='row'>
                <button id='open_presets' type='button' class='btn btn-primary full m-0' @click="load">Choose a calendar preset</button>
            </div>
        </div>
    </div>

@endsection
