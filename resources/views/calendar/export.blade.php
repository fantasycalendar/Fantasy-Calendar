@extends('templates._page')

@push('head')

    <script>

    $(document).ready(function(){

        $("#btn_export").click(function(){
            var file = new Blob([JSON.stringify(JSON.parse($('#export_container').text()),null,4)], {type: "json"});
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, "calendar.json");
            else { // Others
                var a = document.createElement("a"),
                url = URL.createObjectURL(file);
                a.href = url;
                a.download = "calendar.json";
                document.body.appendChild(a);
                a.click();
            }
        })

    })

    </script>

@endpush

@section('content')
    <div id="generator_container">

        <div class='detail-column full margin-above'>

            <div class='detail-row'>

                <button type='button' class='btn btn-bg btn-primary btn-block' id='btn_export'>Export</button>

            </div>

            <div class='detail-row'>

                <textarea readonly id="export_container">{"name":"{{ $calendar->name }}","static_data":@json($calendar->static_data),"dynamic_data":@json($calendar->dynamic_data)}</textarea>

            </div>

        </div>

    </div>
@endsection