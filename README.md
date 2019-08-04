# Fantasy-Calendar

[Fantasy-Calendar](https://www.fantasy-calendar.com/) is a general-purpose fantasy calendar creation and tracking software.


## A what?
Well, whether you're an RPG DM looking to track the events of a long-running Forgotten Realms campaign, or simply a world-builder who likes to have wacky celestial configurations (Such as Eberron's [12 moons](http://archive.wizards.com/default.asp?x=dnd/ebds/20050307a)) with zany timekeeping systems to match, you probably need a calendar of some kind.

>_"Game time is of utmost importance [...] YOU CAN NOT HAVE A MEANINGFUL CAMPAIGN IF STRICT TIME RECORDS ARE NOT KEPT."_  
-[Gary Gygax](http://www.creightonbroadhurst.com/gygax-on-tracking-time-in-the-campaign/)

Fantasy-Calendar seeks to do it all, whether you're creating your own complicated calendar with tons of of interesting edge-cases, or using presets such as the Forgotten Realms, Eberron, or Exandria for simple time-keeping.

This repository is for the yet-unreleased 2.0 update.

## Run Using Docker
We recommend development using [Docker](https://www.docker.com/). Just clone this repo somewhere, `cd` into it, and start it up:
```bash
docker-compose up
```

That will create four running containers: 

|Container|Purpose|
|---|-------|
| `fc-mariadb`| MySQL-compatible database, configured to import `/setup/database.sql` .|
| `fantasy_calendar`                  | nginx web server, configured to appropriately handle traffic between Laravel and non-Laravel pages.|
| `fantasy_calendar_php`              | An extended `php-fpm`  with PDO and composer installed, as well as some default environment variables for a docker setup.|
| `fantasy-calendar-composer-install` | This is a once-run, randomly-named container that does one thing: runs `composer install` . This makes it so that running a simple `docker-compose up`  or `docker-compose up -d`  any time you pull the latest version of this repo will make sure you have the latest versions of any composer-managed packages.|

It may take a moment to build, but once things have settled down from that, you should be able to run `docker exec -it fantasy_calendar_php php artisan migrate` and wait for the migrations to finish. Eventually this will be done automatically.

If everything has gone smoothly, you should have a functional development environment available at http://localhost:9980/.

## Setting up your own environment
If you wish to set up your own non-Docker environment, first import `/setup/database.sql` to a MySQL database. 

That will setup a basic database structure¹, as well as seed it with a development account: Username "Admin" with password "Password1".

Once your basic database is in place, copy `.env.example` to `.env`, and fill it with the appropriate data for your environment.

If your database setup and `.env` information is correct, then you should be ready to run `php artisan migrate`. [More info](https://laravel.com/docs/5.8/migrations)

You'll need all the [usual extensions](https://laravel.com/docs/5.8/installation#server-requirements) for a Laravel application, but if you're avoiding Docker then you probably already know that.

    [1] This database will still need to be brought up-to-date using Laravel migrations.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

