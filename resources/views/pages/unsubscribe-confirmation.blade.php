@extends('templates._page')

@section('content')
    <div class="container w-50">
        <div class="row">
            <div class="col-12">
                <h3 class="text-center py-5">Unsubscribe from Fantasy Computerworks emails</h3>
            </div>
        </div>
        <div class="row">
            <div class="d-none d-md-block col-md-2"></div>
            <div class="col-12 col-md-8">
                @if(Auth::user()->hasOptedInForMarketing())
                    <div class="card">
                        <div class="card-header">
                            <h4 class="text-center pt-2">Are you sure?</h4>
                        </div>

                        <div class="card-body">
                            <p>We understand, no hard feelings at all. However, if you could <a href="mailto:contact@fantasy-calendar.com">send us a note</a> letting us know why, we'd really appreciate it. <br><br>Fantasy Calendar is a passion project that we do for fun, so we'd love to hear from you. We make it a point to only announce new things that we think will excite you, and we definitely don't want to annoy you.</p>

                            <hr>

                            <div class="d-flex justify-content-end">
                                <a href="{{ route('calendars.index') }}" class="btn btn-secondary px-2">No, I clicked the link by accident.</a>
                                <form class="form-inline px-2" action="{{ route('marketing.unsubscribe') }}" method="post">
                                    @csrf
                                    <button class="btn btn-danger">Yes, stop sending me emails.</button>
                                </form>
                            </div>
                        </div>

                        <div class="card-footer py-3 text-right text-muted">
                            You can always change your mind on your <a href="{{ route('profile') }}">profile page</a>
                        </div>
                    </div>
                @else
                    <div class="card">
                        <div class="card-header">
                            <h4 class="text-center pt-2">You're unsubscribed!</h4>
                        </div>

                        <div class="card-body">
                            <p>It looks like you're already unsubscribed.<br><br>Did you want to re-subscribe?</p>

                            <hr>

                            <div class="d-flex justify-content-end">
                                <a href="{{ route('calendars.index') }}" class="btn btn-secondary px-2">No, I clicked the link by accident.</a>
                                <form class="form-inline px-2" action="{{ route('marketing.resubscribe') }}" method="post">
                                    @csrf
                                    <button class="btn btn-primary">Yes, please resubscribe me!</button>
                                </form>
                            </div>
                        </div>

                        <div class="card-footer py-3 text-right text-muted">
                            You can always change your mind on your <a href="{{ route('profile') }}">profile page</a>
                        </div>
                    </div>
                @endif
            </div>
            <div class="d-none d-md-block col-md-2"></div>
        </div>
    </div>
@endsection
