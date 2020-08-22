@extends('inputs.full')

@section('label')
    <div class='wrap-collapsible'>
        <div class='title-text center-text'>Edit Calendar</div>
    </div>

    <div class='wrap-collapsible content'>
        <div class='col-12 mb-2'>
            <div class='row'>
                <input type='text' class='form-control form-control-lg full' id='calendar_name' placeholder='Calendar name' />
            </div>
        </div>
    </div>

    <div class='wrap-collapsible content'>
        <div class='col-12 my-2'>
            <div class='row'>
                <button type="button" disabled id='btn_save' class='btn btn-lg btn-success btn-block'>No changes to save</button>
            </div>
        </div>
    </div>

    <div class='wrap-collapsible'>
        <div class='d-flex my-2 w-100'>
            <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}" class="btn w-100 btn-sm btn-info">
                View
            </a>
            <a href="export" target="_blank" class="btn w-100 btn-sm btn-primary mx-2">
                Export
            </a>
            <button type="button" id='btn_delete' class='btn w-100 btn-sm btn-danger btn-block'>Delete</button>
        </div>
    </div>

    @if(Auth::user()->isAdmin())

        <script>
            function elevate_to_preset(){
                swal.fire({
                    text: "Are you absolutely sure you want to elevate this calendar to a preset?",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Make it so',
                    dangerMode: true
                }).then(result => {
                    if(result.dismiss || !result.value) return;
                    // TO-DO Axel - Implement Axios and Laravel side of things
                    console.log(hash)
                });
            }

            $(document).ready(function(){
                $('#btn_elevate').click(elevate_to_preset);
            });
        </script>

        <div class='wrap-collapsible content'>
            <div class='col-12 mb-2'>
                <div class='row'>
                    <button type="button" id='btn_elevate' class='btn btn-lg btn-success btn-block'>Elevate to preset</button>
                </div>
            </div>
        </div>

    @endif

@endsection
