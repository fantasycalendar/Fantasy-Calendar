// This file is technically Javascript.
// It's... Not permanent. I hope.

@if(Auth::check() && $calendar->users->contains(Auth::user()))
    window.Perms = new Perms({{Auth::user() ? Auth::user()->id : "null"}}, '{{ $calendar->users->find(Auth::user())->pivot->user_role }}')
@else
    window.Perms = new Perms({{Auth::user() ? Auth::user()->id : "null"}}, 'observer');
@endif

hash = "{{ $calendar->hash }}";

calendar_name = "{!! $calendar->name !!}";
calendar_id = {{ $calendar->id }};
static_data = {!! json_encode($calendar->static_data) !!};
dynamic_data = {!! json_encode($calendar->dynamic_data) !!};

is_linked = {!! $calendar->isLinked() ? "true" : "null" !!};
has_parent = {!! $calendar->parent == null ? "null" : "true" !!};
parent_hash = {!! $calendar->parent != null ? '"'.$calendar->parent->hash.'"' : "null" !!};
parent_offset = {!! $calendar->parent != null ? $calendar->parent_offset : "null" !!};

events = {!! json_encode($calendar->events); !!}
event_categories = {!! json_encode($calendar->event_categories); !!}

last_static_change = new Date("{{ $calendar->last_static_change }}")
last_dynamic_change = new Date("{{ $calendar->last_dynamic_change }}")
