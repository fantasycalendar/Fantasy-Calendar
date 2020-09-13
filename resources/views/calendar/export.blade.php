@extends('templates._page')

@push('page-class', 'page-export')

@push('head')
    <script>

    $(document).ready(function(){
        function copy_export(){
            var copyText = document.querySelector(".export-body");
            copyText.select();
            document.execCommand("copy");

            $.notify(
                "Copied to clipboard!",
                {
                    className: "success",
                    globalPosition: "right bottom"
                }
            );
        }

        $("#btn_export_save").click(function(){
            var file = new Blob([JSON.stringify(JSON.parse($('.export-body').text()))], {type: "json"});
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

        $('#btn_export_copy').click(copy_export);
        $('.export-body').click(copy_export);

    })

    </script>
@endpush

@section('content')
    <div class="container">
        <div class='row py-4'>
            <div class='col-sm-6'>
                <button type='button' class='btn btn-bg btn-primary btn-block' id='btn_export_save'>Save to file</button>
            </div>
            <div class='col-sm-6'>
                <button type='button' class='btn btn-bg btn-success btn-block' id='btn_export_copy'>Copy to clipboard</button>
            </div>
        </div>

        <div class='row'>
            <div class="col-sm-12">
                <textarea readonly class="form-control export-body">@json($exportdata)</textarea>
            </div>
        </div>
    </div>
@endsection
