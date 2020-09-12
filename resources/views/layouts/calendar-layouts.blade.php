<div
    class='clickable_background hidden'
    x-data="CalendarLayouts"
    :class="{ 'hidden':!open }"
    x-show='open'
>
    <div class='modal-basic-container'>
        <div class='modal-basic-wrapper'>
            <form id="preset-form" class="modal-wrapper preset-wrapper container" action="post">

                <div class='close-ui-btn-bg'></div>
                <i class="close_ui_btn fas fa-times-circle" @click="open = false"></i>

                <div class='row no-gutters mb-1 modal-form-heading'>
                    <div class="text-center col-12 col-md-12">
                        <h2 style="opacity: 0.5; line-height: 0.8;">Calendar Layouts</h2>
                    </div>
                </div>

            </form>
        </div>
    </div>
</div>
