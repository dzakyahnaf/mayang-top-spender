<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ziggy route groups
    |--------------------------------------------------------------------------
    |
    | The "guest" group is the only set of route names published to the JS
    | payload for unauthenticated visitors (see resources/views/app.blade.php).
    | Admin and kasir route names are deliberately excluded so the public HTML
    | does not enumerate privileged endpoints. Authenticated users receive the
    | full route list.
    |
    */
    'groups' => [
        'guest' => [
            'home',
            'leaderboard',
            'daftar-hadiah',
            'faq',
            'syarat',
            'login',
            'register',
            'logout',
            'dashboard',
            'password.*',
            'verification.*',
        ],
    ],
];
