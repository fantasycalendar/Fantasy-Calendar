<?php

namespace App\Services\RendererService\ImageRenderer;

use Illuminate\Support\Arr;

class ThemeFactory
{
    /**
     * @var null
     */
    private $name;
    public static $themes = [
        'discord' => [
            'background_color' => "#36393f",
            'shadow_color' => "#dcddde",
            'border_color' => "#40444b",
            'current_date_color' => "#49443c",
            'placeholder_background_color' => '#2f3136',
            'heading_text_color' => "#dcddde",
            'text_color' => '#dcddde',
            'inactive_text_color' => '#72767d',
            'font_name' => 'Noah',
        ],
        'fantasy_calendar' => [
            'background_color' => '#303030',
            'shadow_color' => '#222222',
            'border_color' => "#222222",
            'current_date_color' => "#9e6116",
            'placeholder_background_color' => '#343434',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
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
