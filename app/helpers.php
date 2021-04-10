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

if(!function_exists('lcmo_bool')) {
    /**
     * Least Common Multiple Offset (bool) will calculate whether two intervals with individual offsets will ever collide
     *
     * @param  int      x   The first interval
     * @param  int      y   The second interval
     * @param  int      a   The first interval's offset
     * @param  int      b   The second interval's offset
     * @return bool         Whether these two intervals will ever collide
     */
    function lcmo_bool($x, $y, $a, $b){
        return abs($a - $b) == 0 || abs($a - $b) % gmp_gcd($x, $y) == 0;
    }
}

if(!function_exists('lcmo')){
    /**
     * Least Common Multiple Offset will calculate whether two intervals with individual offsets will ever collide,
     * and return an array containing the result, the starting point of their repitition, and how often they repeat
     *
     * @param  int      x   The first interval
     * @param  int      y   The second interval
     * @param  int      a   The first interval's offset
     * @param  int      b   The second interval's offset
     * @return array		An array with the result, starting point, and interval
     */
    function lcmo($x, $y, $a, $b){

        if(!lcmo_bool($x, $y, $a, $b)){
            return ["result" => false];
        }

        $x_start = abs($x + $a) % $x;
        $y_start = abs($y + $b) % $y;

        // If the starts aren't the same, then we need to search for the first instance the intervals' starting points line up
        if($x_start != $y_start){

            // Until the starting points line up, keep increasing them until they do
            while($x_start != $y_start){

                while($x_start < $y_start){
                    $x_start += $x;
                }

                while($y_start < $x_start){
                    $y_start += $y;
                }
            }
        }

        return [
            "result" => true,
            "offset" => $x_start,
            "interval" => gmp_lcm($x, $y)
        ];
    }
}

if(!function_exists('unicode_to_ascii')) {
    function unicode_to_ascii( $str )
    {
        return strtr(utf8_decode($str),
            utf8_decode(
                'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ'),
            'SOZsozYYuAAAAAAACEEEEIIIIDNOOOOOOUUUUYsaaaaaaaceeeeiiiionoooooouuuuyy');
    }
}
