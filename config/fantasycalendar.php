<?php

return [
    'renderers' => [
        'image' => [
            'cache_ttl' => env('IMAGE_RENDERER_CACHE_TTL', 300)
        ]
    ]
];
