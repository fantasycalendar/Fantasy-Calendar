@extends('templates._page')

@section('content')
    <div id="generator_container">

        <div class='detail-column full margin-above'>

            <div class='detail-row'>

                <button type='button' class='btn btn-bg btn-primary btn-block' id='btn_export'>Export</button>

            </div>

            <div class='detail-row'>

                <div id="export_container">

                    {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;"static_data": @json($calendar->static_data, JSON_PRETTY_PRINT),<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;"dynamic_data": @json($calendar->dynamic_data, JSON_PRETTY_PRINT)<br>
                    }

                </div>

            </div>

        </div>

    </div>
@endsection