<div class='h-full w-full bg-gray-900/75 flex z-[5000] flex-col justify-center fixed items-center'
     x-data="LoadingBackground" x-show="visible" x-cloak
     @app-busy-start.window="show" @app-busy-end.window="hide" @app-update-progress.window="update_progress">
    <div class="flex flex-col justify-center items-center gap-4 select-none w-[500px]">


        <img class='loading_spinner' x-show="show_throbber" src='{{ Vite::asset("resources/images/icons/loader_white.png") }}'>

        <div id='loading_information_text' class='font-bold' x-show="info_text" x-text="info_text"></div>

        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700" x-show="percentage">
            <div class="bg-emerald-500 h-2.5 rounded-full" :style="`width: ${percentage}%`"></div>
        </div>

        <div id='loading_text' class='italic' x-text="random_text"></div>

        <div class='loading_cancel_button_container' x-show="show_cancel_button">
            <button type='button' class='btn btn-danger w-full loading_cancel_button' @click="cancel">Cancel</button>
        </div>

    </div>
</div>
