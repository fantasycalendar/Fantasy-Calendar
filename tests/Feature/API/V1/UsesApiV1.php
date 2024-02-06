<?php

namespace Tests\Feature\API\V1;

trait UsesApiV1
{
    public function apiUrl($path): string
    {
        return "/api/v1/$path";
    }
}
