@extends('templates._page')

@push('head')
    <style>
        h1 {
            font-size: 2rem;
        }
        h2 {
            font-size: 1.7rem;
        }
        h3 {
            font-size: 1.4rem;
        }
        h4 {
            font-size: 1.1rem;
        }
        .discord-avatar {
            max-height: 3rem;
            border-radius: 50%;
        }
    </style>
@endpush

@section('content')
    <div class="container py-5">
        <h1>Fantasy Calendar Discord Integration</h1>
        <div class="alert alert-success bg-accent my-4 p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <h4 class="mb-0">
                <img class="discord-avatar mr-2" src="{{ $discord_user->avatar }}" alt="{{ $discord_user->discord_username }}'s Discord avatar">
                {{ $discord_user->discord_username }}
            </h4>
            <hr class="d-md-none w-100 my-3" style="border-top-color: #246645;">
            <a href="#" class="btn btn-outline-danger alert-link">Disconnect</a>
        </div>

        <div class="alert alert-secondary">The following commands are available in any Discord server Fantasy Calendar has been integrated with.</div>

        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Command</th>
                    <th scope="col">Description</th>
                </tr>
                </thead>
                <tbody>
                @foreach(config('services.discord.global_commands') as $command)
                    @if(isset($command['options']) && $command['options'][0]['type'] == 1)
                        @foreach($command['options'] as $option)
                            <tr>
                                <td>/{{ $command['name'] }} {{ $option['name'] }}</td>
                                <td>{{ $option['description'] }}</td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td>/{{ $command['name'] }}</td>
                            <td>{{ $command['description'] }}</td>
                        </tr>
                    @endif
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
