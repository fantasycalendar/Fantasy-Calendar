<?php

header('Access-Control-Allow-Origin: http://beta.fantasy-calendar.com', false);
header('Access-Control-Allow-Origin: https://beta.fantasy-calendar.com', false);
header('Access-Control-Allow-Origin: http://fantasy-calendar.com', false);
header('Access-Control-Allow-Origin: https://fantasy-calendar.com', false);

require_once('../class/includes.php');

$calendar = new calendar();

$action = $_POST['action'];

$failure = array("success" => false, "error" => "Unable to create calendar.");

if($action === "create")
{

	$name = $_POST['name'];
	$dynamic_data = $_POST['dynamic_data'];
	$static_data = $_POST['static_data'];

	$result = $calendar->create($name, $dynamic_data, $static_data);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "load_dynamic")
{
	$hash = $_POST['hash'];

	$result = $calendar->get_dynamic_data($hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}
}
elseif($action === "load_all")
{
	$hash = $_POST['hash'];

	$result = $calendar->get_all_data($hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}
}
elseif($action === "list_children_calendars")
{
	$hash = $_POST['hash'];

	$result = $calendar->list_children_calendars($hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}
}
elseif($action === "check_last_change")
{
	$hash = $_POST['hash'];

	$result = $calendar->check_last_change($hash);

	echo json_encode($result);
}
elseif($action === "update_name")
{

	$hash = $_POST['hash'];
	$name = $_POST['name'];

	$result = $calendar->update_name($hash, $name);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "update_dynamic")
{

	$hash = $_POST['hash'];
	$dynamic_data = $_POST['dynamic_data'];

	$result = $calendar->update_dynamic($hash, $dynamic_data);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "update_all")
{

	$hash = $_POST['hash'];
	$dynamic_data = $_POST['dynamic_data'];
	$static_data = $_POST['static_data'];

	$result = $calendar->update_all($hash, $dynamic_data, $static_data);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "update_master_hash")
{

	$hash = $_POST['hash'];
	$master_hash = $_POST['master_hash'];

	$result = $calendar->update_master_hash($hash, $master_hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "update_children_hashes")
{

	$hash = $_POST['hash'];
	$children_hashes = $_POST['children_hashes'];

	$result = $calendar->update_children_hashes($hash, $children_hashes);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "remove_master_hash")
{

	$hash = $_POST['hash'];

	$result = $calendar->remove_master_hash($hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}

}
elseif($action === "delete")
{
	$hash = $_POST['hash'];
	
	$result = $calendar->delete($hash);

	if(!empty($result))
	{
		echo json_encode($result);
	}
	else
	{
		echo json_encode($failure);
	}	
}
elseif($action === "session_set")
{
	$_SESSION['dynamic_data'] = $_POST['dynamic_data'];
	$_SESSION['static_data'] = $_POST['static_data'];

	echo true;

}
elseif($action === "session_get")
{

	if(isset($_SESSION['data'])){

		$data = array(
			'success' => true,
			'dynamic_data' => $_SESSION['dynamic_data'],
			'static_data' => $_SESSION['static_data']
		);

		unset($_SESSION['dynamic_data']);
		unset($_SESSION['static_data']);

	}else{
		
		$data = array('success' => false, 'error' => 'No calendar to load.');
		
	}

	echo json_encode($data);
	
}
elseif($action === "list")
{

	echo json_encode($calendar->list_calendars());

}

?>