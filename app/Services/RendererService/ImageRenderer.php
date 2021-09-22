<?php

namespace App\Services\RendererService;

use App\Calendar;
use App\Collections\EpochsCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as ImageFile;

class ImageRenderer
{
    private Calendar $calendar;
    private ImageFile $image;
    private Collection $themes;
    private EpochsCollection $weeks;

    private int $x;
    private int $y;

    private string $background;
    private string $shadow;
    private string $current_date_color;

    private string $font_file;
    private string $bold_font_file;

    private int $padding;
    private int $shadow_offset;
    private int $shadow_size_difference;
    private int $shadow_strength;
    private int $header_height;
    private int $header_divider_width;
    private int $weekday_header_height;

    private int $weeks_count;
    private int $week_length;

    private int $grid_bounding_x1;
    private int $grid_bounding_y1;
    private int $grid_bounding_x2;
    private int $grid_bounding_y2;

    private int $grid_line_width;
    private float $grid_column_width;
    private float $grid_row_height;
    private $day_number_size;
    private $day_number_padding;

    private $weekdays;
    private int $intercalary_spacing;
    private int $intercalary_weeks_count = 0;

    private int $savedTimes = 0;
    private string $snapshotFolder;


    public function __construct(Calendar $calendar, array $monthRenderData)
    {
        $month = collect($monthRenderData);

        $this->month = $month->get('month');
        $this->weeks = $month->get('weeks');
        $this->weekdays = $month->get('weekdays');
        $this->calendar = $calendar;

        $this->themes = collect();

        $this->setRequestParams();
        $this->initializeParametrics();
    }

    public static function make(Calendar $calendar, array $monthRenderData)
    {
        return new static($calendar, $monthRenderData);
    }

    public static function renderMonth(Calendar $calendar)
    {
        // ?year=1512&month=6&day=1
        // http://fantasy-calendar.test:9980/calendars/66ce6339d200f81223fe2c0934633786?year=1512&month=8&day=8
        if(request()->has('year') && request()->has('month') && request()->has('day')) {
            $calendar->setDate(
                request()->input('year'),
                request()->input('month'),
                request()->input('day')
            );
        }

        return static::make($calendar, MonthRenderer::prepareFrom($calendar))
            ->render();
    }

    private function setRequestParams()
    {
        $request = request();


        $this->x = $request->input('width', 400);
        $this->y = $request->input('height', 240);

        $this->setupTheme();

        $this->padding = $request->input('padding', 0);
        $this->shadow_offset = $request->input('shadow_offset', 1);
        $this->shadow_size_difference = $request->input('shadow_size_difference', 0);
        $this->shadow_strength = $request->input('shadow_strength', 5);

        $this->header_height = $request->input('header_height', min(round($this->x / 7), 180));

        $default_divider_width = $this->x > 600
            ? 2
            : 1;
        $this->header_divider_width = $request->input('header_divider_width', $default_divider_width);
        $this->weekday_header_height = $request->input('weekday_header_height', min(round($this->header_height / 3), 42));
        $this->grid_line_width = $request->input('grid_line_width', 1);

        $this->intercalary_spacing = $request->input('intercalary_spacing', min(max($this->weekday_header_height / 4, 1), 15));
        
    }

    private function initializeParametrics()
    {
        if(request()->get('debug')) {
            $this->snapshotFolder = storage_path("calendarImages/snapshot-" . now()->format('Y-m-d H:i:s') . '/');

            if(!Storage::disk('local')->has($this->snapshotFolder)) {
                mkdir($this->snapshotFolder, 0777, true);
            }
        }

        $this->grid_bounding_x1 = $this->padding;
        $this->grid_bounding_y1 = $this->padding + $this->header_height + $this->weekday_header_height + $this->intercalary_spacing;
        $this->grid_bounding_x2 = $this->x - $this->padding;
        $this->grid_bounding_y2 = $this->y - $this->padding;

        $this->week_length = $this->weekdays->count();
        $this->weeks_count = $this->calculateWeeksCount();

        $this->grid_column_width = ($this->grid_bounding_x2 - $this->grid_bounding_x1) / $this->week_length;
        $this->grid_row_height = (($this->grid_bounding_y2 - $this->grid_bounding_y1) / $this->weeks_count);

        $this->day_number_size = min(max($this->grid_row_height / 4, 8), 38);
        $this->day_number_padding = min(max($this->day_number_size / 5, 1), 12);
    }

    public function render()
    {
        $this->image = Image::canvas($this->x,$this->y, $this->background);
        $this->snapshot();

        $this->dropShadow();
        $this->headerBlock();
        $this->drawWeekdayNames();

        $week_number = 0;

        $this->weeks->each(function($calendarWeek) use (&$week_number) {
            $calendarWeek->map->chunk($this->week_length)->each(function($visualWeeks, $calendarWeekIndex) use (&$week_number, $calendarWeek) {
                $internal_weeks = $visualWeeks->count();
                $row_y = $this->grid_bounding_y1 + ($week_number * $this->grid_row_height);
                $row_bottom_y = $row_y + ($this->grid_row_height * $visualWeeks->count());
                $isIntercalary = false;

                if($visualWeeks->filter(fn($visualWeeks) => $visualWeeks->filter(fn($day) => optional($day)->isIntercalary)->count())->count()) {
                    $isIntercalary = true;
                    $row_bottom_y = $row_bottom_y - $this->intercalary_spacing;
                    $row_y = $row_y + $this->intercalary_spacing;
                }

                $this->image->line($this->grid_bounding_x1, $row_y, $this->grid_bounding_x2, $row_y, function($draw) {
                    $draw->color($this->colorize());
                    $draw->width($this->grid_line_width);
                });

                $this->snapshot();

                if($week_number < $this->weeks_count - 1) {
                    $this->image->line($this->grid_bounding_x1, $row_bottom_y, $this->grid_bounding_x2, $row_bottom_y, function($draw) {
                        $draw->color($this->colorize());
                        $draw->width($this->grid_line_width);
                    });

                    $this->snapshot();
                }

                $this->drawColumns($row_y, $row_bottom_y);

                $visualWeeks->each(function($days, $internal_week_number) use ($row_y, $visualWeeks, $isIntercalary) {
                    if($isIntercalary && ($internal_week_number > 0 && $internal_week_number < $visualWeeks->count())) {
                        $row_y = $row_y - $this->intercalary_spacing + ($internal_week_number * $this->grid_row_height);

                        $this->image->line($this->grid_bounding_x1, $row_y, $this->grid_bounding_x2, $row_y, function($draw) {
                            $draw->color($this->colorize());
                            $draw->width($this->grid_line_width);
                        });

                        $this->snapshot();
                    }

                    $days->each(function($day, $day_index) use ($internal_week_number, $row_y, &$week_number, &$incremented_visual_week) {
                        if(!$day) {
                            return;
                        }

                        $color = $day->isNumbered
                            ? $this->colorize()
                            : "#72767d";

                        $text = $day->isNumbered
                            ? $day->visualDay
                            : "N/A";

                        $dayHeight = $this->grid_row_height;

                        if($day->isIntercalary) {
                            $dayHeight -= $this->intercalary_spacing;
                        }

                        $dayX = ($day->visualWeekdayIndex * $this->grid_column_width) + $this->grid_bounding_x1;

                        if($day->isCurrent) {
                            $this->image->rectangle(
                                $dayX,
                                $row_y,
                                $dayX + $this->grid_column_width,
                                $row_y + $dayHeight,
                                function($draw) {
                                    $draw->background($this->current_date_color);
                                    $draw->border(1, $this->colorize());
                                }
                            );
                        }

                        $this->image->text(
                            $text,
                             $dayX + $this->day_number_padding,
                            $row_y + $this->day_number_padding,
                            function($font) use ($color) {
                                $font->file($this->font_file);
                                $font->color($color);
                                $font->size($this->day_number_size);
                                $font->valign('top');
                            }
                        );

                        $this->snapshot();
                    });
                });

                $week_number+= $internal_weeks;
            });
        });

        return $this->image->encode('png', 95);
    }

    private function dropShadow()
    {
        if($this->padding >= 20) {
            $this->image->rectangle(
                $this->padding - $this->shadow_size_difference + $this->shadow_offset,
                $this->padding - $this->shadow_size_difference + $this->shadow_offset,
                $this->x - $this->padding + $this->shadow_size_difference + $this->shadow_offset,
                $this->y - $this->padding + $this->shadow_size_difference + $this->shadow_offset,
                function($draw) {
                    $draw->background($this->colorize());
                }
            );
            $this->snapshot();

            $this->image->blur($this->shadow_strength);
            $this->snapshot();

            $this->image->rectangle(
                $this->padding,
                $this->padding,
                $this->x - $this->padding - 1,
                $this->y - $this->padding - 1,
                function($draw) {
                    $draw->background($this->background);
                }
            );
            $this->snapshot();

            return;
        }

        $this->image->rectangle(
            $this->padding,
            $this->padding,
            $this->x - $this->padding - 1,
            $this->y - $this->padding - 1,
            function($draw) {
                $draw->background($this->background);
                $draw->border(1, $this->colorize());
            }
        );
        $this->snapshot();
    }

    private function headerBlock()
    {
        $this->image->line(
            $this->padding,
            $this->padding + $this->header_height,
            $this->x - $this->padding,
            $this->padding + $this->header_height,
            function($draw) {
                $draw->color($this->colorize());
                $draw->width($this->header_divider_width);
            }
        );
        $this->snapshot();

        $this->image->text(
            $this->calendar->name,
            $this->x / 2,
            $this->padding + ($this->header_height / 8),
            function($font) {
                $font->file($this->font_file);
                $font->color($this->colorize());
                $font->align('center');
                $font->valign('top');
                $font->size($this->header_height / 3.5);
            }
        );
        $this->snapshot();

        $this->image->text(
            $this->calendar->current_date,
            $this->x / 2,
            $this->padding + ($this->header_height / 3) + ($this->header_height / 5),
            function($font) {
                $font->file($this->font_file);
                $font->color($this->colorize());
                $font->align('center');
                $font->valign('top');
                $font->size($this->header_height / 4.5);
            }
        );
        $this->snapshot();
    }

    private function drawColumns($y1, $y2, $width = null)
    {
        for($column = 1; $column < $this->week_length; $column++) {
            $column_x = ($column * $this->grid_column_width) + $this->grid_bounding_x1;
            $this->image->line($column_x, $y1, $column_x, $y2, function($draw) use ($width) {
                $draw->color($this->colorize());
                $draw->width($width ?? $this->grid_line_width);
            });

            $this->snapshot();
        }
    }

    private function drawWeekdayNames()
    {
        $weekdaysY1 = $this->padding + $this->header_height;
        $weekdaysY2 = $weekdaysY1 + $this->weekday_header_height;
        $this->drawColumns($weekdaysY1, $weekdaysY2, $this->header_divider_width);

        $this->image->line($this->grid_bounding_x1, $weekdaysY2, $this->grid_bounding_x2, $weekdaysY2, function($draw){
            $draw->color($this->colorize());
            $draw->width($this->header_divider_width);
        });
        $this->snapshot();

        $dayXOffset = $this->grid_column_width / 2;

        $this->weekdays->each(function($weekday, $weekdayIndex) use ($dayXOffset) {
            $this->image->text(
                $weekday,
                $this->grid_bounding_x1 + $dayXOffset + ($this->grid_column_width * $weekdayIndex),
                $this->padding + $this->header_height + ($this->weekday_header_height / 2),
                function($font) {
                    $font->file($this->bold_font_file);
                    $font->size($this->weekday_header_height / 2);
                    $font->align('center');
                    $font->valign('middle');
                    $font->color($this->colorize());
                }
            );
        });
    }

    private function calculateWeeksCount()
    {
        return $this->weeks->map(function($week){
            return $week->map(function($visualWeek){
                if($visualWeek->filter(fn($day) => optional($day)->isIntercalary)->count()){
                    $this->intercalary_weeks_count++;
                }

                return ceil($visualWeek->count() / $this->week_length);
            })->sum();
        })->sum();
    }

    private function colorize()
    {
        if(!request()->get('debug'))
        {
            return $this->shadow;
        }

        $bt = debug_backtrace();
        $caller = array_shift($bt);

        $hash = md5('color' . $caller['line']); // modify 'color' to get a different palette

        return "#" . substr($hash, 0, 2) . substr($hash, 2, 2) . substr($hash, 4, 2);
    }

    private function snapshot()
    {
        if(!request()->get('debug')) {
            return;
        }

        $this->image->save($this->snapshotFolder . Str::padLeft($this->savedTimes, 6, '0'));
        $this->savedTimes++;
    }

    private function setupTheme()
    {
        $request = request();

        if($request->has('theme') && $this->themes->has($request->input('themes'))) {
            $this->setTheme($this->themes->get($request->input('themes')));
        } else {
            $this->background = $request->input('background', "#36393F");
            $this->shadow = $request->input('shadow', "#dcddde");
            $this->current_date_color = $request->input('current_date_color', "#49443C");
            $this->font_file = base_path('resources/fonts/Noah-Regular.ttf');
            $this->bold_font_file = base_path('resources/fonts/Noah-Bold.ttf');
        }
    }
}

