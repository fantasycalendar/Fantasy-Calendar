

<div class="modal_background w-100" x-data="{
    content: [],
    show: false,
    steps: 0,
    current_step: 0,
    step_changed($event) {
        this.current_step = $event.detail.step;
        this.steps = $event.detail.steps;
        this.content = $event.detail.content
        this.show = !$event.detail.done;
    },
    get header_text() {
        return 'Calendar creation (' + (this.current_step) + '/' + this.steps + ')';
    }
}"
     x-cloak
     x-show="show"
    @calendar-step-changed.window="step_changed"
>
    <div id="modal" class="creation mt-5 py-5 d-flex flex-column align-items-center justify-content-center">
        <span class="modal_text">
            <h3 class="opacity-70" x-text="header_text"></h3>
        </span>
        <ol class="mb-4">
            <template x-for="step in content">
                <li><i class="fas mr-2" :class="step.icon"></i><span x-text="step.text"></span></li>
            </template>
        </ol>

        <img class="w-100" src='/resources/calendar_create.svg'>
    </div>
</div>