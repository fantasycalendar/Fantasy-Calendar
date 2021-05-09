<?php


namespace App\Services\Discord\Http\Middleware;

use Closure;

class VerifyDiscordSignature
{
    public function handle($request, Closure $next)
    {
        if($request->hasHeader('bypassChecks')) {
            return $next($request);
        }

        if(!$request->hasHeader('X-Signature-Ed25519') || !$request->hasHeader('X-Signature-Timestamp'))
        {
            throw new \Exception('Must include signatures.');
        }

        $signature = $request->header('X-Signature-Ed25519');
        $timestamp = $request->header('X-Signature-Timestamp');

        $verified = sodium_crypto_sign_verify_detached(hex2bin($signature), $timestamp . $request->getContent(), hex2bin(env('DISCORD_PUBLIC_KEY')));

        if(!$verified) {
            throw new \Exception('Invalid signature.');
        }

        return $next($request);
    }
}
