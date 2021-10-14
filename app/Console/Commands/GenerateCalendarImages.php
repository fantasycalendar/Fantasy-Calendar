<?php

namespace App\Console\Commands;

use App\Calendar;
use App\Services\RendererService\ImageRenderer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GenerateCalendarImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:generate-images
                            {hash : The hash of the calendar}
                            {--years= : A comma-separated list of years or a range of years formatted like "start:end". e.g. 0:10. When omitted, generates just the current year.}
                            {--size=md : The size to do the rendering test at. Defaults at medium size. Options are xs, sm, md, lg, xl, xxl, xxxl.}
                            {--force : Bypass confirmations and generate all of the images without asking.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Renders many images for a specific calendar, given a specific range of dates.';
    private Calendar $calendar;
    private \Symfony\Component\Console\Helper\ProgressBar $bar;

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
        $time_start = microtime(true);
        $this->calendar = Calendar::hash($this->argument('hash'))->firstOrFail();

        $years = $this->collectYears();
        $estimatedTotalImages = ceil($this->calendar->average_year_length * $years->count());

        if($years->count() > 10) {
            $shellColumns = intval(shell_exec('tput cols'));

            $this->info("Hmm, that's a lot of years. Doing a quick performance test...");

            $render_time_start = microtime(true);
            foreach(range(0,30) as $day) {
                $this->calendar->addDay();
                ImageRenderer::renderMonth($this->calendar, collect(['ext' => 'png', 'size' => $this->option('size')]));
            }
            $estimatedTotalRenderTime = intval((microtime(true) - $render_time_start) * ($estimatedTotalImages / 30));

            $this->newLine();
            $this->warn(Str::repeat('-', $shellColumns));
            $this->warn(Str::padBoth('WARNING--WARNING--WARNING', $shellColumns, '-'));
            $this->warn(Str::repeat('-', $shellColumns));

            $this->newLine();
            $this->warn("You are generating {$years->count()} ENTIRE YEARS worth of daily calendar images, an estimated $estimatedTotalImages total images.\nThat could take **quite** a while, depending on your hardware and the size of your calendars.\nA quick test of that calendar puts a naive estimate at $estimatedTotalRenderTime seconds.");

            if(!$this->option('force') && !$this->confirm("Are you sure?")) {
                $this->info("Thought so, exiting.");

                exit(0);
            }
        }

        $calendarImagesPath = 'calendar-images-' . now()->format('Y-m-d H:i:s');
        Storage::makeDirectory($calendarImagesPath);

        $imagesCreated = collect();

        $this->bar = $this->getOutput()->createProgressBar($estimatedTotalImages);
        $this->bar->start();

        $years->each(function($year) use ($calendarImagesPath, &$imagesCreated) {
            $this->calendar->setDate($year)->startOfYear();

            while($this->calendar->year === $year) {

                $imageOutput = ImageRenderer::renderMonth($this->calendar, collect([
                    'ext' => 'png', 'size' => $this->option('size')
                ]));

                $imagesCreated->put(Str::slug($this->calendar->name) . '-' .  $this->calendar->epoch->slug . '.png', $imageOutput);

                $this->calendar->addDay();
                $this->bar->advance();
            }
        });

        $this->bar->finish();

        $this->newLine(2);
        $this->info("Created a total of " . $imagesCreated->count() . " images! Writing them to disk now...");

        $this->bar = $this->getOutput()->createProgressBar($imagesCreated->count());

        $imagesCreated->each(function($image, $name) use ($calendarImagesPath) {
            Storage::put($calendarImagesPath . '/' . $name, $image);
            $this->bar->advance();
        });

        $this->bar->finish();

        $this->newLine(2);
        $seconds = intval(microtime(true) - $time_start);

        $this->info("Done! Full process took a total of $seconds seconds.");
        $this->info("Your fresh new calendar images are in '$calendarImagesPath'");

        return 0;
    }

    private function collectYears()
    {
        if(!$this->option('years')) {
            return collect([$this->calendar->year]);
        }

        $yearString = $this->option('years');
        if(Str::contains($yearString, ':')) {
            $years = array_map('intval', explode(':', $yearString));
            if(count($years) != 2 || !is_numeric($years[0]) || !is_numeric($years[1]) || $years[0] >= $years[1]) {
                $this->error('Your range is invalid! You need to specify a range of numbers in the format:');
                $this->error('lownumber:highnumber. For example, to generate between the years 1 and 10, specify');
                $this->error('--years=1:10');

                exit(1);
            }

            return collect(range($years[0], $years[1]));
        }

        return collect(explode(',', $yearString))->map(fn($year) => intval($year));
    }
}
