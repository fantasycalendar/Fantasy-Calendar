<?php

if( !function_exists('discord_help') ) {
    function discord_help() {
        $commands = config('services.discord.global_commands');
        $help_output = [];

        // Top-level commands
        foreach($commands as $command) {
            $baseCommand = '/' . $command['name'];

            if(array_key_exists('options', $command)) {
                foreach($command['options'] as $option) {
                    if($option['type'] < 3 && array_key_exists('options', $option)) {
                        $help_output[] = [
                            'command' => $baseCommand . ' ' . $option['name'] . ' ' . "{" . implode(',', array_map(function($option){ return $option['name']; }, $option['options'])) . "}",
                            'description' => $option['description'],
                        ];

                        continue;
                    }

                    $help_output[] = [
                        'command' => $baseCommand . ' ' . $option['name'],
                        'description' => $option['description'],
                    ];
                }

                continue;
            }

            $help_output[] = [
                'command' => '/' . $command['name'],
                'description' => $command['description'],
            ];
        }

        return $help_output;
    }
}
