@push('head')
    <script lang="js">

        function statisticSection($data){

            return {

                get averageYearLength(){
                    return avg_year_length($data.static_data);
                },

                get averageMonthLength(){
                    return avg_month_length($data.static_data);
                },

            }
        }

    </script>
@endpush


<x-sidebar.collapsible
        class="settings-statistics"
        name="statistics"
        title="Statistics"
        icon="fas fa-chart-pie"
        tooltip-title="More Info: Statistics"
        helplink="statistics"
>

    <div x-data="statisticSection($data)">

        <div class='row no-gutters'>
            <div class='col-7 bold-text'>
                Avg. year length:
            </div>
            <div class='col-5 text-right'>
                <div class='detail-text' x-text="averageYearLength">
                </div>
            </div>
        </div>

        <hr class="my-1">

        <div class='row no-gutters'>
            <div class='col-7 bold-text'>
                Avg. month length:
            </div>
            <div class='col-5 text-right'>
                <div class='detail-text' x-text="averageMonthLength">
                </div>
            </div>
        </div>

    </div>

</x-sidebar.collapsible>
