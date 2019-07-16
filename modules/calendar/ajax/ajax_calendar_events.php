<?php

require_once('../class/includes.php');

$calendar = new calendar();

$action = $_POST['action'];

$failure = array("success" => false, "error" => "Unable to create calendar.");

if($action === "load_comments")
{

	$event_id = $_POST['event_id'];

	$result = $calendar->load_comments($name, $data);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}

?>