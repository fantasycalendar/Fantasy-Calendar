import { clone } from "./calendar_functions";

/**
 * Change detection for the event editor.
 *
 * The editor snapshots an event when it opens and compares against it to decide
 * whether there are unsaved changes. Two fields get rewritten by their own UI
 * bindings independently of user input, so they are normalized before comparing
 * to avoid false positives:
 *
 *   - `description`: the Quill rich-text editor re-serializes HTML into its
 *     canonical form (e.g. dropping a trailing `<br>` inside a `<p>`) and writes
 *     it back via its x-modelable binding.
 *   - `event_category_id`: the `x-model.number` category binding coerces an
 *     uncategorized event's `null` to `-1`.
 */

/**
 * Collapse the cosmetic differences Quill introduces when it re-serializes a
 * description, without hiding real text/markup edits:
 *
 *   - trims surrounding whitespace
 *   - drops a single outer `<p>...</p>` block wrapper around bare text
 *   - drops a trailing `<br>`
 *   - collapses runs of whitespace
 */
export function normalizeDescription(description) {
    if (description === null || description === undefined) {
        return "";
    }

    let normalized = String(description).trim();

    // Quill wraps bare text in a single <p> block; unwrap one outer <p>.
    const outerParagraph = normalized.match(/^<p>([\s\S]*)<\/p>$/i);
    if (outerParagraph) {
        normalized = outerParagraph[1];
    }

    // Quill drops a trailing <br>.
    normalized = normalized.replace(/<br\s*\/?>\s*$/i, "");

    // Collapse insignificant whitespace differences.
    normalized = normalized.replace(/\s+/g, " ").trim();

    return normalized;
}

/**
 * Normalize the category id so the UI's `null -> -1` coercion for uncategorized
 * events is not treated as a change.
 */
export function normalizeCategoryId(categoryId) {
    if (categoryId === null || categoryId === undefined || categoryId === -1) {
        return -1;
    }
    return Number(categoryId);
}

/**
 * Returns true when `current` differs meaningfully from the `initial` snapshot.
 *
 * Only the meaningful fields are compared: `name`, `description` (normalized),
 * `event_category_id` (normalized), `settings`, and `data`. `current.data` is
 * expected to already be the output of `create_event_data()`, matching how the
 * snapshot's `.data` was built.
 *
 * When there is no snapshot yet, nothing has changed.
 */
export function eventHasChanged(initial, current) {
    if (!initial) {
        return false;
    }

    const a = normalizeForComparison(initial);
    const b = normalizeForComparison(current);

    return !Object.compare(a, b);
}

function normalizeForComparison(event) {
    const normalized = clone(event);

    return {
        name: normalized.name ?? "",
        description: normalizeDescription(normalized.description),
        event_category_id: normalizeCategoryId(normalized.event_category_id),
        settings: normalized.settings ?? {},
        data: normalized.data ?? {},
    };
}
