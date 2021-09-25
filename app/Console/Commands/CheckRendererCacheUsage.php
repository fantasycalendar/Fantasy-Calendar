<?php

namespace App\Console\Commands;

use App\Services\RendererService\ImageRenderer;
use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CheckRendererCacheUsage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:renderer-cache-test {--user_id=1} {--iterations=10} {--ext=png} {--y=0}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Does a stress-test on our renderer cache by doing LOTS of rendering. Hooray!';

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
     * @return int
     */
    public function handle()
    {
        $iterations = $this->option('iterations');
        $user = User::find($this->option('user_id'));

        $total = $user->calendars()->where('parent_id', null)->count() * $iterations;

        if($total > 1000 && !$this->option('y')) {
            $this->warn("WARNING! You are trying to generate more than a thousand calendar images, which will all be saved to disk and cached in redis.");
            $this->warn("Depending on your computer hardware, this could take a long time (there will be a progress bar).");
            if(!$this->confirm("Are you sure you want to do this?")) {
                $this->info("Aborting.");

                exit(0);
            }

            if($total > 10000 && !$this->option('y')) {
                $this->warn("No seriously, you're generating over TEN THOUSAND images and advancing each of your calendars by $iterations days during the process (dates will be reversed at the end). This could take a **VERY** long time.");
                if(!$this->confirm("Are you truly sure? This is the last confirmation (run with --y=true to skip these prompts.).")) {
                    $this->info(" Aborting.");

                    exit(0);
                }
            }
        }


        $memoryUsage = 0;

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $parameters = collect([
            'ext' => $this->option('ext'),
            'width' => 1920,
            'height' => 1080,
        ]);;

        $user->calendars()->where('parent_id', null)->each(function($calendar) use ($iterations, $user, $parameters, &$memoryUsage, &$bar){
            collect(range(1, $iterations))->each(function($index) use ($calendar, $parameters, &$memoryUsage, &$bar) {
                $calendar->addDays(1)->save();

                $image = ImageRenderer::renderMonth($calendar, $parameters);

                Storage::disk('local')->put('calendarImages/'.$this->option('ext').'/' . $calendar->hash . '-' . $calendar->epoch->slug . '-' . Str::slug($calendar->current_date) . '.png', $image);

                $memoryUsage += strlen($image);

                $bar->advance();
            });
        });

        $bar->finish();

        $this->newLine(2);
        $this->info("Finished iterating over calendars, rolling back date changes...");

        $this->withProgressBar($user->calendars()->where('parent_id', null)->get(), function($calendar) use ($iterations) {
            $calendar->subDays($iterations)->save();
        });

        $this->newLine(2);
        $this->info("Finished! here are some stats:");

        $this->table([
            'Total Images',
            'Total Cache Size',
        ],[
            [
                $total,
                $this->formatBytes($memoryUsage),
            ]
        ]);

        return 0;
    }

    public function formatBytes($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = array('', 'K', 'M', 'G', 'T');

        return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
    }
}
