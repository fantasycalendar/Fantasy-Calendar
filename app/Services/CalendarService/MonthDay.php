<?php


namespace App\Services\CalendarService;


class MonthDay
{
    public $order;
    /**
     * @var float
     */
    public $intercalary;
    /**
     * @var bool
     */
    public function __construct($order, $intercalary)
    {
        $this->order = $order;
        $this->intercalary = $intercalary;
    }

}
