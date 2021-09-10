<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;
use Throwable;

class DiscordException extends \Exception
{
    /**
     * @var Response
     */
    protected Response $response;
    protected $defaultMessage = null;

    public function __construct($message = null, $code = 0, Throwable $previous = null)
    {
        $this->response = $this->makeResponse($message ?? $this->defaultMessage);

        $message = $this->response->getTextContent();

        parent::__construct($message, $code, $previous);
    }

    public function getResponse(): Response
    {
        return $this->response;
    }

    protected function makeResponse($message)
    {
        logger('making response');

        return ($message instanceof Response)
            ? $message
            : Response::make($message)->ephemeral();
    }
}
