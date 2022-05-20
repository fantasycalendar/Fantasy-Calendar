<?php

namespace App\Services\Discord\Commands\Command\Response;

use Illuminate\Support\Str;

class Emoji
{
    private $name;
    private $id;

    /**
     * @param $name
     * @param null $id
     */
    public function __construct($name, $id = null)
    {
        $this->name = $name;
        $this->id = $id;
    }

    public function build(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }

    /**
     * Accepts either an emoji string like :sunglasses:, or an array containing
     * 'name' => The name of the emoji surrounded by colons (like :sunglasses:)
     * 'id' => The Discord ID of the emoji. Only necessary for custom emoji, I think?
     *
     * @param $data
     * @return Emoji
     * @throws \Exception
     */
    public static function make($data): Emoji
    {
        if(is_string($data) && Str::startsWith($data, ':') && Str::endsWith($data, ':')) {
            return new self(Str::remove(':', $data));
        }

        if(is_array($data)) {
            return new self(Str::remove(':', $data['name']), $data['id']);
        }

        throw new \Exception("Emoji incorrectly initialized");
    }
}
