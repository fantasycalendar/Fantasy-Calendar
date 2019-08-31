@extends('templates._page')

@push('head')

    <script>

    $(document).ready(function(){

        $("#btn_save").click(function(){
            var file = new Blob([JSON.stringify(JSON.parse($('#export_container').text()))], {type: "json"});
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
        });

        $('#btn_copy').click(function(){
            var copyText = document.querySelector("#export_container");
            copyText.select();
            document.execCommand("copy");
            $.notify(
                "Copied to clipboard!",
                "success"
            );
        });

    })

    </script>

@endpush

@section('content')
    <div id="generator_container">

        <div class='detail-column full margin-above'>

            <div class='detail-row'>

                <div class='detail-column half'>
                    
                    <div class='detail-row'>
                        <button type='button' class='btn btn-bg btn-primary btn-block' id='btn_save'>Save to file</button>
                    </div>

                </div>

                <div class='detail-column half'>
                    
                    <div class='detail-row'>

                        <button type='button' class='btn btn-bg btn-success btn-block' id='btn_copy'>Copy to clipboard</button>
                   
                    </div>
                    
                </div>

            </div>

            <div class='detail-row'>

                <textarea readonly id="export_container">{"name":"{{ $calendar->name }}","static_data":@json($calendar->static_data),"dynamic_data":@json($calendar->dynamic_data)}</textarea>

            </div>

        </div>

    </div>
@endsection