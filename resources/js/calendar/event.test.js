import { expect, test } from 'vitest'
import CalendarEvent from "@/calendar/event";

test("simple events", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "simple",
        date: { year: 100, month: 1, day: 1 }
    });

    expect(event.evaluate({ year: 100, month: 1, day: 1 })).toBe(true);
    expect(event.evaluate({ year: 101, month: 1, day: 1 })).toBe(false);

});

test("complex events: monthly", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "complex",
        conditions: [
            {
                type: "condition",
                target: "month",
                operand: "==",
                value: 2
            }
        ]
    });

    expect(event.evaluate({ month: 1 })).toBe(false);
    expect(event.evaluate({ month: 2 })).toBe(true);
    expect(event.evaluate({ month: 3 })).toBe(false);

});

test("complex events: every day after day in month", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "complex",
        conditions: [
            {
                type: "condition",
                target: "month",
                operand: "==",
                value: 2
            },
            { type: "operator", operator: "and" },
            {
                type: "condition",
                target: "day",
                operand: ">=",
                value: 15
            },
        ]
    });

    expect(event.evaluate({ month: 2, day: 14 })).toBe(false);
    expect(event.evaluate({ month: 2, day: 15 })).toBe(true);
    expect(event.evaluate({ month: 2, day: 16 })).toBe(true);
    expect(event.evaluate({ month: 2, day: 17 })).toBe(true);
    expect(event.evaluate({ month: 2, day: 18 })).toBe(true);
    expect(event.evaluate({ month: 2, day: 19 })).toBe(true);
    expect(event.evaluate({ month: 3, day: 1 })).toBe(false);

});

test("complex event: count group", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "complex",
        conditions: [
            {
                type: "group",
                groupType: "count",
                targetCount: 2,
                conditions: [
                    {
                        type: "condition",
                        target: "moons.0.phase",
                        operand: "==",
                        value: 0
                    },
                    {
                        type: "condition",
                        target: "moons.1.phase",
                        operand: "==",
                        value: 0
                    },
                    {
                        type: "condition",
                        target: "moons.2.phase",
                        operand: "==",
                        value: 0
                    },
                ]
            }
        ]
    });

    expect(event.evaluate({ moons: [
        { phase: 5 }, { phase: 2 }, { phase: 5 },
    ]})).toBe(false);

    expect(event.evaluate({ moons: [
        { phase: 0 }, { phase: 2 }, { phase: 5 },
    ]})).toBe(false);

    expect(event.evaluate({ moons: [
        { phase: 1 }, { phase: 0 }, { phase: 0 },
    ]})).toBe(true);

    expect(event.evaluate({ moons: [
        { phase: 0 }, { phase: 0 }, { phase: 0 },
    ]})).toBe(true);

});


test("complex events: every even day", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "complex",
        conditions: [
            {
                type: "condition",
                target: "dateId",
                operand: "%",
                value: 2,
                offset: 0
            }
        ]
    });

    expect(event.evaluate({ dateId: 0 })).toBe(true);
    expect(event.evaluate({ dateId: 1 })).toBe(false);
    expect(event.evaluate({ dateId: 2 })).toBe(true);
    expect(event.evaluate({ dateId: 3 })).toBe(false);
    expect(event.evaluate({ dateId: 4 })).toBe(true);
    expect(event.evaluate({ dateId: 5 })).toBe(false);
    expect(event.evaluate({ dateId: 6 })).toBe(true);

});



test("complex events: every odd  day", () => {

    const event = CalendarEvent.make({
        name: "Test Event",
        type: "complex",
        conditions: [
            {
                type: "condition",
                target: "dateId",
                operand: "%",
                value: 2,
                offset: 1
            }
        ]
    });

    expect(event.evaluate({ dateId: 0 })).toBe(false);
    expect(event.evaluate({ dateId: 1 })).toBe(true);
    expect(event.evaluate({ dateId: 2 })).toBe(false);
    expect(event.evaluate({ dateId: 3 })).toBe(true);
    expect(event.evaluate({ dateId: 4 })).toBe(false);
    expect(event.evaluate({ dateId: 5 })).toBe(true);
    expect(event.evaluate({ dateId: 6 })).toBe(false);

});
