<div class="flex-grow">
    <button
        x-data="CreateButton"
        @calendar-validation-failed.window="addErrors"
        @calendar-validation-succeeded.window="removeErrors"
        @calendar-loaded.window="calendarLoaded"
        @calendar-step-changed.window="evaluateCalendarStep"
        type="button"
        :disabled="disabled"
        x-text="text"
        @click="save"
        x-cloak
        class='btn btn-lg btn-block'
        :class='{
            "btn-secondary": disabled && !save_status,
            "btn-primary": !disabled,
            "btn-warning": !disabled && warning && !save_status,
            "btn-danger": save_status === "error",
            "btn-success": save_status === "success",
        }'
    ></button>
</div>
