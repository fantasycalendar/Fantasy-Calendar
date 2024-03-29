<?php

namespace App\Exceptions;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Throwable;
use Auth;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param Throwable $exception
     * @return void
     * @throws Throwable
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    public function register()
    {
        if (config('logging.discord.url')) {
            $this->reportable(function (Throwable $e) {
                logger()->channel('discord')->error($e->getMessage() . "\n" . $e->getTraceAsString());
            });
        }

        $this->reportable(function (Throwable $e) {
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param Request $request
     * @param Throwable $exception
     * @return Application|JsonResponse|RedirectResponse|Response|Redirector
     * @throws Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($this->isApiCall($request)) {
            if (property_exists($exception, 'validator')) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $exception->validator->getMessageBag()
                ], 422);
            }

            $status = ($exception instanceof AuthenticationException)
                ? 401
                : 200;

            return response()->json([
                'message' => $exception->getMessage()
            ], $status);
        }

        if ($exception instanceof AuthorizationException || $exception instanceof AuthenticationException) {
            if ($request->is('calendars/*/edit')) {
                return redirect(str_replace('/edit', '', $request->path()));
            }

            if ($request->is('calendars/create')) {
                $message = (Auth::user()->isEarlySupporter())
                    ? "Thanks for using Fantasy Calendar! Free accounts created before Nov 1st, 2020 are limited to fifteen calendars. <br> Please subscribe if you need more than that. As an early supporter, you even get a lifetime 20% discount!"
                    : "Thanks for using Fantasy Calendar! Please subscribe to have more than two calendars active at a time.";

                return redirect(route('subscription.pricing'))->with('alert', $message);
            }

            if ($request->is('calendars/*')) {
                return redirect(route('errors.calendar_unavailable'));
            }
        }

        if ($exception instanceof QueryException) {
            return response()->view('errors.default');
        }

        if ($this->isHttpException($exception)) {
            if ($exception->getStatusCode() == 404) {
                if ($exception instanceof ModelNotFoundException) {
                    return response()->view('errors.404', [
                        'title' => 'Calendar not found'
                    ]);
                } else {
                    return redirect('/');
                }
            }

            if ($exception->getStatusCode() == 403) {
                if (Auth::check() && Auth::user()->betaAccess()) {
                    return redirect('/');
                }

                return response()->view('errors.403', [
                    'title' => $exception->getMessage()
                ]);
            }

            if (!view()->exists("errors.{$exception->getStatusCode()}")) {
                return response()->view('errors.default', ['exception' => $exception], 200, $exception->getHeaders());
            }
        }

        return parent::render($request, $exception);
    }

    protected function isApiCall($request): bool
    {
        return str_contains($request->getUri(), '/api/');
    }
}
