@extends('templates._page')

@push('head')
    <style>
        html {
            scroll-behavior: smooth;
        }

        nav.navbar {
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
        }

        .next-link {
            transition: 0.3s ease all;
        }

        .next-link:hover {
            padding-bottom: 8px !important;
        }

        a:hover {
            color: #246645;
        }

        div.section {
            height: 100vh;
        }

        div.green-border {
            border-bottom: 10px solid green;
        }

        div.comparison_image {
            background-size: contain, cover;
            background-repeat: no-repeat, no-repeat;
            background-position: center center, center center;
            background-attachment: fixed, fixed;
            display: grid;
            place-items: center;
            position: relative;
        }
        .welcome {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .overlay {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0) 300px) repeat-x bottom center;
            height: 100%;
            width: 100%;
            z-index: 20;
        }
        img {
            max-width: 100%;
        }

        h3 i {
            font-size: 72%;
        }
    </style>
@endpush

@section('content')
    <div>
        <div class="section green-border welcome" style="background-color: #edf2f7; background-image: url({{ asset('resources/whats-new-angle-blur-transparent.png') }}); background-size: cover; background-position: center center;">
            <h1>Fantasy Calendar is getting an update!</h1>
            <h2>Here is what you can expect in Fantasy Calendar 2.0.</h2>
            <h3 class="next-link" style="font-size: 40px; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section2"><i class="fa fa-chevron-circle-down"></i> Scroll down to see more <i class="fa fa-chevron-circle-down"></i></a></h3>
        </div>

        <div class="section green-border comparison_image" id="section2" style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url({{ asset('resources/whats-new-1-0.png') }});">
            <h1 style="position: absolute; top: 8%; width: 100%; text-align: center; color: #2d3748;">Here's what you're used to.</h1>
            <h2 style="position: absolute; top: 16%; width: 100%; text-align: center; color: #2d3748;">It works great! But I think we can all agree it could use some polish.</h2>
            <img src="{{ asset('/resources/whats-new-1-0.png') }}" style="max-width: 72%; max-height: 50%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); position: absolute;">
            <h3 class="next-link" style="font-size: 40px; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section3"><i class="fa fa-chevron-circle-down"></i> Take a peek at the new look <i class="fa fa-chevron-circle-down"></i></a></h3>
            <div class="overlay"></div>
        </div>

        <div class="section green-border comparison_image" id="section3" style="height: 100vh; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url({{ asset('resources/whats-new-2-0.png') }})">
            <h1 style="position: absolute; top: 8%; width: 100%; text-align: center; color: #2d3748;">This is Fantasy Calendar 2.0.</h1>
            <h2 style="position: absolute; top: 16%; width: 100%; text-align: center; color: #2d3748;">Lovingly crafted to look good on any screen. Even mobile devices.</h2>
            <h3 class="next-link" style="font-size: 40px; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section4"><i class="fa fa-chevron-circle-down"></i> Looks great! Show me more <i class="fa fa-chevron-circle-down"></i></a></h3>
            <img src="{{ asset('/resources/whats-new-2-0.png') }}" style="max-width: 72%; max-height: 50%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); position: absolute;">
            <div class="overlay"></div>
        </div>

        <div class="section comparison_both welcome" id="section4" style="background-color: #edf2f7;">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-4 mt-5">
                        <h1>A modern look</h1>
                        <h3>Fantasy Calendar 2.0 looks great!</h3>
                    </div>

                    <div class="col-12 col-md-8 text-right">
                        <img src="{{ asset('resources/whats-new-2-0.png') }}" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>Of course, looks aren't everything!</h1>
                    <h2>We also have the features to back it up</h2>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-12 col-md-4 text-center">
                    <h4>Some text</h4>
                    <ul>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                    </ul>
                </div>
                <div class="col-12 col-md-4 text-center">
                    <h4>Some text</h4>
                    <ul>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                    </ul>
                </div>
                <div class="col-12 col-md-4 text-center">
                    <h4>Some text</h4>
                    <ul>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                        <li>Some text</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
@endsection
