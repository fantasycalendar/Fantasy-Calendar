<?php

require_once('../class/includes.php');

$user = new user();

$action = $_POST['action'];

if($action === "login")
{
	$username = $_POST['username'];
	$password = $_POST['password'];
	$remember = $_POST['remember'];

	$result = $user->logIn($username, $password, $remember);

	echo json_encode($result);

}
elseif($action === "signup")
{

	$username = $_POST['username'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	$password2 = $_POST['password2'];

	$result = $user->signup($username, $email, $password, $password2);

	echo json_encode($result);

}
elseif($action === "update")
{

	$password = $_POST['password'];
	$new_password = $_POST['new_password'];
	$new_password2 = $_POST['new_password2'];
	$new_email = $_POST['new_email'];
	$new_email2 = $_POST['new_email2'];

	$result = $user->update_profile($password, $new_password, $new_password2, $new_email, $new_email2);

	echo $result;

}
elseif($action === "change_password")
{

	$new_password = $_POST['password'];
	$key = $_POST['key'];

	$result = $user->update_forgotten_password($new_password, $key);

	echo $result;

}
elseif($action === "forgotten")
{

	$email = $_POST['email'];

	$result = $user->forgotten_password($email);

	echo $result;

}
elseif($action === "resend")
{

	$email = $_POST['email'];

	$results = $user->resend_activation($email);

	echo $result;

}
elseif($action === "logout")
{

	echo $user->logout();

}


?>