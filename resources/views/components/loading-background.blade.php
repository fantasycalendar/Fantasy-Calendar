<div class='basic-background blurred_background' x-data="LoadingBackground" x-show="visible"
     x-cloak @set-loading-screen-visible.window="set_loading_screen_visible">
    <img class='loading_spinner' src='{{ asset("resources/icons/loader_white.png") }}'>
    <div id='loading_information_text' class='bold-text' x-show="info_text" x-text="info_text"></div>
    <div id='loading_text' class='italics-text' x-text="random_text"></div>

    <div class='loading_cancel_button_container' x-show="show_cancel_button">
        <button type='button' class='btn btn-danger full loading_cancel_button' @click="cancel">Cancel</button>
    </div>
</div>