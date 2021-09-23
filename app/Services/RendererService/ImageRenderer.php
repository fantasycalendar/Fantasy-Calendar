<?php

namespace App\Services\RendererService;

use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\RendererService\ImageRenderer\ThemeFactory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as ImageFile;

class ImageRenderer
{
    private Collection $parameters;
    private Calendar $calendar;
    private ImageFile $image;
    private Collection $themes;
    private EpochsCollection $weeks;

    private int $x;
    private int $y;

    private ImageRenderer\Theme $theme;

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
    private int $day_number_size;
    private int $day_number_padding;

    private $weekdays;
    private int $intercalary_spacing;
    private int $intercalary_weeks_count = 0;

    private int $savedTimes = 0;
    private string $snapshotFolder;


    public function __construct(Calendar $calendar, Collection $monthRenderData, ?Collection $parameters = null)
    {
        $month = $monthRenderData;
        $this->parameters = $parameters ?? collect();

        $this->month = $month->get('month');
        $this->weeks = $month->get('weeks');
        $this->weekdays = $month->get('weekdays');
        $this->calendar = $calendar;

        $this->themes = collect();

        $this->mergeParameters();
        $this->initializeParametrics();
    }

    public static function make(Calendar $calendar, Collection $monthRenderData, ?Collection $parameters = null)
    {
        return new static($calendar, $monthRenderData, $parameters);
    }

    public static function renderMonth(Calendar $calendar, $parameters)
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

        return static::make($calendar, collect(MonthRenderer::prepareFrom($calendar)), $parameters)
            ->render();
    }

    private function mergeParameters()
    {
        $this->x = $this->parameters->get('width', 400);
        $this->y = $this->parameters->get('height', 240);


        $this->padding = $this->parameters->get('padding', 0);
        $this->shadow_offset = $this->parameters->get('shadow_offset', 1);
        $this->shadow_size_difference = $this->parameters->get('shadow_size_difference', 0);
        $this->shadow_strength = $this->parameters->get('shadow_strength', 5);

        $this->header_height = $this->parameters->get('header_height', min(round($this->y / 7), 180));

        $default_divider_width = $this->x > 600
            ? 2
            : 1;

        $this->header_divider_width = $this->parameters->get('header_divider_width', $default_divider_width);
        $this->weekday_header_height = $this->parameters->get('weekday_header_height', min(round($this->header_height / 3), 42));
        $this->grid_line_width = $this->parameters->get('grid_line_width', 1);

        $this->intercalary_spacing = $this->parameters->get('intercalary_spacing', min(max($this->weekday_header_height / 4, 1), 15));

        $this->setupTheme();
    }

    private function initializeParametrics()
    {
        if($this->parameters->get('debug')) {
            $this->snapshotFolder = storage_path("calendarImages/snapshot-" . now()->format('Y-m-d H:i:s') . '/');

            if(!Storage::disk('local')->has($this->snapshotFolder)) {
                mkdir($this->snapshotFolder, 0777, true);
            }
        }

        $this->grid_bounding_x1 = $this->padding;
        $this->grid_bounding_y1 = $this->padding + $this->header_height + $this->weekday_header_height;
        $this->grid_bounding_x2 = $this->x - $this->padding;
        $this->grid_bounding_y2 = $this->y - $this->padding;

        $this->week_length = $this->weekdays->count();
        $this->weeks_count = $this->calculateWeeksCount();

        /* Determine width of grid columns based on the area reserved for days */
        $boundingBoxWidth = $this->grid_bounding_x2 - $this->grid_bounding_x1;
        $this->grid_column_width = ($boundingBoxWidth) / $this->week_length;

        /* Determine height of grid rows based on the area reserved for days */
        $boundingBoxHeight = $this->grid_bounding_y2 - $this->grid_bounding_y1;
        $totalIntercalarySpacing = $this->intercalary_spacing * $this->intercalary_weeks_count * 2;
        $this->grid_row_height = ($boundingBoxHeight - $totalIntercalarySpacing) / $this->weeks_count;

        $this->day_number_size = min(max($this->grid_row_height / 4, 8), 38);
        $this->day_number_padding = min(max($this->day_number_size / 5, 1), 12);
    }

    public function render()
    {
        $this->freshImage();
        $this->drawDropShadow();
        $this->drawHeaderBlock();
        $this->drawWeekdayNames();
        $this->drawWeeks();

        return $this->image->encode('png', 95);
    }

    /**
     * @return void
     */
    private function freshImage(): void
    {
        $this->image = Image::canvas($this->x,$this->y, $this->theme->get('background_color'));
        $this->snapshot();
    }

    /**
     * Draws a drop-shadow on our image (if padding > 20), by:
     * 1. Creating a rectangle of our theme's shadow_color, the size of our image minus padding
     * 2. Blurring the image
     * 3. Creating another rectangle of the same size, of our theme's background_color
     */
    private function drawDropShadow()
    {
        if($this->padding >= 20) {
            $this->rectangle(
                $this->padding - $this->shadow_size_difference + $this->shadow_offset,
                $this->padding - $this->shadow_size_difference + $this->shadow_offset,
                $this->x - $this->padding + $this->shadow_size_difference + $this->shadow_offset,
                $this->y - $this->padding + $this->shadow_size_difference + $this->shadow_offset,
                0,
                $this->colorize('shadow'),
            );

            $this->image->blur($this->shadow_strength);
            $this->snapshot();

            $this->rectangle(
                $this->padding,
                $this->padding,
                $this->x - $this->padding - 1,
                $this->y - $this->padding - 1
            );

            return;
        }

        $this->rectangle(
            $this->padding,
            $this->padding,
            $this->x - $this->padding - 1,
            $this->y - $this->padding - 1,
            1,
            $this->colorize('background'),
            $this->colorize('border')
        );
    }

    private function drawHeaderBlock()
    {
        $this->line(
            $this->padding,
            $this->padding + $this->header_height,
            $this->x - $this->padding,
            $this->padding + $this->header_height,
            $this->header_divider_width
        );

        $this->text(
            $this->calendar->name,
            $this->x / 2,
            $this->padding + ($this->header_height / 8),
            $this->header_height / 3.5
        );

        $this->text(
            $this->calendar->current_date,
            $this->x / 2,
            $this->padding + ($this->header_height / 3) + ($this->header_height / 5),
            $this->header_height / 4.5,
        );
    }

    private function drawColumns($y1, $y2, $width = null)
    {
        for($column = 1; $column < $this->week_length; $column++) {
            $column_x = ($column * $this->grid_column_width) + $this->grid_bounding_x1;
            $this->line(
                $column_x,
                $y1,
                $column_x,
                $y2,
                1
            );
        }
    }

    private function drawWeekdayNames()
    {
        $weekdaysY1 = $this->padding + $this->header_height;
        $weekdaysY2 = $weekdaysY1 + $this->weekday_header_height;

        $this->drawColumns($weekdaysY1, $weekdaysY2, $this->header_divider_width);

        $this->line(
            $this->grid_bounding_x1,
            $weekdaysY2,
            $this->grid_bounding_x2,
            $weekdaysY2,
            $this->header_divider_width
        );

        $dayXOffset = $this->grid_column_width / 2;

        $this->weekdays->each(function($weekday, $weekdayIndex) use ($dayXOffset) {
            $this->text(
                $weekday,
                $this->grid_bounding_x1 + $dayXOffset + ($this->grid_column_width * $weekdayIndex),
                $this->padding + $this->header_height + ($this->weekday_header_height / 2),
                $this->weekday_header_height / 2,
                $this->colorize('text'),
                'center',
                'middle',
                $this->bold_font_file,
            );
        });
    }

    private function drawWeeks()
    {
        $current_row_top_y = $this->grid_bounding_y1;

        $this->weeks->each(function($calendarWeek) use (&$current_row_top_y) {
            $this->drawWeek($calendarWeek, $current_row_top_y);
        });
    }

    private function drawWeek($calendarWeek, &$current_row_top_y)
    {

        // Chunk all visual weeks in this calendar week by the length of the week.
        // This is only necessary until we have a ->visualWeekIndex prop on Epochs
        $calendarWeek = $calendarWeek
            ->map->chunk($this->week_length);

        $calendarWeek->each(function($visualWeeks) use (&$current_row_top_y) {
            $this->drawVisualWeeks($visualWeeks, $current_row_top_y);
        });
    }

    private function drawVisualWeeks($visualWeeks, &$current_row_top_y)
    {
        $isIntercalary = false;

        if($this->hasIntercalary($visualWeeks)) {
            $isIntercalary = true;
            $current_row_top_y += $this->intercalary_spacing;
        }

        $visualWeeks->each(function($days, $internal_week_number) use (&$current_row_top_y, $visualWeeks, $isIntercalary) {
            $this->drawVisualWeek($days, $internal_week_number, $current_row_top_y, $visualWeeks, $isIntercalary);

            $current_row_top_y += $this->grid_row_height;
        });
    }

    private function drawVisualWeek($days, $internal_week_number, &$current_row_top_y, $visualWeeks, $isIntercalary)
    {
        $row_bottom_y = $current_row_top_y + $this->grid_row_height;

        $this->line(
            $this->grid_bounding_x1,
            $current_row_top_y,
            $this->grid_bounding_x2,
            $current_row_top_y,
            $this->grid_line_width
        );

        $this->drawColumns($current_row_top_y, $row_bottom_y);

        $this->line(
            $this->grid_bounding_x1,
            $row_bottom_y,
            $this->grid_bounding_x2,
            $row_bottom_y,
            $this->grid_line_width
        );

        $days->each(function($day) use ($row_bottom_y, $internal_week_number, $current_row_top_y) {
            if(!$day) {
                return;
            }

            $color = $day->isNumbered
                ? 'text'
                : 'inactive_text';

            $text = $day->isNumbered
                ? $day->visualDay
                : "N/A";

            $dayX = ($day->visualWeekdayIndex * $this->grid_column_width) + $this->grid_bounding_x1;

            if($day->isCurrent) {
                $this->rectangle(
                    $dayX,
                    $current_row_top_y,
                    $dayX + $this->grid_column_width,
                    $row_bottom_y,
                    1,
                    $this->colorize('current_date'),
                    $this->colorize('border'),
                );
            }

            $this->text(
                $text,
                $dayX + $this->day_number_padding,
                $current_row_top_y + $this->day_number_padding,
                $this->day_number_size,
                $this->colorize($color),
                'left'
            );
        });

        if($isIntercalary && ($visualWeeks->count() == 1 || ($internal_week_number > 0 && $internal_week_number < $visualWeeks->count()))) {
            $current_row_top_y += $this->intercalary_spacing;
        }
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

    private function colorize($type = null)
    {
        if(!request()->get('debug'))
        {
            return $this->theme->get("{$type}_color");
        }

        $hash = md5('color' . rand(1, 500)); // modify 'color' to get a different palettes

        return "#" . substr($hash, 0, 2) . substr($hash, 2, 2) . substr($hash, 4, 2);
    }

    private function rectangle($x1, $y1, $x2, $y2, $border_width = null, $background = null, $border_color = null)
    {
        $this->image->rectangle(
            round($x1),
            round($y1),
            round($x2),
            round($y2),
            function($draw) use ($background, $border_width, $border_color) {
                $draw->background($background ?? $this->colorize('background'));

                if($border_width) {
                    $draw->border($border_width, $border_color ?? $this->colorize('border'));
                }
            }
        );

        $this->snapshot();
    }

    private function line($x1, $y1, $x2, $y2, $width = null, $color = null)
    {
        $this->image->line(
            round($x1),
            round($y1),
            round($x2),
            round($y2),
            function($draw) use ($width, $color) {
                $draw->width($width ?? $this->grid_line_width);
                $draw->color($color ?? $this->colorize('border'));
            }
        );

        $this->snapshot();
    }

    private function text($text, $x, $y, $size, $color = null, $align = 'center', $valign = 'top', $fontFile = null)
    {
        $this->image->text(
            $text,
            round($x),
            round($y),
            function($font) use ($size, $color, $align, $valign, $fontFile) {
                $font->file($fontFile ?? $this->font_file);
                $font->color($color ?? $this->colorize('text'));
                $font->align($align);
                $font->valign($valign);
                $font->size($size);
            }
        );

        $this->snapshot();
    }

    private function snapshot()
    {
        if(!request()->get('snapshot') || !app()->environment('local')) {
            return;
        }

        $this->image->save($this->snapshotFolder . Str::padLeft($this->savedTimes, 6, '0'));
        $this->savedTimes++;
    }

    private function setupTheme()
    {
        $this->theme = ThemeFactory::getTheme($this->parameters->get('theme'));
        $overrides = ['shadow_strength'];

        foreach($overrides as $override) {
            $this->$override = $this->theme->get($override, $this->parameters->get($override, $this->$override));
        }

        $this->font_file = base_path('resources/fonts/'.$this->theme->get('font_name').'-Regular.ttf');
        $this->bold_font_file = base_path('resources/fonts/'.$this->theme->get('font_name').'-Bold.ttf');
    }

    /**
     * Check whether $visualWeeks has an intercalary
     *
     * @param $visualWeeks
     * @return bool
     */
    private function hasIntercalary($visualWeeks): bool
    {
        return $visualWeeks->filter(
            fn($displayedWeeks) => $displayedWeeks->filter(
                fn($day) => optional($day)->isIntercalary
            )->count()
        )->count() > 0;
    }
}

