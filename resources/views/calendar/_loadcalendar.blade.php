// This file is technically Javascript.
// It's... Not permanent. I hope.

hash = "{{ $calendar->hash }}";

calendar_name = "{!! $calendar->name !!}";
calendar_id = "{{ $calendar->id }}";
static_data = {!! json_encode($calendar->static_data) !!};
dynamic_data = {!! json_encode($calendar->dynamic_data) !!};
events = {!! json_encode($calendar->events); !!}
event_categories = {!! json_encode($calendar->event_categories); !!}

link_data = {
    master_hash: "{!! $calendar->master_hash !!}",
    children: {!! $calendar->children !!}
};

last_static_change = new Date("{{ $calendar->last_static_change }}")
last_dynamic_change = new Date("{{ $calendar->last_dynamic_change }}")
