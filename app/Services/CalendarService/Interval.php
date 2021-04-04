<?php


namespace App\Services\CalendarService;


class Interval
{
    public string $interval;
    public bool $negated;
    public bool $ignores_offset;
    public int $years;

    /**
     * Interval constructor.
     * @param $interval
     */
    public function __construct($interval)
    {
        $this->interval = $interval;
        $this->negated = str_contains($interval, '!');
        $this->ignores_offset = str_contains($interval, '+');
        $this->years = intval(str_replace('!', '', $interval));
    }

    public function voteOnYear($year)
    {
        if(($year % $this->years) === 0) {
            if($this->negated) return 'deny';

            return 'allow';
        }

        return 'abstain';
    }
}


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
    ]

}