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
window.static_data = @js(json_encode($calendar->static_data));
window.dynamic_data = @js(json_encode($calendar->dynamic_data));

window.is_linked = @js($calendar->isLinked() ? "true" : "null");
window.has_parent = @js($calendar->parent == null ? "null" : "true");
window.parent_hash = @js($calendar->parent);
window.parent_offset = @js($calendar->parent);

window.events = @js(json_encode($calendar->events));
window.event_categories = @js(json_encode($calendar->event_categories));

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
            window.hash,
            window.calendar_name,
            window.calendar_id,
            window.static_data,
            window.dynamic_data,
            window.is_linked,
            window.has_parent,
            window.parent_hash,
            window.parent_offset,
            window.events,
            window.event_categories,
            window.last_static_change,
            window.last_dynamic_change,
            window.advancement
        }
    })
)
