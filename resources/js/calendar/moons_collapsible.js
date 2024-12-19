import CollapsibleComponent from "./collapsible_component.js";
import { avg_month_length, get_moon_granularity } from "./calendar_functions.js";

class MoonsCollapsible extends CollapsibleComponent {

    deleting = -1;

    moons = [];
    months = [];
    leap_days = [];

    name = "";
    cycle = null;
    shift = null;

    inboundProperties = {
        "moons": "static_data.moons",
        "months": "static_data.year_data.timespans",
        "leap_days": "static_data.year_data.leap_days",
    };

    outboundProperties = {
        "moons": "static_data.moons"
    }

    validCustomCycleRegex = /[`!+~@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/A-Za-z ]/g;

    addMoon(){
        let cycle = this.cycle || avg_month_length(this.months, this.leap_days) || 32;
        this.moons.push({
            'name': this.name || "New moon",
            'cycle': cycle,
            'cycle_rounding': "round",
            'shift': this.shift || 0,
            'granularity': get_moon_granularity(cycle),
            'color': '#ffffff',
            'shadow_color': '#292b4a',
            'hidden': false,
            'custom_phase': false
        });
        this.name = "";
        this.cycle = null;
        this.shift = null;
        this.deleting = -1;
    }

    removeMoon(index){
        this.moons.splice(index, 1);
        this.deleting = -1;
    }

    customPhaseChanged(moon) {
        if(moon.custom_phase){
            let phases = moon.custom_cycle.split(",").map(Number)
            moon.cycle = phases.length;
            moon.shift = phases[0];
            moon.custom_cycle = "";
        }else{
            let newCycle = [...Array(moon.granularity).keys()];
            moon.custom_cycle = newCycle.join(",");
        }
        moon.custom_phase = !moon.custom_phase;
    }

    getCustomCycleMessage(moon){
        if(!moon.custom_phase) return "";
        return moon.custom_phase
            ? `This moon has ${moon.custom_cycle.split(',').length} phases, with a granularity of ${moon.granularity} moon sprites.`
            : ''
    }

    getCustomCycleErrorMsg(moon){
        if(!moon.custom_phase) return '';
        let cycle = Math.max.apply(null, moon.custom_cycle.split(',')) + 1;
        let invalid = cycle > 40;
        // TODO: Figure out a way to block the calendar rendering if collapsible contains an error
        return invalid ? `${moon.name} has an invalid custom cycle. 39 is the highest possible number.` : '';
    }

    customCycleChanged(moon, $event) {

        $event.target.value = $event.target.value
            .replace(this.validCustomCycleRegex, '')
            .replace(/,{2,}/g, ",");

        let cycle = Math.max.apply(null, $event.target.value.split(',')) + 1;

        if (cycle <= 4) {
            moon.granularity = 4;
        } else if (cycle <= 8) {
            moon.granularity = 8;
        } else if (cycle <= 16) {
            moon.granularity = 16;
        } else if (cycle <= 24) {
            moon.granularity = 24;
        } else {
            moon.granularity = 40;
        }

        moon.custom_cycle = $event.target.value;
    }

    shiftCustomCycle(moon, direction){

        let cycle = moon.custom_cycle.split(",");

        if (direction > 0) {
            cycle = [...cycle.slice(cycle.length - 1), ...cycle.slice(0, cycle.length - 1)];
        } else {
            cycle = [...cycle.slice(1, cycle.length), ...cycle.slice(0, 1)];
        }

        moon.custom_cycle = cycle.join(",");

    }

}

export default () => new MoonsCollapsible();
