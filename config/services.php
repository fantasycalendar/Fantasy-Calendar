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
        'enabled' => (!empty(env('DISCORD_CLIENT_ID')) && !empty(env('DISCORD_CLIENT_SECRET')) && !empty(env('DISCORD_REDIRECT_URI'))),
        'client_id' => env('DISCORD_CLIENT_ID'),
        'client_secret' => env('DISCORD_CLIENT_SECRET'),
        'redirect' => env('DISCORD_REDIRECT_URI'),
        'global_command' => env('DISCORD_COMMAND'),

        // optional
        'allow_gif_avatars' => (bool)env('DISCORD_AVATAR_GIF', true),
        'avatar_default_extension' => env('DISCORD_EXTENSION_DEFAULT', 'jpg'), // only pick from jpg, png, webp
        'global_commands' => [
            env('DISCORD_COMMAND', 'fc') => [
                'name' => env('DISCORD_COMMAND', 'fc'),
                'description' => 'Get information from Fantasy Calendar',
                'options' => [
                    [
                        'name' => 'help',
                        'description' => 'Lists the available commands and their functions',
                        'type' => 1
                    ],
                    [
                        'name' => 'choose',
                        'description' => 'Set the default calendar for use in this server',
                        'type' => 1,
                    ],
                    [
                        'name' => 'show',
                        'description' => 'Displays information from your selected calendar',
                        'type' => 2,
                        'options' => [
                            [
                                'name' => 'date',
                                'description' => 'Displays just the date',
                                'type' => 1
                            ],
                            [
                                'name' => 'month',
                                'description' => 'Displays the current month',
                                'type' => 1
                            ],
                            [
                                'name' => 'day',
                                'description' => 'Displays information about the current date',
                                'type' => 1
                            ],
                            [
                                'name' => 'link',
                                'description' => 'Displays a public view link',
                                'type' => 1
                            ]
//                            [
//                                'name' => 'event',
//                                'description' => 'Searches for an event by name, displaying info on the closest match',
//                                'type' => 1
//                            ],
//                            [
//                                'name' => 'era',
//                                'description' => 'Displays just the current era',
//                                'type' => 1
//                            ],
                        ]
                    ],
//                    [
//                        'name' => 'set',
//                        'description' => 'Set the date of your selected calendar',
//                        'type' => 2,
//                        'options' => [
//                            [
//                                'name' => 'date',
//                                'description' => 'Sets the current date',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'datestring',
//                                        'description' => 'A date to set the calendar to.',
//                                        'type' => 3,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'hour',
//                                'description' => 'Sets the current hour',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'hour',
//                                        'description' => 'The hour of the day to set',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'minute',
//                                'description' => 'Sets the current minute',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'minute',
//                                        'description' => 'The minute of the current hour to set',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'day',
//                                'description' => 'Sets the current day',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'day',
//                                        'description' => 'The day to set the calendar to (Number within month or name, if applicable)',
//                                        'type' => 3,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'month',
//                                'description' => 'Sets the current month',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'month',
//                                        'description' => 'The name or number of the month to set to',
//                                        'type' => 3,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'year',
//                                'description' => 'Sets the current year',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'year',
//                                        'description' => 'The absolute year (ignoring eras) to set to',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'setting',
//                                'description' => 'Change your personal settings for this Discord integration',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'name',
//                                        'description' => 'Name of the setting to change',
//                                        'type' => 4,
//                                        'required' => false,
//                                        'choices' => [
//                                            [
//                                                'name' => 'Default show',
//                                                'value' => 1
//                                            ],
//                                            [
//                                                'name' => 'Date format',
//                                                'value' => 2
//                                            ],
//                                            [
//                                                'name' => 'Calendar',
//                                                'value' => 3
//                                            ],
//                                        ]
//                                    ],
//                                    [
//                                        'name' => 'value',
//                                        'description' => 'Value to set the setting to',
//                                        'type' => 4,
//                                        'required' => false
//                                    ]
//                                ]
//                            ],
//                        ]
//                    ],
                    [
                        'name' => 'add',
                        'description' => 'Advance the date or time of your selected calendar',
                        'type' => 2,
                        'options' => [
                            [
                                'name' => 'day',
                                'description' => 'Add a day',
                                'type' => 1
                            ],
                            [
                                'name' => 'days',
                                'description' => 'Add a set number of days',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'days',
                                        'description' => 'The number of days to add',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
                            [
                                'name' => 'month',
                                'description' => 'Add a month',
                                'type' => 1
                            ],
                            [
                                'name' => 'months',
                                'description' => 'Add a set number of months',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'months',
                                        'description' => 'The number of months to add',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
                            [
                                'name' => 'year',
                                'description' => 'Add a year',
                                'type' => 1
                            ],
                            [
                                'name' => 'years',
                                'description' => 'Add a set number of years',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'years',
                                        'description' => 'The number of years to add',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
//                            [
//                                'name' => 'minute',
//                                'description' => 'Add a minute',
//                                'type' => 1
//                            ],
//                            [
//                                'name' => 'minutes',
//                                'description' => 'Add a set number of minutes',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'minutes',
//                                        'description' => 'The number of minutes to add',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'hour',
//                                'description' => 'Add a hour',
//                                'type' => 1
//                            ],
//                            [
//                                'name' => 'hours',
//                                'description' => 'Add a set number of hours',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'hours',
//                                        'description' => 'The number of hours to add',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'event',
//                                'description' => 'Add an one-time event to the current date of the calendar',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'title',
//                                        'description' => 'Title of the event to be added',
//                                        'type' => 3,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
                        ],
                    ],

                    [
                        'name' => 'sub',
                        'description' => 'Backtrack the date of your selected calendar',
                        'type' => 2,
                        'options' => [
                            [
                                'name' => 'day',
                                'description' => 'Subtract a day',
                                'type' => 1
                            ],
                            [
                                'name' => 'days',
                                'description' => 'Subtract a set number of days',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'days',
                                        'description' => 'The number of days to subtract',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
                            [
                                'name' => 'month',
                                'description' => 'Subtract a month',
                                'type' => 1
                            ],
                            [
                                'name' => 'months',
                                'description' => 'Subtract a set number of months',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'months',
                                        'description' => 'The number of months to subtract',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
                            [
                                'name' => 'year',
                                'description' => 'Subtract a year',
                                'type' => 1
                            ],
                            [
                                'name' => 'years',
                                'description' => 'Subtract a set number of years',
                                'type' => 1,
                                'options' => [
                                    [
                                        'name' => 'years',
                                        'description' => 'The number of years to subtract',
                                        'type' => 4,
                                        'required' => true
                                    ]
                                ]
                            ],
//                            [
//                                'name' => 'minute',
//                                'description' => 'Subtract a minute',
//                                'type' => 1
//                            ],
//                            [
//                                'name' => 'minutes',
//                                'description' => 'Subtract a set number of minutes',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'minutes',
//                                        'description' => 'The number of minutes to subtract',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
//                            [
//                                'name' => 'hour',
//                                'description' => 'Subtract an hour',
//                                'type' => 1
//                            ],
//                            [
//                                'name' => 'hours',
//                                'description' => 'Subtract a set number of hours',
//                                'type' => 1,
//                                'options' => [
//                                    [
//                                        'name' => 'hours',
//                                        'description' => 'The number of hours to subtract',
//                                        'type' => 4,
//                                        'required' => true
//                                    ]
//                                ]
//                            ],
                        ],
                    ],
                ]
            ]
        ],
        'command_handlers' => [
            env('DISCORD_COMMAND', 'fc') => [
                'help' => \App\Services\Discord\Commands\Command\HelpHandler::class,
                'show' => [
                    'date' => \App\Services\Discord\Commands\Command\Show\DateHandler::class,
                    'month' => \App\Services\Discord\Commands\Command\Show\MonthHandler::class,
                    'day' => \App\Services\Discord\Commands\Command\Show\DayHandler::class,
                    'link' => \App\Services\Discord\Commands\Command\Show\LinkHandler::class,
//                    'event' => \App\Services\Discord\Commands\Command\Show\EventHandler::class,
//                    'era' => \App\Services\Discord\Commands\Command\Show\EraHandler::class,
                ],
//                'set' => [
//                    'date' => \App\Services\Discord\Commands\Command\Set\DateHandler::class,
//                    'hour' => \App\Services\Discord\Commands\Command\Set\HourHandler::class,
//                    'minute' => \App\Services\Discord\Commands\Command\Set\MinuteHandler::class,
//                    'day' => \App\Services\Discord\Commands\Command\Set\DayHandler::class,
//                    'month' => \App\Services\Discord\Commands\Command\Set\MonthHandler::class,
//                    'year' => \App\Services\Discord\Commands\Command\Set\YearHandler::class,
//                    'setting' => \App\Services\Discord\Commands\Command\Set\SettingsHandler::class
//                ],
                'add' => \App\Services\Discord\Commands\Command\DateChangesHandler::class,
                'sub' => \App\Services\Discord\Commands\Command\DateChangesHandler::class,
                'choose' => \App\Services\Discord\Commands\Command\ChooseHandler::class,
            ]
        ]
    ],
];
