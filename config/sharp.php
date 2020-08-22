<?php

return [
    "entities" => [
        "user" => [
            "list" => \App\Sharp\UserList::class,
            "show" => \App\Sharp\UserShow::class,
            "form" => \App\Sharp\UserForm::class,
        ],
        "calendars" => [
            "list" => \App\Sharp\CalendarList::class
        ],
        "env" => [
            "list" => \App\Sharp\EnvVarsList::class,
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
