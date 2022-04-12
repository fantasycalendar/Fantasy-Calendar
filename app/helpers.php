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

if(!function_exists('log_json')) {
    function log_json(ArrayAccess $arrayAccess) {
        logger(json_encode($arrayAccess, JSON_PRETTY_PRINT));
    }
}


if(!function_exists('words_to_number')) {
    /**
     * Convert numerals to digits
     * answer to https://stackoverflow.com/questions/1077600/converting-words-to-numbers-in-php
     *
     * @param string $input
     *
     * @return string
     */
    function words_to_number(string $input)
    {
        static $delims = " \-,.!?:;\\/&\(\)\[\]";
        static $tokens = [
            'zero'        => ['val' => '0', 'power' => 1],
            'a'           => ['val' => '1', 'power' => 1],
            'first'       => ['val' => '1', 'suffix' => 'st', 'power' => 1],
            'one'         => ['val' => '1', 'power' => 1],
            'second'      => ['val' => '2', 'suffix' => 'nd', 'power' => 1],
            'two'         => ['val' => '2', 'power' => 1],
            'third'       => ['val' => '3', 'suffix' => 'rd', 'power' => 1],
            'three'       => ['val' => '3', 'power' => 1],
            'fourth'      => ['val' => '4', 'suffix' => 'th', 'power' => 1],
            'four'       => ['val' => '4', 'power' => 1],
            'fifth'       => ['val' => '5', 'suffix' => 'th', 'power' => 1],
            'five'        => ['val' => '5', 'power' => 1],
            'sixth'       => ['val' => '6', 'suffix' => 'th', 'power' => 1],
            'six'         => ['val' => '6', 'power' => 1],
            'seventh'     => ['val' => '7', 'suffix' => 'th', 'power' => 1],
            'seven'       => ['val' => '7', 'power' => 1],
            'eighth'      => ['val' => '8', 'suffix' => 'th', 'power' => 1],
            'eight'       => ['val' => '8', 'power' => 1],
            'ninth'       => ['val' => '9', 'suffix' => 'th', 'power' => 1],
            'nine'        => ['val' => '9', 'power' => 1],
            'tenth'       => ['val' => '10', 'suffix' => 'th', 'power' => 1],
            'ten'         => ['val' => '10', 'power' => 10],
            'eleventh'    => ['val' => '11', 'suffix' => 'th', 'power' => 10],
            'eleven'      => ['val' => '11', 'power' => 10],
            'twelveth'    => ['val' => '12', 'suffix' => 'th', 'power' => 10],
            'twelfth'    => ['val' => '12', 'suffix' => 'th', 'power' => 10],
            'twelve'      => ['val' => '12', 'power' => 10],
            'thirteenth'  => ['val' => '13', 'suffix' => 'th', 'power' => 10],
            'thirteen'    => ['val' => '13', 'power' => 10],
            'fourteenth'  => ['val' => '14', 'suffix' => 'th', 'power' => 10],
            'fourteen'    => ['val' => '14', 'power' => 10],
            'fifteenth'   => ['val' => '15', 'suffix' => 'th', 'power' => 10],
            'fifteen'     => ['val' => '15', 'power' => 10],
            'sixteenth'   => ['val' => '16', 'suffix' => 'th', 'power' => 10],
            'sixteen'     => ['val' => '16', 'power' => 10],
            'seventeenth' => ['val' => '17', 'suffix' => 'th', 'power' => 10],
            'seventeen'   => ['val' => '17', 'power' => 10],
            'eighteenth'  => ['val' => '18', 'suffix' => 'th', 'power' => 10],
            'eighteen'    => ['val' => '18', 'power' => 10],
            'nineteenth'  => ['val' => '19', 'suffix' => 'th', 'power' => 10],
            'nineteen'    => ['val' => '19', 'power' => 10],
            'twentieth'   => ['val' => '20', 'suffix' => 'th', 'power' => 10],
            'twenty'      => ['val' => '20', 'power' => 10],
            'thirty'      => ['val' => '30', 'power' => 10],
            'forty'       => ['val' => '40', 'power' => 10],
            'fourty'      => ['val' => '40', 'power' => 10], // common misspelling
            'fifty'       => ['val' => '50', 'power' => 10],
            'sixty'       => ['val' => '60', 'power' => 10],
            'seventy'     => ['val' => '70', 'power' => 10],
            'eighty'      => ['val' => '80', 'power' => 10],
            'ninety'      => ['val' => '90', 'power' => 10],
            'hundred'     => ['val' => '100', 'power' => 100],
            'thousand'    => ['val' => '1000', 'power' => 1000],
            'million'     => ['val' => '1000000', 'power' => 1000000],
            'billion'     => ['val' => '1000000000', 'power' => 1000000000],
            'and'           => ['val' => '', 'power' => null],
        ];
        $powers = array_column($tokens, 'power', 'val');

        $mutate = function ($parts) use (&$mutate, $powers){
            $stack = new \SplStack;
            $sum   = 0;
            $last  = null;

            foreach ($parts as $idx => $arr) {
                $part = $arr['val'];

                if (!$stack->isEmpty()) {
                    $check = $last ?? $part;

                    if ((float)$stack->top() < 20 && (float)$part < 20 ?? (float)$part < $stack->top() ) { //пропускаем спец числительные
                        return $stack->top().(isset($parts[$idx - $stack->count()]['suffix']) ? $parts[$idx - $stack->count()]['suffix'] : '')." ".$mutate(array_slice($parts, $idx));
                    }
                    if (isset($powers[$check]) && $powers[$check] <= $arr['power'] && $arr['power'] <= 10) { //но добавляем степени (сотни, тысячи, миллионы итп)
                        return $stack->top().(isset($parts[$idx - $stack->count()]['suffix']) ? $parts[$idx - $stack->count()]['suffix'] : '')." ".$mutate(array_slice($parts, $idx));
                    }
                    if ($stack->top() > $part) {
                        if ($last >= 1000) {
                            $sum += $stack->pop();
                            $stack->push($part);
                        } else {
                            // twenty one -> "20 1" -> "20 + 1"
                            $stack->push($stack->pop() + (float) $part);
                        }
                    } else {
                        $current = $stack->pop();
                        if (is_numeric($current)) {
                            $stack->push($current * (float) $part);
                        } else {
                            $stack->push($part);
                        }
                    }
                } else {
                    $stack->push($part);
                }

                $last = $part;
            }

            return $sum + $stack->pop();
        };

        $prepared = preg_split('/(['.$delims.'])/', $input, -1, PREG_SPLIT_DELIM_CAPTURE);

        //Замена на токены
        foreach ($prepared as $idx => $word) {
            if (is_array($word)) {continue;}
            $maybeNumPart = trim(strtolower($word));
            if (isset($tokens[$maybeNumPart])) {
                $item = $tokens[$maybeNumPart];
                if (isset($prepared[$idx+1])) {
                    $maybeDelim = $prepared[$idx+1];
                    if ($maybeDelim === " ") {
                        $item['delim'] = $maybeDelim;
                        unset($prepared[$idx + 1]);
                    } elseif ($item['power'] == null && !isset($tokens[$maybeDelim])) {
                        continue;
                    }
                }
                $prepared[$idx] = $item;
            }
        }

        $result      = [];
        $accumulator = [];

        $getNumeral = function () use ($mutate, &$accumulator, &$result) {
            $last        = end($accumulator);
            $result[]    = $mutate($accumulator).(isset($last['suffix']) ? $last['suffix'] : '').(isset($last['delim']) ? $last['delim'] : '');
            $accumulator = [];
        };

        foreach ($prepared as $part) {
            if (is_array($part)) {
                $accumulator[] = $part;
            } else {
                if (!empty($accumulator)) {
                    $getNumeral();
                }
                $result[] = $part;
            }
        }
        if (!empty($accumulator)) {
            $getNumeral();
        }

        return implode('', array_filter($result));
    }
}

if(!function_exists('clamp')) {
    function clamp($number, $lower, $upper) {
        return max($lower, min($upper, $number));
    }
}

if(!function_exists('format_timestamp')) {
    function format_timestamp($timestamp) {
        return (!$timestamp)
            ? null
            : (new Carbon\Carbon($timestamp))->toFormattedDateString();
    }
}

if(!function_exists('format_money')) {
    function format_money($cents) {
        return number_format($cents / 100, 2);
    }
}

if(!function_exists('random_fantasy_name')) {
    function random_fantasy_name() {
        $names = [
            'Krusk the Half-orc',
            'Tenser the Lazy',
            'Bigby "Talk to the Hand" of Veluna',
            'Otto the Dancer',
            'Drawmij the Summoner',
            'Aura Creator Nystul',
            'Rary, Creator of Telepathic Bond',
            'Otiluke of the Sphere',
            'Elminster',
            'Drizzt Do\'Urden',
            'Strahd von Zarovich',
            'Vecna, The Whispered One',
            'Lolth, Demon Queen of Spiders',
            'Tiamat, Bane of Bahamut',
            'Gruumsh One-Eye',
            'Bahamut the Justice Bringer',
            'Moradin of the Hammer',
            'Mystra, Lady of Spells',
            'Karsus, Unmaker of the Weave'
        ];

        return $names[array_rand($names)];
    }
}

if(!function_exists('mdToHtml')) {
    function mdToHtml($markdown) {
        return (new League\CommonMark\GithubFlavoredMarkdownConverter())->convert($markdown);
    }
}

if(!function_exists('feature')) {
    function feature($name) {
        if(empty(config('app.features_enabled'))) {
            return true;
        }

        return in_array($name, config('app.features_enabled'));
    }
}
