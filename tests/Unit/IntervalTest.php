<?php

namespace Tests\Unit;

use App\Collections\IntervalsCollection;
use PHPUnit\Framework\TestCase;

class IntervalTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testNormalize()
    {

        $intervals = IntervalsCollection::fromString("!1000,746,!373,!5,4", 0)
            ->cleanUp()
            ->normalize()
            ->toJsons();

        $truth = '["{\"interval\":373000,\"subtractor\":true,\"offset\":0}","{\"interval\":7460,\"subtractor\":false,\"offset\":0}","{\"interval\":1492,\"subtractor\":true,\"offset\":0}","{\"interval\":746,\"subtractor\":false,\"offset\":0}","{\"interval\":20,\"subtractor\":true,\"offset\":0}","{\"interval\":4,\"subtractor\":false,\"offset\":0}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("400,!100,4", 0)
            ->cleanUp()
            ->normalize()
            ->toJsons();

        $truth = '["{\"interval\":400,\"subtractor\":false,\"offset\":0}","{\"interval\":100,\"subtractor\":true,\"offset\":0}","{\"interval\":4,\"subtractor\":false,\"offset\":0}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("!2203,!400,+!100,4,!2", 1)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":881200,\"subtractor\":false,\"offset\":1}","{\"interval\":8812,\"subtractor\":true,\"offset\":1}","{\"interval\":400,\"subtractor\":true,\"offset\":1}","{\"interval\":4,\"subtractor\":false,\"offset\":1}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("233,!144,+89,55,!34,+21,13,+!8,!5,3,2", 0)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":254074700880,\"subtractor\":false,\"offset\":0}","{\"interval\":36296385840,\"subtractor\":true,\"offset\":0}","{\"interval\":19544207760,\"subtractor\":true,\"offset\":0}","{\"interval\":14945570640,\"subtractor\":true,\"offset\":0}","{\"interval\":10586445870,\"subtractor\":true,\"offset\":0}","{\"interval\":4619540016,\"subtractor\":true,\"offset\":0}","{\"interval\":3849616680,\"subtractor\":true,\"offset\":0}","{\"interval\":2854771920,\"subtractor\":true,\"offset\":0}","{\"interval\":2135081520,\"subtractor\":false,\"offset\":0}","{\"interval\":1149659280,\"subtractor\":false,\"offset\":0}","{\"interval\":1090449360,\"subtractor\":true,\"offset\":0}","{\"interval\":962404170,\"subtractor\":false,\"offset\":0}","{\"interval\":814341990,\"subtractor\":false,\"offset\":0}","{\"interval\":769923336,\"subtractor\":false,\"offset\":0}","{\"interval\":659934288,\"subtractor\":false,\"offset\":0}","{\"interval\":504116470,\"subtractor\":false,\"offset\":0}","{\"interval\":407824560,\"subtractor\":false,\"offset\":0}","{\"interval\":355349232,\"subtractor\":false,\"offset\":0}","{\"interval\":311366055,\"subtractor\":false,\"offset\":0}","{\"interval\":296124360,\"subtractor\":false,\"offset\":0}","{\"interval\":271737648,\"subtractor\":false,\"offset\":0}","{\"interval\":226448040,\"subtractor\":false,\"offset\":0}","{\"interval\":219597840,\"subtractor\":false,\"offset\":0}","{\"interval\":183315080,\"subtractor\":false,\"offset\":0}","{\"interval\":167927760,\"subtractor\":false,\"offset\":0}","{\"interval\":164237040,\"subtractor\":true,\"offset\":0}","{\"interval\":155778480,\"subtractor\":false,\"offset\":0}","{\"interval\":118948830,\"subtractor\":false,\"offset\":0}","{\"interval\":83880720,\"subtractor\":false,\"offset\":0}","{\"interval\":74031090,\"subtractor\":true,\"offset\":0}","{\"interval\":64144080,\"subtractor\":false,\"offset\":0}","{\"interval\":59224872,\"subtractor\":true,\"offset\":0}","{\"interval\":51904944,\"subtractor\":false,\"offset\":0}","{\"interval\":45828770,\"subtractor\":true,\"offset\":0}","{\"interval\":45435390,\"subtractor\":false,\"offset\":0}","{\"interval\":45289608,\"subtractor\":true,\"offset\":0}","{\"interval\":43254120,\"subtractor\":false,\"offset\":0}","{\"interval\":38819664,\"subtractor\":true,\"offset\":0}","{\"interval\":36663016,\"subtractor\":true,\"offset\":0}","{\"interval\":28306005,\"subtractor\":true,\"offset\":0}","{\"interval\":23989680,\"subtractor\":true,\"offset\":0}","{\"interval\":23951235,\"subtractor\":true,\"offset\":0}","{\"interval\":20902896,\"subtractor\":true,\"offset\":0}","{\"interval\":19826352,\"subtractor\":false,\"offset\":0}","{\"interval\":17419080,\"subtractor\":true,\"offset\":0}","{\"interval\":16521960,\"subtractor\":false,\"offset\":0}","{\"interval\":14826955,\"subtractor\":true,\"offset\":0}","{\"interval\":14101160,\"subtractor\":true,\"offset\":0}","{\"interval\":12917520,\"subtractor\":true,\"offset\":0}","{\"interval\":12252240,\"subtractor\":false,\"offset\":0}","{\"interval\":10813530,\"subtractor\":true,\"offset\":0}","{\"interval\":10783240,\"subtractor\":true,\"offset\":0}","{\"interval\":9163440,\"subtractor\":true,\"offset\":0}","{\"interval\":9149910,\"subtractor\":true,\"offset\":0}","{\"interval\":8650824,\"subtractor\":true,\"offset\":0}","{\"interval\":8087430,\"subtractor\":true,\"offset\":0}","{\"interval\":7414992,\"subtractor\":true,\"offset\":0}","{\"interval\":5664230,\"subtractor\":true,\"offset\":0}","{\"interval\":4934160,\"subtractor\":true,\"offset\":0}","{\"interval\":4130490,\"subtractor\":true,\"offset\":0}","{\"interval\":4043715,\"subtractor\":false,\"offset\":0}","{\"interval\":3992688,\"subtractor\":true,\"offset\":0}","{\"interval\":3525290,\"subtractor\":false,\"offset\":0}","{\"interval\":3498495,\"subtractor\":true,\"offset\":0}","{\"interval\":3495030,\"subtractor\":true,\"offset\":0}","{\"interval\":3483816,\"subtractor\":false,\"offset\":0}","{\"interval\":3327240,\"subtractor\":true,\"offset\":0}","{\"interval\":3304392,\"subtractor\":true,\"offset\":0}","{\"interval\":3053232,\"subtractor\":true,\"offset\":0}","{\"interval\":2986128,\"subtractor\":false,\"offset\":0}","{\"interval\":2832336,\"subtractor\":true,\"offset\":0}","{\"interval\":2820232,\"subtractor\":false,\"offset\":0}","{\"interval\":2695810,\"subtractor\":false,\"offset\":0}","{\"interval\":2544360,\"subtractor\":true,\"offset\":0}","{\"interval\":2177385,\"subtractor\":false,\"offset\":0}","{\"interval\":2163590,\"subtractor\":true,\"offset\":0}","{\"interval\":2156648,\"subtractor\":false,\"offset\":0}","{\"interval\":2059720,\"subtractor\":true,\"offset\":0}","{\"interval\":1845360,\"subtractor\":false,\"offset\":0}","{\"interval\":1750320,\"subtractor\":true,\"offset\":0}","{\"interval\":1617486,\"subtractor\":false,\"offset\":0}","{\"interval\":1525104,\"subtractor\":true,\"offset\":0}","{\"interval\":1336335,\"subtractor\":true,\"offset\":0}","{\"interval\":1270920,\"subtractor\":true,\"offset\":0}","{\"interval\":1166256,\"subtractor\":true,\"offset\":0}","{\"interval\":1140535,\"subtractor\":false,\"offset\":0}","{\"interval\":971880,\"subtractor\":true,\"offset\":0}","{\"interval\":942480,\"subtractor\":true,\"offset\":0}","{\"interval\":831810,\"subtractor\":false,\"offset\":0}","{\"interval\":829480,\"subtractor\":false,\"offset\":0}","{\"interval\":808743,\"subtractor\":true,\"offset\":0}","{\"interval\":786760,\"subtractor\":true,\"offset\":0}","{\"interval\":720720,\"subtractor\":true,\"offset\":0}","{\"interval\":705058,\"subtractor\":true,\"offset\":0}","{\"interval\":704880,\"subtractor\":false,\"offset\":0}","{\"interval\":665448,\"subtractor\":false,\"offset\":0}","{\"interval\":622110,\"subtractor\":false,\"offset\":0}","{\"interval\":539162,\"subtractor\":true,\"offset\":0}","{\"interval\":514930,\"subtractor\":false,\"offset\":0}","{\"interval\":510510,\"subtractor\":true,\"offset\":0}","{\"interval\":508872,\"subtractor\":false,\"offset\":0}","{\"interval\":436176,\"subtractor\":false,\"offset\":0}","{\"interval\":411944,\"subtractor\":false,\"offset\":0}","{\"interval\":318045,\"subtractor\":false,\"offset\":0}","{\"interval\":317730,\"subtractor\":false,\"offset\":0}","{\"interval\":311055,\"subtractor\":true,\"offset\":0}","{\"interval\":269581,\"subtractor\":false,\"offset\":0}","{\"interval\":269115,\"subtractor\":false,\"offset\":0}","{\"interval\":254184,\"subtractor\":false,\"offset\":0}","{\"interval\":234864,\"subtractor\":false,\"offset\":0}","{\"interval\":222768,\"subtractor\":true,\"offset\":0}","{\"interval\":207370,\"subtractor\":true,\"offset\":0}","{\"interval\":196690,\"subtractor\":false,\"offset\":0}","{\"interval\":195720,\"subtractor\":false,\"offset\":0}","{\"interval\":194376,\"subtractor\":false,\"offset\":0}","{\"interval\":185640,\"subtractor\":true,\"offset\":0}","{\"interval\":166608,\"subtractor\":false,\"offset\":0}","{\"interval\":166595,\"subtractor\":false,\"offset\":0}","{\"interval\":165896,\"subtractor\":true,\"offset\":0}","{\"interval\":158440,\"subtractor\":false,\"offset\":0}","{\"interval\":157352,\"subtractor\":false,\"offset\":0}","{\"interval\":124422,\"subtractor\":true,\"offset\":0}","{\"interval\":121485,\"subtractor\":false,\"offset\":0}","{\"interval\":121160,\"subtractor\":false,\"offset\":0}","{\"interval\":102960,\"subtractor\":false,\"offset\":0}","{\"interval\":102795,\"subtractor\":false,\"offset\":0}","{\"interval\":90870,\"subtractor\":false,\"offset\":0}","{\"interval\":89712,\"subtractor\":false,\"offset\":0}","{\"interval\":74760,\"subtractor\":false,\"offset\":0}","{\"interval\":63635,\"subtractor\":false,\"offset\":0}","{\"interval\":62211,\"subtractor\":false,\"offset\":0}","{\"interval\":60520,\"subtractor\":false,\"offset\":0}","{\"interval\":55440,\"subtractor\":false,\"offset\":0}","{\"interval\":46410,\"subtractor\":false,\"offset\":0}","{\"interval\":46280,\"subtractor\":false,\"offset\":0}","{\"interval\":45435,\"subtractor\":true,\"offset\":0}","{\"interval\":41474,\"subtractor\":false,\"offset\":0}","{\"interval\":39610,\"subtractor\":true,\"offset\":0}","{\"interval\":39270,\"subtractor\":false,\"offset\":0}","{\"interval\":39144,\"subtractor\":true,\"offset\":0}","{\"interval\":37128,\"subtractor\":false,\"offset\":0}","{\"interval\":34710,\"subtractor\":false,\"offset\":0}","{\"interval\":31824,\"subtractor\":false,\"offset\":0}","{\"interval\":31688,\"subtractor\":true,\"offset\":0}","{\"interval\":30290,\"subtractor\":true,\"offset\":0}","{\"interval\":24465,\"subtractor\":true,\"offset\":0}","{\"interval\":24310,\"subtractor\":false,\"offset\":0}","{\"interval\":24232,\"subtractor\":true,\"offset\":0}","{\"interval\":20737,\"subtractor\":true,\"offset\":0}","{\"interval\":18174,\"subtractor\":true,\"offset\":0}","{\"interval\":17355,\"subtractor\":true,\"offset\":0}","{\"interval\":17136,\"subtractor\":false,\"offset\":0}","{\"interval\":15130,\"subtractor\":true,\"offset\":0}","{\"interval\":15015,\"subtractor\":false,\"offset\":0}","{\"interval\":14952,\"subtractor\":true,\"offset\":0}","{\"interval\":14280,\"subtractor\":false,\"offset\":0}","{\"interval\":13104,\"subtractor\":false,\"offset\":0}","{\"interval\":12816,\"subtractor\":true,\"offset\":0}","{\"interval\":12815,\"subtractor\":true,\"offset\":0}","{\"interval\":12104,\"subtractor\":true,\"offset\":0}","{\"interval\":11570,\"subtractor\":true,\"offset\":0}","{\"interval\":10920,\"subtractor\":false,\"offset\":0}","{\"interval\":9345,\"subtractor\":true,\"offset\":0}","{\"interval\":9320,\"subtractor\":true,\"offset\":0}","{\"interval\":9256,\"subtractor\":true,\"offset\":0}","{\"interval\":9087,\"subtractor\":false,\"offset\":0}","{\"interval\":8840,\"subtractor\":false,\"offset\":0}","{\"interval\":7922,\"subtractor\":false,\"offset\":0}","{\"interval\":7920,\"subtractor\":true,\"offset\":0}","{\"interval\":6990,\"subtractor\":true,\"offset\":0}","{\"interval\":6942,\"subtractor\":true,\"offset\":0}","{\"interval\":6058,\"subtractor\":false,\"offset\":0}","{\"interval\":4895,\"subtractor\":true,\"offset\":0}","{\"interval\":3570,\"subtractor\":true,\"offset\":0}","{\"interval\":3560,\"subtractor\":true,\"offset\":0}","{\"interval\":3495,\"subtractor\":false,\"offset\":0}","{\"interval\":3471,\"subtractor\":false,\"offset\":0}","{\"interval\":3029,\"subtractor\":true,\"offset\":0}","{\"interval\":3026,\"subtractor\":false,\"offset\":0}","{\"interval\":2856,\"subtractor\":true,\"offset\":0}","{\"interval\":2670,\"subtractor\":true,\"offset\":0}","{\"interval\":2330,\"subtractor\":false,\"offset\":0}","{\"interval\":2314,\"subtractor\":false,\"offset\":0}","{\"interval\":2210,\"subtractor\":true,\"offset\":0}","{\"interval\":2184,\"subtractor\":true,\"offset\":0}","{\"interval\":1872,\"subtractor\":true,\"offset\":0}","{\"interval\":1864,\"subtractor\":false,\"offset\":0}","{\"interval\":1768,\"subtractor\":true,\"offset\":0}","{\"interval\":1398,\"subtractor\":false,\"offset\":0}","{\"interval\":1365,\"subtractor\":true,\"offset\":0}","{\"interval\":1335,\"subtractor\":false,\"offset\":0}","{\"interval\":1157,\"subtractor\":true,\"offset\":0}","{\"interval\":1155,\"subtractor\":true,\"offset\":0}","{\"interval\":1008,\"subtractor\":true,\"offset\":0}","{\"interval\":890,\"subtractor\":false,\"offset\":0}","{\"interval\":840,\"subtractor\":true,\"offset\":0}","{\"interval\":715,\"subtractor\":true,\"offset\":0}","{\"interval\":712,\"subtractor\":false,\"offset\":0}","{\"interval\":699,\"subtractor\":true,\"offset\":0}","{\"interval\":680,\"subtractor\":true,\"offset\":0}","{\"interval\":534,\"subtractor\":false,\"offset\":0}","{\"interval\":520,\"subtractor\":true,\"offset\":0}","{\"interval\":466,\"subtractor\":true,\"offset\":0}","{\"interval\":390,\"subtractor\":true,\"offset\":0}","{\"interval\":267,\"subtractor\":true,\"offset\":0}","{\"interval\":233,\"subtractor\":false,\"offset\":0}","{\"interval\":195,\"subtractor\":false,\"offset\":0}","{\"interval\":178,\"subtractor\":true,\"offset\":0}","{\"interval\":170,\"subtractor\":false,\"offset\":0}","{\"interval\":168,\"subtractor\":false,\"offset\":0}","{\"interval\":136,\"subtractor\":false,\"offset\":0}","{\"interval\":130,\"subtractor\":false,\"offset\":0}","{\"interval\":105,\"subtractor\":false,\"offset\":0}","{\"interval\":104,\"subtractor\":false,\"offset\":0}","{\"interval\":89,\"subtractor\":false,\"offset\":0}","{\"interval\":78,\"subtractor\":false,\"offset\":0}","{\"interval\":55,\"subtractor\":false,\"offset\":0}","{\"interval\":40,\"subtractor\":false,\"offset\":0}","{\"interval\":39,\"subtractor\":true,\"offset\":0}","{\"interval\":34,\"subtractor\":true,\"offset\":0}","{\"interval\":30,\"subtractor\":false,\"offset\":0}","{\"interval\":26,\"subtractor\":true,\"offset\":0}","{\"interval\":21,\"subtractor\":true,\"offset\":0}","{\"interval\":21,\"subtractor\":false,\"offset\":0}","{\"interval\":15,\"subtractor\":true,\"offset\":0}","{\"interval\":13,\"subtractor\":false,\"offset\":0}","{\"interval\":10,\"subtractor\":true,\"offset\":0}","{\"interval\":8,\"subtractor\":true,\"offset\":0}","{\"interval\":6,\"subtractor\":true,\"offset\":0}","{\"interval\":3,\"subtractor\":false,\"offset\":0}","{\"interval\":2,\"subtractor\":false,\"offset\":0}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("!300,!180,150,90", 3)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":900,\"subtractor\":false,\"offset\":3}","{\"interval\":450,\"subtractor\":true,\"offset\":3}","{\"interval\":300,\"subtractor\":true,\"offset\":3}","{\"interval\":180,\"subtractor\":true,\"offset\":3}","{\"interval\":150,\"subtractor\":false,\"offset\":3}","{\"interval\":90,\"subtractor\":false,\"offset\":3}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("!165105,!2500,9,2", 50)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":82552500,\"subtractor\":false,\"offset\":50}","{\"interval\":165105,\"subtractor\":true,\"offset\":50}","{\"interval\":2500,\"subtractor\":true,\"offset\":50}","{\"interval\":18,\"subtractor\":true,\"offset\":14}","{\"interval\":9,\"subtractor\":false,\"offset\":5}","{\"interval\":2,\"subtractor\":false,\"offset\":0}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("!100,15,10,4", 15)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":100,\"subtractor\":true,\"offset\":15}","{\"interval\":30,\"subtractor\":true,\"offset\":15}","{\"interval\":20,\"subtractor\":true,\"offset\":15}","{\"interval\":15,\"subtractor\":false,\"offset\":0}","{\"interval\":10,\"subtractor\":false,\"offset\":5}","{\"interval\":4,\"subtractor\":false,\"offset\":3}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

        $intervals = IntervalsCollection::fromString("+50,4", 4)
                ->cleanUp()
                ->normalize()
                ->toJsons();

        $truth = '["{\"interval\":100,\"subtractor\":true,\"offset\":0}","{\"interval\":50,\"subtractor\":false,\"offset\":0}","{\"interval\":4,\"subtractor\":false,\"offset\":0}"]';

        $this->assertEquals($truth, $intervals);

        #--------------------------------------------------#

    }
}
