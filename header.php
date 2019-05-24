<?php

header('Cache-Control: no-cache');

require_once("modules/calendar/class/includes.php");

$user = new user();

$user->validate_cookie();

$jsversion = "2.0";
//$jsversion = time();
?>

<!DOCTYPE HTML>

<html lang="en">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds have never been easier!">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $title ?></title>

		<link rel="apple-touch-icon" sizes="180x180" href="resources/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="resources/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="resources/favicon-16x16.png">
		<link rel="manifest" href="resources/site.webmanifest">
		<link rel="mask-icon" href="resources/safari-pinned-tab.svg" color="#5bbad5">
		<meta name="msapplication-TileColor" content="#da532c">
		<meta name="theme-color" content="#ffffff">
		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

		<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
		<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
		<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
		

		<script>

		window.baseurl = "";
		//window.baseurl = "https://fantasy-calendar.com/";
		
		</script>

		<script src="js/login.js"></script>
		<script src="js/profile.js"></script>

		<script src="modules/chartjs/Chart.min.js"></script>
    	<script src="modules/trumbowyg/trumbowyg.min.js"></script>
    	<script src="modules/jquery/jquery.ui.touch-punch.min.js"></script>
    	<script src="modules/notifyjs/notify.min.js"></script>
    	<script src="modules/sortable/jquery-sortable-min.js"></script>
    	<script src="modules/spectrum/spectrum.js"></script>
    	<script src="modules/calendar/js/header.js"></script>
    	<script src="modules/calendar/js/calendar_event_ui.js"></script>
    	<script src="modules/calendar/js/calendar_functions.js"></script>
    	<script src="modules/calendar/js/calendar_variables.js"></script>
    	<script src="modules/calendar/js/calendar_weather_layout.js"></script>
    	<script src="modules/calendar/js/calendar_season_generator.js"></script>
    	<script src="modules/calendar/js/calendar_layout_builder.js"></script>
    	<script src="modules/calendar/js/calendar_inputs_visitor.js"></script>
    	<script src="modules/calendar/js/calendar_inputs_view.js"></script>
    	<script src="modules/calendar/js/calendar_inputs_edit.js"></script>
    	<script src="modules/calendar/js/calendar_manager.js"></script>
    	<script src="modules/calendar/js/calendar_ajax_functions.js"></script>

		<link rel="stylesheet" href="css/calendar_input_style.css">
		<link rel="stylesheet" href="css/calendar_styles.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">
		<link rel="stylesheet" href="css/index_style.css">
		<link rel="stylesheet" href="css/login_style.css">
		<link rel="stylesheet" href="css/header_style.css">
		<link rel="stylesheet" href="css/text_styles.css">
		<link rel="stylesheet" href="modules/spectrum/spectrum.css">
		<link rel="stylesheet" href="modules/trumbowyg/ui/trumbowyg.min.css">

	</head>

	<body>
	
		<header id="header">
			
			<div id="header_left_container">
				<!--<a href="https://www.beta.fantasy-calendar.com/" id="logo"><img src="resources/calendar-logo.png" alt="Logo"/></a>-->
				<a href="http://127.0.0.1:8080/edsa-Fantasy-2.0/" id="logo"><img src="resources/calendar-logo.png" alt="Logo"/></a>
				<a href="calendar?action=generate"><div class="button" id="new_calendar">New Calendar</div></a>
			</div>

			<div id="header_center_container"><?php echo $title; ?></div>

			<div id="header_right_container">
			
			<a href="calendar?action=generate"><div class="button">New Calendar</div></a>

			<?php if(!empty($_SESSION["user_id"])){ ?>
				<div id="logout-button" class="button">Log Out</div>
				<a href="profile"><div class="button">Profile</div></a><?php
			}
			else
			{
				?><a href="signup"><div id="signup-show-button" class="button">Sign-up</div></a>
				<div class="button login-show-button">Log In</div>
			<?php
			}?>

			</div>
		
		</header>

		<div id="alert_background">
			<div id="alert">
				<span id="alert_closebtn" onclick="this.parentElement.parentElement.style.display='none';">&times;</span>
				<span id="alert_text">
					This is an alert box.
				</span>
			</div>
		</div>
		
		<?php
		if(empty($_SESSION["user_id"]))
		{?>
		<div id="login-background" class="basic-background">
			<div class="basic-container">
				<div class="basic-wrapper">
					<form id="login-form" class="basic-form" method="POST">       
						<h3 class="basic-form-heading">Login</h3>
						<input type="text" class="form-control" id="login_username" name="username" placeholder="Username" autofocus="" autocomplete="username" />
						<input type="password" class="form-control" id="login_password" name="password" placeholder="Password" autocomplete="current-password"></input>
						<list id="login_messagebox"></list>
						<label class="form-control checkbox">
							<input type="checkbox" value="remember-me" id="login_rememberMe" name="rememberMe"> Remember me
						</label>
						<button class="btn btn-lg btn-primary btn-block" id="login_button" type="submit">Login</button>
						<a href="forgotten_password.php"><button class="btn btn-sm btn-default btn-block" id="forgotten_password" type="button">Forgotten Password</button></a>
					</form>
				</div>
			</div>
		</div>
		<?php } ?>
		
		<div id="content">