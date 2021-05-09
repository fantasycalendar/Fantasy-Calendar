<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional place to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'discord' => [
        'client_id' => env('DISCORD_CLIENT_ID'),
        'client_secret' => env('DISCORD_CLIENT_SECRET'),
        'redirect' => env('DISCORD_REDIRECT_URI'),

        // optional
        'allow_gif_avatars' => (bool)env('DISCORD_AVATAR_GIF', true),
        'avatar_default_extension' => env('DISCORD_EXTENSION_DEFAULT', 'jpg'), // only pick from jpg, png, webp
        'global_commands' => [
            'fc' => [
                'name' => 'fc',
                'description' => 'Get information from Fantasy Calendar',
                'options' => [
                    [
                        'name' => 'echo',
                        'description' => 'Says back what you said.',
                        'type' => 1,
                        'options' => [
                            [
                                'name' => 'echo',
                                'description' => 'A string to echo',
                                'type' => 3,
                                'required' => true
                            ]
                        ]
                    ],
                    [
                        'name' => 'list',
                        'description' => 'Lists your Fantasy Calendar calendars.',
                        'type' => 1
                    ],
                    [
                        'name' => 'use',
                        'description' => 'Set the default calendar for use in this server',
                        'type' => 1,
                        'options' => [
                            [
                                'name' => 'id',
                                'description' => 'The calendar number, gathered from the list command',
                                'type' => 4,
                                'required' => true
                            ]
                        ]
                    ],
                    [
                        'name' => 'month',
                        'description' => "Show the current month of this server's default calendar.",
                        'type' => 1
                    ]
                ]
            ]
        ],
        'command_handlers' => [
            'fc' => [
                'echo' => \App\Services\Discord\Commands\Command\EchoHandler::class,
                'list' => \App\Services\Discord\Commands\Command\ListHandler::class,
                'use' => \App\Services\Discord\Commands\Command\UseHandler::class,
                'month' => \App\Services\Discord\Commands\Command\MonthHandler::class,
            ]
        ]
    ],
];
