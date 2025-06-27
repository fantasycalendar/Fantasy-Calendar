
<div
    class='col-12 my-2'
    x-data="SaveButton"
    @calendar-validation-failed.window="addErrors"
    @calendar-validation-succeeded.window="removeErrors"
    @calendar-loaded.window="calendarLoaded"
    @calendar-updated.window="calendarUpdated"
    @events-changed.window="calendarUpdated"
>
    <div class='row'>
        <button
            type="button"
            :disabled="disabled"
            x-text="text"
            @click="save"
            class='btn btn-lg btn-block'
            :class='{
                "btn-secondary": disabled,
                "btn-primary": !disabled && has_changes,
                "btn-warning": !disabled && warning
            }'
        ></button>
    </div>
</div>