<?php

namespace Tests\Unit;

use App\Support\EventName;
use PHPUnit\Framework\TestCase;

class EventNameTest extends TestCase
{
    /**
     * @dataProvider names
     */
    public function test_normalize(string $input, string $expected)
    {
        $this->assertSame($expected, EventName::normalize($input));
    }

    public static function names(): array
    {
        return [
            'plain text is untouched' => ['Harvest Festival', 'Harvest Festival'],
            'raw ampersand is untouched' => ['Rock & Roll', 'Rock & Roll'],
            'encoded ampersand is decoded' => ['Rock &amp; Roll', 'Rock & Roll'],
            'double-encoded is fully decoded' => ['Rock &amp;amp; Roll', 'Rock & Roll'],
            'apostrophe entity' => ['Redaun &amp; Lex&#39;s Birthday', "Redaun & Lex's Birthday"],
            'legacy apostrophe entity' => ['O&#039;Brien', "O'Brien"],
            'quote entity' => ['Tom &quot;T&quot;', 'Tom "T"'],
            'arrow' => ['Teleport Chamilla -&gt; Library', 'Teleport Chamilla -> Library'],
            'heart survives' => ['Get Out of My Forest, &lt;3 Blossom', 'Get Out of My Forest, <3 Blossom'],
            'less-than before a digit survives' => ['Level <5 boss', 'Level <5 boss'],
            'spaced less-than survives' => ['a < b', 'a < b'],
            'complete tags are removed' => ['<b>Feast</b> day', 'Feast day'],
            'encoded tags are removed after decoding' => ['&lt;b&gt;Feast&lt;/b&gt;', 'Feast'],
            'handler-bearing tag is removed' => ['x<img src=x onerror=alert(1)>y', 'xy'],
            'unclosed tag text is kept as text' => ['<img src=x onerror=alert(1)//', '<img src=x onerror=alert(1)//'],
            'tags split by entities converge' => ['&lt;<b></b>b&gt;x', 'x'],
            'unicode is preserved' => ['Sarcophages &amp; nécrophages — 36', 'Sarcophages & nécrophages — 36'],
        ];
    }

    public function test_normalize_is_idempotent()
    {
        foreach (self::names() as [$input]) {
            $once = EventName::normalize($input);
            $this->assertSame($once, EventName::normalize($once), "Not a fixed point: {$input}");
        }
    }

    public function test_non_strings_pass_through()
    {
        $this->assertNull(EventName::normalize(null));
        $this->assertSame(5, EventName::normalize(5));
    }
}
