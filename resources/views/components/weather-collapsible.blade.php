@props(['calendar' => null])

<div x-show="!seasons.length">
    You need at least one season for weather to function.
</div>

<div class="flex flex-col space-y-2" x-show="seasons.length">
    <div class='flex justify-between'>
        <div>Enable weather:</div>

        <label class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" x-model='weather.enable_weather'>
            <span class="custom-control-indicator"></span>
        </label>
    </div>

    <div class="contents space-y-2" x-show="weather.enable_weather">
        <div class='flex text-xs mt-2'>
            <i class="fa fa-info-circle text-opacity-80 mr-1.5"></i>
            Custom weather can be configured per location.
        </div>

        <div class='flex flex-col'>
            <div>Weather offset (days):</div>
            <input class='form-control'
                :value='weather.weather_offset'
                type='number'
                @change='weather.weather_offset = Math.floor(Number($event.target.value))'/>
        </div>

        <div class='grid grid-cols-2 gap-x-2'>
            <div>Temperature:</div>
            <div>Wind:</div>

            <select class='custom-select form-control' x-model='weather.temp_sys'>
                <option selected value='metric'>Metric</option>
                <option value='imperial'>Imperial</option>
                <option value='both_m'>Both (inputs metric)</option>
                <option value='both_i'>Both (inputs imperial)</option>
            </select>

            <select class='custom-select form-control' x-model='weather.wind_sys'>
                <option selected value='metric'>Metric</option>
                <option value='imperial'>Imperial</option>
                <option value='both'>Both</option>
            </select>
        </div>

        <div class='flex justify-between'>
            <div>Cinematic temperature description:</div>

            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" x-model='weather.cinematic'/>
                <span class="custom-control-indicator"></span>
            </label>
        </div>


        <div>
            <div>Weather generation seed:</div>
            <div class='flex input-group'>
                <input type='number' id='seasons_seed' class='form-control' x-model='weather.seed'/>
                <div class="input-group-append">
                    <div class='btn btn-primary' id='reseed_seasons'><i class="fa fa-redo"></i></div>
                </div>
            </div>
        </div>
    </div>
</div>
