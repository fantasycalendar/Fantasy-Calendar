import _ from "lodash";
import { condition_mapping } from "./calendar_variables.js";

export default () => ({

    _elements: [],
    _flatElements: {},
    _orig_elements: [],

    sortableIndex: {},

    set elements(value) {
        this._orig_elements = value;
        this._elements = this.processElements(_.cloneDeep(value))

        this.$nextTick(() => {
            this.initializeSortable(this.$refs.sortableContainer);
            this.$refs.sortableContainer.querySelectorAll('ul').forEach(ul => this.initializeSortable(ul));
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
            this._flatElements[processedElement.id] = processedElement;
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

    renderInput(condition){
        return `<input type="number" x-model="_flatElements['${condition.id}'].values[0]"/>`;
    },

    renderConditionOptions(condition) {
        switch (condition.type) {
            case "Month":
                let type = condition_mapping[condition.type][condition.comparison][2][0][0];
                if(type === "select"){
                    let months = this.$store.calendar.static_data.year_data.timespans.map((month, index) => {
                        let selected = Number(condition.values[0]) === index ? "selected" : "";
                        return `<option ${selected} value="${index}">${sanitizeHtml(month.name)}</option>>`
                    }).join("");
                    return `<select class="form-control order-3"
                      @change="handleConditionChanged('${condition.id}')"
                      x-model="_flatElements['${condition.id}'].values[0]">
                        ${months}
                      </select>`;
                }
                return this.renderInput(condition);

            // TODO: All of the condition types here, see calendar-events-editor.js line 1700 and onwards
        }

        return ``;
    },

    renderCondition(condition){

        const moon_options = this.$store.calendar.static_data.moons.map((moon, index) => {
            let selected = condition.type === "Moons" && condition.values[0] === index ? "selected" : "";
            return `<option ${selected} value='${index}'>${sanitizeHtml(moon.name)}</option>`;
        }).join("");

        const condition_options = Object.entries(condition_mapping).map(([group, options]) => {
            let html = `<optgroup label="${group}">`;

            html += options.map((option, index) => {
                let selected = condition.type === group && condition.comparison === index ? "selected" : "";
                return `<option ${selected} value="${index}">${option[0]}</option>`
            }).join("");

            html += `</optgroup>`;

            return html;
        })

        return `
        <li class="condition" data-id="${condition.id}">
        <div class="condition_container ${condition.type}">
        <div class='handle fa fa-bars' data-move></div>
        <select class="form-control moon_select order-1" :class="{ 'hidden': _flatElements['${condition.id}'].type !== 'Moons' }">
          ${moon_options}
        </select>
        <select class='form-control condition_type order-2'>
          ${condition_options}
        </select>
        ${this.renderConditionOptions(condition)}
        </div>
        </li>
        `;
    },

    handleConditionChanged(id){
        //console.log(this._flatElements[id]);
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

        let children = element.children.map(child => {
            return this.renderElement(child);
        }).join("");

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
        if(this._flatElements[id]){
            return Object.assign({}, this._flatElements[id]);
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