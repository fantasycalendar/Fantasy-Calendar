<?php

require_once __DIR__ . '/../../../../vendor/autoload.php';

// Now load our envvars
$dotenv = Dotenv\Dotenv::create(__DIR__.'/../../../../');
$dotenv->load();

require_once 'c_db.php';
require_once 'c_user.php';
require_once 'c_auth_token.php';
require_once 'c_calendar.php';

?>