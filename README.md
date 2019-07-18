# Fantasy-Calendar
This is for the fantasy-calendar website, specifically the 2.0 update. Feel free to contribute and help improve the site!

## Setting up your own environment
If you wish to set up your own environment, I'm using MySQL with PHPMyAdmin to run it. The necessary .sql file to set up the database is in the "setup" folder. The account to log in with is username "Admin" with password "Password1".

The .env file in setup goes into "modules/calendar/class/". Adjust "modules/calendar/class/includes.php" accordingly to load the correct environment file.

## Docker
Just clone this repo somewhere, `cd` into it, and run `docker-compose up`. 

If you have docker installed properly and configured with docker-compose, you'll be up and running with a dev environment in seconds, available at http://localhost:9980/