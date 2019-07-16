<?php

$title = "Fantasy Calendar";

include('header.php');

?>

<div class='detail-row'>

	<div class='detail-column half'>

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

	</div>

	<div class='detail-column half'>

		<?php

		// The changelog path
		$changelog_path = 'changelog.txt';
		// Format the changelog from .md to HTML
		$changelog = file_get_contents( $changelog_path );
		$changelog = preg_replace( "/###[ ]?([A-Z0-9\.]+): ([A-Z0-9 ,]+)/i", "<h3>$1</h3>" . PHP_EOL . "<i>$2</i>" . PHP_EOL . "<ul>", $changelog );
		$changelog = preg_replace( "/\* ([A-Z0-9 !\._,'\(\)\/\-&\"\']+)/i", "<li>$1</li>", $changelog );
		$changelog = preg_replace( "/" . PHP_EOL . "<h3>/i", "</ul>" . PHP_EOL . PHP_EOL . "<h3>", $changelog );
		$changelog .= PHP_EOL . "</ul>";
		// Ouput. Copy and paste this to your website.
		echo "<div id='changelog'><h2>Changelog</h2>".$changelog."</div>";

	?>

	</div>
	
</div>

<?php


include('footer.php');

?>

