<div class='col' x-data="{
        _date: {
            year: 0,
            timespan: 0,
            day: 0
        },
        get year() {
            if ($store.calendar.static_data.settings.year_zero_exists) {
                return this._date.year;
            } else {
                return (this._date.year >= 0)
                    ? this._date.year + 1
                    : this._date.year;
            }
        },
        set year(value) {
            if ($store.calendar.static_data.settings.year_zero_exists) {
                this._date.year = year;
            } else {
                this._date.year = year > 0 ? year - 1 : year;
            }
        }
    }"
    x-modelable="_date"
    {{ $attributes->whereStartsWith('x-model') }}
    >
    {{ $attributes->get('title') }}

    <div>
        <div class='row my-2'>
            <div class='col'>
                <input type='number' step="1.0" class='form-control small-input' x-model="year" {{ $attributes->whereStartsWith(':disabled') }}>
            </div>
        </div>

        <div class='row my-2'>
            <div class='col'>
                <select
                    type='number'
                    class='form-control'
                    x-model.lazy.number="_date.timespan"
                    {{ $attributes->whereStartsWith(':disabled') }}
                >
                    <template x-for="(month, index) in $store.calendar.get_timespans_in_year_as_select_options(_date.year)">
                        <option :value="index" x-text="month.name"
                                :selected="index === _date.timespan"
                                :disabled="month.disabled"></option>
                    </template>
                </select>
            </div>
        </div>

        <div class='row my-2'>
            <div class='col'>
                <select type='number'
                    class='form-control'
                    x-model.lazy.number="_date.day"
                    {{ $attributes->whereStartsWith(':disabled') }}
                    >
                    <template x-for="(timespan_day, index) in $store.calendar.get_days_in_timespan_in_year_as_select_options(_date.year, _date.timespan)" >
                        <option :value="index+1" x-text="timespan_day"
                                :selected="index+1 === _date.day"></option>
                    </template>
                </select>
            </div>
        </div>
    </div>
</div>
