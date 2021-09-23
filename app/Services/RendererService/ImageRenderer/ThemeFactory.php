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
            'shadow_color' => "#dcddde",
            'border_color' => "#dcddde",
            'current_date_color' => "#49443C",
            'text_color' => '#dcddde',
        ]
    ];

    public function __construct($name = 'discord')
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
            $name ?? 'discord',
            Arr::get(self::$themes, 'discord')
        );

        return new Theme($themeData);
    }
}
