export default class Moon {

    constructor(attributes) {
        this.name = attributes['name'];
        this.hidden = attributes['hidden'];

        this.cycle = attributes['cycle'];
        this.shift = attributes['shift'];

        this.custom_phase = attributes['custom_phase'] ?? false;
        this.custom_cycle = attributes['custom_cycle'] ?? "";
        this.cycle_rounding = attributes['cycle_rounding'] ?? "round";

        this.color = attributes['color'];
        this.shadow_color = attributes['shadow_color'];
    }

    get granularity(){
        if(this.cycle >= 40){
            return 40;
        }else if(this.cycle >= 24){
            return 24;
        }else if(this.cycle >= 8){
            return 8;
        }else{
            return 4;
        }
    }

    getPhases(epoch) {
        return this.custom_phase
            ? this.getPhasesFromCustomCycle(epoch)
            : this.getPhasesFromCycle(epoch);
    }

    getPhasesFromCustomCycle(epoch) {

        const cycle = this.custom_cycle.split(',').map(phase => Number(phase));
        const cycleLength = cycle.length;

        const cycleIndex = Math.abs(epoch % cycleLength);
        const phase = cycle[cycleIndex];

        const totalPhases = Math.abs(epoch / cycleLength)+1;
        const totalPhaseCount = Math.round(totalPhases);

        return {
            phase,
            totalPhaseCount
        };
    }

    getPhasesFromCycle(epoch) {

        const roundingMethod = Math[this.cycle_rounding];

        const totalCyclePosition = (epoch - this.shift) / this.cycle;
        const normalizedCyclePosition = totalCyclePosition - Math.floor(totalCyclePosition);

        const phase = roundingMethod(normalizedCyclePosition * this.granularity) % this.granularity;
        const totalPhaseCount = roundingMethod(Math.abs(totalCyclePosition)+1);

        return {
            phase,
            totalPhaseCount
        };
    }
}
