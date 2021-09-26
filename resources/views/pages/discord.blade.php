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

        .discord-bg {
            background-color: rgb(88, 101, 242);
        }

        .btn-discord {
            background-color: rgb(88, 101, 242);
            transition: all 0.2s ease-in-out;
            color: white;
        }
        .btn-discord:hover {
            background-color: #2f855a;
            color: white;
        }

        .fullheight {
            height: 100vh;
            position: relative;
        }

        .green-border {
            border-bottom: 10px solid #2f855a;
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

        h3 i {
            font-size: 85%;
        }

        section h3 {
            margin-bottom: 1rem;
        }

        section h4 {
            font-size: 1.3rem;
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

    <script>
        window.wordRandomizer = {
                words: [
                    'RPGers',
                    'Players',
                    'Community',
                    'Dragon Slayers',
                    'Dungeon Delvers',
                    'Trenchcoat-Kobolds',
                    'Group',
                    'Table',
                    'Adventurers',
                    'Storytellers',
                    'Jokesters',
                    'Friends',
                    'Campaigners',
                    'Lunatics',
                    'Murder-hobos',
                    'Munchkins',
                    'Powergamers',
                    'Minmaxers',
                    'Story Tourists',
                    'Trophy Hunters',
                    'Roleplayers',
                    'Rules Lawyers',
                    'Critters',
                    'Metagamers',
                    'Voicechatters',
                    'Homebrewers',
                    'Agents of Chaos',
                    'Paragons of Good',
                    'Mercenaries',
                    'Explorers',
                    'Soldiers of Fortune',
                    'Pioneers',
                    'Travellers',
                    'Co-Authors',
                    'Nerds',
                    'Geeks',
                ],
                word: 'Community',
                visible: 1,
                used_words: [],
                get_word(){
                    let index = Math.floor(Math.random() * this.words.length);
                    let word = this.words[index];

                    this.used_words.push(word);
                    this.words.splice(index, 1);

                    if (!this.words.length) {
                        this.words = [...this.used_words];
                        this.used_words = [];
                    }
                    return word;
                }
            }
    </script>
@endpush

@section('content')
    <div>
        <section class="fullheight green-border welcome" style="background-color: #edf2f7; background-image: url({{ asset('resources/discord/integration-bg-1.png') }}); background-size: cover; background-position: center center; background-attachment: fixed;">
            <div class="container">
                <div class="row justify-content-center align-items-center">
                    <div class="col-12 col-md-5 big-logo-wrapper p-0">
                        <img class="m-0 m-md-1" src="{{ asset('resources/fc_logo_white_padding.png') }}">
                    </div>

                    <div class="col-2 col-md-2 big-logo-wrapper p-0 text-center">
                        <img class="m-0 m-md-1" style="max-width:3rem;" src="{{ asset('resources/discord_fc_plus_white.svg') }}">
                    </div>

                    <div class="col-12 col-md-5 big-logo-wrapper p-0">
                        <img class="m-0 m-md-1" src="{{ asset('resources/discord/discord_white_padding.png') }}">
                    </div>

                </div>
            </div>

            <h3 style="width: 100%; text-align: center;" class="text-white">The long-awaited Discord integration is here!</h3>
            <h4 class="text-white text-center">Quick to setup, easy to use, and available <strong><a href="{{ route('discord.index') }}">right now</a></strong> to subscribers.</h4>

            <h4 class="next-link" style="font-size: 2.1rem; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section2"><i class="fa fa-chevron-circle-down"></i> Show me more! <i class="fa fa-chevron-circle-down"></i></a></h4>
        </section>

        <section class="fullheight green-border welcome text-white" id="section2" style="background-image: url({{ asset('resources/discord/plugin_pattern.png') }}); background-repeat: repeat;">
            <div class="container">
                <h3 style="width: 100%; text-align: center;"
                    class="display-md-1"
                    x-data="wordRandomizer"
                    x-init="setInterval(() => { $dispatch('randomize-word') }, 2200)"
                    @randomize-word.window="visible = 0; setTimeout(() => { $dispatch('hidden-word') }, 300)"
                    @hidden-word.window="word = get_word(); visible = 1"
                >
                    Your <span x-text="word" x-show.opacity.transition.duration.800ms="visible"></span>. Your Calendar. Together.
                </h3>
                <h5 style="width: 100%; text-align: center;">Track campaign time for your players right from Discord. Yeah, <span class="font-italic">we like it too.</span></h5>
                <img src="{{ asset('resources/discord/integration-bg-2.png') }}" alt="" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
            </div>
            <h4 class="next-link" style="font-size: 2.1rem; position: absolute; bottom: 10px; width: 100%; text-align: center; z-index: 21;"><a href="#section3"><i class="fa fa-chevron-circle-down"></i> There's more?! <i class="fa fa-chevron-circle-down"></i></a></h4>
        </section>

        <section class="comparison_both welcome" id="section3" style="background-color: #303136; background-image: url('{{ asset('resources/gray-square-bg.png') }}');">
            <div class="container my-5 py-5">
                <div class="row">
                    <div class="col-12 col-md-7 text-center text-md-left d-flex flex-column align-items-start justify-content-center">
                        <h3 class="text-white">The information you need, just a command away.</h3>
                    </div>

                    <div class="col-12 col-md-5 text-center text-md-right">
                        <img src="{{ asset('resources/discord/discord_show_month.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                    </div>
                </div>
                <div class="row">

                    <div class="col-12 col-md-5 text-center text-md-left">
                        <img src="{{ asset('resources/discord/discord_add_days.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                    </div>

                    <div class="col-12 col-md-7 text-center text-md-right d-flex flex-column align-items-md-end align-items-center  justify-content-center">
                        <h3 class="text-white">Quickly add or subtract minutes, hours, days, months, or years. <br><br>Thousands at once, even!</h3>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background" style="background-image: url('{{ asset('resources/discord/webb-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.25; transform: scale(1.5, 1.5)"></div>
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left d-flex flex-column align-items-md-start align-items-center justify-content-center text-white">
                        <h3>Image or text, your choice.</h3>
                        <h4>We can provide an image or a text render of your calendar, whenever you need it.</h4>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right">
                        <img src="{{ asset('resources/discord/discord_show_month_text.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background" style="background-image: url({{ asset('/resources/discord/gray-cubic-bg.png') }});position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0.03;transform: scale(1.2);"></div>
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left">
                        <img src="{{ asset('resources/discord/detailed_day_info.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right d-flex flex-column align-items-md-end align-items-center justify-content-center text-white">
                        <h3>Stats-nerds, we've got you covered.</h3>
                        <h4>Quickly access detailed information about the current day with a simple command.</h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 darkmode" style="background-color: #222222; background-image: url('{{ asset('resources/gray-square-bg.png') }}');">
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left d-flex flex-column align-items-md-start align-items-center justify-content-center">
                        <h3 style="color: white;">Privacy: Respected</h3>
                        <h4 style="color: white;">
                            We add new "slash commands" to your Discord server, <strong>not</strong> an always-listening bot.
                            <br><br>
                            Even if you use it in private channels, your messages stay yours.
                        </h4>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right">
                        <img src="{{ asset('resources/discord/slash_commands.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5"  style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background" style="background-image: url('{{ asset('resources/discord/double-bubble-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.15; transform: scale(1.5, 1.5)"></div>
            <div class="container py-5 text-white">
                <div class="row">
                    <div class="col-12 col-md-6 text-center text-md-left">
                        <iframe src="https://discord.com/widget?id=399974878134140939&theme=dark" width="350" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-right d-flex flex-column align-items-md-end align-items-center justify-content-center">
                        <h3>Feedback Wanted!</h3>
                        <h4>Confused? Something not working? Seeing an error message? Wish you could do/see/get something not currently available? Head over to our Discord server and let us know!</h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5" style="position: relative; overflow: hidden; background-color: #222222;">
            <div class="background" style="background-image: url('{{ asset('resources/discord/webb-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.15; transform: scale(1.5, 1.5)"></div>
            <div class="container text-white" style="max-width: 1300px;">
                <div class="row">
                    <div class="col-12 text-center">
                        <h2>Quick-Fire FAQs</h2>
                    </div>
                </div>
                <div class="row pt-3 pb-3 justify-content-center">
                    @include('pages.announcement._card', ['icon' => 'question-circle', 'title' => "How does it work?", 'content' => "You add the Fantasy Calendar integration to a Discord server you own or admin, then type <span style='font-family: monospace; border: 1px solid #6e6e6e; border-radius: 3px; padding: .2rem; font-size: .7rem;'>/fc</span> in that server. Easy as that! You can run <span style='font-family: monospace; border: 1px solid #6e6e6e; border-radius: 3px; padding: .2rem; font-size: .7rem;'>/fc help</span> for help."])
                    @include('pages.announcement._card', ['icon' => 'plug', 'title' => "Integration?", 'content' => "Yep! That just means a connection between our system and Discord's, to make life easier for you - now you can keep track of time right in Discord."])
                    @include('pages.announcement._card', ['icon' => 'dollar-sign', 'title' => "Why subscription-only?", 'content' => "In short: Every single /fc command costs us a small amount of money, adding up quickly. It also helps keep the lights on so we can keep making Fantasy-Calendar better!"])
                </div>
                <div class="row pb-1 justify-content-center">
                    @include('pages.announcement._card', ['icon' => 'user-secret', 'title' => "Does this give you my private messages?", 'content' => "<strong>Nope.</strong> No always-on bots in sight! All Discord sends us is the content of the commands you run, when you run them."])
                    @include('pages.announcement._card', ['icon' => 'calendar-check', 'title' => "What can I do with it?", 'raw' => true, 'content' => "<ul class='text-left pl-4 m-auto' style='width: 90%;'><li>View the current date</li><li>Display the current month</li><li>Advance time and date</li><li>Share a direct calendar link</li><li>All directly from Discord</li></ul>"])
                    @include('pages.announcement._card', ['icon' => 'newspaper', 'title' => "We still plan to add:", 'raw' => true, 'content' => "<ul class='text-left pl-4 pb-4 m-auto' style='width: 90%;'><li>Moons</li><li>Events+Categories</li><li>Weather</li><li>Clock</li><li>User management</li></ul>"])
                </div>
            </div>
        </section>

        <section class="py-3" style="background-color: #222222;">
            <div class="container py-3">
                <div class="row">
                    <div class="col-12 text-center d-flex flex-column align-items-start justify-content-center">
                        @if(!Auth::user())
                        <h4 class='w-100'><a href='{{ route('register') }}' class='btn btn-lg btn-discord text-white mt-5 mb-2'>Register and Subscribe Now to Connect!</a></h4>
                        @elseif(!Auth::user()->isPremium())
                        <h4 class='w-100'><a href='{{ route('subscription.pricing') }}' class='btn btn-lg btn-discord text-white mt-5 mb-2'>Subscribe Now to Connect!</a></h4>
                        @else
                        <h4 class='w-100'><a href='{{ route('discord.index') }}' class='btn btn-lg btn-discord text-white mt-5 mb-2'>Connect Your Account Now!</a></h4>
                        @endif
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 text-center d-flex flex-column align-items-start justify-content-center">
                        <h4 class='w-100'><a href='{{ route('discord.server') }}' class='btn btn btn-secondary text-white mb-5 mt-2'>Join Our Discord Server</a></h4>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 discord-bg">
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
