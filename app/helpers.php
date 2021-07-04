<?php

use App\Services\CalendarService\Interval;

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
     * Least Common Multiple Offset (bool) will calculate whether two intervals with individual offsets will ever intersect
     *
     * @param Interval   x   The first interval
     * @param Interval   y   The second interval
     *
     * @return bool         Whether these two intervals will ever intersect
     */
    function lcmo_bool(Interval $x, Interval $y): bool
    {
        return abs($x->offset - $y->offset) == 0 || (abs($x->offset - $y->offset) % gmp_gcd($x->interval, $y->interval)) == 0;
    }
}

if(!function_exists('lcmo')){
    /**
     * Least Common Multiple Offset will calculate whether two intervals with individual offsets will ever collide,
     * and return an array containing the result, the starting point of their repetition, and how often they repeat
     *
     * @param Interval $x   The first interval
     * @param Interval $y   The second interval
     *
     * @return mixed		                                Either false if the two intervals never intersect, or
     *                                                      an array with the result, starting point, and interval
     */
    function lcmo(Interval $x, Interval $y)
    {

        if(!lcmo_bool($x, $y)){
            return false;
        }

        $x_start = $x->offset;
        $y_start = $y->offset;

        // If the starts aren't the same, then we need to search for the first instance the intervals' starting points line up
        if($x_start != $y_start){

            // Until the starting points line up, keep incrementing them until they do
            while($x_start != $y_start){

                while($x_start < $y_start){
                    $x_start += $x->interval;
                }

                while($y_start < $x_start){
                    $y_start += $y->interval;
                }
            }
        }

        $interval = gmp_lcm($x->interval, $y->interval);

        return new Interval(strval($interval), $x_start);
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

if(!function_exists('ordinal')) {
    /*
     * Copied from https://stackoverflow.com/a/3110033
     */
    function ordinal($number) {
        return (new NumberFormatter('en_US', NumberFormatter::ORDINAL))->format($number);
    }
}

if(!function_exists('date_slug')) {
    function date_slug($year, $month = 0, $day = 0) {
        return $year.'-'.$month.'-'.$day;
    }
}

/**
 * Counts the number of characters of a string in UTF-8.
 * Unit-tested by Kasper and works 100% like strlen() / mb_strlen()
 *
 * @param    string        UTF-8 multibyte character string
 * @return    integer        The number of characters
 * @see strlen()
 * @author    Martin Kutschker <martin.t.kutschker@blackbox.net>
 */
if (!function_exists('utf8_strlen')) {
      function utf8_strlen($str)    {
            $n=0;
    for($i=0; isset($str[$i]) && strlen($str[$i])>0; $i++)    {
                  $c = ord($str[$i]);
      if (!($c & 0x80))    // single-byte (0xxxxxx)
                        $n++;
      elseif (($c & 0xC0) == 0xC0)    // multi-byte starting byte (11xxxxxx)
        $n++;
    }
    return $n;
  }
}
