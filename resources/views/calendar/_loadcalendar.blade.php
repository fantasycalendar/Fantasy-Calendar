// This file is technically Javascript.
// It's... Not permanent. I hope.

@if(Auth::check())
    window.Perms = new Perms(
        {{ Auth::user()->id }},
        {{ $calendar ? ($calendar->owned ? "true" : "false") : "true" }},
        '{{ strtolower(Auth::user()->paymentLevel()) }}',
        '{{ $calendar->users->contains(Auth::user()) ? $calendar->users->find(Auth::user())->pivot->user_role : null }}'
    )
@else
    window.Perms = new Perms(
        {{ Auth::user() ? Auth::user()->id : "null" }},
        {{ $calendar ? ($calendar->owned ? "true" : "false") : "true" }},
        'free',
        'guest'
    );
@endif

window.dark_theme = @json(auth()->user()?->setting('dark_theme') ?? true);

window.hash = `{{ $calendar->hash }}`;

window.calendar_name = unescapeHtml("{{ $calendar->name }}");
window.calendar_id = {{ $calendar->id }};
window.static_data = {!! json_encode($calendar->static_data) !!};
window.dynamic_data = {!! json_encode($calendar->dynamic_data) !!};

window.is_linked = {!! $calendar->isLinked() ? "true" : "null" !!};
window.has_parent = {!! $calendar->parent == null ? "null" : "true" !!};
window.parent_hash = {!! $calendar->parent != null ? '"'.$calendar->parent->hash.'"' : "null" !!};
window.parent_offset = {!! $calendar->parent != null ? $calendar->parent_offset : "null" !!};

window.events = {!! json_encode($calendar->events); !!}
window.event_categories = {!! json_encode($calendar->event_categories); !!}

window.last_static_change = new Date("{{ $calendar->last_static_change }}")
window.last_dynamic_change = new Date("{{ $calendar->last_dynamic_change }}")

window.advancement = {
    advancement_enabled: {{ $calendar->advancement_enabled ? "true" : "false" }},
    advancement_real_rate: {{ $calendar->advancement_real_rate ?? 1 }},
    advancement_real_rate_unit: '{{ $calendar->advancement_real_rate_unit ?? "minutes" }}',
    advancement_rate: {{ $calendar->advancement_rate ?? 1 }},
    advancement_rate_unit: '{{ $calendar->advancement_rate_unit ?? "minutes" }}',
    advancement_webhook_url: '{{ $calendar->advancement_webhook_url }}',
    advancement_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

window.dispatchEvent(
    new CustomEvent('calendar-loaded', {
        detail: {
            hash,
            calendar_name,
            calendar_id,
            static_data,
            dynamic_data,
            is_linked,
            has_parent,
            parent_hash,
            parent_offset,
            events,
            event_categories,
            last_static_change,
            last_dynamic_change,
            advancement
        }
    })
)
