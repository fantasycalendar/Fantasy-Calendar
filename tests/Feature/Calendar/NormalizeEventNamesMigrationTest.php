<?php

namespace Tests\Feature\Calendar;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * The migration's up()/down() create and drop a table, which implicitly commits
 * in MariaDB — so this test does not use RefreshDatabase's transaction and
 * instead cleans up the rows it inserts.
 */
class NormalizeEventNamesMigrationTest extends TestCase
{
    private array $ids = [];

    private function migration()
    {
        return require database_path('migrations/2026_10_15_000000_normalize_event_names.php');
    }

    private function insertEvent(string $name, bool $deleted = false): int
    {
        $id = DB::table('calendar_events')->insertGetId([
            'name' => $name,
            'description' => '',
            'data' => '{}',
            'settings' => '{}',
            'calendar_id' => 0,
            'deleted_at' => $deleted ? now() : null,
        ]);

        return $this->ids[] = $id;
    }

    private function nameOf(int $id): string
    {
        return DB::table('calendar_events')->where('id', $id)->value('name');
    }

    protected function tearDown(): void
    {
        DB::table('calendar_events')->whereIn('id', $this->ids)->delete();

        parent::tearDown();
    }

    public function test_up_normalizes_names_and_down_restores_them()
    {
        $migration = $this->migration();
        $migration->down();

        $encoded = $this->insertEvent('Redaun &amp; Lex&#39;s Birthday');
        $arrow = $this->insertEvent('Teleport -&gt; Library');
        $tagged = $this->insertEvent('<b>Feast</b> day');
        $heart = $this->insertEvent('Get Out of My Forest, &lt;3 Blossom');
        $plain = $this->insertEvent('Rock & Roll');
        $untouched = $this->insertEvent('Harvest Festival');
        $softDeleted = $this->insertEvent('Old &amp; Gone', deleted: true);

        $migration->up();

        $this->assertSame("Redaun & Lex's Birthday", $this->nameOf($encoded));
        $this->assertSame('Teleport -> Library', $this->nameOf($arrow));
        $this->assertSame('Feast day', $this->nameOf($tagged));
        $this->assertSame('Get Out of My Forest, <3 Blossom', $this->nameOf($heart));
        $this->assertSame('Rock & Roll', $this->nameOf($plain));
        $this->assertSame('Harvest Festival', $this->nameOf($untouched));
        $this->assertSame('Old & Gone', $this->nameOf($softDeleted));

        // Only rows that actually changed are backed up.
        $backedUp = DB::table('calendar_event_name_backups')->whereIn('event_id', $this->ids)->pluck('name', 'event_id');
        $this->assertEqualsCanonicalizing([$encoded, $arrow, $tagged, $heart, $softDeleted], $backedUp->keys()->all());

        $migration->down();

        $this->assertSame('Redaun &amp; Lex&#39;s Birthday', $this->nameOf($encoded));
        $this->assertSame('<b>Feast</b> day', $this->nameOf($tagged));
        $this->assertSame('Old &amp; Gone', $this->nameOf($softDeleted));
        $this->assertFalse(Schema::hasTable('calendar_event_name_backups'));

        // Leave the schema as migrate:fresh would.
        $migration->up();
    }
}
