<?php

namespace Database\Factories;

use App\Models\Calendar;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CalendarFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Calendar::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            "name" => "Test calendar",
            "hash" => md5(Str::random(100000)),
            "dynamic_data" => [
                "epoch" => 0,
                "year" => 0,
                "timespan" => 0,
                "day" => 1
            ],
            "static_data" => [
                "first_day" => 1,
                "overflow" => false,
                "year_data" => [
                    "timespans" => [],
                    "leap_days" => [],
                    "global_week" => []
                ],
                "settings" => [
                    "year_zero_exists" => false
                ]
            ]
        ];
    }
}
