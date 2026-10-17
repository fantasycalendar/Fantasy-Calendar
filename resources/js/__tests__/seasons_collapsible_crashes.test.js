import { describe, it, expect } from 'vitest';
import seasonsCollapsible from '../calendar/seasons_collapsible.js';

function makeComponent(seasons, settings = {}) {
    const component = seasonsCollapsible();
    component.seasons = seasons;
    component.settings = { color_enabled: true, ...settings };
    return component;
}

describe('season colors', () => {
    it('can be enabled with a single season', () => {
        const component = makeComponent([{ name: 'Summer' }]);

        expect(() => component.seasonColorChanged()).not.toThrow();
        expect(component.seasons[0].color).toEqual(['#e74d0e', '#e74d0e']);
    });

    it('blend each season into the next, wrapping around to the first', () => {
        const component = makeComponent([{ name: 'Winter' }, { name: 'Spring' }, { name: 'Summer' }]);

        component.seasonColorChanged();

        expect(component.seasons.map(season => season.color)).toEqual([
            ['#0bcfe9', '#1ee313'],
            ['#1ee313', '#e74d0e'],
            ['#e74d0e', '#0bcfe9'],
        ]);
    });

    it('keep a custom season\'s random color the same on both sides of it', () => {
        const component = makeComponent([{ name: 'Dry' }, { name: 'Wet' }]);

        component.seasonColorChanged();

        const [dry, wet] = component.seasons.map(season => season.color);
        expect(dry[1]).toBe(wet[0]);
        expect(wet[1]).toBe(dry[0]);
    });

    it('are removed when disabled', () => {
        const component = makeComponent([{ name: 'Summer', color: ['#000000', '#ffffff'] }], { color_enabled: false });

        component.seasonColorChanged();

        expect(component.seasons[0].color).toBeUndefined();
    });
});

describe('season type selection', () => {
    it('swaps types with the season that already had the chosen type', () => {
        const component = makeComponent([
            { name: 'A', type: 'winter' },
            { name: 'B', type: 'summer' },
        ]);

        component.ensureMutualTypeExclusivity('summer', 0);

        expect(component.seasons.map(season => season.type)).toEqual(['summer', 'winter']);
    });

    it('just sets the type when no other season has it', () => {
        const component = makeComponent([
            { name: 'A' },
            { name: 'B', type: 'winter' },
        ]);

        expect(() => component.ensureMutualTypeExclusivity('summer', 0)).not.toThrow();
        expect(component.seasons.map(season => season.type)).toEqual(['summer', 'winter']);
    });
});
