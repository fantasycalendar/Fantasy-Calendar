@section('title')404 - Not Found -@endsection

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

<x-app-guest-layout>
    <div class="grid grid-cols-12 w-full max-w-4xl mx-auto min-h-screen px-6">
        <div class="col-span-12 md:col-span-7 flex flex-col justify-center">
            <h1 class="text-6xl text-gray-700 text-center font-['Cabin_Sketch']">404:<small>{{ isset($resource) ? $resource : "Page" }} Not Found</small></h1>
        </div>
        <div class="flex col-span-12 md:col-span-5 flex-col justify-center">
            <div class="sketch relative">
                <div class="bee-sketch red"></div>
                <div class="bee-sketch blue"></div>
            </div>
        </div>
    </div>
</x-app-guest-layout>
