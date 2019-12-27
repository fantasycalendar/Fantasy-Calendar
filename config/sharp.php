<?php

return [
    "entities" => [
        "user" => [
            "list" => \App\Sharp\UserList::class,
        ]
    ],

    "auth" => [
        'display_attribute' => 'username',
        'check_handler' => \App\Sharp\Auth\SharpCheckHandler::class,
    ],
];
