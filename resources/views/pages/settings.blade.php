@extends('templates._page')

@push('head')
    <script>
        function toggleSetting(name) {
            document.getElementById(name).value=1-document.getElementById(name).value;
            if(document.getElementById(name+'_input').getAttribute('checked') === 'checked') {
                document.getElementById(name+'_input').removeAttribute('checked');
            } else {
                document.getElementById(name+'_input').setAttribute('checked', 'checked');
            }
        }
    </script>
@endpush

@section('content')
    <div class="container py-4">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <h2 class="card-header">User settings</h2>
                    <div class="card-body">
                        <div class="card-text p-4">
                            <form id="settings" method="post">
                                @csrf

                                <div class="form-check pb-2" onclick="toggleSetting('dark_theme')">
                                    <input id="dark_theme" type="hidden" name="dark_theme" @if($settings['dark_theme']) value="1" @else value="0" @endif>
                                    <input id="dark_theme_input" type="checkbox" class="form-check-input" id="dark_theme" @if($settings['dark_theme']) checked="checked" @endif>
                                    <label class="form-check-label" for="dark_theme">Enable dark theme</label>
                                </div>

                                <button class="btn btn-primary">Save Settings</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
