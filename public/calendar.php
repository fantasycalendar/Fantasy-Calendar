<?php

require_once('modules/calendar/class/includes.php');

$calendar = new calendar;

function redirect($url, $statusCode = 303)
{
   header('Location: ' . $url, true, $statusCode);
   die();
}


if(!$_SESSION['beta']){
	redirect('403.php', 303);
}

if(isset($_GET['action']) && $_GET['action'] === "generate")
{

	include('modules/calendar/includes/create.php');

}
elseif(isset($_GET['id']))
{

	$calendar_data = $calendar->check_ownership($_GET['id']);

	if(!empty($calendar_data))
	{

		$calendar_data['owner'] = $calendar_data['owner'] === 'true' ? true : false;

		if($calendar_data['owner'] || (isset($_SESSION['permission']) && $_SESSION['permission'] === "Admin"))
		{

			if($_GET['action'] === "view")
			{
				
				include('modules/calendar/includes/view.php');

			}
			elseif($_GET['action'] === "edit")
			{
				
				include('modules/calendar/includes/edit.php');

			}
			elseif($_GET['action'] === "print")
			{

				include('modules/calendar/includes/print.php');

			}
			elseif($_GET['action'] === "duplicate")
			{

				$new_calendar = $calendar->duplicate($_GET['id']);
				redirect('calendar?action=edit&id='.$new_calendar);

			}

		}else{
			
			include('modules/calendar/includes/visitor.php');

		}

	}else{

		include('404.php');

	}

}
else
{
	redirect('https://www.fantasy-calendar.com/');
}

$calendar = null;

?>
