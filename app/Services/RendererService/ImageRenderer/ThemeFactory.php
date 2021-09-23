<?php

namespace App\Services\RendererService\ImageRenderer;

use Illuminate\Support\Arr;

class ThemeFactory
{
    /**
     * @var null
     */
    private $name;
    private static $themes = [
        'discord' => [
            'background_color' => "#36393F",
            'shadow_color' => "#DCDDDE",
            'border_color' => "#40444B",
            'current_date_color' => "#49443C",
            'heading_text_color' => "#DCDDDE",
            'text_color' => '#DCDDDE',
            'inactive_text_color' => '#72767d',
            'font_name' => 'Noah',
        ],
        'fantasy_calendar' => [
            'background_color' => '#303030',
            'shadow_color' => '#222',
            'border_color' => "#222",
            'current_date_color' => "#9e6116",
            'heading_text_color' => '#FFFFFF',
            'text_color' => '#FFFFFF',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ]
    ];

    public function __construct($name = 'fantasy_calendar')
    {
        $this->name = $name;
    }

    public function get()
    {
        return static::getTheme($this->name);
    }

    public static function getTheme($name = null): Theme
    {
        $themeData = Arr::get(
            self::$themes,
            $name ?? 'fantasy_calendar',
            Arr::get(self::$themes, 'fantasy_calendar')
        );

        return new Theme($themeData);
    }
}
