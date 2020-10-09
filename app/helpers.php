<?php

if(!function_exists('helplink')) {
    function helplink($target = null) {
        return "https://helpdocs.fantasy-calendar.com/" . (($target) ? "topic/" . $target : "");
    }
}
