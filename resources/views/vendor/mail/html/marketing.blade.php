@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }}
        @endcomponent
    @endslot

    {{-- Body --}}
    {{ $slot }}

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            Fantasy Computerworks Ltd is registered in England number 12171652. Trading name "Fantasy Calendar". Registered office: Brookfield Court Selby Road, Garforth, Leeds, LS25 1NB, UK. Main trading address: 6 Boulevard Drive, Apartment 54, Cavendish House, London, NW9 5QG, UK. Please do not reply to this email. If you wish to get in touch, please contact us through: [contact@fantasy-calendar.com](mailto:contact@fantasy-calendar.com)
            <br><br>
            [Click here to unsubscribe]({{ URL::signedRoute('unsubscribe', ['user' => $user]) }})
        @endcomponent
    @endslot

    {{-- Subcopy --}}
    @isset($subcopy)
        @slot('subcopy')
            @component('mail::subcopy')
                {{ $subcopy }}
            @endcomponent
        @endslot
    @endisset
@endcomponent
