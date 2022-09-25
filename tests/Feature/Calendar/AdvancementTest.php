<?php

namespace Tests\Feature\Calendar;

use Tests\TestCase;

class AdvancementTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_automatic_advancement()
    {
        $calendars = $this->getEdgeCases('advancement_testcases')->map->static_data;

        dd($calendars);
    }
}
