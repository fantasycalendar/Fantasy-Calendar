<?php

namespace App\Services\RendererService\TextRenderer\Exceptions;

use Exception;

class TextRendererOutputTooLongException extends Exception
{
    protected $message = "The text renderer tried to create a message that was too long.";
}
