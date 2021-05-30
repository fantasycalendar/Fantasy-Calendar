<?php


namespace App\Collections;


use App\Services\EpochService\Epoch;
use Illuminate\Support\Collection;
use Illuminate\Support\Collection as BaseCollection;

class EpochsCollection extends BaseCollection
{
    public function insert(Epoch $epoch)
    {
        $this->offsetSet($epoch->slug, $epoch);

        return $this;
    }
}
