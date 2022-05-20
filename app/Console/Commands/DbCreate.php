<?php
namespace App\Console\Commands;

use App\Models\Calendar;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DbCreate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:create {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new MySQL database based on the database config file or the provided name';

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
    public function handle()
    {
        if(config('database.default') !== 'mysql') {
            file_exists(database_path('schema/' . config('database.default') . '-schema.dump')) && unlink(database_path('schema/' . config('database.default') . '-schema.dump'));
            copy(database_path('schema/mysql-schema.dump'), database_path('schema/' . config('database.default') . '-schema.dump'));
        }


        $schemaName = $this->argument('name') ?: config("database.connections.".config('database.default').".database");

        config(["database.connections.".config('database.default').".database" => null]);

        $query = "CREATE OR REPLACE DATABASE `$schemaName`;";

        DB::statement($query);

        config(["database.connections.".config('database.default').".database" => $schemaName]);

    }
}
