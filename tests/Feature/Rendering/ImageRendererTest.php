<?php

namespace Tests\Feature\Rendering;

use App\Services\RendererService\ImageRenderer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Imagick;
use Tests\TestCase;

class ImageRendererTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Storage::disk('local')->makeDirectory('tmp');
    }

    public function tearDown(): void
    {
        parent::tearDown();

        Storage::disk('local')->deleteDirectory('tmp');
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testImageRenderer()
    {
        $this->getEdgeCases()->each(function($calendar){
            collect(Arr::get($calendar->static_data, 'imagerenderer_testcases',[]))->each(function($testCase) use ($calendar) {
                $expectationBlob = Storage::disk('base')->get($testCase['expectation_filename']);
                $freshBlob = ImageRenderer::renderMonth($calendar, collect([
                    'ext' => 'png',
                    'year' => $testCase['year'] ?? 0,
                    'month_id' => $testCase['month'] ?? 0,
                    'day' => $testCase['day'] ?? 1,
                ]))->encode();

//                Storage::disk('local')->put('tmp/' . Str::slug(Str::ascii($calendar->name)) . '_' . Str::slug(Str::ascii($calendar->current_date)) . '.png', $freshBlob);

                $this->assertEquals(round(0.0, 2), round($this->compareImages($expectationBlob, $freshBlob), 2));
            });
        });
    }

    private function compareImages($blob1, $blob2)
    {
        $image1 = new Imagick();
        $image1->readImageBlob($blob1);
        $image2 = new Imagick();
        $image2->readImageBlob($blob2);

        $result = $image1->compareImages($image2, Imagick::METRIC_MEANSQUAREERROR);
        $result[0]->setImageFormat("png");

        return $result[1];
    }
}
