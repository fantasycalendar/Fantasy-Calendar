<?php

namespace App\Services\Discord\Commands\Command\Traits;

use Illuminate\Support\Str;

trait FormatsText
{
    /**
     * Formats the input string into a Markdown code block
     *
     * @param string $string
     * @return string
     */
    protected static function codeBlock(string $string): string
    {
        return "```\n$string\n```";
    }

    /**
     * Formats the input string to be Markdown bold
     *
     * @param string $string
     * @return string
     */
    protected static function bold(string $string): string
    {
        return "**{$string}**";
    }

    /**
     * Formats the input string to be a Markdown blockquote
     *
     * @param string $string
     * @return string
     */
    protected static function blockQuote(string $string): string
    {
        return "> " . implode("\n> ",explode("\n", $string));
    }

    /**
     * Creates a nicely-formatted "heading" of a specified length. For example, given
     * "Harptos" and a length of 40, it will return the following string:
     * "=============== Harptos ================"
     *
     * @param string $string
     * @param int $min_length
     * @return string
     */
    protected static function heading(string $string, int $min_length): string
    {
        return Str::padBoth(" {$string} ", $min_length, '=');
    }

    /**
     * Creates the specified number of newlines.
     *
     * @param int $amount
     * @return string
     */
    protected static function newLine(int $amount = 1): string
    {
        return str_repeat("\n", $amount);
    }

    /**
     * Creates a formatted Discord mention for the specified Discord user, if given a Discord user ID.
     * If no user is specified, default to the user who called the command
     *
     * @param string|null $discord_user_id
     * @return string
     */
    protected static function mention(string $discord_user_id = null): string
    {
        return '<@' . ($discord_user_id) . '>';
    }

}
