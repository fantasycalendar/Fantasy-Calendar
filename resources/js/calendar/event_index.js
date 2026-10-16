/**
 * Resolve the store index of the event an `event-*` dispatch refers to.
 *
 * Callers pass either `event_id` (an array index) or `event_db_id`. On the
 * create page events have no DB id yet, so the events manager addresses them
 * by a synthetic `new-${index}` id that encodes the array index.
 *
 * Returns -1 when nothing matches.
 */
export function resolveEventIndex(events, detail) {
    if (detail.event_db_id === undefined) {
        return events[detail.event_id] === undefined ? -1 : detail.event_id;
    }

    let index = events.findIndex((event) => event.id === detail.event_db_id);

    if (index === -1 && typeof detail.event_db_id === "string" && detail.event_db_id.startsWith("new-")) {
        index = Number(detail.event_db_id.slice("new-".length));
    }

    return events[index] === undefined ? -1 : index;
}
