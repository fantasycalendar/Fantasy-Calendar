# Fantasy-Calendar

[Fantasy-Calendar](https://www.fantasy-calendar.com/) is a general-purpose fantasy calendar creation and tracking software.

## A what?
Well, whether you're a GM looking to track the events of a long-running Forgotten Realms campaign, an author, or simply a world-builder who likes to have wacky celestial configurations (Such as Eberron's [12 moons](http://archive.wizards.com/default.asp?x=dnd/ebds/20050307a)) with zany timekeeping systems to match, you probably need a calendar of some kind.

>_"Game time is of utmost importance [...] you can not have a meaningful campaign if strict time records are not kept."_  
-[Gary Gygax](http://www.creightonbroadhurst.com/gygax-on-tracking-time-in-the-campaign/)

Fantasy-Calendar seeks to do it all, whether you're creating your own complicated calendar with tons of interesting edge-cases, or using presets such as the Forgotten Realms, Eberron, or Exandria for simple time-keeping.

## Run Using Docker
We recommend development using [Docker](https://www.docker.com/), as it's what we use and it makes things like setting up the PHP environment a breeze. As long as you already have Docker installed, actually getting up and running is pretty straightforward. First you'll want to run:

```shell
$ make
```

That runs the default `initialize_dev` entry in FC's `Makefile`, which:
- Copies the default .env to the appropriate location
- Builds all of FC's container images
- Installs `npm` dependencies
- Installs `composer` dependencies
- Starts docker containers
- Runs `artisan migrate`
- Stops docker containers

We've also provided a handy `aliases.sh` to make some common tasks/aliases/etc., easier. So, after you've run `make`, we recommend `source aliases.sh`. I'd list all the aliases here, but ... just go read the file, it's super straightforward.

### The Containers
The default `docker-compose up` will create quite a few containers:

|Container|Purpose|
|---|-------|
| `fc-mariadb`| MariaDB, configured to create a default database .|
| `fc-bref-web`                  | nginx web server, configured to appropriately.|
| `fantasy_calendar_php`              | An extended `php-fpm`  with PDO and composer installed, as well as some default environment variables for a docker setup.|
|`selenium` | This is a headless Chrome install used for integration tests |
|`fcredis`| A [Redis](https://redis.io/) container, used for caching and queues |
| `fantasy-calendar-composer-install` | This is a once-run, randomly-named container that does one thing: runs `composer install` . This makes it so that running a simple `docker-compose up`  or `docker-compose up -d`  any time you pull the latest version of this repo will make sure you have the latest versions of any composer-managed packages.|
|`npm`| This runs `npm run dev-install-watch`, which installs deps and automatically rebuilds assets as they change. |
|`mailhog`| Available on `localhost:8025`, Mailhog captures outgoing mail. |


If everything has gone smoothly, after `make` and `docker-compose up`, you should have a functional development environment available at http://localhost:9980/.

## Setting up your own environment
Fantasy Calendar is just a Laravel app. So you'll need the [usual installation process](https://laravel.com/docs/7.x/installation) for a Laravel application, along with two extra PHP extensions: `imagick` and `gmp`.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
