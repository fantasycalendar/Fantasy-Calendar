@extends("templates._page")

@push("head")
    <style>

        html {
            scroll-behavior: smooth;
        }

        .container {

            padding: 3rem 0;

        }

        .question {
            flex-direction: row;
            justify-content: space-between;
            cursor: pointer;
            font-size: 1.3rem;
        }

        .question span {
            max-width: 90%;
        }

        .question i {
            font-size: 1.5rem;
            line-height: normal;
            align-self: center;
        }

        .question i.light {
            opacity: 0.5;
        }

        .light {
            color: #6b7280;
        }

    </style>


    <script>

        function faq_page(){
            return {
                open: 0,
                questions: [
                    {
                        text: "What is Fantasy-Calendar?",
                        answer: "Fantasy-Calendar is a web application that allows you to create your own custom calendars. The calendar doesn't have to be the same as the calendar in our world, it could be from any established fantastic world, or one of your own making."
                    },
                    {
                        text: "The site looks different. What's new?",
                        answer: `You can check out the "<a target='_blank' href='{{ route('whats-new') }}'>what's new</a>" page here for broad strokes, or if you want to get into the nitty gritty, you can read over the <a target='_blank' href='{{ route('changelog') }}'>changelog</a>.`
                    },
                    {
                        text: "Where is the preset for the real world calendar?",
                        answer: "We do! The calendar we use on earth is called the 'Gregorian Calendar', and you can find it in the presets when you create a calendar."
                    },
                    {
                        text: "Is there a way to track the weather in my world?",
                        answer: "Yes it can! You'll need <a target='_blank' href='{{ helplink('seasons') }}'>seasons</a> in your calendar and enable <a target='_blank' href='{{ helplink('weather') }}'>weather</a> on it. Then, you have the option to switch <a target='_blank' href='{{ helplink('locations') }}'>locations</a>, which is what actually drives the weather. Between our many preset climate locations, such as Equatorial, Tropical Savanna, Cool and Rainy, and Polar-like, you have plenty of options to simulate your location. If you want something more home-brewed, you can create your own custom locations to best suit the places in your world."
                    },
                    {
                        text: "I have an idea, where can I let you know?",
                        answer: "On our <a target='_blank' href='https://discord.gg/BNSM7aT'>Discord server</a>! Both of the developers are very active on there, and we're always listening to your feedback!"
                    },
                    {
                        text: "I don't know how X feature works! Where can I find more information?",
                        answer: "Don't worry! You can find help on our <a target='_blank' href='{{ helplink()  }}'>help docs</a>, which contains detailed information about each feature. If that doesn't solve your issues, you can always join our <a target='_blank' href='https://discord.gg/BNSM7aT'>discord server</a> and ask other Fantasy-Calendar users for a hand."
                    },
                    {
                        text: "Subscriptions? Isn't Fantasy-Calendar free?",
                        answer: "Fantasy-Calendar is still <strong>completely free to use</strong>! Free accounts can still create up to 2 calendars, with no other limitations. As Fantasy-Calendar has grown, so has our bills. For the last 3 years we have been happily funding the site out of our own pockets and from generous donations from some of our users, but we want Fantasy-Calendar stay online long term. That's why we added some <i>optional</i> premium features that won't hinder you from creating full-fleged calendars!"
                    },
                    {
                        text: "I have forgotten my username / email / password!",
                        answer: `We got your back! Before you try to reset it, remember that you can sign in with your email address <i>or</i> your username. If you've forgotten your password, you can reset it here <a target='_blank' href='${window.location.origin}/password/reset'>here</a>. If you've forgotten your username or email, get in touch with us at <a target='_blank' href='mailto:contact@fantasy-calendar.com'>contact@fantasy-calendar.com</a> and we'll sort you out!`
                    }
                ]
            }
        }

    </script>

@endpush

@section("content")

    <div class="container" x-data="faq_page()">

        <h2 class="text-center">Frequently Asked Questions</h2>

        <template x-for="(question, index) in questions" :key="index">

            <div class="border-bottom mx-1 p-3">

                <div class="row question py-2" @click="open = index">

                    <span x-text="question.text"></span>

                    <i class="fas" :class="{
                        'fa-chevron-up light': open !== index,
                        'fa-chevron-down': open === index
                    }"></i>

                </div>

                <div class="row mt-1 answer">
                    <span class="light" x-html="question.answer" x-show="open === index"></span>
                </div>

            </div>

        </template>

    </div>

@endsection
