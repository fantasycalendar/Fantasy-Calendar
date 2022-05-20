<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;
use Throwable;

class DiscordResponseTooLongException extends DiscordException
{
    protected $defaultMessage = "Hmm, it looks like that would have generated a response that is too long for Discord (2,000 characters max):";
    private int $length;

    public function __construct(int $length, $message = null, $code = 0, Throwable $previous = null)
    {
        $this->length = $length;

        parent::__construct($message, $code, $previous);
    }

    public function makeResponse($message)
    {
        $response = ($message instanceof Response)
            ? $message
            : Response::make($message)->ephemeral();

        $append = "\nTried to respond with %s characters.";

        if($this->length > 4000) {
            $append .= ".. more than double the limit! Whoa.";
        }

        return $response->appendText(sprintf($append, number_format($this->length)));
    }
}
