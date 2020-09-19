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
            font-weight: bold;
            font-size: 1.2rem;
        }

        .question span {
            max-width: 90%;
        }

        .question i {
            font-size: 1.5rem;
            line-height: normal;
            align-self: center;
        }

    </style>


    <script>

        function faq_page(){
            return {
                questions: [
                    {
                        open: false,
                        text: "What is Fantasy-Calendar?",
                        answer: "Fantasy-Calendar is a web application that allows you to create your own custom calendars. The calendar doesn't have to be the same as the calendar in our world, it could be from any established fantasic world, or one of your own making."
                    },
                    {
                        open: false,
                        text: "Subscriptions? Isn't Fantasy-Calendar free? What changed?",
                        answer: "Fantasy-Calendar is still <strong>completely free to use</strong>! Free accounts can still create up to 2 calendars, with no other limitations. As Fantasy-Calendar has grown, so has our bills. For the last 3 years we have been happily funding the site out of our own pockets and from generous donations from some of our users, but we want Fantasy-Calendar stay online long term. That's why we added some <i>optional</i> premium features that won't hinder you from creating full-fleged calendars!"
                    },
                    {
                        open: false,
                        text: "I have an idea, where can I let you know?",
                        answer: "On our <a target='_blank' href='https://discord.gg/BNSM7aT'>Discord server</a>! Both of the developers are very active on there, and we're always listening to your feedback!"
                    },
                    {
                        open: false,
                        text: "I have forgotten my username / email / password!",
                        answer: `We got your back! Before you try to reset it, remember that you can sign in with your email address <i>or</i> your username. If you've forgotten your password, you can reset it here <a target='_blank' href='${window.location.origin}/password/reset'>here</a>. If you've forgotten your username or email, get in touch with us at <a target='_blank' href='mailto:contact@fantasy-calendar.com'>contact@fantasy-calendar.com</a> and we'll sort you out!`
                    },
                    {
                        open: false,
                        text: "I don't know how X feature works! Help!",
                        answer: "Don't worry! You can find help on our <a target='_blank' href='https://helpdocs.fantasy-calendar.com/'>help docs</a>, which contains detailed information about each feature. If that doesn't solve your issues, you can always join our <a target='_blank' href='https://discord.gg/BNSM7aT'>discord server</a> and ask other Fantasy-Calendar users for a hand."
                    }
                ]
            }
        }

    </script>

@endpush

@section("content")

    <div class="container" x-data="faq_page()">

        <h2 class="text-center">Frequently Asked Questions</h2>

        <template x-for="question in questions">

            <div class="border-bottom mx-1 p-3">

                <div class="row question py-2" @click="question.open = !question.open">
                
                    <span x-text="question.text"></span>

                    <i class="fas" :class="{
                        'fa-chevron-up': !question.open,
                        'fa-chevron-down': question.open
                    }"></i>

                </div>

                <div class="row mt-1 answer">
                    <span x-html="question.answer" x-show="question.open"></span>
                </div>

            </div>

        </template>

    </div>

@endsection
