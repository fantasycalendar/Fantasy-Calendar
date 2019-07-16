<?php

require_once('../class/includes.php');

$email = $_POST['email'];

$user = new user();

if($user->verify_email($email) == 0)
{
	echo "true";
}
else
{
	echo "false";
}

?>