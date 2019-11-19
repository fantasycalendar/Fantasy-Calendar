@extends('templates._page')

@push('head')
    <script>
        var afterPost = function() {
            self.location = '/subscription';
        }
    </script>
@endpush

@section('content')
    <div class="container">
        <h1>Cancel</h1>

        @foreach($subscriptions as $subscription)
            <a href="javascript:" class="btn btn-primary cancelsubbutton" onclick="axios.post('{{ route('subscription.cancel', ['level' => $subscription->name]) }}').then(afterPost);">Cancel my {{ $subscription->name }} subscription</a>
        @endforeach
    </div>
@endsection
