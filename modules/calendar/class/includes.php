<?php

function loadEnvVars($env) {
    foreach(explode("\n", $env) as $envline) {
        putenv(trim($envline));
    }
}

// Now load our envvars
$envfile = file_get_contents(__DIR__.'/server.env');
loadEnvVars($envfile);

require_once 'c_db.php';
require_once 'c_user.php';
require_once 'c_auth_token.php';
require_once 'c_calendar.php';

?>