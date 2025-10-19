import _ from "lodash";
import { condition_mapping, moon_phases } from "./calendar_variables.js";
import { ordinal_suffix_of } from "./calendar_functions.js";

export default () => ({

    condition_tree: [],
    conditionsHashmap: {},
    sortableMap: {},

    addCondition(add_to_id) {
        let condition = this.processCondition(["Year", "0", [0]], add_to_id);
        this.conditionsHashmap[condition.id] = condition;

        if (add_to_id) {
            let parentGroup = this.conditionsHashmap[add_to_id];

            if (parentGroup.children.length) {
                parentGroup.children[parentGroup.children.length - 1].operator = "&&"
            }
            parentGroup.children.push(condition);
        } else {
            if (this.condition_tree.length) {
                this.condition_tree[this.condition_tree.length - 1].operator = "&&"
            }

            this.condition_tree.push(condition);
        }
    },

    deleteElement(element_id) {
        let element = this.conditionsHashmap[element_id];
        let siblings = this.conditionsHashmap[element.parent_id]?.children
            ?? this.condition_tree;

        let element_index = siblings.indexOf(element);

        if (siblings.length > 1 && element_index === siblings.length - 1) {
            siblings[element_index - 1].operator = false
        }

        siblings.splice(element_index, 1);

        if (element.parent_id && siblings.length === 0) {
            this.deleteElement(element.parent_id);
        }
    },

    addGroup(add_to_id = null) {
        let group = this.processGroup(["", []], add_to_id, 0);
        this.conditionsHashmap[group.id] = group;

        if (add_to_id) {
            let parentGroup = this.conditionsHashmap[add_to_id];

            if (parentGroup.children.length) {
                parentGroup.children[parentGroup.children.length - 1].operator = "&&"
            }
            parentGroup.children.push(group);
        } else {
            if (this.condition_tree.length) {
                this.condition_tree[this.condition_tree.length - 1].operator = "&&"
            }

            this.condition_tree.push(group);
        }

        this.addCondition(group.id);
    },

    set source(value) {
        this.condition_tree = this.deserializeConditionsData(_.cloneDeep(value));
    },

    get source() {
        return this.serializeConditionsData(this.condition_tree);
    },

    serializeConditionsData(elements){
        let stack = [];
        for (let element of elements) {
            switch (element.data_type) {
                case 'group':
                    let group = [element.value, []];
                    stack.push(group);
                    if (element.children.length > 0) {
                        group[1] = this.serializeConditionsData(element.children);
                    }
                    if (element.operator) {
                        stack.push([element.operator]);
                    }
                    break;
                case 'condition':
                    let condition = [
                        element.type,
                        element.comparison.toString(),
                        element.type === 'Moons'
                            ? [element.moon_index.toString(), ...element.values]
                            : element.values
                    ];
                    stack.push(condition);
                    if (element.operator) {
                        stack.push([element.operator]);
                    }
                    break;
            }
        }

        return stack;
    },

    deserializeConditionsData(elements, parentId = null) {
        let stack = [];
        let parent_index = 0;
        for (let element of elements) {
            let processedElement;

            let isGroup = Array.isArray(element[1]);
            let isCondition = element.length > 1;
            let isOperator = element.length === 1;

            if (isGroup) {
                processedElement = this.processGroup(element, parentId, parent_index)
                parent_index++;
            } else if (isCondition) {
                processedElement = this.processCondition(element, parentId)
                parent_index++;
            } else if (isOperator) {
                stack[stack.length - 1].operator = element[0];
                continue;
            }

            this.conditionsHashmap[processedElement.id] = processedElement;
            stack.push(processedElement);
        }

        return stack;
    },

    processGroup(data, parent_id, parent_index) {
        let id = _.uniqueId("elem");
        let type;
        let minimum = null;

        if (data[0] === "") {
            type = "normal";
        } else if (data[0] === "!") {
            type = "not";
        } else {
            type = "num";
            minimum = Number(data[0]);
        }

        return {
            id,
            parent_id,
            parent_index,
            data_type: "group",
            type,
            minimum,
            value: data[0],
            children: this.deserializeConditionsData(data[1], id),
            operator: false
        }
    },

    processCondition(data, parent_id) {
        return {
            id: _.uniqueId("elem"),
            parent_id,
            data_type: "condition",
            type: data[0],
            comparison: Number(data[1]),
            moon_index: data[0] === "Moons" ? Number(data[2][0]) : 0,
            values: data[0] === "Moons" ? data[2].slice(1) : data[2],
            operator: false
        };
    },

    addInput(condition, input, value_index = 0) {
        if (input[0] === "hidden") {
            return {
                type: input[0],
                value: "1"
            }
        }
        return {
            type: input[0],
            placeholder: input[1] ?? "",
            alt: input[2] ?? "",
            value: condition.values[value_index],
            min: input[4],
            max: input[5]
        }
    },

    addMonthSelect(condition, value_index) {
        return {
            type: "select",
            values: this.$store.calendar.static_data.year_data.timespans.map((month, month_index) => ({
                label: month.name,
                value: month_index,
                selected: Number(condition.values[value_index]) === month_index
            }))
        }
    },

    addDateInputs(condition, conditionInputs) {
        let year = Number(condition.values[0]);
        let month = Number(condition.values[1]);
        let months = this.$store.calendar.get_timespans_in_year_as_select_options(year, true);
        let days = this.$store.calendar.get_days_in_timespan_in_year_as_select_options(year, month);
        return [
            this.addInput(condition, conditionInputs[0]),
            {
                type: "select",
                values: months.map((month, month_index) => ({
                    label: month.name,
                    value: month_index,
                    selected: Number(condition.values[1]) === month_index
                        || (month_index >= months.length - 1)
                }))
            },
            {
                type: "select",
                values: days.map((day, day_index) => ({
                    label: day,
                    value: day_index+1,
                    selected: Number(condition.values[2]) === day_index+1
                        || (day_index >= days.length - 1)
                }))
            }
        ]
    },

    addMoonPhaseSelect(condition, value_index = 0) {
        let selected_moon = this.$store.calendar.static_data.moons[condition.moon_index];
        let phases = Object.keys(moon_phases[selected_moon.granularity]);
        return {
            type: "select",
            values: phases.map((phase, index) => ({
                label: phase,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addCycleSelect(condition, value_index = 0) {
        return {
            type: "select-optgroup",
            values: this.$store.calendar.static_data.cycles.map((cycle, cycle_index) => ({
                label: `${ordinal_suffix_of(cycle_index + 1)} cycle group`,
                value: cycle_index,
                values: cycle.names.map((name, name_index) => ({
                    label: name,
                    value: name_index,
                    selected: Number(condition.values[value_index]) === cycle_index && Number(condition.values[value_index + 1]) === name_index
                }))
            }))
        }
    },

    addEraSelect(condition, value_index = 0) {
        return {
            type: "select",
            values: this.$store.calendar.static_data.eras.map((era, index) => ({
                label: era.name,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addSeasonSelect(condition, value_index = 0) {
        return {
            type: "select",
            values: this.$store.calendar.static_data.seasons.data.map((season, index) => ({
                label: season.name,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addLocationSelect(condition, value_index = 0) {
        return {
            type: "select",
            values: this.$store.calendar.static_data.seasons.locations.map((location, index) => ({
                label: location.name,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addWeekdaySelect(condition, value_index = 0) {
        return {
            type: "select",
            values: this.$store.calendar.static_data.year_data.global_week.map((weekday_name, index) => ({
                label: weekday_name,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addEventsSelect(condition, value_index = 0) {
        return {
            type: "select",
            values: this.$store.calendar.events.map((event, index) => ({
                label: event.name,
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    renderConditionOptions(condition) {
        let inputs = [];

        let conditionInputs = condition_mapping[condition.type][condition.comparison].elements;

        switch (condition.type) {
            case "Month":
                for (let [index, input] of conditionInputs.entries()) {
                    if (input[0] === "select") {
                        inputs.push(this.addMonthSelect(condition, index));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Date":
                inputs = inputs.concat(this.addDateInputs(condition, conditionInputs));
                break;

            case "Moons":
                for (let [index, input] of conditionInputs.entries()) {
                    if (input[0] === "select") {
                        inputs.push(this.addMoonPhaseSelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Season":
                for (let [index, input] of conditionInputs.entries()) {
                    if (input[0] === "select") {
                        inputs.push(this.addSeasonSelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Weekday":
                for (let [index, input] of conditionInputs.entries()) {
                    if (input[0] === "select") {
                        inputs.push(this.addWeekdaySelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Cycle":
                inputs.push(this.addCycleSelect(condition));
                break;

            case "Era":
                inputs.push(this.addEraSelect(condition));
                break;

            case "Location":
                inputs.push(this.addLocationSelect(condition));
                break;

            case "Events":
                for (let [index, input] of conditionInputs.entries()) {
                    if (input[0] === "select") {
                        inputs.push(this.addEventsSelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Era Year":
            case "Random":
            case "Week":
            case "Year":
            case "Day":
            default:
                for (let [index, input] of conditionInputs.entries()) {
                    if (input !== "select") {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;
        }

        return inputs.reduce((html, input, index) => {
            if (input.type === "select-optgroup") {
                html += `<select class='form-control order-${index + 3}' data-event-conditions-manager-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionsHashmap['${condition.id}'].values[${index}].value">`;
                for (let optgroup of input.values) {
                    html += `<optgroup label="${optgroup.label}">`;
                    for (let option of optgroup.values) {
                        html += `<option ${option.selected ? "selected" : ""} value="${option.value}">${option.label}</option>`;
                    }
                    html += `</optgroup>`;
                }
                html += `</select>`;
            } else if (input.type === "select") {
                html += `<select class='form-control order-${index + 3}' data-event-conditions-manager-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionsHashmap['${condition.id}'].values[${index}]">`;
                input.values.forEach(option => {
                    html += `<option ${option.selected ? "selected" : ""} value="${option.value}">${option.label}</option>`;
                });
                html += `</select>`;
            } else {
                html += `<input type="${input.type}" class='form-control order-${index + 3}' data-event-conditions-manager-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionsHashmap['${condition.id}'].values[${index}]" placeholder="${input.placeholder}"`;
                if (input.alt !== undefined) {
                    html += ` alt="${input.alt}"`;
                }
                if (input.min !== undefined) {
                    html += ` min="${input.min}"`;
                }
                if (input.max !== undefined) {
                    html += ` max="${input.max}"`;
                }
                html += `/>`;
            }
            return html;
        }, "");
    },

    handleConditionTypeChanged(event, id) {
        let select = event.target;
        let value = Number(select.value);
        let optGroupValue = select.options[select.selectedIndex].parentElement.label;
        if (this.conditionsHashmap[id].comparison !== value) {
            this.conditionsHashmap[id].values = []
        }
        this.conditionsHashmap[id].comparison = value;
        this.conditionsHashmap[id].type = optGroupValue;
        this.keepFocus(event.target.dataset.id);
    },

    keepFocus(id) {
        this.$nextTick(() => {
            let elem = document.querySelectorAll(`[data-event-conditions-manager-id="${id}"]`)[0];
            if (elem) {
                elem.focus();
            }
        });
    },

    renderSortableElement(element, parent = false) {
        if (element.data_type === "condition") {
            return this.renderCondition(element, parent);
        } else if (element.data_type === "group") {
            return this.renderGroup(element, parent);
        }

        return ``;
    },

    renderCondition(condition, parent) {
        let moon_select = ""
        if (condition.type === "Moons") {
            let moon_options = this.$store.calendar.static_data.moons.reduce((html, moon, index) => {
                let selected = condition.type === "Moons" && condition.moon_index === index ? "selected" : "";
                return html + `<option ${selected} value='${index}'>${moon.name}</option>`;
            }, "");

            moon_select = `
                <select class="form-control moon_select order-1" x-model.lazy.number="conditionsHashmap['${condition.id}'].moon_index" data-event-conditions-manager-id="condition-moon-${condition.id}" @change="keepFocus('condition-moon-${condition.id}')" :class="{ 'hidden': conditionsHashmap['${condition.id}'].type !== 'Moons' }">
                  ${moon_options}
                </select>`;
        }

        let condition_types = Object.entries(condition_mapping).reduce((html, [group, options]) => {
            html += `<optgroup label="${group}">`;
            options.forEach((option, index) => {
                let selected = condition.type === group && condition.comparison === index ? "selected" : "";
                html += `<option ${selected} value="${index}">${option.label}</option>`
            });
            html += `</optgroup>`;
            return html;
        }, "");

        return `
        <li class="condition" data-event-conditions-manager-id="${condition.id}" :key="conditionsHashmap['${condition.id}'].id">
            <div class="condition_container items-center ${condition.type}">
                ${moon_select}
                <select class='form-control condition_type order-2' data-event-conditions-manager-id="condition-type-${condition.id}" @change="handleConditionTypeChanged(event, '${condition.id}')">
                  ${condition_types}
                </select>
                ${this.renderConditionOptions(condition)}
                <div @click="deleteElement('${condition.id}')" class="cursor-pointer order-last ml-2 mr-1.5"><i class="fa fa-trash"></i></div>
            </div>
                ${condition.operator && (!parent || parent.type !== "num") ? this.renderOperator(condition) : ""}
        </li>`;
    },

    renderGroup(group) {

        let children = group.children.reduce((html, child) => {
            return html + this.renderSortableElement(child, group);
        }, "");

        return `
        <li data-event-conditions-manager-id="${group.id}" :key="conditionsHashmap['${group.id}'].id" class="group relative">
            <div class="group_type" type="${group.type}">
                <div class='normal'>
                  <label><input @click="setGroupType('${group.id}', 'normal')" type='radio' ${(group.type === "normal" ? "checked" : "")} name=''>NORMAL</label>
                </div>
                <div class='not'>
                  <label><input @click="setGroupType('${group.id}', 'not')" type='radio' ${(group.type === "not" ? "checked" : "")} name=''>NOT</label>
                </div>
                <div class='num'>
                  <label>
                    <input type='radio' @click="setGroupType('${group.id}', 'num')" ${(group.type === "num" ? "checked" : "")} name=''>AT LEAST
                  </label>
                    <input type='number' x-model="conditionsHashmap['${group.id}'].minimum" class='form-control num_group_con' :disabled="conditionsHashmap['${group.id}'].type !== 'num'">
                </div>
            </div>
            <ul class='group_list' x-ref="${group.id}" data-event-conditions-manager-id="${group.id}">
              ${children}
              <div class='flex mb-1'>
                  <button type='button' @click="addCondition('${group.id}')" class='btn btn-outline-secondary full'>Add condition</button>
                  <button type='button' @click="addGroup('${group.id}')" class='btn btn-outline-secondary full'>Add group</button>
              </div>
            </ul>
            ${group.operator ? this.renderOperator(group) : ""}
        </li>`;

    },

    setGroupType(groupId, type) {
        this.conditionsHashmap[groupId].type = type;

        if (type === 'num') {
            this.conditionsHashmap[groupId].minimum ||= 1;
        }
    },

    renderOperator(element) {
        return `<select class="form-control order-6" data-event-conditions-manager-id="operator-${element.id}" @change="keepFocus('operator-${element.id}')" x-model.lazy="conditionsHashmap['${element.id}'].operator" >
            <option ${element.operator === '&&' ? 'selected' : ''} value='&&'>AND - both must be true</option>
            <option ${element.operator === 'NAND' ? 'selected' : ''} value='NAND'>NAND - neither can be true</option>
            <option ${element.operator === 'OR' ? 'selected' : ''} value='||'>OR - at least one is true</option>
            <option ${element.operator === 'XOR' ? 'selected' : ''} value='XOR'>XOR - only one must be true</option>
          </select>`;
    }

});
