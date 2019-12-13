@extends('templates._page')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <h1 class="card-header">User settings</h1>
                    <div class="card-body">
                        <div class="card-text p-4">
                            <form action="/settings" method="post">
                                @csrf

                                <div class="form-check pb-2">
                                    <input type="checkbox" name="dark_theme" class="form-check-input" id="dark_theme">
                                    <label class="form-check-label" for="dark_theme">Enable dark theme</label>
                                </div>

                                <button type="submit" class="btn btn-primary">Save Settings</button>
                            </form>
                            @foreach($settings as $setting => $value)
                                <p>{{ $setting }}: {{ $value }}</p>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
