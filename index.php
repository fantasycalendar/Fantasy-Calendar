<?php

$title = "Fantasy Calendar";

include('header.php');

?>

<div class='index_container'>

	<?php


	if(!empty($_SESSION['user_id']))
	{

		$calendar = new calendar;

		?>
		<div id='user_calendar_list'>
		<?php

		$list = $calendar->list_calendars();

		$i = 0;
		foreach($list as $index => $data)
		{
			?> <div class='user_calendar'>

			<div class='name'>

				<?php echo '<b>'. $data['name'] . '</b><br>by ' . $data['username'] ?>
				
			</div>

			<div class='icon_container'>
				
				<a class='image_link' href='<?php echo "calendar.php?action=edit&id=" . $data["hash"]; ?>'>
					<img class='icon' src='resources/icons/edit_icon.png' title="Edit"/>
				</a>

			</div>

			</div>
			<?php

		}

		?>
		</div>
		<?php

	}

	?>

</div>

<?php


include('footer.php');

?>

