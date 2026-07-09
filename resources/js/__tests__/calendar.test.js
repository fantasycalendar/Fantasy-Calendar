// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import Calendar from '../calendar.js';

function loadJSON(filepath) {
    if (!existsSync(filepath)) return null;
    return JSON.parse(readFileSync(filepath, 'utf-8'));
}

const seederDir = resolve(__dirname, '../../../database/seeders/presets');
const gregorian = loadJSON(resolve(seederDir, 'gregorian.json'));

describe('Calendar.rebuild_calendar', () => {

    let calendar;

    beforeEach(() => {
        calendar = new Calendar();
        // Minimal state for rebuild_calendar(): an invalid static_data with no
        // timespans, which makes calendar_data_generator.__init__ fail and the
        // run() promise reject with { success: false, errors: [...] }.
        calendar.static_data = structuredClone(gregorian.static_data);
        calendar.static_data.year_data.timespans = [];
        calendar.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar.preview_date = { follow: true };
        calendar.events = [];
        calendar._event_categories = [];
        calendar.perms = { player_at_least: () => true };
    });

    it('surfaces init errors via a notify dispatch instead of rejecting unhandled', async () => {
        const dispatched = [];
        calendar.dispatch = vi.fn((name, detail) => dispatched.push({ name, detail }));

        // Should resolve (the rejection is caught and surfaced), not reject.
        await expect(calendar.rebuild_calendar()).resolves.not.toThrow();

        const notify = dispatched.find(d => d.name === 'notify');
        expect(notify, 'expected a notify dispatch surfacing the init error').toBeTruthy();
        expect(notify.detail.type).toBe('error');
    });
});

describe('Calendar.update re-render triggers', () => {

    let calendar;

    beforeEach(() => {
        // A VALID calendar so update() reaches the rebuild/update-epochs branch.
        calendar = new Calendar();
        calendar.static_data = structuredClone(gregorian.static_data);
        calendar.dynamic_data = structuredClone(gregorian.dynamic_data);
        calendar.preview_date = { follow: true };
        calendar.events = [];
        calendar._event_categories = [];
        calendar.perms = { player_at_least: () => true };

        calendar.dispatch = vi.fn();
        calendar.rebuild_calendar = vi.fn();
        calendar.update_epochs = vi.fn();

        // Prime the store: the first update() always rebuilds (initial reconcile
        // + date-manager setup). Clear the spies so subsequent assertions reflect
        // only the change under test.
        calendar.update({});
        calendar.rebuild_calendar.mockClear();
        calendar.update_epochs.mockClear();
    });

    it('does not rebuild on a no-op update once primed (baseline)', () => {
        calendar.update({});

        expect(calendar.rebuild_calendar).not.toHaveBeenCalled();
    });

    it('rebuilds the calendar when events change (so new season events render immediately)', () => {
        calendar.update({ events: [{ name: 'Summer Solstice', sort_by: 0 }] });

        expect(calendar.rebuild_calendar).toHaveBeenCalled();
    });

    it('rebuilds the calendar when cycles change (so the cycle subheader appears immediately)', () => {
        calendar.update({ 'static_data.cycles.data': [{ names: ['Year of the Rat'] }] });

        expect(calendar.rebuild_calendar).toHaveBeenCalled();
    });
});
