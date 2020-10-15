<?php

return [
    "entities" => [
        "user" => [
            "list" => \App\Sharp\UserList::class,
            "show" => \App\Sharp\UserShow::class,
            "form" => \App\Sharp\UserForm::class,
        ],
        "calendars" => [
            "list" => \App\Sharp\CalendarList::class,
            "show" => \App\Sharp\CalendarShow::class
        ],
        "old_calendars" => [
            "list" => \App\Sharp\OldCalendarList::class,
        ],
        "presets" => [
            "list" => \App\Sharp\PresetList::class,
            "show" => \App\Sharp\PresetShow::class,
            "form" => \App\Sharp\PresetForm::class,
        ],
        "env" => [
            "list" => \App\Sharp\EnvVarsList::class,
        ]
    ],

    "dashboards" => [
        "statistics" => [
            "view" => \App\Sharp\StatisticsDashboard::class
        ]
    ],

    "menu" => [
        [
            "label" => "Back to App",
            "icon" => "fa-arrow-left",
            "url" => "/"
        ],
        [
            "label" => "Users",
            "icon" => "fa-users",
            "entity" => "user"
        ],
        [
            "label" => "Calendars",
            "icon" => "fa-calendar",
            "entity" => "calendars"
        ],
        [
            "label" => "Presets",
            "icon" => "fa-calendar",
            "entity" => "presets"
        ],
        [
            "label" => "Statistics",
            "icon" => "fa-chart-bar",
            "dashboard" => "statistics"
        ],
        [
            "label" => "Env Vars",
            "icon" => "fa-cog",
            "entity" => "env"
        ]
    ],

    "auth" => [
        'display_attribute' => 'username',
        'check_handler' => \App\Sharp\Auth\SharpCheckHandler::class,
    ],
];
