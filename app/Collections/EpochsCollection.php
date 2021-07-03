<?php


namespace App\Collections;


use App\Services\EpochService\Epoch;
use Illuminate\Support\Collection as BaseCollection;

class EpochsCollection extends BaseCollection
{
    /**
     * @param Epoch $epoch
     * @return $this
     */
    public function insert(Epoch $epoch): EpochsCollection
    {
        $this->offsetSet($epoch->slug, $epoch);

        return $this;
    }

    /**
     * @param $epochAttributes
     * @return $this
     */
    public function insertFromArray($epochAttributes): EpochsCollection
    {
        $this->insert(new Epoch($epochAttributes));
        return $this;
    }

    /**
     * @param $year
     * @param int $month
     * @param int $day
     * @return bool
     */
    public function hasDate($year, $month = 0, $day = 1): bool
    {
        return $this->has(date_slug($year, $month, $day));
    }

    /**
     * @param $year
     * @param int $month
     * @param int $day
     * @return Epoch
     */
    public function getByDate($year, $month = 0, $day = 1): Epoch
    {
        return $this->get(date_slug($year, $month, $day));
    }

    /**
     * @param $year
     * @return EpochsCollection
     */
    public function whereYear($year): EpochsCollection
    {
        return $this->where('year', '=', $year);
    }

    /**
     * @param $monthIndexOfYear
     * @return EpochsCollection
     */
    public function whereMonthIndexOfYear($monthIndexOfYear): EpochsCollection
    {
        return $this->where('monthIndexOfYear', '=', $monthIndexOfYear);
    }

    /**
     *
     *
     * @return EpochsCollection
     */
    public function chunkByWeeks(): EpochsCollection
    {
        return $this->groupBy('weeksSinceMonthStart')
            ->map->chunkWhile(function($epoch, $key, $chunk) {
                return $epoch->isIntercalary === $chunk->last()->isIntercalary;
            });
    }
}
