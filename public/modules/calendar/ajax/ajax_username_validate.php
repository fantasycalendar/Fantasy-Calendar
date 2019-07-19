<?php

require_once('../class/includes.php');

$username = $_POST['username'];

$user = new user();

if($user->verify_username($username) == 0)
{
	echo "true";
}
else
{
	echo "false";
}

?>