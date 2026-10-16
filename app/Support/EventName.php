<?php

namespace App\Support;

/**
 * Event names are plain text. Every place that renders them either uses a
 * text binding (x-text, Blade {{ }}) or escapes at render time, so names are
 * stored decoded: no HTML entities, and no markup.
 *
 * Older clients entity-encoded names before saving them ("Rock &amp; Roll"),
 * which text bindings then displayed literally. normalize() undoes that and
 * removes complete tags, while keeping plain-text uses of "<" such as "<3" or
 * "Level <5" (which PHP's strip_tags would truncate).
 */
class EventName
{
    // A complete tag: "<", an optional "/", a letter, then anything up to ">".
    private const TAG = '/<\/?[a-zA-Z][^<>]*>/';

    // Enough for any real-world nesting; guarantees termination.
    private const MAX_PASSES = 10;

    public static function normalize(mixed $name): mixed
    {
        if (!is_string($name)) {
            return $name;
        }

        for ($pass = 0; $pass < self::MAX_PASSES; $pass++) {
            $next = preg_replace(self::TAG, '', html_entity_decode($name, ENT_QUOTES | ENT_HTML5, 'UTF-8'));

            if ($next === $name) {
                break;
            }

            $name = $next;
        }

        return $name;
    }
}
