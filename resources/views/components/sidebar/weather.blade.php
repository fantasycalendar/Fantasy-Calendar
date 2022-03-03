@props([ "calendar" ])

@push('head')
    <script lang="js">

        function weatherSection($data){

            return {

                seasons: $data.static_data.seasons.data,
                settings: $data.static_data.seasons.global_settings,

                reseedWeather(){
                    this.settings.seed = Math.abs((Math.random().toString().substr(7)|0));
                }

            }
        }

    </script>
@endpush


<x-sidebar.collapsible
    class="settings-weather"
    name="weather"
    title="Weather"
    icon="fas fa-cloud-sun-rain"
    tooltip-title="More Info: Weather"
    helplink="weather"
>
    <div x-data="weatherSection($data)">

        <div class='row no-gutters' x-show="seasons.length === 0">
            You need at least one season for weather to function.
        </div>

        <div  x-show="seasons.length > 0">

            <div class='row no-gutters'>
                <div class='col-8'>Enable weather:</div>
                <div class='col-4 text-right'>
                    <label class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" x-model='settings.enable_weather'>
                        <span class="custom-control-indicator"></span>
                    </label>
                </div>
            </div>

            <div class='weather_inputs'>

                <div class='row no-gutters my-2 small-text'>
                    Custom weather can be configured in locations.
                </div>


                <div class='row my-2'>
                    <div class='col'>
                        Weather offset (days):
                        <input class='form-control' type='number' x-model.number='settings.weather_offset'/>
                    </div>
                </div>

                <div class='row no-gutters'>
                    <div class='col-md-6 my-1'>
                        Temperature system:
                        <select class='custom-select form-control' x-model='settings.temp_sys'>
                            <option selected value='metric'>Metric</option>
                            <option value='imperial'>Imperial</option>
                            <option value='both_m'>Both (inputs metric)</option>
                            <option value='both_i'>Both (inputs imperial)</option>
                        </select>
                    </div>

                    <div class='col-md-6 my-1'>
                        Wind system:
                        <select class='custom-select form-control' x-model='settings.wind_sys'>
                            <option selected value='metric'>Metric</option>
                            <option value='imperial'>Imperial</option>
                            <option value='both'>Both</option>
                        </select>
                    </div>
                </div>

                <div class='row no-gutters my-2 protip align-items-center' data-pt-position="right" data-pt-title="In addition of the temperature being shown, you'll also see the description for the temperature of that particular day.">
                    <div class='col-8'>Cinematic temperature description:</div>
                    <div class='col-4 text-right'>
                        <label class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" x-model='settings.cinematic'>
                            <span class="custom-control-indicator"></span>
                        </label>
                    </div>
                </div>

                <div class='row no-gutters'>
                    <div class='col-auto'>Weather generation seed:</div>
                </div>
                <div class='row no-gutters'>
                    <div class='col'>
                        <input type='number' class='form-control full' x-model='settings.seed' />
                    </div>
                    <div class='col-auto'>
                        <div class='btn btn-primary' @click="reseedWeather()"><i class="fa fa-redo"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-sidebar.collapsible>