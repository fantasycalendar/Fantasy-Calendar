import { describe, it, expect } from 'vitest';
import { convert_year, unconvert_year, clone } from '../calendar/calendar_functions';

describe('convert_year', () => {
    it('is a no-op when year_zero_exists is true', () => {
        const sd = { settings: { year_zero_exists: true } };
        expect(convert_year(sd, 0)).toBe(0);
        expect(convert_year(sd, 1)).toBe(1);
        expect(convert_year(sd, -1)).toBe(-1);
        expect(convert_year(sd, 2020)).toBe(2020);
    });

    it('subtracts 1 from positive years when year_zero_exists is false', () => {
        const sd = { settings: { year_zero_exists: false } };
        expect(convert_year(sd, 1)).toBe(0);
        expect(convert_year(sd, 2)).toBe(1);
        expect(convert_year(sd, 2020)).toBe(2019);
    });

    it('leaves negative years unchanged when year_zero_exists is false', () => {
        const sd = { settings: { year_zero_exists: false } };
        expect(convert_year(sd, -1)).toBe(-1);
        expect(convert_year(sd, -100)).toBe(-100);
    });
});

describe('unconvert_year', () => {
    it('is a no-op when year_zero_exists is true', () => {
        const sd = { settings: { year_zero_exists: true } };
        expect(unconvert_year(sd, 0)).toBe(0);
        expect(unconvert_year(sd, 1)).toBe(1);
        expect(unconvert_year(sd, -1)).toBe(-1);
    });

    it('adds 1 to non-negative years when year_zero_exists is false', () => {
        const sd = { settings: { year_zero_exists: false } };
        expect(unconvert_year(sd, 0)).toBe(1);
        expect(unconvert_year(sd, 1)).toBe(2);
        expect(unconvert_year(sd, 2019)).toBe(2020);
    });

    it('leaves negative years unchanged when year_zero_exists is false', () => {
        const sd = { settings: { year_zero_exists: false } };
        expect(unconvert_year(sd, -1)).toBe(-1);
        expect(unconvert_year(sd, -100)).toBe(-100);
    });

    it('round-trips with convert_year', () => {
        const sd = { settings: { year_zero_exists: false } };
        for (const year of [-100, -1, 1, 2, 100, 2020]) {
            expect(unconvert_year(sd, convert_year(sd, year))).toBe(year);
        }
    });
});

describe('clone', () => {
    it('deep clones an object', () => {
        const original = { a: 1, b: { c: 2 } };
        const cloned = clone(original);
        expect(cloned).toEqual(original);
        expect(cloned).not.toBe(original);
        expect(cloned.b).not.toBe(original.b);
    });
});
