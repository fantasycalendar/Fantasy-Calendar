@push('head')
    <style>
        @import url('https://fonts.googleapis.com/css?family=Cabin+Sketch|Montserrat:300,500');
        .sketch {
            height: 400px;
            min-width: 400px;
        }

        .bee-sketch {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 30px;
            left: 0;
        }
        .red {
            background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png) no-repeat center center;
            opacity: 1;
            animation: red 3.5s linear infinite, opacityRed 5s linear alternate infinite;
        }

        .blue {
            background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png) no-repeat center center;
            opacity: 0;
            animation: blue 3.5s linear infinite, opacityBlue 5s linear alternate infinite;
        }

        @keyframes blue {
            0% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png)
            }
            9.09% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-2.png)
            }
            27.27% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-3.png)
            }
            36.36% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-4.png)
            }
            45.45% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-5.png)
            }
            54.54% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-6.png)
            }
            63.63% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-7.png)
            }
            72.72% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-8.png)
            }
            81.81% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-9.png)
            }
            100% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png)
            }
        }

        @keyframes red {
            0% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png)
            }
            9.09% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-2.png)
            }
            27.27% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-3.png)
            }
            36.36% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-4.png)
            }
            45.45% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-5.png)
            }
            54.54% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-6.png)
            }
            63.63% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-7.png)
            }
            72.72% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-8.png)
            }
            81.81% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-9.png)
            }
            100% {
                background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png)
            }
        }

        @keyframes opacityBlue {
            from {
                opacity: 0
            }
            25% {
                opacity: 0
            }
            75% {
                opacity: 1
            }
            to {
                opacity: 1
            }
        }

        @keyframes opacityRed {
            from {
                opacity: 1
            }
            25% {
                opacity: 1
            }
            75% {
                opacity: .3
            }
            to {
                opacity: .3
            }
        }
    </style>
@endpush


<x-app-guest-layout body-class="dark bg-gray-900">
    <div class="grid grid-cols-12 w-full mx-auto min-h-screen px-6 gap-4">
        <div class="flex col-span-12 md:col-span-5 flex-col justify-center">
            <div class="sketch relative">
                <div class="bee-sketch red"></div>
                <div class="bee-sketch blue"></div>
            </div>
        </div>

        <div class="col-span-12 md:col-span-7 flex flex-col justify-center">
            <x-panel>
                @unless($slot->isNotEmpty())
                    <div class="font-['Cabin_Sketch']">
                        <h1 class="text-3xl">An error has occurred.</h1>
                        <h2 class="text-2xl pb-2 text-gray-500 dark:text-gray-400">This was probably <strong>not</strong> your fault.</h2>
                    </div>

                    <p class="text-lg">
                        In fact, this error page usually means something is <strong style="font-weight: 500;">INCREDIBLY</strong> broken, like our database is unreachable. Hopefully, our monitoring tools will have caught it, and we're already looking into it.<br>
                        <br>
                        There are a few steps you can take, however:
                    </p>

                    <ul class="p-4 border-l-4 border-yellow-400 dark:border-yellow-700 text-left list-disc">
                        <li class="ml-4 pb-2">Check out <x-app-link href="https://fantasy-calendar.instatus.com">our status page</x-app-link>. <br>That's where we post status updates if we're aware of what's going on.</li>
                        <li class="ml-4 pb-2">Try just going to <x-app-link href="{{ route('calendars.index') }}">the home page</x-app-link> and see if that errors too (it probably will, that's ok)</li>
                        <li class="ml-4 pb-2">Reach out to us on <x-app-link href="https://discord.gg/BNSM7aT">Discord!</x-app-link> <br>We're a two-man team who do this in our free time, so we appreciate your patience.</li>
                    </ul>
                @else
                    {{ $slot }}
                @endunless

                <x-slot name="footer"></x-slot>
            </x-panel>
        </div>
    </div>
</x-app-guest-layout>
