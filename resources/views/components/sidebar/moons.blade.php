@props([ "calendar" ])

@push('head')

    <script lang="js">

        function moonList($data){

            return {

                moons: $data.static_data.moons,

                newMoon: {
                    name: "",
                    cycle: null,
                    shift: null
                },

                expanded: {},
                reordering: false,
                deleting: null,
                custom_moon_cycle_regex: new RegExp(`[\`!+~@#$%^&*()_|=?;:'\"\.<>\{\}\[\]\\\/A-Za-z -]`, "g"),

                init(){
                    this.moons.forEach(moon => {
                        moon.cycle_rounding = moon.cycle_rounding || 'round';
                        console.log(moon.custom_cycle)
                    })
                },

                add({ name, cycle, shift, color, shadow_color, hidden }={}){
                    const granularity = this.getGranularity(cycle || 32)
                    this.moons.push({
                        name: name || `Moon ${this.moons.length}`,
                        cycle: cycle || 32,
                        shift: shift || 0,
                        granularity: granularity,
                        color: color || '#ffffff',
                        shadow_color: shadow_color || '#292b4a',
                        hidden: !!hidden ?? false
                    });
                },

                remove(index){
                    this.moons.splice(index, 1);
                },

                toggleCustomCycle(moon){

                    if(moon.custom_cycle){
                        moon.cycle = moon.custom_cycle.split(',').length;
                        moon.shift = moon.custom_cycle.split(',')[0];
                        delete moon.custom_cycle;
                    }else{
                        moon.custom_cycle = Array.from(Array(moon.granularity).keys()).join(',');
                        delete moon.cycle;
                        delete moon.shift;
                    }

                },

                changeCustomCycle($event, index, moon){

                    const currentCycle = $event.target.value;

                    const validatedCycle = currentCycle.replace(this.custom_moon_cycle_regex, "").replace(/,*$/g, "");

                    const invalidCycle = Math.max.apply(null, validatedCycle.split(',')) > 40;

                    // TODO: Create some sort of error message handling
                    if(invalidCycle) return;

                    // We need to do this in order to force the Alpine observer to refresh in case the input changed
                    // but the stored string was the same as the previous one, but the input field changed
                    moon.custom_cycle = "";
                    moon.custom_cycle = validatedCycle;

                    const cycle = Math.max.apply(null, validatedCycle.split(','))+1;

                    moon.granularity = this.getGranularity(cycle);

                },

                cycleChanged(moon){
                    moon.granularity = this.getGranularity(moon.cycle);
                },

                shiftCustomCycle(moon, backwards){

                    let customCycle = moon.custom_cycle.split(",");
                    if(backwards){
                        customCycle = [...customCycle.slice(customCycle.length-1), ...customCycle.slice(0, customCycle.length-1)];
                    }else{
                        customCycle = [...customCycle.slice(1, customCycle.length), ...customCycle.slice(0,1)];
                    }
                    moon.custom_cycle = customCycle.join(',');

                },

                getGranularity(cycle){
                    if(cycle <= 4){
                        return 4;
                    }else if(cycle <= 8){
                        return 8;
                    }else if(cycle <= 16){
                        return 16;
                    }else if(cycle <= 24){
                        return 24;
                    }
                    return 40;
                }
            }
        }

    </script>

@endpush


<x-sidebar.collapsible
        class="settings-moons"
        name="moons"
        title="Moons"
        icon="fas fa-moon"
        tooltip-title="More Info: Moons"
        helplink="moons"
>

    <div x-data="moonList($data)">


        <div class='row bold-text'>
            <div class="col">
                New moon:
            </div>
        </div>

        <div class='add_inputs moon'>
            <div class='row no-gutters'>
                <div class='col'>
                    <input type='text' class='form-control protip' x-model="newMoon.name" data-pt-position="top" data-pt-title="The moon's name." placeholder='Moon name'>
                </div>
                <div class='col-auto'>
                    <button type='button' class='btn btn-primary' @click="add(newMoon)"><i class="fa fa-plus"></i></button>
                </div>
            </div>
            <div class='row no-gutters'>
                <div class='col-6'>
                    <input type='number' class='form-control protip' x-model="newMoon.cycle" data-pt-position="top" data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.' min='1' placeholder='Cycle'>
                </div>
                <div class='col-6'>
                    <input type='number' class='form-control protip' x-model="newMoon.shift" data-pt-position="top" data-pt-title='This is how many days the cycle is offset by.' placeholder='Shift'>
                </div>
            </div>
        </div>

        <div class="row sortable-header timespan_sortable_header no-gutters align-items-center">
            <div x-show="!reordering" @click="reordering = true" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer"><i class="fa fa-sort"></i></div>
            <div x-show="reordering" @click="reordering = false" class="btn btn-outline-secondary p-1 border col-1 rounded text-center cursor-pointer "><i class="fa fa-times"></i></div>
            <div class='py-2 col-8 text-center'>Name</div>
        </div>

        <div class="sortable list-group">
            <template x-for="(moon, index) in moons">
                <div class='sortable-container list-group-item'>

                    <div class='main-container' x-show="deleting !== moon">
                        <i class='handle icon-reorder' x-show="reordering"></i>
                        <i class='expand' x-show="!reordering" :class="expanded[index] ? 'icon-collapse' : 'icon-expand'" @click="expanded[index] = !expanded[index]"></i>
                        <div class="input-group">
                            <input class='name-input small-input form-control' x-model="moon.name">
                            <div class="input-group-append">
                                <div class='btn btn-danger icon-trash' @click="deleting = moon" x-show="deleting !== moon"></div>
                            </div>
                        </div>
                    </div>

                    <div class='d-flex justify-content-between align-items-center w-100 px-1'>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === moon"></div>
                        <div class='remove-container-text' x-show="deleting === moon">Are you sure?</div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === moon"></div>
                    </div>

                    <div class='container pb-2' x-show="expanded[index] && deleting !== moon">

                        <div class='row no-gutters my-1'>
                            <div class='form-check col-12 py-2 border rounded'>
                                <input type='checkbox' :id='index+"_custom_cycle_count"' class='form-check-input' :checked="moon.custom_cycle?.length > 0" @change="toggleCustomCycle(moon)">
                                <label :for='index+"_custom_cycle_count"' class='form-check-label ml-1'>
                                    Custom phase count
                                </label>
                            </div>
                        </div>

                        <div x-show="!moon.custom_cycle?.length">

                            <div class='row no-gutters my-1'>
                                <div class='col-7'>Cycle:</div>
                                <div class='col-5'>Shift:</div>
                            </div>

                            <div class='row no-gutters mb-1'>

                                <div class='col-7 pr-1'>
                                    <input type='number' min='1' step="any" class='form-control protip' x-model="moon.cycle" @change="cycleChanged(moon)" data-pt-position="top" data-pt-title='How many days it takes for this moon go from Full Moon to the next Full Moon.'/>
                                </div>

                                <div class='col-5 pl-1'>
                                    <input type='number' step="any" class='form-control protip' x-model="moon.shift" data-pt-position="top" data-pt-title='This is how many days the cycle is offset by.'/>
                                </div>

                            </div>

                            <div class='row no-gutters mb-1'>

                                <select class='form-control protip' x-model="moon.cycle_rounding" data-pt-position="top" data-pt-title='This determines the way this moon calculates its phases, as in which way it rounds the phase value to the closest sprite.'>
                                    <option value='floor'>Floor (0.7 becomes 0.0)</option>
                                    <option value='round'>Round (< 0.49 becomes 0.0, 0.5 > becomes 1.0)</option>
                                    <option value='ceil'>Ceiling (0.3 becomes 1.0)</option>
                                </select>

                            </div>

                        </div>

                        <div class='row no-gutters' x-show="moon.custom_cycle?.length">

                            <div class='col'>

                                <div class='my-1'>Custom phase:</div>

                                <div class='input-group my-1'>

                                    <div class='input-group-prepend'>
                                        <button type='button' class='btn btn-sm btn-danger' @click="shiftCustomCycle(moon, true)"><</button>
                                    </div>

                                    <input type='text' class='form-control form-control-sm' :value='moon.custom_cycle' @change="changeCustomCycle($event, index, moon)" />

                                    <div class='input-group-append'>
                                        <button type='button' class='btn btn-sm btn-success' @click="shiftCustomCycle(moon)">></button>
                                    </div>

                                </div>

                                <div class='custom_cycle_text italics-text small-text my-1' x-text="moon.custom_cycle ? `This moon has ${moon.custom_cycle.split(',').length} phases, with a granularity of ${moon.granularity} moon sprites.` : ''"></div>

                            </div>

                        </div>

                        <div class='row no-gutters my-2'>
                            <div class='col'>
                                <div class='separator'></div>
                            </div>
                        </div>

                        <div class='row no-gutters mt-1'>
                            <div class='col-6'>Moon color:</div>
                            <div class='col-6'>Shadow color:</div>
                        </div>

                        <div class='row no-gutters mb-1'>

                            <div class='col-6 pr-1'>
                                <input type='color' x-model="moon.color"/>
                            </div>

                            <div class='col-6 pl-1'>
                                <input type='color' x-model="moon.shadow_color"/>
                            </div>

                        </div>

                        <div class='row no-gutters my-1'>
                            <div class='form-check col-12 py-2 border rounded'>
                                <input type='checkbox' :id='index + "_hidden_moon"' class='form-check-input' x-model="moon.hidden">
                                <label :for='index + "_hidden_moon"' class='form-check-label ml-1'>
                                    Hide from guest viewers
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

            </template>
        </div>
    </div>
</x-sidebar.collapsible>