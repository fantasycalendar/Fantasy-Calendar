<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;
use Throwable;

class DiscordException extends \Exception
{
    /**
     * @var Response
     */
    private Response $response;

    public function __construct($message, $code = 0, Throwable $previous = null)
    {
        $this->response = ($message instanceof Response)
            ? $message
            : Response::make($message)->ephemeral();

        $message = $this->response->getTextContent();

        parent::__construct($message, $code, $previous);
    }

    public function getResponse(): Response
    {
        return $this->response;
    }
}
