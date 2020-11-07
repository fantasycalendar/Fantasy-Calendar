<?php

namespace App\Console\Commands;

use App\Calendar;
use App\Jobs\SaveCalendarEvents;
use App\Jobs\SaveEventCategories;
use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Illuminate\Support\Str;

class CalendarImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:import
                            {hash? : The hash of the calendar you want to import from beta.fantasy-calendar.com}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import a calendar from the FC beta';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(Client $client)
    {
        // Make sure we have an FC api key
        if(!env('FC_API_KEY')) {
            $this->error('You have no api key set. Add it as FC_API_KEY to your .env and try again.');
            return 1;
        }

        // Make sure we get a hash
        $beta_hash = $this->argument('hash');
        while(!$beta_hash) {
            $this->info('No valid hash specified.');
            $beta_hash = $this->ask("What's the hash of the calendar you want to import?");
        }

        $this->info('Attempting import of calendar with hash ' . $beta_hash);


        // The heavy lifting. Reach out to the beta and grab a calendar
        $response = $client->get('https://app.fantasy-calendar.com/api/calendar/' . $beta_hash, [
            'query' => ['api_key' => env('FC_API_KEY')]
        ]);
        $calendar_data = json_decode($response->getBody()->getContents(), true);

        // This is kinda ugly, but but basically we have to remap event categories and events
        $static_data = $calendar_data['static_data'];

        // Loop through the categories and map an array of [beta id] => slug-name for use later
        $originalCategoryIds = [];
        $categories = $calendar_data['event_categories'];

        foreach($categories as $index => $category) {
            $originalCategoryIds[$categories[$index]['id']] = Str::slug($category['name']);
            $categories[$index]['id'] = Str::slug($category['name']);
        }


        // Now we loop through all the events and get rid of the original event ID,
        // then set each event's category ID to the slug-name we set earlier.
        $events = $calendar_data['events'];

        foreach($events as $index => $event) {
            unset($events[$index]['id']);

            if(is_numeric($events[$index]['event_category_id']) && $events[$index]['event_category_id'] > -1) {
                $events[$index]['event_category_id'] = $originalCategoryIds[$events[$index]['event_category_id']];
            }

        }
        
        // Now that we've done the above, we can create the calendar
        $calendar = Calendar::create([
            'user_id' => 1,
            'name' => $calendar_data['name'],
            'dynamic_data' => $calendar_data['dynamic_data'],
            'static_data' => $static_data,
            'hash' => $calendar_data['hash']
        ]);


        // We need to tell all categories to use the ID.
        foreach($categories as $index => $category) {
            $categories[$index]['calendar_id'] = $calendar->id;
        }

        // Create our categories first, then make an array of our local numeric IDs => slug-name
        $categoryids = SaveEventCategories::dispatchNow($categories, $calendar->id);

        // Now we can create our events, providing the above IDs => slug-name map
        $eventids = SaveCalendarEvents::dispatchNow($events, $categoryids, $calendar->id);

        $this->info(
            sprintf(
                "Calendar '%s' imported: %scalendars/%s/edit",
                $calendar_data['name'],
                env('APP_URL'),
                $calendar_data['hash']
            )
        );
    }
}
