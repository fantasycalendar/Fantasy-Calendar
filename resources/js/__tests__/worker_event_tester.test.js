import { describe, it, expect, beforeAll, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * The event tester worker's onmessage is async, so a failure inside it is an
 * unhandled rejection: it never reaches the page's Worker.onerror. The worker
 * must report failures back as a message, or the page waits forever.
 */
const gregorian = JSON.parse(readFileSync(
    resolve(__dirname, '../../../database/seeders/presets/gregorian.json'),
    'utf-8',
));

describe('event tester worker', () => {
    beforeAll(async () => {
        // Worker globals.
        globalThis.onmessage = null;
        globalThis.postMessage = vi.fn();
        await import('../webworkers/worker_event_tester.js');
    });

    it('posts an error message when the test run fails', async () => {
        const static_data = structuredClone(gregorian.static_data);
        // No month ever exists, so generating the requested years fails.
        for (const timespan of static_data.year_data.timespans) {
            timespan.interval = 1000;
            timespan.offset = 999;
        }

        await globalThis.onmessage({
            data: {
                calendar_name: 'Test',
                static_data,
                dynamic_data: structuredClone(gregorian.dynamic_data),
                events: [],
                event_categories: [],
                owner: true,
                start_year: 2020,
                end_year: 2021,
                callback: false,
                event_id: 0,
                build_seasons: false,
            },
        });

        expect(globalThis.postMessage).toHaveBeenLastCalledWith({ error: expect.any(String) });
    });
});
