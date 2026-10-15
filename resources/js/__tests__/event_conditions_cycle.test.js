// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import eventConditionsComponent from '../calendar/event_conditions_component.js';

/**
 * Cycle conditions store a [cycle_index, name_index] pair. The editor renders a
 * single optgroup select for them, so each option must carry BOTH indices, and
 * a change must write both back into the condition's values.
 */

function makeComponent() {
    const component = eventConditionsComponent();
    component.$store = {
        calendar: {
            static_data: {
                cycles: {
                    data: [
                        { names: ['Rat', 'Ox', 'Tiger'] },
                        { names: ['Wood', 'Fire'] },
                    ],
                },
            },
        },
    };
    component.$dispatch = vi.fn();
    component.$nextTick = vi.fn();
    return component;
}

function optionValues(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    return [...container.querySelectorAll('option')].map(option => ({
        value: option.value,
        selected: option.hasAttribute('selected'),
    }));
}

// Minimal stand-in for the condition-type <select> change event target.
function typeSelect(group, value) {
    return {
        value,
        selectedIndex: 0,
        options: [{ parentElement: { label: group } }],
        dataset: {},
    };
}

describe('Cycle conditions', () => {
    let component;

    beforeEach(() => {
        window.sanitizeHtml = (value) => value;
        component = makeComponent();
    });

    it('encodes both the cycle index and the name index in each option', () => {
        component.source = [['Cycle', '0', ['1', '0']]];
        const condition = component.condition_tree[0];

        const options = optionValues(component.renderConditionOptions(condition));

        expect(options.map(option => option.value)).toEqual(['0,0', '0,1', '0,2', '1,0', '1,1']);
    });

    it('marks the stored pair as selected', () => {
        component.source = [['Cycle', '0', ['1', '0']]];
        const condition = component.condition_tree[0];

        const selected = optionValues(component.renderConditionOptions(condition))
            .filter(option => option.selected)
            .map(option => option.value);

        expect(selected).toEqual(['1,0']);
    });

    it('does not bind x-model to a property of a primitive value', () => {
        component.source = [['Cycle', '0', ['0', '0']]];
        const condition = component.condition_tree[0];

        const html = component.renderConditionOptions(condition);

        expect(html).not.toContain('.value"');
    });

    it('writes both indices back when the selection changes, and they serialize', () => {
        component.source = [['Cycle', '0', ['0', '0']]];
        const condition = component.condition_tree[0];

        component.setCycleValue(condition.id, '1,1');

        expect(component.source).toEqual([['Cycle', '0', ['1', '1']]]);
        expect(component.$dispatch).toHaveBeenCalledWith('conditions-manually-changed');
    });

    it('drops stale values when switching type even if the comparison index is unchanged', () => {
        component.source = [['Date', '0', ['2026', '6', '10']]];
        const condition = component.condition_tree[0];

        // "Date is exactly" (0) -> "Cycle is exactly" (0): same comparison index.
        component.handleConditionTypeChanged({ target: typeSelect('Cycle', '0') }, condition.id);
        component.renderConditionOptions(condition);

        expect(component.source).toEqual([['Cycle', '0', ['0', '0']]]);
    });

    it('keeps values when re-selecting the same type and comparison', () => {
        component.source = [['Cycle', '0', ['1', '2']]];
        const condition = component.condition_tree[0];

        component.handleConditionTypeChanged({ target: typeSelect('Cycle', '0') }, condition.id);

        expect(component.source).toEqual([['Cycle', '0', ['1', '2']]]);
    });

    it('defaults a fresh cycle condition to the first option so it never saves empty', () => {
        component.source = [['Cycle', '0', []]];
        const condition = component.condition_tree[0];

        const selected = optionValues(component.renderConditionOptions(condition))
            .filter(option => option.selected)
            .map(option => option.value);

        expect(selected).toEqual(['0,0']);
        expect(component.source).toEqual([['Cycle', '0', ['0', '0']]]);
    });
});
