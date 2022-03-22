<?php

namespace Tests\Feature\API\V1;

class TestCase extends \Tests\TestCase
{
    public function apiUrl($path): string
    {
        return "/api/v1/$path";
    }
}
