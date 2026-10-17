// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import locationsCollapsibleFactory from '../calendar/locations_collapsible.js';

/**
 * Deleting a custom location must keep `current_location` (an index into the
 * custom `locations` array, stored as a numeric string) pointing at the correct
 * location:
 *   - deleting a location BEFORE the current one shifts the current index down,
 *   - deleting the CURRENT location reassigns to a sensible neighbour,
 *   - deleting a location AFTER the current one leaves it untouched,
 *   - deleting the LAST remaining custom location falls back to presets.
 *
 * Previously `removeLocation` just spliced and left `current_location` stale,
 * which is why deleting the current location was disabled outright.
 */
function makeComponent(locations, currentLocation) {
    const component = locationsCollapsibleFactory();
    component.locations = locations;
    component.current_location = String(currentLocation);
    component.using_custom_location = true;
    return component;
}

const loc = (name) => ({ name });

describe('LocationsCollapsible.removeLocation', () => {
    it('shifts current_location down when deleting a location before it', () => {
        const c = makeComponent([loc('A'), loc('B'), loc('C')], 2); // current = C
        c.removeLocation(0); // delete A

        expect(c.locations.map((l) => l.name)).toEqual(['B', 'C']);
        expect(c.current_location).toBe('1'); // C is now at index 1
    });

    it('leaves current_location untouched when deleting a location after it', () => {
        const c = makeComponent([loc('A'), loc('B'), loc('C')], 0); // current = A
        c.removeLocation(2); // delete C

        expect(c.locations.map((l) => l.name)).toEqual(['A', 'B']);
        expect(c.current_location).toBe('0'); // A still at index 0
    });

    it('reassigns to the previous location when deleting the current one', () => {
        const c = makeComponent([loc('A'), loc('B'), loc('C')], 2); // current = C
        c.removeLocation(2); // delete the current (C)

        expect(c.locations.map((l) => l.name)).toEqual(['A', 'B']);
        expect(c.current_location).toBe('1'); // fell back to B
    });

    it('reassigns to the new first location when deleting the current first one', () => {
        const c = makeComponent([loc('A'), loc('B'), loc('C')], 0); // current = A
        c.removeLocation(0); // delete the current first (A)

        expect(c.locations.map((l) => l.name)).toEqual(['B', 'C']);
        expect(c.current_location).toBe('0'); // new first (was B)
    });

    it('falls back to presets when the last custom location is deleted', () => {
        const c = makeComponent([loc('Only')], 0);
        c.removeLocation(0);

        expect(c.locations).toEqual([]);
        expect(c.using_custom_location).toBe(false);
        expect(c.current_location).toBe('0');
    });
});
