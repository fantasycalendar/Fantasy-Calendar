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
        ],
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
        'red' => [
            'background_color' => '#b71c1c',
            'shadow_color' => '#c62828',
            'border_color' => "#c62828",
            'current_date_color' => "#d32f2f",
            'placeholder_background_color' => '#b71c1c',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'orange' => [
            'background_color' => '#e65100',
            'shadow_color' => '#ef6c00',
            'border_color' => "#ef6c00",
            'current_date_color' => "#f57c00",
            'placeholder_background_color' => '#e65100',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'deep_orange' => [
            'background_color' => '#bf360c',
            'shadow_color' => '#d84315',
            'border_color' => "#d84315",
            'current_date_color' => "#e64a19",
            'placeholder_background_color' => '#bf360c',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'yellow' => [
            'background_color' => '#f57f17',
            'shadow_color' => '#f9a825',
            'border_color' => "#f9a825",
            'current_date_color' => "#fbc02d",
            'placeholder_background_color' => '#f57f17',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'green' => [
            'background_color' => '#1b5e20',
            'shadow_color' => '#2e7d32',
            'border_color' => "#2e7d32",
            'current_date_color' => "#388e3c",
            'placeholder_background_color' => '#1b5e20',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'light_green' => [
            'background_color' => '#33691e',
            'shadow_color' => '#558b2f',
            'border_color' => "#558b2f",
            'current_date_color' => "#689f38",
            'placeholder_background_color' => '#33691e',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'lime' => [
            'background_color' => '#827717',
            'shadow_color' => '#9e9d24',
            'border_color' => "#9e9d24",
            'current_date_color' => "#afb42b",
            'placeholder_background_color' => '#827717',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'teal' => [
            'background_color' => '#004d40',
            'shadow_color' => '#00695c',
            'border_color' => "#00695c",
            'current_date_color' => "#00796b",
            'placeholder_background_color' => '#004d40',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'blue' => [
            'background_color' => '#0d47a1',
            'shadow_color' => '#1565c0',
            'border_color' => "#1565c0",
            'current_date_color' => "#1976d2",
            'placeholder_background_color' => '#0d47a1',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'cyan' => [
            'background_color' => '#006064',
            'shadow_color' => '#00838f',
            'border_color' => "#00838f",
            'current_date_color' => "#0097a7",
            'placeholder_background_color' => '#006064',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'light_blue' => [
            'background_color' => '#01579b',
            'shadow_color' => '#0277bd',
            'border_color' => "#0277bd",
            'current_date_color' => "#0288d1",
            'placeholder_background_color' => '#01579b',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'indigo' => [
            'background_color' => '#1a237e',
            'shadow_color' => '#283593',
            'border_color' => "#283593",
            'current_date_color' => "#303f9f",
            'placeholder_background_color' => '#1a237e',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'purple' => [
            'background_color' => '#4a148c',
            'shadow_color' => '#6a1b9a',
            'border_color' => "#6a1b9a",
            'current_date_color' => "#7b1fa2",
            'placeholder_background_color' => '#4a148c',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'deep_purple' => [
            'background_color' => '#311b92',
            'shadow_color' => '#4527a0',
            'border_color' => "#4527a0",
            'current_date_color' => "#512da8",
            'placeholder_background_color' => '#311b92',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'pink' => [
            'background_color' => '#880e4f',
            'shadow_color' => '#ad1457',
            'border_color' => "#ad1457",
            'current_date_color' => "#c2185b",
            'placeholder_background_color' => '#880e4f',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'brown' => [
            'background_color' => '#3e2723',
            'shadow_color' => '#4e342e',
            'border_color' => "#4e342e",
            'current_date_color' => "#5d4037",
            'placeholder_background_color' => '#3e2723',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'grey' => [
            'background_color' => '#212121',
            'shadow_color' => '#424242',
            'border_color' => "#424242",
            'current_date_color' => "#616161",
            'placeholder_background_color' => '#212121',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
        'blue_grey' => [
            'background_color' => '#263238',
            'shadow_color' => '#37474f',
            'border_color' => "#37474f",
            'current_date_color' => "#455a64",
            'placeholder_background_color' => '#263238',
            'heading_text_color' => '#ffffff',
            'text_color' => '#ffffff',
            'inactive_text_color' => '#717171',
            'font_name' => 'Noah',
            'shadow_strength' => '30',
        ],
    ];

    public function __construct($name = 'fantasy_calendar')
    {
        $this->name = $name;
    }

    public static function getThemeNames()
    {
        return collect(array_keys(static::$themes))
            ->mapWithkeys(function($theme){
                return [
                    $theme => ucwords(str_replace('_', ' ', $theme))
                ];
            })->merge(['custom' => 'Custom Theme'])->toArray();
    }

    public static function getThemesRich()
    {
        return collect(\App\Services\RendererService\ImageRenderer\ThemeFactory::$themes)
            ->map(function($theme){
                return collect($theme)->reject(function($value, $key){
                    return in_array($key, ['font_name', 'shadow_strength']);
                })
                ->map(function($value, $key){
                    return [
                        'field' => $key,
                        'value' => $value,
                        'title' => ucwords(str_replace(['_', 'color'], [' ', ''], $key))
                    ];
                });
            });
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
