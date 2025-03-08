import CollapsibleComponent from "./collapsible_component.js";
import { set_up_view_values } from "./calendar_inputs_view.js";
import { ordinal_suffix_of } from "./calendar_functions.js";
import _ from "lodash";
import { do_error_check } from "./calendar_inputs_edit.js";

class MonthsCollapsible extends CollapsibleComponent {

    deleting = -1;
    name = "";
    type = "month";
    reordering = false;

    months = [];

    inboundProperties = {
        "months": "static_data.year_data.timespans",
        "weekdays": "static_data.year_data.global_week",
        "year_zero_exists": "static_data.settings.year_zero_exists"
    }

    outboundProperties = {
        "months": "static_data.year_data.timespans"
    }

    changeHandlers = {
        "months": this.sanitizeMonthIntervalOffsets
    }

    draggableRef = "months-sortable";

    loaded() {
        this.sanitizeMonthIntervalOffsets();
    }

    reorderSortable(start, end) {
        let months = JSON.parse(JSON.stringify(this.months));

        const elem = months.splice(start, 1)[0];
        months.splice(end, 0, elem);

        this.months = months;
    }

    addMonth() {
        let name = this.name || (
            this.type === "month"
                ? `Month ${this.months.length + 1}`
                : `Intercalary Month ${this.months.length + 1}`
        )

        this.months.push({
            'name': name,
            'type': this.type,
            'length': this.months.length
                ? this.months[this.months.length-1].length
                : this.weekdays.length,
            'interval': 1,
            'offset': 0
        });

        this.name = "";
    }

    removeMonth(index){
        this.months.splice(index, 1);
        this.deleting = -1;
    }

    toggleCustomWeek(month){
        if(!month.week){
            month.week = _.cloneDeep(this.weekdays);
        }else{
            delete month['week'];
        }
    }

    quickAddCustomWeekdays(month){
        swal.fire({
            title: "Weekday Names",
            text: "Each line entered below creates one week day in this month.",
            input: "textarea",
            inputValue: month.week.join('\n'),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            icon: "info"
        }).then((result) => {
            if (result.dismiss) return;
            if (result.value === "") {
                swal.fire({
                    title: "Error",
                    text: "You didn't enter any values!",
                    icon: "warning"
                });
            }

            month.week = result.value.split('\n');
        });
    }

    customWeekLengthChanged($event, month){
        let newLength = Number($event.target.value);

        if(newLength > month.week.length){
            for(let i = month.week.length; i < newLength; i++){
                month.week.push(`Week day ${i+1}`);
            }
        }else{
            month.week = month.week.slice(0, newLength);
        }
    }

    sanitizeMonthIntervalOffsets(){
       for(let month of this.months){
           if(month.interval === 1){
               month.offset = 0;
           }
       }
    }

    getMonthIntervalText(month) {
        let interval = month.interval;
        let offset = month.interval === 1 ? 0 : month.offset;

        let text = "This timespan will appear every";

        if (interval > 1) {
            text += " " + ordinal_suffix_of(interval)
        }

        text += " year";

        if (interval > 1) {
            let offset_modulus = ((interval + offset) % interval);
            let first_year = offset_modulus === 0 ? interval : offset_modulus;
            text += `, starting year ${first_year}. `
            text += `(${this.year_zero_exists && offset_modulus === 0 ? "year 0," : "year"} ${first_year}, ${interval + first_year}, ${(interval * 2) + first_year}...)`;
        }

        text += ".";

        return text;
    }

}

export default () => new MonthsCollapsible();
