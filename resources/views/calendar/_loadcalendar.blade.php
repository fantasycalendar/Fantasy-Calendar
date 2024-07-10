// This file is technically Javascript.
// It's... Not permanent. I hope.

window.Perms = new Perms(
    @js(Auth::user()?->id),
    @js(!$calendar || $calendar->owned),
    @js(strtolower(Auth::user()->paymentLevel() ?? 'free')),
    @js($calendar->users->find(Auth::user())?->pivot?->user_role ?? 'guest')
);

window.dark_theme = @js(auth()->user()?->setting('dark_theme') ?? true);

window.hash = @js($calendar->hash);

window.calendar_name = @js($calendar->name);
window.calendar_id = @js($calendar->id);
window.static_data = @js($calendar->static_data);
window.dynamic_data = @js($calendar->dynamic_data);

window.is_linked = @js($calendar->isLinked() ? "true" : "null");
window.has_parent = @js($calendar->parent == null ? "null" : "true");
window.parent_hash = @js($calendar->parent?->hash);
window.parent_offset = @js($calendar->parent_offset);

window.events = @js($calendar->events);
window.event_categories = @js($calendar->event_categories);

window.last_static_change = new Date("@js($calendar->last_static_change)")
window.last_dynamic_change = new Date("@js($calendar->last_dynamic_change)")

window.advancement = {
    advancement_enabled: @js($calendar->advancement_enabled),
    advancement_real_rate: @js($calendar->advancement_real_rate ?? 1),
    advancement_real_rate_unit: @js($calendar->advancement_real_rate_unit ?? "minutes"),
    advancement_rate: @js($calendar->advancement_rate ?? 1),
    advancement_rate_unit: @js($calendar->advancement_rate_unit ?? "minutes"),
    advancement_webhook_url: @js($calendar->advancement_webhook_url),
    advancement_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

window.dispatchEvent(
    new CustomEvent('calendar-loaded', {
        detail: {
            hash: window.hash,
            calendar_name: window.calendar_name,
            calendar_id: window.calendar_id,
            static_data: window.static_data,
            dynamic_data: window.dynamic_data,
            is_linked: window.is_linked,
            has_parent: window.has_parent,
            parent_hash: window.parent_hash,
            parent_offset: window.parent_offset,
            events: window.events,
            event_categories: window.event_categories,
            last_static_change: window.last_static_change,
            last_dynamic_change: window.last_dynamic_change,
            advancement: window.advancement
        }
    })
)
