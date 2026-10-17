<div class="flex-grow">
    <button
        x-data="SaveButton"
        @calendar-validation-failed.window="addErrors"
        @calendar-validation-succeeded.window="removeErrors"
        @calendar-loaded.window="calendarLoaded"
        @calendar-updated.window="calendarUpdated"
        @events-changed.window="calendarUpdated"
        type="button"
        :disabled="disabled"
        x-text="text"
        @click="save"
        class='btn btn-lg btn-block'
        :class='{
            "btn-secondary": disabled && !save_status,
            "btn-primary": !disabled && has_changes,
            "btn-warning": !disabled && warning && !save_status,
            "btn-danger": save_status === "error",
            "btn-success": save_status === "success",
        }'
    ></button>
</div>
