<?php

namespace App\Services\RendererService;

use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\RendererService\ImageRenderer\ThemeFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Imagick;
use ImagickDraw;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as ImageFile;

class ImageRenderer
{
    private Collection $cache;
    private Calendar $calendar;
    private Collection $defaults;
    private Collection $parameters;
    private Collection $intercalaryDividerYs;
    private EpochsCollection $weeks;
    private ImageFile $image;
    private ImageRenderer\Theme $theme;

    private int $x;
    private int $max_x = 1080 * 2;
    private int $y;
    private int $max_y = 1920 * 2;

    private string $font_file;
    private string $bold_font_file;

    private int $weeks_count;
    private int $week_length;

    private int $calendar_bounding_x1;
    private int $calendar_bounding_y1;
    private int $calendar_bounding_x2;
    private int $calendar_bounding_y2;

    private int $grid_bounding_x1;
    private int $grid_bounding_y1;
    private int $grid_bounding_x2;
    private int $grid_bounding_y2;

    private float $grid_column_width;
    private float $grid_row_height;
    private int $day_number_size;
    private int $day_number_padding;

    private $weekdays;

    private int $savedTimes = 0;
    private string $snapshotFolder;
    private $minimum_weekday_header_height = 20;
    private $maximum_header_height = 180;
    private $minimum_header_height = 50;
    private $min_day_text_length;

    /**
     * ImageRenderer constructor.
     * @param Calendar $calendar
     * @param Collection $monthRenderData
     * @param Collection|null $parameters
     */
    public function __construct(Calendar $calendar, Collection $monthRenderData, ?Collection $parameters = null)
    {
        $this->defaults = $this->defaults();
        $this->parameters = $parameters ?? collect();
        $this->intercalaryDividerYs = collect();
        $this->cache = collect();
        $this->calendar = $calendar;

        $this->month = $monthRenderData->get('month');
        $this->weeks = $monthRenderData->get('weeks');
        $this->weekdays = $monthRenderData->get('clean_weekdays');
        $this->week_length = $monthRenderData->get('week_length');
        $this->weeks_count = $monthRenderData->get('weeks_count');
        $this->intercalary_weeks_count = $monthRenderData->get('intercalary_weeks_count');
        $this->min_day_text_length = $monthRenderData->get('min_day_text_length');


        $this->setupTheme();
        $this->determineCanvasDimensions();
        $this->initializeParametrics();
        $this->setupThemeOverrides();
    }

    /**
     * Returns the defaults, or methods to devise the defaults
     *
     * @return Collection
     */
    public function defaults(): Collection
    {
        return collect([
            'padding' => 0,
            'shadow_offset' => 1,
            'shadow_size_difference' => 0,
            'shadow_strength' => 5,
            'grid_line_width' => 1,
            'debug' => 0,
            'snapshot' => 0,
            'theme' => 'discord',
            'quality' => 95,
            'size' => 'md',

            // Callables - Used for responsiveness until a proper responsive system gets put in place. =)
            'header_height' => fn() => clamp(round(($this->y - ($this->padding * 2)) / 7), $this->minimum_header_height, $this->maximum_header_height),
            'weekday_header_height' => fn() => clamp($this->header_height / 4, 18, 42),
            'header_divider_width' => fn() => $this->x > 600 ? 2 : 1,
            'weekday_header_divider_width' => fn() => $this->x > 600 ? 2 : 1,
            'intercalary_spacing' => fn() => clamp($this->weekday_header_height / 4, 4, 30),
        ]);
    }

    /**
     * Create a new ImageRenderer
     *
     * @param Calendar $calendar
     * @param Collection $monthRenderData
     * @param Collection|null $parameters
     * @return ImageRenderer
     */
    public static function make(Calendar $calendar, Collection $monthRenderData, ?Collection $parameters = null): ImageRenderer
    {
        return new static($calendar, $monthRenderData, $parameters);
    }

    /**
     * Explicitly render and cache the current month of a given calendar
     *
     * @param Calendar $calendar
     * @param $parameters
     * @return mixed
     * @throws \Exception
     */
    public static function renderMonth(Calendar $calendar, $parameters)
    {
        if($parameters->has('year') && $parameters->has('month_id') && $parameters->has('day')) {
            $calendar->setDate(
                (int) $parameters->get('year'),
                (int) $parameters->get('month_id'),
                (int) $parameters->get('day')
            );
        }

        $cacheName = $calendar->hash . '-' . $calendar->epoch->slug . '-' . sha1($parameters->toJson());
        return cache()->remember($cacheName, 300, function() use ($calendar, $parameters){
            return static::make($calendar, collect(MonthRenderer::prepareFrom($calendar)), $parameters)
                ->render();
        });
    }

    private function initializeParametrics()
    {
        if($this->parameter('snapshot')) {
            $this->snapshotFolder = storage_path("calendarImages/snapshot-" . now()->format('Y-m-d H:i:s') . '/');

            if(!Storage::disk('local')->has($this->snapshotFolder)) {
                mkdir($this->snapshotFolder, 0777, true);
            }
        }

        $this->calendar_bounding_x1 = $this->padding;
        $this->calendar_bounding_y1 = $this->padding;
        $this->calendar_bounding_x2 = $this->x - $this->padding - 1;
        $this->calendar_bounding_y2 = $this->y - $this->padding - 1;

        $this->grid_bounding_x1 = $this->calendar_bounding_x1;
        $this->grid_bounding_y1 = $this->padding + $this->header_height + $this->weekday_header_height;
        $this->grid_bounding_x2 = $this->calendar_bounding_x2;
        $this->grid_bounding_y2 = $this->calendar_bounding_y2;

        /* Determine width of grid columns based on the area reserved for days */
        $boundingBoxWidth = $this->grid_bounding_x2 - $this->grid_bounding_x1;
        $this->grid_column_width = ($boundingBoxWidth) / $this->week_length;

        /* Determine height of grid rows based on the area reserved for days */
        $boundingBoxHeight = $this->grid_bounding_y2 - $this->grid_bounding_y1;
        $totalIntercalarySpacing = $this->intercalary_spacing * $this->intercalary_weeks_count * 2;
        $this->grid_row_height = ($boundingBoxHeight - $totalIntercalarySpacing) / $this->weeks_count;

        $this->day_number_size = clamp($this->parameter('day_number_size', $this->grid_row_height / 4), 12, 38);
        $this->day_number_padding = clamp($this->day_number_size / 4, 1, 12);
    }

    public function render()
    {
        $this->freshImage();
        $this->drawDropShadow();
        $this->drawHeaderBlock();
        $this->drawWeeks();
        $this->drawWeekdayNames();
        $this->drawColumns();
        $this->drawIntercalaryDividers();

        return $this->image->encode($this->ext, $this->quality);
    }

    /**
     * @return void
     */
    private function freshImage(): void
    {
        $this->image = Image::canvas($this->x,$this->y, $this->colorize('background'));
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
        $border_width = 1;

        if($this->padding >= 20) {
            $this->rectangle(
                $this->calendar_bounding_x1 + $this->shadow_size_difference + $this->shadow_offset,
                $this->calendar_bounding_y1 + $this->shadow_size_difference + $this->shadow_offset,
                $this->calendar_bounding_x2 + $this->shadow_size_difference + $this->shadow_offset,
                $this->calendar_bounding_y2 + $this->shadow_size_difference + $this->shadow_offset,
                0,
                $this->colorize('shadow'),
            );

            $this->image->blur($this->shadow_strength);
            $this->snapshot();

            $border_width = 1;
        }

        $this->rectangle(
            $this->calendar_bounding_x1,
            $this->calendar_bounding_y1,
            $this->calendar_bounding_x2,
            $this->calendar_bounding_y2,
            $border_width,
            $this->colorize('placeholder_background'),
            $this->colorize('border')
        );
    }

    /**
     * Draws the header block containing the calendar name and date
     */
    private function drawHeaderBlock()
    {
        $this->rectangle(
            $this->calendar_bounding_x1,
            $this->calendar_bounding_y1,
            $this->calendar_bounding_x2,
            $this->grid_bounding_y1,
            1,
            $this->colorize('background')
        );

        $this->line(
            $this->grid_bounding_x1 + 1,
            $this->padding + $this->header_height,
            $this->grid_bounding_x2 - 1,
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

    /**
     * Draws vertical lines between days
     *
     * @param $y1
     * @param $y2
     * @param null $width
     */
    private function drawColumns()
    {
        for($column = 1; $column < $this->week_length; $column++) {
            $column_x = ($column * $this->grid_column_width) + $this->grid_bounding_x1;
            $this->line(
                $column_x,
                $this->padding + $this->header_height,
                $column_x,
                $this->y - $this->padding - 1,
                1
            );
        }
    }

    /**
     * Draws in the names of the weekdays and the lines between them
     */
    private function drawWeekdayNames()
    {
        $weekdaysY1 = $this->padding + $this->header_height;
        $weekdaysY2 = $weekdaysY1 + $this->weekday_header_height;

        $this->line(
            $this->grid_bounding_x1 + 1,
            $weekdaysY2,
            $this->grid_bounding_x2 - 1,
            $weekdaysY2,
            $this->header_divider_width
        );

        $dayXOffset = $this->grid_column_width / 2;

        $this->weekdays->each(function($weekday, $weekdayIndex) use ($dayXOffset) {
            $this->text(
                Str::limit($weekday, $this->min_day_text_length, ''),
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

    /**
     * Draws in the week days! It does that through a few layers, keeping track
     * of the current 'y' value of the top of the last drawn week, just to keep things (relatively) tidy.
     * In short: Our calendar data is formatted as
     * [
     *      'calendarWeeks' => [
     *          'visualWeeks' => [
     *              'days' => [
     *                  // Epoch objects for days OR nulls for empty spaces.
     *              ]
     *          ]
     *      ]
     * ]
     */
    private function drawWeeks()
    {
        $current_row_top_y = $this->grid_bounding_y1;

        $this->weeks->each(function($calendarWeek) use (&$current_row_top_y) {
            $this->drawWeek($calendarWeek, $current_row_top_y);
        });
    }

    /**
     * Takes an individual calendar week and draws its visual weeks
     *
     * @param $calendarWeek
     * @param $current_row_top_y
     */
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

    /**
     * Goes through all of the visual weeks its given and draws them.
     * Additionally, this is where vertical intercalary spacing is applied, since
     * we want that applied between visual weeks (even if there are "internal" weeks within,
     * due to overflow by way of long leap days)
     *
     * @param $visualWeeks
     * @param $current_row_top_y
     */
    private function drawVisualWeeks($visualWeeks, &$current_row_top_y)
    {
        $isIntercalary = false;

        if($this->hasIntercalary($visualWeeks)) {
            $isIntercalary = true;
            $this->intercalaryDividerYs->push($current_row_top_y);

            $current_row_top_y += $this->intercalary_spacing;
        }

        $visualWeeks->each(function($days, $internal_week_number) use (&$current_row_top_y, $visualWeeks, $isIntercalary) {
            $this->drawVisualWeek($days, $internal_week_number, $current_row_top_y, $visualWeeks, $isIntercalary);

            $current_row_top_y += $this->grid_row_height;
        });

        if($isIntercalary) {
            $this->intercalaryDividerYs->push($current_row_top_y - $this->intercalary_spacing);
        }
    }

    /**
     * Draws a singular visual week, by:
     * 1. drawing the top line
     * 2. drawing the column lines
     * 3. drawing the bottom line
     * 4. filling in the current day background color (if applicable)
     * 5. filling in the "empty day" background color (if applicable)
     * 6. drawing the day number (or N/A for non-numbered leap days)
     *
     * @param $days
     * @param $internal_week_number
     * @param $current_row_top_y
     * @param $visualWeeks
     * @param $isIntercalary
     */
    private function drawVisualWeek($days, $internal_week_number, &$current_row_top_y, $visualWeeks, $isIntercalary)
    {
        $row_bottom_y = $current_row_top_y + $this->grid_row_height;

        $leading_empty_days = $days->takeWhile(function ($day){
            return empty($day);
        })->count();

        $days_left_x = ($leading_empty_days * $this->grid_column_width) + $this->grid_bounding_x1;

        $days_to_fill = $days->skipWhile(function($day) {
            return empty($day);
        })->takeWhile(function($day) {
            return !empty($day);
        })->count();

        $days_right_x = ($days_to_fill * $this->grid_column_width) + $days_left_x;

        $this->rectangle(
            $days_left_x,
            $current_row_top_y,
            $days_right_x,
            $row_bottom_y,
            1,
            $this->parameter('background')
        );

        $days->each(function($day) use ($row_bottom_y, $internal_week_number, $current_row_top_y) {
            if(!$day) {
                return;
            }

            $dayX = ($day->visualWeekdayIndex * $this->grid_column_width) + $this->grid_bounding_x1;

            $color = $day->isNumbered
                ? 'text'
                : 'inactive_text';

            $text = $day->isNumbered
                ? $day->visualDay
                : "N/A";


            if($day->isCurrent) {
                $this->rectangle(
                    $dayX,
                    $current_row_top_y,
                    min($dayX + $this->grid_column_width, $this->grid_bounding_x2),
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

    private function drawIntercalaryDividers()
    {
        $this->intercalaryDividerYs->each(function($y) {
            $this->rectangle(
                $this->grid_bounding_x1,
                $y,
                $this->grid_bounding_x2,
                $y + $this->intercalary_spacing,
                1,
                $this->parameter('background')
            );
        });
    }

    private function colorize($type = null)
    {
        if(!request()->get('debug'))
        {
            return $this->parameter("{$type}_color") ?? $this->theme->get("{$type}_color");
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

        $this->image->save($this->snapshotFolder . Str::padLeft($this->savedTimes, 6, '0') . '.' . $this->parameter('ext'));
        $this->savedTimes++;
    }

    private function setupTheme()
    {
        $this->theme = ThemeFactory::getTheme($this->parameters->get('theme'));

        $this->font_file = base_path('resources/fonts/'.$this->theme->get('font_name').'-Regular.ttf');
        $this->bold_font_file = base_path('resources/fonts/'.$this->theme->get('font_name').'-Bold.ttf');
    }

    private function setupThemeOverrides()
    {
        $overrides = ['shadow_strength'];

        foreach($overrides as $override) {
            $this->$override = $this->theme->get($override, $this->parameters->get($override, $this->$override));
        }
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

    private function autoSizeBoth()
    {
        $intercalary_spacing = 4;
        $day_width = min($this->min_day_text_length * 6, 30);
        $day_height = 26;
        $weekday_header_height = $this->minimum_weekday_header_height; // 24
        $header_height = 35; // 50
        $day_number_size = 10;

        // 'small' sizes chosen arbitrarily.
        // The rest are proportional
        // You're welcome, future me!
        $size_presets = [
            'md' => [
                'divide' => 3,
                'multiply' => 4,
            ],
            'lg' => [
                'divide' => 18,
                'multiply' => 31
            ],
            'xl' => [
                'divide' => 12,
                'multiply' => 25
            ],
            'xxl' => [
                'divide' => 72,
                'multiply' => 175,
            ]
        ];

        $size = $this->parameter('size');
        if($size && Arr::has($size_presets, $size)) {
            foreach(['intercalary_spacing', 'day_width','day_height','weekday_header_height','header_height', 'day_number_size'] as $property) {
                $$property /= $size_presets[$size]['divide'];
                $$property *= $size_presets[$size]['multiply'];
            }
        }

        $this->intercalary_spacing = $intercalary_spacing;

        $this->parameters->put('grid_column_width', $day_width);
        $this->parameters->put('grid_row_height', $day_height);
        $this->parameters->put('weekday_header_height', clamp($weekday_header_height, $this->minimum_weekday_header_height, 80));
        $this->parameters->put('header_height', clamp($header_height, $this->minimum_header_height, $this->maximum_header_height));
        $this->parameters->put('day_number_size', clamp($day_number_size, 10, 50));

        $this->x = clamp($this->week_length * $day_width, 240, $this->max_y);
        $this->y = $this->parameter('weekday_header_height') + $this->parameter('header_height') + ($this->intercalary_spacing * $this->intercalary_weeks_count * 2) + ($this->weeks_count * $day_height) + 1;
    }

    private function autoSizeWidthOnly()
    {
        return (int) ($this->week_length * (
                ($this->y - $this->header_height) / $this->weeks_count
            ));
    }

    private function autoSizeHeightOnly()
    {
        return (int) (($this->weeks_count * (
                $this->x / $this->week_length
            )) / 6) * 7;
    }

    /**
     * Warning: DIRTY STINKY HAX
     */
    private function determineCanvasDimensions()
    {
        if($this->parameters->has('width') && $this->parameters->has('height')) {
            $this->y = clamp($this->parameters->get('height'), 240, $this->max_x);
            $this->x = clamp($this->parameters->get('width'), 240, $this->max_y);

            return;
        }

        if($this->parameters->has('height')) {
            $this->y = clamp($this->parameters->get('height'), 240, $this->max_x);
            $this->x = clamp($this->autoSizeWidthOnly(), 240, $this->max_y);

            return;
        }

        if($this->parameters->has('width')) {
            $this->x = clamp($this->parameters->get('width'), 240, $this->max_y);
            $this->y = clamp($this->autoSizeHeightOnly(), 240, $this->max_x);

            return;
        }

        $this->autoSizeBoth();
    }

    private function determineTextSize($string, $font_size)
    {
        $image = new Imagick();
        $draw = new ImagickDraw();
        $draw->setFillColor(new \ImagickPixel('black'));
        $draw->setStrokeAntialias(true);
        $draw->setTextAntialias(true);
        $draw->setFontSize(24);
        // Set typeface
        $draw->setFont($this->bold_font_file);
        // Calculate size
        $metrics = $image->queryFontMetrics($draw,$string,FALSE);
        $w=$metrics['textWidth'];
        $h=$metrics['textHeight'];

        return [
            'width' => $w,
            'height' => $h
        ];
    }

    private function parameter(string $string, $last_resort = null)
    {
        $result = $this->cache->get($string)
            ?? $this->parameters->get($string)
            ?? $this->theme->get($string)
            ?? $this->defaults->get($string)
            ?? $last_resort;

        if(is_callable($result)) {
            $result = $result();
        }

        $this->cache->put($string, $result);

        return $result;
    }

    public function __get($name)
    {
        return $this->parameter($name);
    }
}

