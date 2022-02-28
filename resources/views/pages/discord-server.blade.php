<x-app-layout>
    <div class="grid md:grid-cols-12">
        <div class="col-span-12 md:col-span-7 flex flex-col justify-center prose dark:prose-invert">
            <h3>Hear the latest news, get your questions answered, or suggest new features!</h3>
            <p>We'd love to hear any feedback or ideas you have for us! We're pretty active in our Discord server, and we're always glad to have new folks around.</p>
        </div>
        <x-panel class="w-full col-span-12 md:col-span-5">
            <div class="pt-5 text-center md:text-right mx-auto">
                <iframe class="mx-auto mb-4" src="https://discord.com/widget?id=399974878134140939&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </div>

            <x-slot name="footer"></x-slot>
        </x-panel>
    </div>
</x-app-layout>
