<x-app-layout>
    <div class="container markdown_container">

        <div class="py-5 prose dark:prose-invert m-auto">

            <h1>{{ $title }}</h1>
            <p><i>Document Version {{ $version }}.0 — {{ $date }}</i></p>

            {!! $markdown !!}

        </div>

    </div>
</x-app-layout>
