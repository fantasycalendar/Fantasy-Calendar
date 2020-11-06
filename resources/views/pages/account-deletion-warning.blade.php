@extends('templates._page')

@section('content')
    <div class="container w-50">
        <div class="row py-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-text text-center">

                            <h4>Your account has been marked for deletion.</h4>

                            <p><strong>Username:</strong> {{ $user->username }}</p>
                            <p><strong>Requested at:</strong> {{ $requested_at }}</p>

                            <p>If you do nothing, your account will be deleted at {{ $delete_at }}.</p>
                            
                            <a class="btn btn-success" href="cancel-account-deletion">Stop account deletion</a>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
