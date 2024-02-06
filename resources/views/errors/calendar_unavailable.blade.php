<x-error-layout>
    <h1>{{ $title ?? "That calendar is unavailable." }}</h1>

    <p>There are a couple of reasons this can happen:</p>
    <ul class="list-disc ml-6">
        <li>
            The creator has set it to be private, and you are not on the calendar's user list
        </li>
        <li>
            Free users only get two calendars. If the owner of this calendar had a subscription that lapsed, this calendar may have been disabled as a result.
        </li>
    </ul>
</x-error-layout>
