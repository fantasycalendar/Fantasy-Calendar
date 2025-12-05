<div class='mb-2'>
    Current location:

    <select class='form-control' @change="locationChanged">
        <template x-for="(options, label) of location_select_options">
            <optgroup :label="label">
                <template x-for="(location, _) of options">
                    <option :value="location.key" :selected="location.key == location_select_value" x-text="location.name"></option>
                </template>
            </optgroup>
        </template>
    </select>
</div>
