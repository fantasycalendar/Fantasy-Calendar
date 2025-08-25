import _ from "lodash";
import { condition_mapping } from "./calendar_variables.js";
import { ordinal_suffix_of } from "./calendar_functions.js";

export default () => ({

    _elements: [],
    conditionMap: {},
    _orig_elements: [],

    sortableIndex: {},

    set elements(value) {
        this._orig_elements = value;
        this._elements = this.processElements(_.cloneDeep(value))

        this.$nextTick(() => {
            this.sortableContainer = this.$refs.sortableContainer;
            this.initializeSortable(this.sortableContainer);
            this.sortableContainer.querySelectorAll('ul').forEach(ul => this.initializeSortable(ul));
            this.processSortable('root');
        });
    },

    get elements() {
        return this._orig_elements
    },

    processElements(elements) {
        let stack = [];
        for(const element of elements) {
            let processedElement;
            if(Array.isArray(element[1])){
                processedElement = this.processGroup(element)
            }else if (element.length === 1) {
                processedElement = this.processOperator(element)
            }else{
                processedElement = this.processCondition(element)
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
            children: this.processElements(data[1])
        }
    },

    processCondition(data) {
        return {
            id: _.uniqueId("elem"),
            data_type: "condition",
            type: data[0],
            comparison: Number(data[1]),
            values: data[2]
        };
    },


    processOperator(data) {
        return {
            id: _.uniqueId("elem"),
            data_type: "operator",
            type: data[0]
        };
    },

    renderElement(element){

        if(element.data_type === "condition"){
            return this.renderCondition(element);
        }

        if(element.data_type === "operator"){
            return this.renderOperator(element);
        }

        return this.renderGroup(element);

    },

    addInput(condition, input, value_index = 0){
        if(input[0] === "hidden"){
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

    addMonthSelect(condition, value_index){
        return {
            type: "select",
            values: this.$store.calendar.static_data.year_data.timespans.map((month, month_index) => ({
                label: sanitizeHtml(month.name),
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

    addMoonSelect(condition, value_index = 0){
        return {
            type: "select",
            values: this.$store.calendar.static_data.moons.map((moon, index) => ({
                label: sanitizeHtml(moon.name),
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addCycleSelect(condition, value_index = 0){
        return {
            type: "select-optgroup",
            values: this.$store.calendar.static_data.cycles.map((cycle, cycle_index) => ({
                label: `${ordinal_suffix_of(cycle_index + 1)} cycle group`,
                value: cycle_index,
                values: cycle.names.map((name, name_index) => ({
                    label: sanitizeHtml(name),
                    value: name_index,
                    selected: Number(condition.values[value_index]) === cycle_index && Number(condition.values[value_index+1]) === name_index
                }))
            }))
        }
    },

    addEraSelect(condition, value_index = 0){
        return {
            type: "select",
            values: this.$store.calendar.static_data.eras.map((era, index) => ({
                label: sanitizeHtml(era.name),
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addSeasonSelect(condition, value_index = 0){
        return {
            type: "select",
            values: this.$store.calendar.static_data.seasons.data.map((season, index) => ({
                label: sanitizeHtml(season.name),
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addLocationSelect(condition, value_index = 0){
        return {
            type: "select",
            values: this.$store.calendar.static_data.seasons.locations.map((location, index) => ({
                label: sanitizeHtml(location.name),
                value: index,
                selected: Number(condition.values[value_index]) === index
            }))
        }
    },

    addWeekdaySelect(condition, value_index = 0){
        return {
            type: "select",
            values: this.$store.calendar.static_data.year_data.global_week.map((weekday_name, index) => ({
                label: sanitizeHtml(weekday_name),
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
                for(const [index, input] of conditionInputs.entries()){
                    if(input[0] === "select") {
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
                for(const [index, input] of conditionInputs.entries()){
                    if(input[0] === "select") {
                        inputs.push(this.addMoonSelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Season":
                for(const [index, input] of conditionInputs.entries()){
                    if(input[0] === "select") {
                        inputs.push(this.addSeasonSelect(condition));
                    } else {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;

            case "Weekday":
                for(const [index, input] of conditionInputs.entries()){
                    if(input[0] === "select") {
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
                for(const [index, input] of conditionInputs.entries()){
                    if(input !== "select") {
                        inputs.push(this.addInput(condition, input, index));
                    }
                }
                break;
        }

        return inputs.reduce((html, input, index) => {
            if(input.type === "select-optgroup"){
                html += `<select class='form-control order-${index+3}' data-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionMap['${condition.id}'].values[${index}].value">`;
                for(const optgroup of input.values){
                    html += `<optgroup label="${optgroup.label}">`;
                    for(const option of optgroup.values){
                        html += `<option ${option.selected ? "selected" : ""} value="${option.value}">${option.label}</option>`;
                    }
                    html += `</optgroup>`;
                }
                html += `</select>`;
            } else if(input.type === "select"){
                html += `<select class='form-control order-${index+3}' data-id="${condition.id}-${index}" @change="keepFocus('${condition.id}-${index}')" x-model.lazy="conditionMap['${condition.id}'].values[${index}]">`;
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

    keepFocus(id){
        this.$nextTick(() => {
            let elem = this.sortableContainer.querySelectorAll(`[data-id="${id}"]`)[0];
            if(elem){
                elem.focus();
            }
        });
    },

    renderCondition(condition){

        const moon_options = this.$store.calendar.static_data.moons.reduce((html, moon, index) => {
            let selected = condition.type === "Moons" && condition.values[0] === index ? "selected" : "";
            return html + `<option ${selected} value='${index}'>${sanitizeHtml(moon.name)}</option>`;
        }, "");

        const condition_options = Object.entries(condition_mapping).reduce((html, [group, options]) => {
            html += `<optgroup label="${group}">`;

            options.forEach((option, index) => {
                let selected = condition.type === group && condition.comparison === index ? "selected" : "";
                html += `<option ${selected} value="${index}">${option.label}</option>`
            });

            html += `</optgroup>`;

            return html;
        }, "");

        return `
        <li class="condition" data-id="${condition.id}">
        <div class="condition_container ${condition.type}">
        <div class='handle fa fa-bars' data-move></div>
        <select class="form-control moon_select order-1" :class="{ 'hidden': conditionMap['${condition.id}'].type !== 'Moons' }">
          ${moon_options}
        </select>
        <select class='form-control condition_type order-2'>
          ${condition_options}
        </select>
        ${this.renderConditionOptions(condition)}
        </div>
        </li>
        `;
        // TODO: Hook up condition_options select to actually change structure of condition itself, see method below
    },

    handleConditionChanged(id){
        //console.log(this.conditionMap[id]);
    },

    renderOperator(element){
        return `<li data-id="${element.id}">
          <select class='form-control condition_operator'>
            <option ${element.type === '&&' ? 'selected' : ''} value='&&'>AND - both must be true</option>
            <option ${element.type === 'NAND' ? 'selected' : ''} value='NAND'>NAND - neither can be true</option>
            <option ${element.type === 'OR' ? 'selected' : ''} value='||'>OR - at least one is true</option>
            <option ${element.type === 'XOR' ? 'selected' : ''} value='XOR'>XOR - only one must be true</option>
          </select>
        </li>`;
    },

    renderGroup(element){

        let children = element.children.reduce((html, child) => {
            return html + this.renderElement(child);
        }, "");

        return `
        <li data-id="${element.id}" class="group">
            <div class="group_type" type="${element.type}">
                <div class='normal'>
                  <label><input type='radio' ${(element.type === "normal" ? "checked" : "")} name=''>NORMAL</label>
                </div>
                <div class='not'>
                  <label><input type='radio' ${(element.type === "not" ? "checked" : "")} name=''>NOT</label>
                </div>
                <div class='num'>
                  <label>
                    <input type='radio' ${(element.type === "num" ? "checked" : "")} name=''>AT LEAST
                  </label>
                  <input type='number' class='form-control num_group_con' disabled>
                </div>
            </div>
            <div class='handle fa fa-bars' data-move></div>
            <ul class='group_list' x-ref="${element.id}" data-id="${element.id}">
              ${children}
            </ul>
        </li>`;

    },

    initializeSortable(element) {
        // Initialize SortableJS on the element with ID 'sortableContainer'
        this.sortableIndex[element.dataset.id] = new Sortable(element, {
            group: 'shared', // Enable moving items between containers
            handle: '[data-move]',
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onEnd: evt => {
                this.processSortable('root');
            }
        });

        return this.sortableIndex[element.dataset.id];

    },


    findLayerById(id) {
        if(this.conditionMap[id]){
            return Object.assign({}, this.conditionMap[id]);
        }
        return null;
    },

    processSortable(owner) {

        let ret = {};
        if (owner !== 'root') {
            ret = this.findLayerById(owner);
            if (ret === null) {
                ret = {};
            }
        }

        if (this.sortableIndex.hasOwnProperty(owner)) {

            let t = this.sortableIndex[owner].toArray();

            let tret = [];
            for (let index1 = 0; index1 < t.length; ++index1) {
                let element = t[index1];
                tret.push(this.processSortable(element));
            }
            if (owner !== 'root') {
                ret['children'] = tret;
            } else {
                ret = tret;
            }
        } else {
            if (owner !== 'root') {
                ret['children'] = [];
            }
        }


        return Object.assign({}, ret);
    },

});