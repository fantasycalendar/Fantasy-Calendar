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
                    <button type="button" disabled id='btn_create' class='btn btn-lg btn-danger btn-block'>Cannot create yet</button>
                @else
                    <button type='button' class='login-show-button btn btn-lg btn-info btn-block'>Log in to save</button>
                @endif
            </div>
        </div>
    </div>

    <div class='wrap-collapsible mb-1'>
        <div class='row'>
            <div class='col'>
                <button id='open_presets' type='button' class='btn btn-primary full m-0' @click="load">Choose a calendar preset</button>
            </div>
        </div>
    </div>

@endsection