<div x-data="event_editor">
    <x-modal name="event_editor">
        <div class="flex flex-col space-y-4">
            <x-alpine.text-input path="event.name" x-model="event.name"></x-alpine.text-input>
        </div>
    </x-modal>
</div>
