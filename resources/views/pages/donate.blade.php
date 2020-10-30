@extends('templates._page')

@push('head')
    <style>
    .donate-background{
        height: 100%;
        padding: 0;
        margin: 0;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .thank-you{
        width:100%;
    }

    .donate-background .detail-column{
        padding:10px;
    }

    .donate-background .detail-row{
        padding:10px;
    }

    .float-rights{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: inline-flex;
        align-self: flex-end;
        flex-direction: column;
    }

    .spacing{
        padding-left:1.5em;
    }
    </style>
@endpush

@section('content')
    <div class='donate-background'>
        <div class='detail-row'>
            <div class='thank-you center-text bold-text'>Thank you for considering supporting the site! It's only through your generous donations I can keep this site up and running!</div>
        </div>
        <div class='detail-row'>
            <div class='detail-column half'>
                <div class='float-rights'>
                    <div class='detail-row'>
                        <h4>Paypal:</h4>
                    </div>
                    <div class='detail-row'>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="HWFW78AYHS4HQ" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        <img alt="" border="0" src="https://www.paypal.com/en_CZ/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                    </div>
                </div>
            </div>
            <div class='detail-column half'>
                <div class='detail-row'>
                    <h4>Ko-fi:</h4>
                </div>
                <div class='detail-row'>
                    <script type='text/javascript' src='https://ko-fi.com/widgets/widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support Me on Ko-fi', '#46b798', 'H2H2LCCQ');kofiwidget2.draw();</script> 
                </div>
            </div>
        </div>
    </div>
@endsection