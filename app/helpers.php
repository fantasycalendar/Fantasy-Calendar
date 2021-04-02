<?php

if(!function_exists('helplink')) {
    function helplink($target = null) {
        return "https://helpdocs.fantasy-calendar.com/" . (($target) ? "topic/" . $target : "");
    }
}

if(!function_exists('mb_substr_replace')) {
    function mb_substr_replace($str, $repl, $start, $length = null)
    {
        $length = is_int($length) ? $length : utf8_strlen($str);
        $repl = str_repeat($repl, $length);

        preg_match_all('/./us', $str, $ar);
        preg_match_all('/./us', $repl, $rar);

        array_splice($ar[0], $start, $length, $rar[0]);
        return implode($ar[0]);
    }
}
