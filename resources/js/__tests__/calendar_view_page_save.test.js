// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * The view page saves dynamic_data whenever the calendar updates. Only users
 * the server lets change the date (owners/co-owners) should save, and only
 * when dynamic_data actually changed — not on every month/day navigation.
 */
const ajax = vi.hoisted(() => ({
    update_dynamic: vi.fn(),
    get_dynamic_data: vi.fn(),
    check_last_change: vi.fn(),
}));

vi.mock('../calendar/calendar_ajax_functions.js', () => ajax);
vi.mock('../calendar/calendar_manager.js', () => ({
    bind_calendar_events: vi.fn(),
    registerMousemoveCallback: vi.fn(),
}));

const { default: viewPageFactory } = await import('../calendar/calendar_view_page.js');

function makePage({ coOwner }) {
    const page = viewPageFactory({});
    page.$store = {
        calendar: {
            hash: 'abc',
            dynamic_data: { year: 2026, timespan: 3, day: 6, epoch: 100 },
            perms: { player_at_least: (level) => coOwner && level === 'co-owner' },
        },
    };
    page.remember_saved_dynamic_data();
    return page;
}

describe('view page dynamic_data saving', () => {
    beforeEach(() => {
        ajax.update_dynamic.mockClear();
    });

    it('does not save when the date did not change (e.g. preview navigation)', () => {
        const page = makePage({ coOwner: true });

        page.calendar_updated();

        expect(ajax.update_dynamic).not.toHaveBeenCalled();
    });

    it('saves when an owner/co-owner changes the date', () => {
        const page = makePage({ coOwner: true });
        page.$store.calendar.dynamic_data.day = 7;

        page.calendar_updated();
        page.calendar_updated();

        expect(ajax.update_dynamic).toHaveBeenCalledTimes(1);
        expect(ajax.update_dynamic).toHaveBeenCalledWith('abc');
    });

    it('never saves for guests and players', () => {
        const page = makePage({ coOwner: false });
        page.$store.calendar.dynamic_data.day = 7;

        page.calendar_updated();

        expect(ajax.update_dynamic).not.toHaveBeenCalled();
    });

    it('does not echo a date that came from the server back to it', () => {
        const page = makePage({ coOwner: true });
        page._applying_server_update = true;
        page.$store.calendar.dynamic_data.day = 9;

        page.calendar_updated();
        page.calendar_updated();

        expect(ajax.update_dynamic).not.toHaveBeenCalled();
    });
});
