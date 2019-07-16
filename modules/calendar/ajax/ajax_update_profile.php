<?php

require_once('../class/includes.php');

$password = $_GET['password'];
$new_password = $_GET['new_password'];
$new_password2 = $_GET['new_password2'];
$new_email = $_GET['new_email'];
$new_email2 = $_GET['new_email2'];

$user = new user();

$results = $user->update_profile($password, $new_password, $new_password2, $new_email, $new_email2);

echo $_GET['callback'] . '(' . json_encode($results) . ')';

?>