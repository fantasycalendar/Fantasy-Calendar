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
            z-index: 2;
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

        .fullheight {
            height: 100vh;
        }

        .green-border {
            border-bottom: 10px solid green;
        }

        .comparison_image {
            background-size: contain, cover;
            background-repeat: no-repeat, no-repeat;
            background-position: center center, center center;
            background-attachment: fixed, fixed;
            display: grid;
            place-items: center;
            align-content:center;
            position: relative;
        }

        .comparison_image img {
            max-width: 72%;
            max-height: 60vh;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .comparison_image h1, .comparison_image h2, .comparison_image img{
            z-index:2;
        }

        .welcome {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .overlay {
            position:absolute;
            bottom:0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0) 300px) repeat-x bottom center;
            height: 100%;
            width: 100%;
            z-index: 1;
        }
        section img {
            max-width: 100%;
            margin: 1.5rem 0;
        }

        h1, h2, h3, h4, p {
            color: white;
        }

        h3 i {
            font-size: 85%;
        }

        section h3 {
            margin-bottom: 1rem;
        }

        section h4 {
            font-size: 1.3rem;
        }

        .logo-wrapper {
            height: 6rem;
            width: 6rem;
            display: grid;
            place-items: center;
        }
        .connect-box {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .fa-discord, .discord-color {
            color: #7289DA;
        }
        .discord-bg {
            background-color: #7289DA;
        }

        @media screen and (max-width: 768px) {
            html {
                font-size: 16px;
            }

            .comparison_image img {
                max-width: 96%;
            }
        }

    </style>
@endpush

@section('content')
    <div>
        <div class="fullheight green-border welcome" style="background-color: #edf2f7; background-image: url({{ asset('resources/discord/integration-bg-1.png') }}); background-size: cover; background-position: center center; background-attachment: fixed;">
            <h1 style="width: 100%; text-align: center;">
                <img style="width: 35rem; max-width:100%;" src="resources/fc_logo_white_padding.png">
                <img style="height: 5rem;" src="resources/discord_fc_plus_white.svg">
                <img style="width: 35rem; max-width:100%;" src="resources/discord/discord_white_padding.png">
            </h1>
<!--            <h1 style="width: 100%; text-align: center;">Fantasy Calendar <i class="fa fa-heart"></i> Discord</h1>-->
            <h3 style="width: 100%; text-align: center;">After many months of work, integration with Discord is finally here!</h3>
            <h3 class="next-link" style="font-size: 2.3rem; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section2"><i class="fa fa-chevron-circle-down"></i> See more <i class="fa fa-chevron-circle-down"></i></a></h3>
            <div class="overlay"></div>
        </div>
gu
        <div class="fullheight green-border comparison_image" id="section2" style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), url({{ asset('resources/discord/integration-bg-2.png') }});">
            <div class="p-4" style="background-color: gray; border-radius:1rem;">
                <h1 style="width: 100%; text-align: center; color: #2d3748; margin-bottom:1rem;">How does it work?</h1>
                <h2 style="width: 100%; text-align: center; color: #2d3748; margin-bottom:1.4rem;">In short: You connect to Fantasy Calendar with your Discord account.</h2>
                <div class="col-12 flex align-items-center mb-3">
                    <div class="connect-box py-4 w-100 border rounded my-4">

                        <div class="logo-wrapper">
                            <img src="{{ asset('resources/logo-accent.png') }}" alt="" style="max-height: 5.2rem;">
                        </div>

                        <div class="logo-wrapper">
                            <i class="fa fa-arrows-alt-h" style="font-size: 3rem;"></i>
                        </div>

                        <div class="logo-wrapper">
                            <i class="fab fa-discord" style="font-size: 5.6rem; margin-bottom: -.7rem;"></i>
                        </div>
                    </div>
                </div>
                <p class="small text-center" style="opacity: 0.7">Don't worry, though! We can't send messages on your behalf or anything like that.</p>
                <h3 class="next-link" style="font-size: 2.3rem; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section3"><i class="fa fa-chevron-circle-down"></i> Take a peek at the new look <i class="fa fa-chevron-circle-down"></i></a></h3>
                <div class="overlay"></div>
            </div>
        </div>

        <div class="fullheight green-border comparison_image" id="section3" style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url({{ asset('resources/whats-new-2-0.png') }})">
            <h1 style="width: 100%; text-align: center; color: #2d3748; margin-bottom: 1rem;">Enter: Fantasy&nbsp;Calendar&nbsp;2.0.</h1>
            <h2 style="width: 100%; text-align: center; color: #2d3748; margin-bottom: 1.4rem;">Lovingly crafted to be enjoyable.</h2>
            <img src="{{ asset('/resources/whats-new-2-0.png') }}">
            <h3 class="next-link" style="font-size: 2.3rem; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section4"><i class="fa fa-chevron-circle-down"></i> Looks great! Show me more <i class="fa fa-chevron-circle-down"></i></a></h3>
            <div class="overlay"></div>
        </div>

        <section class="comparison_both welcome" id="section4" style="background-color: #edf2f7;">
            <div class="container mt-5 pt-5">
                <div class="row">
                    <div class="col-12 col-md-5 text-center text-md-left d-flex flex-column align-items-start justify-content-center">
                        <h1>A fresh, modern look</h1>
                    </div>

                    <div class="col-12 col-md-7 text-center text-md-right">
                        <img src="{{ asset('resources/whats-new-2-0.png') }}" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
                    </div>
                </div>
            </div>
        </section>

        <section class="comparison_both welcome" id="section4" style="background-color: #edf2f7;">
            <div class="container mb-5 pb-5">
                <div class="row">

                    <div class="col-12 col-md-7 text-center text-md-left">
                        <img src="{{ asset('resources/whats-new-event-colors.png') }}" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
                    </div>

                    <div class="col-12 col-md-5 text-center text-md-right d-flex flex-column align-items-end justify-content-center">
                        <h4>Make your events colorful, to help you and your players distinguish between them.</h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="position: relative; overflow: hidden;">
            <div class="background" style="background-image: url('{{ asset('resources/gray-cubic-bg.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.25; transform: scale(2.2, 2.2)"></div>
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left d-flex flex-column align-items-start justify-content-center">
                        <h3>Great on any device</h3>
                        <h4>For a DM on the go, or for players who like to take notes during the session, Fantasy Calendar 2.0 works great on phones and tablets.</h4>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right">
                        <img src="{{ asset('resources/any-device.png') }}">
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 darkmode" style="background-color: #222222; background-image: url('{{ asset('resources/gray-square-bg.png') }}');">
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left">
                        <img src="{{ asset('resources/whats-new-dark.png') }}" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right d-flex flex-column align-items-end justify-content-center">
                        <h3 style="color: white;">What lives in the darkness...</h3>
                        <h4 style="color: white;">Ok, that's probably a bit dramatic. But dark mode is here! You can enable it on your profile when you are logged in.</h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5"  style="position: relative; overflow: hidden;">
            <div class="background" style="background-image: url('{{ asset('resources/triangle-bg.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.25; transform: scale(1.5, 1.5)"></div>
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left d-flex flex-column align-items-start justify-content-center">
                        <h3>Helpful Documentation</h3>
                        <h4>Confused? Some feature doesn't make any sense? Head over to the <a href='https://helpdocs.fantasy-calendar.com/' target='_blank'>helpdocs</a> for help and information about every single feature.</h4>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right">
                        <img src="{{ asset('resources/whats-new-helpdocs.png') }}" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="background-color: #edf2f7;">
            <div class="container" style="max-width: 1300px;">
                <div class="row">
                    <div class="col-12 text-center">
                        <h2>And So Much More...</h2>
                    </div>
                </div>
                <div class="row pt-3 pb-3 justify-content-center">
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 ml-md-0 pl-md-0 pr-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-infinity"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Eras</h5>
                            </div>
                            <div class="row">
                                <p class=" px-4">AD, BC, Dalereckoning, Post-Divergence, The&nbsp;Reign of The Ashmarai... Whatever you call them, you can now record the eras of your world!</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 px-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-th-list"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Event Categories</h5>
                            </div>
                            <div class="row">
                                <p class=" px-4">Religious holidays, natural world events, kingdom celebrations, character birthdays, campaign notes... Organize your events for the ways you use them.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 pl-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-calendar-check"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Event Conditions</h5>
                            </div>
                            <div class="row">
                                <p class=" px-4">Your events now have support for advanced conditions. Last sunday on three specific months? Check. When all 4 moons are full? <strong>Check.</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row pb-1 justify-content-center">
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 ml-md-0 pl-md-0 pr-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-users"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Collaboration</h5>
                            </div>
                            <div class="row">
                                <p class=" px-4">Invite another GM to run events in your world, or let your players help you chronicle the events of the story you're telling together.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 px-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-link"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Calendar Linking</h5>
                            </div>
                            <div class="row">
                                <p class=" px-4">Connect two calendars together, make a parent calendar drive the date of child calendars for a 1:1 date conversion in real time.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3 py-2 py-md-0 px-2 pl-md-2">
                        <div class="inner text-center h-100 px-3 rounded" style="background-color: #e2e8f0;">
                            <div class="row">
                                <h3 class="pt-4 w-100"><i class="fa fa-cogs"></i></h3>
                            </div>
                            <div class="row">
                                <h5 class="pt-2 w-100">Engine Improvements</h5>
                            </div>
                            <div class="row justify-content-center">
                                <ul class="text-left pl-4">
                                    <li>More accurate leap days</li>
                                    <li>Intercalary & leap months</li>
                                    <li>Better weather generation</li>
                                    <li>Upgraded and improved seasons</li>
                                    <li>...and more!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-3">
            <div class="container py-3">
                <div class="row">
                    <div class="col-12 text-center d-flex flex-column align-items-start justify-content-center">
                        <h4 class='w-100'><a href='calendars' class='btn btn-lg btn-accent text-white mt-5 mb-2'>Check out your calendars now</a></h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 text-center d-flex flex-column align-items-start justify-content-center">
                        <h4 class='w-100'><a href='changelog' class='btn btn btn-secondary text-white mb-5 mt-2'>Read the full changelog</a></h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="background-color: #2f855a">
            <section class="container">
                <div class="row">
                    <div class="col-12 text-center text-white">
                        <h3>With much more to come!</h3>
                        <h4>We only plan to make it better.</h4>
                    </div>
                </div>
            </section>
        </section>
    </div>
@endsection
