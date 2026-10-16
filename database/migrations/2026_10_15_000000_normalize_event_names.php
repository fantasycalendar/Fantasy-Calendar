<?php

use App\Support\EventName;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Older clients entity-encoded event names before saving ("Rock &amp; Roll"),
 * and the grid/viewer render names as text, so users saw the entities
 * literally. Normalize existing names to decoded plain text, the same way
 * every write path now does (EventName::normalize()).
 *
 * The original value of every changed row is kept in
 * calendar_event_name_backups so down() can restore it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_event_name_backups', function (Blueprint $table) {
            $table->unsignedBigInteger('event_id')->primary();
            $table->string('name');
            $table->timestamp('created_at')->useCurrent();
        });

        // Query builder on purpose: includes soft-deleted rows, skips model
        // events, and leaves updated_at alone.
        DB::table('calendar_events')
            ->select(['id', 'name'])
            ->where(function ($query) {
                $query->where('name', 'like', '%&%')
                    ->orWhere('name', 'regexp', '<[a-zA-Z/]');
            })
            ->chunkById(500, function ($events) {
                foreach ($events as $event) {
                    $normalized = EventName::normalize($event->name);

                    if ($normalized === $event->name) {
                        continue;
                    }

                    DB::table('calendar_event_name_backups')->insertOrIgnore([
                        'event_id' => $event->id,
                        'name' => $event->name,
                    ]);

                    // Compare-and-swap: never clobber a name edited mid-migration.
                    DB::table('calendar_events')
                        ->where('id', $event->id)
                        ->where('name', $event->name)
                        ->update(['name' => $normalized]);
                }
            });
    }

    public function down(): void
    {
        if (!Schema::hasTable('calendar_event_name_backups')) {
            return;
        }

        DB::table('calendar_event_name_backups')
            ->orderBy('event_id')
            ->chunk(500, function ($backups) {
                foreach ($backups as $backup) {
                    DB::table('calendar_events')
                        ->where('id', $backup->event_id)
                        ->update(['name' => $backup->name]);
                }
            });

        Schema::drop('calendar_event_name_backups');
    }
};
