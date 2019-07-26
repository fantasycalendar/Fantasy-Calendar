@extends('templates._page')

@push('head')
    <style type="text/css">
        .changelog__content h1 {
            font-size: 1.75rem;
        }
        .changelog__content h2 {
            font-size: 1rem;
            font-style: italic;
        }
        .changelog__content ul li {
            list-style-type: circle;
        }
        #changelog {
            margin-top: 40px;
        }
    </style>
@endpush

@section('content')
    <div id="content">
        <div id="loading_background" class='basic-background hidden'>
            <img src='{{ asset("resources/icons/35.png") }}'>
            <div id='loading_text' class='italics-text'>Random text</div>
        </div>
        <div class='detail-row'>

    <div class='detail-column @isset($changelog) half @else full @endisset'>
        <div class='index_container'>
            @isset($calendars)
                <div id='user_calendar_list'>
                @foreach($calendars as $calendar)
                    <div class='user_calendar @if(!isset($changelog)) quarter @endif'>
                        <div class='name'>
                            <b>{!! $calendar->name !!}</b><br>by {{ $calendar->user->username }}
                        </div>

                        <div class='icon_container'>                        
                            <a class='image_link' href='calendar.php?action=edit&id={{ $calendar->hash }}'>
                                <img class='icon' src='{{ asset("resources/icons/edit_icon.png") }}' title="Edit"/>
                            </a>
                        </div>
                    </div>
                @endforeach
                </div>
            @endisset
        </div>

    </div>
    
    @isset($changelog)
        <div class='detail-column half'>
            <div id='changelog'>
                <h2>Changelog</h2>

                <div class="changelog__content">
                {!! $changelog !!}
                </div>
            </div>
        </div>
    @endisset

    </div>
</div>
@endsection