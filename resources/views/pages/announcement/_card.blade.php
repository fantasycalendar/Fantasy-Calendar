<div class="col-12 col-md-3 py-2 py-md-0 px-2 ml-md-0 pl-md-0 pr-md-2">
    <div class="inner text-center h-100 px-3 rounded" style="background-color: #303136;">
        <div class="row">
            <h3 class="pt-4 w-100"><i class="fa fa-{{ $icon }}"></i></h3>
        </div>
        <div class="row">
            <h5 class="pt-2 w-100">{{ $title }}</h5>
        </div>
        <div class="row">
            @unless(isset($raw) && $raw === true)
                <p class=" px-4">{!! $content !!}</p>
            @else
                {!! $content !!}
            @endunless
        </div>
    </div>
</div>
