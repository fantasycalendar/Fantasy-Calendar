<?php

return [
    "entities" => [
        "user" => [
            "list" => \App\Sharp\UserList::class,
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
        ]
    ],

    "auth" => [
        'display_attribute' => 'username',
        'check_handler' => \App\Sharp\Auth\SharpCheckHandler::class,
    ],
];
