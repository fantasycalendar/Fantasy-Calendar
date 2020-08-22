@extends('inputs.full')

@push('head')
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.6.0/dist/alpine.min.js" defer></script>
@endpush

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

    <div id='preset_container' class='wrap-collapsible mb-1'>

        <div class='row'>
            
            <div class='col pr-1' x-data="{ presets: false }" 
            @mouseenter.once="
                fetch('/api/presets.html')
                    .then(response => response.text())
                    .then(html => { $refs.dropdown.innerHTML = html })
            ">

                <select class='form-control form-control-sm' id='preset_select' x-ref="dropdown">
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