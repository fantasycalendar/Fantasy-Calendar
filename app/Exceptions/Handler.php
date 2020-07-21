<?php

namespace App\Exceptions;

use Throwable;
use Auth;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;

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
     * @param  \Throwable  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        if($this->isApiCall($request)) {
            return response()->json(['error'=>true, 'message'=>$exception->getMessage()]);
        }

        if($exception instanceof AuthorizationException || $exception instanceof AuthenticationException) {
            if($request->is('calendars/*/edit')) {
                return redirect(str_replace('/edit','', $request->path()));
            }
        }

        if ($this->isHttpException($exception)) {
            if($exception->getStatusCode() == 404) {
                if($exception instanceof ModelNotFoundException) {
                    return response()->view('errors.404', [
                        'title' => 'Calendar not found'
                    ]);
                }
            }

            if ($exception->getStatusCode() == 403) {
                if(Auth::check() && Auth::user()->betaAccess()) {
                    return redirect('/');
                }

                return response()->view('errors.403', [
                    'title' => $exception->getMessage()
                ]);
            }
        }

        return parent::render($request, $exception);
    }

    protected function isApiCall($request)
    {
        return strpos($request->getUri(), '/api/') !== false;
    }
}
