<style>
    section.footer {
        display: flex;
        background-color: #323232;
        justify-content: space-between;
        align-items: center;
        padding: 40px 20px;
        color: white;
    }
    section.footer a {
        font-weight: bold;
    }
    section.footer a:hover {
        color: rgba(255, 255, 255, 0.6);
    }
</style>

<section class="footer d-flex flex-column flex-md-row mt-5 mt-md-0">
    <div class="logo pb-4 pb-md-0"><img src="{{ asset('resources/footer_logo.png') }}"></div>
    <div class="copyright text-center text-md-right">
        <span class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd</span><br>
        <span><a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></span>
    </div>
</section>
