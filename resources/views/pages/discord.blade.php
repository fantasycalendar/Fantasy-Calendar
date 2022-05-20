@push('head')
    <style>
        html {
            scroll-behavior: smooth;
        }

        nav {
            z-index: 2;
            position: absolute;
            width: 100%;
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

<x-app-fullwidth-layout>
    <div>
        <section class="px-6 min-h-screen pt-16 h-full border-b-4 border-b-primary-600 flex flex-col justify-center items-center relative" style="background-color: #edf2f7; background-image: url({{ asset('resources/discord/integration-bg-1.png') }}); background-size: cover; background-position: center center; background-attachment: fixed;">
            <div class="flex flex-col md:flex-row justify-center items-center max-w-7xl">
                <div class="grid place-items-center">
                    <img class="max-h-60" src="{{ asset('resources/fc_logo_white_padding.png') }}">
                </div>

                <div class="grid place-items-center">
                    <img class="max-h-60" style="max-width:3rem;" src="{{ asset('resources/discord_fc_plus_white.svg') }}">
                </div>

                <div class="grid place-items-center">
                    <img class="max-h-60" src="{{ asset('resources/discord/discord_white_padding.png') }}">
                </div>

            </div>

            <h3 class="px-8 font-semibold w-full text-center text-white text-lg md:text-3xl pb-2">Fantasy Calendar has a Discord integration!</h3>
            @if(Auth::user() && Auth::user()->isPremium())
                <h4 class="px-8 text-white text-center text-md md:text-xl">Quick to setup, easy to use, and available for subscribers like you <x-app-link href="{{ route('profile.integrations') }}"><strong>right now</strong></x-app-link>!</h4>
            @else
                <h4 class="px-8 text-white text-center text-md md:text-xl">Quick to setup, easy to use, and available in just a few clicks <x-app-link href="{{ route('subscription.pricing') }}">for subscribers!</x-app-link></h4>
                <span class="px-8 text-white text-center text-sm md:text-md">(only $2.49/month)</span>
            @endif

            <h4 class="absolute bottom-4 w-full text-center z-index-10 font-semibold text-xl md:text-2xl"><x-app-link class="inline-block hover:-translate-y-1 leading-loose transition duration-200" href="#section2"><i class="fa fa-chevron-circle-down"></i> Show me more! <i class="fa fa-chevron-circle-down"></i></x-app-link></h4>
        </section>

        <section class="px-6 min-h-screen max-h-screen h-full border-b-4 border-b-primary-600 flex flex-col justify-center items-center relative text-white" id="section2" style="background-image: url({{ asset('resources/discord/plugin_pattern.png') }}); background-repeat: repeat;">
            <div class="max-h-5/6 max-w-full w-full pt-10 px-10 flex justify-center">
                <div class="absolute top-8 left-0 right-0">
                    <h3 class="px-4 w-full text-center text-lg md:text-2xl"
                        x-data="wordRandomizer"
                        x-init="setInterval(() => { $dispatch('randomize-word') }, 2200)"
                        @randomize-word.window="visible = 0; setTimeout(() => { $dispatch('hidden-word') }, 300)"
                        @hidden-word.window="word = get_word(); visible = 1"
                    >
                        Your <span x-text="word" x-show="visible" x-transition.opacity.duration.800ms></span>. Your Calendar. Together.
                    </h3>
                    <h5 class="px-4 w-full text-center text-md md:text-lg">Track campaign time for your players right from Discord. Yeah, <span class="font-italic">we like it too.</span></h5>
                </div>
                <img class="hidden md:block" src="{{ asset('resources/discord/integration-bg-2.png') }}" alt="" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); max-height: 76vh">
                <img class="md:hidden mx-auto" src="{{ asset('resources/discord/integration-bg-mobile.png') }}" alt="" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); max-height: 60vh;">
            </div>
            <h4 class="absolute bottom-4 w-full text-center z-index-10 font-semibold text-xl md:text-2xl"><x-app-link class="inline-block hover:-translate-y-1 leading-loose transition duration-200" href="#section3"><i class="fa fa-chevron-circle-down"></i> There's more?! <i class="fa fa-chevron-circle-down"></i></x-app-link></h4>
        </section>

        <section class="px-6 grid place-items-center py-10" id="section3" style="background-color: #303136; background-image: url('{{ asset('resources/gray-square-bg.png') }}');">
            <div class="max-w-5xl my-5 py-5 grid md:grid-cols-12 gap-10">
                <div class="md:col-span-7 text-center md:text-left flex flex-col items-start justify-center">
                    <h3 class="text-white text-2xl font-semibold">The information you need, just a command away.</h3>
                </div>

                <div class="md:col-span-5 text-center md:text-right">
                    <img src="{{ asset('resources/discord/discord_show_month.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                </div>

                <div class="md:col-span-5 text-center md:text-left">
                    <img src="{{ asset('resources/discord/discord_add_days.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                </div>

                <div class="md:col-span-7 text-center md:text-right flex flex-col md:items-end items-center justify-center">
                    <h3 class="text-white text-2xl font-semibold">Quickly add or subtract minutes, hours, days, months, or years. <br><br>Thousands at once, even!</h3>
                </div>
            </div>
        </section>

        <section class="px-6 py-16" style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background z-10" style="background-image: url('{{ asset('resources/discord/webb-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.25; transform: scale(1.5, 1.5)"></div>
            <div class="max-w-5xl mx-auto grid md:grid-cols-2 py-5 z-20 relative gap-10">
                <div class="text-center md:text-left flex flex-col md:items-start items-center justify-center text-white">
                    <h3 class="text-white text-2xl font-semibold pb-8">Image or text, your choice.</h3>
                    <h4 class="text-white text-xl">Prefer something you can paste into a text editor, wiki, or markdown page? The text-renderer will let you do just that.</h4>
                </div>
                <div class="text-center md:text-right flex flex-col md:flex-row items-center md:justify-end">
                    <img src="{{ asset('resources/discord/discord_show_month_text.png') }}" style="min-height: 100%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                </div>
            </div>
        </section>

        <section class="px-6 py-5" style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background z-10" style="background-image: url({{ asset('/resources/discord/gray-cubic-bg.png') }});position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0.03;transform: scale(1.2);"></div>
            <div class="max-w-5xl m-auto py-5 grid md:grid-cols-2 z-20 relative gap-10">
                <div class="text-center md:text-left">
                    <img src="{{ asset('resources/discord/detailed_day_info.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                </div>
                <div class="text-center md:text-right flex flex-col md:items-end items-center justify-center text-white">
                    <h3 class="text-white text-2xl font-semibold pb-8">Stats-nerds, we've got you covered.</h3>
                    <h4 class="text-white text-xl">Quickly access detailed information about the current day with a simple command.</h4>
                </div>
            </div>
        </section>

        <section class="px-6 py-5 darkmode" style="background-color: #222222; background-image: url('{{ asset('resources/gray-square-bg.png') }}');">
            <div class="max-w-5xl m-auto py-5 grid md:grid-cols-2 gap-10">
                <div class="text-center md:text-left flex flex-col md:items-start items-center justify-center">
                    <h3 class="text-white text-2xl font-semibold pb-8">Privacy: Respected</h3>
                    <h4 class="text-white text-xl">
                        We add new "slash commands" to your Discord server, <strong>not</strong> an always-listening bot.
                        <br><br>
                        Even if you use it in private channels, your messages stay yours.
                    </h4>
                </div>
                <div class="text-center md:text-right flex flex-col md:items-end items-center justify-center text-white">
                    <img src="{{ asset('resources/discord/slash_commands.png') }}" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                </div>
            </div>
        </section>

        <section class="px-6 py-5"  style="position: relative; overflow: hidden; background-color: rgb(44, 47, 51);">
            <div class="background z-10" style="background-image: url('{{ asset('resources/discord/double-bubble-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.15; transform: scale(1.5, 1.5)"></div>
            <div class="max-w-5xl m-auto py-5 grid md:grid-cols-2 gap-10 text-white relative z-20">
                <div class="flex justify-center md:justify-start text-center md:text-left">
                    <iframe src="https://discord.com/widget?id=399974878134140939&theme=dark" width="350" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                </div>
                <div class="m-auto text-center md:text-right flex flex-col md:items-end items-center justify-center">
                    <h3 class="text-white text-2xl font-semibold pb-8">Feedback Wanted!</h3>
                    <h4 class="text-white text-xl">Confused? Something not working? Seeing an error message? Wish you could do/see/get something not currently available? Head over to our Discord server and let us know!</h4>
                </div>
            </div>
        </section>

        <section class="px-6 py-5" style="position: relative; overflow: hidden; background-color: #222222;">
            <div class="background z-10" style="background-image: url('{{ asset('resources/discord/webb-dark.png') }}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.08; transform: scale(1.5, 1.5)"></div>
            <div class="max-w-5xl mx-auto py-16 px-4 md:px-6 lg:py-24 lg:px-8 relative z-20" style="max-width: 1300px;">
                <div class="max-w-3xl mx-auto text-center">
                    <h2 class="text-3xl font-extrabold text-gray-200">Quick-fire FAQs</h2>
                    <p class="mt-4 text-lg text-gray-300">You have questions, we have answers.</p>
                </div>
                <dl class="mt-12 space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                    @include('pages.announcement._card', ['icon' => 'question-circle', 'title' => "How does it work?", 'content' => "You add the Fantasy Calendar integration to a Discord server you own or admin, then type <span class='bg-gray-900' style='font-family: monospace; border: 1px solid #6e6e6e; border-radius: 3px; padding: .2rem; font-size: .7rem;'>/fc</span> in that server. Easy as that! You can run <span class='bg-gray-900' style='font-family: monospace; border: 1px solid #6e6e6e; border-radius: 3px; padding: .2rem; font-size: .7rem;'>/fc help</span> for help."])
                    @include('pages.announcement._card', ['icon' => 'plug', 'title' => "Integration?", 'content' => "Yep! That just means a connection between our system and Discord's, to make life easier for you - now you can keep track of time right in Discord."])
                    @include('pages.announcement._card', ['icon' => 'dollar-sign', 'title' => "Why subscription-only?", 'content' => "In short: Every single /fc command costs us a small amount of money, adding up quickly. It also helps keep the lights on so we can keep making Fantasy-Calendar better!"])
                    @include('pages.announcement._card', ['icon' => 'user-secret', 'title' => "Does this give you my private messages?", 'content' => "<strong>Nope.</strong> No always-on bots in sight! All Discord sends us is the content of the commands you run, when you run them."])
                    @include('pages.announcement._card', ['icon' => 'calendar-check', 'title' => "What can I do with it?", 'raw' => true, 'content' => "<ul class='text-left list-disc m-auto' style='width: 90%;'><li>View the current date</li><li>Display the current month</li><li>Advance time and date</li><li>Share a direct calendar link</li><li>All directly from Discord</li></ul>"])
                    @include('pages.announcement._card', ['icon' => 'newspaper', 'title' => "We still plan to add:", 'raw' => true, 'content' => "<ul class='text-left list-disc pb-4 m-auto' style='width: 90%;'><li>Moons</li><li>Events+Categories</li><li>Weather</li><li>Clock</li><li>User management</li></ul>"])
                </dl>
            </div>
        </section>

        <section class="px-6 py-3" style="background-color: #222222;">
            <div class="flex flex-col items-center py-10 space-y-4">
                @if(!Auth::user())
                <div><x-button-link role="custom" size="xl" class="text-white border-[color:#5865F2] dark:border-[color:#5865F2] bg-[#5865F2] dark:bg-[#5865F2] hover:bg-[color:#2f855a] dark:hover:border-[color:#2f855a] hover:border-[color:#2f855a] dark:hover:bg-[color:#2f855a] transition duration-100" :href='route("subscription.pricing")'>Register and Subscribe Now to Connect!</x-button-link></div>
                @elseif(!Auth::user()->isPremium())
                <div><x-button-link role="custom" size="xl" class="text-white border-[color:#5865F2] dark:border-[color:#5865F2] bg-[#5865F2] dark:bg-[#5865F2] hover:bg-[color:#2f855a] dark:hover:border-[color:#2f855a] hover:border-[color:#2f855a] dark:hover:bg-[color:#2f855a] transition duration-100" :href='route("subscription.pricing")'>Subscribe Now to Connect!</x-button-link></div>
                @else
                <div><x-button-link role="custom" size="xl" class="text-white border-[color:#5865F2] dark:border-[color:#5865F2] bg-[#5865F2] dark:bg-[#5865F2] hover:bg-[color:#2f855a] dark:hover:border-[color:#2f855a] hover:border-[color:#2f855a] dark:hover:bg-[color:#2f855a] transition duration-100" :href='route("profile.integrations")'>Connect Your Account Now!</x-button-link></div>
                @endif
                <div><x-button-link size="md" role="custom" class="text-gray-200 bg-gray-800 hover:bg-gray-700 focus:ring-primary-500 border-gray-700" :href='route("discord.server")'>Join Our Discord Server</x-button-link></div>
            </div>
        </section>

        <section class="px-6 bg-[#5865F2] text-center">
            <div class="h-full py-10">
                <h1 class="text-white text-3xl mb-4 font-bold">With much more to come!</h1>
                <h2 class="text-white text-xl font-semibold">We only plan to make it better.</h2>
            </div>
        </section>
    </div>
</x-app-fullwidth-layout>
