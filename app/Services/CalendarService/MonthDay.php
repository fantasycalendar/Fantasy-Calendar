<?php


namespace App\Services\CalendarService;


class MonthDay
{
    public $order;
    /**
     * @var float
     */
    public bool $intercalary;
    public bool $isNumbered;

    /**
     * @param $order
     * @param $intercalary
     * @param bool $isNumbered
     */
    public function __construct($order, bool $intercalary, bool $isNumbered = true)
    {
        $this->order = $order;
        $this->intercalary = $intercalary;
        $this->isNumbered = $isNumbered;
    }

}
