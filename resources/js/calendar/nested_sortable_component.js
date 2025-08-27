import _ from "lodash";
import { condition_mapping, moon_phases } from "./calendar_variables.js";
import { ordinal_suffix_of } from "./calendar_functions.js";

export default () => ({

    sortable_data: [],
    original_data: [],

    conditionMap: {},
    sortableMap: {},

    addCondition() {
        this.sortable_data[this.sortable_data.length-1].operator = "&&"
        let condition = this.processCondition(["Year", "0", [0]]);
        this.conditionMap[condition.id] = condition;
        this.sortable_data.push(condition);
        // TODO: Figure out why this breaks sortables
    },

    addGroup() {
        this.sortable_data[this.sortable_data.length-1].operator = "&&"
        let group = this.processGroup(["", []]);
        this.conditionMap[group.id] = group;
        this.sortable_data.push(group);
    },

    set sortableData(value) {
        this.conditionMap = {};
        this.original_data = value;
        this.sortable_data = this.processConditionsData(_.cloneDeep(value))

        this.$nextTick(() => {
            this.sortableContainer = this.$refs.sortableContainer;
            this.initializeSortable(this.sortableContainer);
            this.sortableContainer.querySelectorAll('ul').forEach(ul => this.initializeSortable(ul));
        });
    },

    get sortableData() {
        return this.original_data
    },

    processConditionsData(elements) {
        let stack = [];
        for (let element of elements) {
            let processedElement;

            let isGroup = Array.isArray(element[1]);
            let isCondition = element.length > 1;
            let isOperator = element.length === 1;

            if (isGroup) {
                processedElement = this.processGroup(element)
            } else if (isCondition) {
                processedElement = this.processCondition(element)
            } else if (isOperator) {
                stack[stack.length-1].operator = element[0];
                continue;
            }

            this.conditionMap[processedElement.id] = processedElement;
            stack.push(processedElement);
        }
        return stack;
    },

    processGroup(data) {
        return {
            id: _.uniqueId("elem"),
            data_type: "group",
            type: typeof data[0] === "number" ? "num" : (data[0] === "!" ? "not" : "normal"),
            value: data[0],
            children: this.processConditionsData(data[1]),
            operator: false
        }
    },

    processCondition(data) {
        return {
            id: _.uniqueId("elem"),
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
                        || (month_index === months.length - 1 && month_index > months.length - 1)
                }))
            },
            {
                type: "select",
                values: days.map((day, day_index) => ({
                    label: day,
                    value: day_index,
                    selected: Number(condition.values[2]) === day_index
                        || (day_index === days.length - 1 && day_index > days.length - 1)
                        || (day_index === 0 && day_index < 0)
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
                html += `<select class='form-control order-${index + 3}' data-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionMap['${condition.id}'].values[${index}].value">`;
                for (let optgroup of input.values) {
                    html += `<optgroup label="${optgroup.label}">`;
                    for (let option of optgroup.values) {
                        html += `<option ${option.selected ? "selected" : ""} value="${option.value}">${option.label}</option>`;
                    }
                    html += `</optgroup>`;
                }
                html += `</select>`;
            } else if (input.type === "select") {
                html += `<select class='form-control order-${index + 3}' data-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionMap['${condition.id}'].values[${index}]">`;
                input.values.forEach(option => {
                    html += `<option ${option.selected ? "selected" : ""} value="${option.value}">${option.label}</option>`;
                });
                html += `</select>`;
            } else {
                html += `<input type="${input.type}" class='form-control order-${index + 3}' data-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionMap['${condition.id}'].values[${index}]" placeholder="${input.placeholder}"`;
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
        if (this.conditionMap[id].comparison !== value) {
            this.conditionMap[id].values = []
        }
        this.conditionMap[id].comparison = value;
        this.conditionMap[id].type = optGroupValue;
        this.keepFocus(event.target.dataset.id);
    },

    keepFocus(id) {
        this.$nextTick(() => {
            let elem = this.sortableContainer.querySelectorAll(`[data-id="${id}"]`)[0];
            if (elem) {
                elem.focus();
            }
        });
    },

    renderSortableElement(element, parent=false) {
        if (element.data_type === "condition") {
            return this.renderCondition(element, parent);
        } else if (element.data_type === "group") {
            return this.renderGroup(element, parent);
        }

        return ``;
    },

    renderCondition(condition, parent) {
        let moon_select = ""
        if(condition.type === "Moons") {
            let moon_options = this.$store.calendar.static_data.moons.reduce((html, moon, index) => {
                let selected = condition.type === "Moons" && condition.moon_index === index ? "selected" : "";
                return html + `<option ${selected} value='${index}'>${moon.name}</option>`;
            }, "");

            moon_select = `
                <select class="form-control moon_select order-1" x-model.lazy.number="conditionMap['${condition.id}'].moon_index" data-id="condition-moon-${condition.id}" @change="keepFocus('condition-moon-${condition.id}')" :class="{ 'hidden': conditionMap['${condition.id}'].type !== 'Moons' }">
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
        <li class="condition" data-id="${condition.id}" :key="conditionMap['${condition.id}'].id">
        <div class="condition_container items-center ${condition.type}">
        <div class='handle fa fa-bars' data-move></div>
        ${moon_select}
        <select class='form-control condition_type order-2' data-id="condition-type-${condition.id}" @change="handleConditionTypeChanged(event, '${condition.id}')">
          ${condition_types}
        </select>
        ${this.renderConditionOptions(condition)}
        </div>
        ${condition.operator && (!parent || parent.type !== "num") ? this.renderOperator(condition) : ""}
        </li>`;
    },

    renderGroup(group) {

        let children = group.children.reduce((html, child) => {
            return html + this.renderSortableElement(child, group);
        }, "");

        return `
        <li data-id="${group.id}" :key="conditionMap['${group.id}'].id" class="group">
            <div class="group_type" type="${group.type}">
                <div class='normal'>
                  <label><input type='radio' ${(group.type === "normal" ? "checked" : "")} name=''>NORMAL</label>
                </div>
                <div class='not'>
                  <label><input type='radio' ${(group.type === "not" ? "checked" : "")} name=''>NOT</label>
                </div>
                <div class='num'>
                  <label>
                    <input type='radio' ${(group.type === "num" ? "checked" : "")} name=''>AT LEAST
                  </label>
                  <input type='number' class='form-control num_group_con' disabled>
                </div>
            </div>
            <div class='handle fa fa-bars' data-move></div>
            <ul class='group_list' x-ref="${group.id}" data-id="${group.id}">
              ${children}
            </ul>
            ${group.operator ? this.renderOperator(group) : ""}
        </li>`;

    },

    renderOperator(element) {
        return `<select class="form-control order-6" data-id="operator-${element.id}" @change="keepFocus('operator-${element.id}')" x-model.lazy="conditionMap['${element.id}'].operator" >
            <option ${element.operator === '&&' ? 'selected' : ''} value='&&'>AND - both must be true</option>
            <option ${element.operator === 'NAND' ? 'selected' : ''} value='NAND'>NAND - neither can be true</option>
            <option ${element.operator === 'OR' ? 'selected' : ''} value='||'>OR - at least one is true</option>
            <option ${element.operator === 'XOR' ? 'selected' : ''} value='XOR'>XOR - only one must be true</option>
          </select>`;
    },

    initializeSortable(element) {

        this.sortableMap[element.dataset.id] = new Sortable(element, {
            group: 'shared', // Enable moving items between containers
            handle: '[data-move]',
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onEnd: evt => {
                this.sortable_data = this.processSortable('root');

                // This is stupid but apparently we need to reinitialize the sortables because the above assignment
                // causes a re-render, which makes the sortables lose their reference, probably because alpine hates us
                // TODO: This doesn't work if you add new data though, which sucks
                this.$nextTick(() => {
                    this.sortableContainer = this.$refs.sortableContainer;
                    this.initializeSortable(this.sortableContainer);
                    this.sortableContainer.querySelectorAll('ul').forEach(ul => this.initializeSortable(ul));
                });
            }
        });

        return this.sortableMap[element.dataset.id];

    },

    processSortable(id) {

        let sortable_data = {
            children: []
        };

        if (id !== 'root' && this.conditionMap[id]) {
            sortable_data = _.cloneDeep(this.conditionMap[id]);
        }

        if (this.sortableMap[id]) {

            let sortable_sub_elements = this.sortableMap[id].toArray();

            let sortable_children = [];
            for (let sortable_id of sortable_sub_elements) {
                sortable_children.push(this.processSortable(sortable_id));
            }

            if (sortable_children.length) {
                sortable_children.sort((a, b) => {
                    return sortable_sub_elements.indexOf(a.id) - sortable_sub_elements.indexOf(b.id);
                });
                sortable_children.forEach((element, index, array) => {
                    if ((sortable_data.data_type === "group" && sortable_data.type === "num") || index === array.length - 1) {
                        element.operator = false;
                    } else if (!element.operator) {
                        element.operator = "&&";
                    }
                })
            }

            if (id === "root") {
                sortable_data = sortable_children;
            } else {
                sortable_data['children'] = sortable_children;
            }
        }

        return _.cloneDeep(sortable_data);
    },

});