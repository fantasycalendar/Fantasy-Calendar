@push('head')
    <style>
        html {
            scroll-behavior: smooth;
        }
    </style>
@endpush

<x-app-layout>
    <div class="container markdown_container">

        <div class="py-5 prose dark:prose-invert m-auto">

            <h1 class="pt-5">What's Changed with Fantasy Calendar</h1>

            {!! mdToHtml(Storage::disk('base')->get('public/changelog.md')); !!}

        </div>

    </div>
</x-app-layout>
