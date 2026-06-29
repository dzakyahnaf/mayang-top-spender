<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    /**
     * Attach a Content-Security-Policy in REPORT-ONLY mode. Browsers report
     * violations (console) but do NOT block anything, so the policy can be
     * validated against real traffic before switching to an enforcing header.
     *
     * Directives reflect the app's actual resources: same-origin Vite assets,
     * Bunny Fonts, the inline Ziggy @routes script + React inline styles
     * ('unsafe-inline'), and blob:/data: image previews (receipt upload).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $policy = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
            "font-src 'self' https://fonts.bunny.net",
            "img-src 'self' data: blob:",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
        ]);

        $response->headers->set('Content-Security-Policy-Report-Only', $policy);

        return $response;
    }
}
