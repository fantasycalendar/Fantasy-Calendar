<div>

    <script lang="js">

        function weekdayList($data){

            return {

                weekdayName: "",
                weekdays: $data.static_data.year_data.global_week,
                deleting: null,

                add(name){
                    this.weekdays.push(name || `Weekday ${this.weekdays.length}`);
                },

                remove(index){
                    this.weekdays.splice(index, 1);
                }
            }
        }

    </script>

    <div x-data="weekdayList($data)">

        <div class='row no-gutters mt-2 bold-text'>
            <div class="col">
                New weekday:
            </div>
        </div>

        <div class='row no-gutters add_inputs global_week'>
            <div class='col'>
                <input type='text' class='form-control name' x-model="weekdayName" placeholder='Weekday name'>
            </div>
            <div class='col-auto'>
                <button type='button' class='btn btn-primary add' @click="add(weekdayName)"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <div class="sortable list-group">
            <template x-for="(weekday, index) in weekdays">
                <div class='sortable-container list-group-item'>
                    <div class='main-container' x-show="deleting !== weekday">
                        <div class='handle icon-reorder'></div>
                        <div class='name-container'>
                            <input type='text' class='form-control name-input small-input' x-model="weekday"/>
                        </div>
                        <div class='remove-spacer'></div>
                    </div>

                    <div class='remove-container'>
                        <div class='remove-container-text' x-show="deleting === weekday">Are you sure you want to remove this?</div>
                        <div class='btn_remove btn btn-danger icon-trash' @click="deleting = weekday" x-show="deleting !== weekday"></div>
                        <div class='btn_cancel btn btn-danger icon-remove' @click="deleting = null" x-show="deleting === weekday"></div>
                        <div class='btn_accept btn btn-success icon-ok' @click="remove(index)" x-show="deleting === weekday"></div>
                    </div>
                </div>

            </template>
        </div>
    </div>
</div>