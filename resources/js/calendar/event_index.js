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

/**
 * Stored events reference other events indirectly: an `Events` condition's
 * first value is an index into `data.connected_events`, which holds the global
 * event index. The editor works on global indices; this converts stored
 * conditions to that form (recursing into groups), without mutating them.
 */
export function conditionsWithGlobalEventIndices(conditions, connectedEvents = []) {
    return (conditions ?? []).map((condition) => {
        if (Array.isArray(condition[1])) {
            return [condition[0], conditionsWithGlobalEventIndices(condition[1], connectedEvents)];
        }

        if (condition.length === 3 && condition[0] === "Events") {
            const values = [...condition[2]];
            const connectedIndex = Number(values[0]);

            if (connectedIndex < connectedEvents.length) {
                values[0] = String(connectedEvents[connectedIndex]);
            }

            return [condition[0], condition[1], values];
        }

        return condition;
    });
}
