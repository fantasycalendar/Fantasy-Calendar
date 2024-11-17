import CollapsibleComponent from "./collapsible_component.js";

class CyclesCollapsible extends CollapsibleComponent {

    deleting = -1;

    format = "";
    cycles = [];

    loads = {
        "format": "cycles.format",
        "cycles": "cycles.data",
    }

    setters = {
        "format": "cycles.format",
        "cycles": "cycles.data",
    }

    addCycle(){
        if(!this.format){
            this.format = "Cycle {{1}}";
        }
        this.cycles.push({
            "length": 1,
            "offset": 0,
            "names": ["Name 1"]
        });
        this.deleting = -1;
    }

    removeCycle(index){
        this.cycles.splice(index, 1);
        this.deleting = -1;
    }

    setNumberOfCycleNames(cycle, newNameCount) {
        const nameCount = cycle.names.length;
        if(newNameCount > nameCount){
            let newNames = [...Array(newNameCount - nameCount).keys()]
                .map(i => `Name ${nameCount+i+1}`);
            cycle.names = cycle.names.concat(newNames);
        }else if(newNameCount < nameCount){
            cycle.names = cycle.names.slice(0, newNameCount);
        }
    }

    openCycleNameModal(cycle) {

        swal.fire({
            title: "Cycle Names",
            text: "Each line entered below creates one name in the cycle list.",
            input: "textarea",
            inputValue: cycle.names.join('\n'),
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

            cycle.names = result.value.split('\n').filter(Boolean);

        });
    }

}

export default () => new CyclesCollapsible();
