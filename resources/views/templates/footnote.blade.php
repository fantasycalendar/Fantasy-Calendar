<style>
    section.footer {
        display: flex;
        background-color: var(--gray-dark);
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
    section.footer .footer-social-icons a i {
        background-color: rgb(47, 133, 90);
        padding: 5px;
        color: var(--gray-dark);
        font-size: 24px;
    }
    section.footer .footer-social-icons a:hover i {
        background-color: rgba(255, 255, 255, 0.3);
    }
</style>

<section class="footer d-flex flex-column flex-md-row mt-5 mt-md-0">
    <div class="logo pb-4 pb-md-0 d-flex flex-column flex-md-row align-items-center">
        <img src="{{ asset('resources/footer_logo.png') }}">
        <div class="footer-social-icons px-md-2 border-md-left border-secondary ml-md-2 mt-2 pt-2 pt-md-0 mt-md-0">
            <a href="{{ route('discord') }}"><i class="fab fa-discord mx-1 rounded"></i></a>
            <a href="https://twitter.com/FantasyCalendar"><i class="fab fa-twitter mx-1 rounded"></i></a>
            <a href="https://github.com/fantasycalendar"><i class="fab fa-github mx-1 rounded"></i></a>
        </div>
    </div>

    <div class="copyright text-center text-md-right">
        <span class="copyright d-inline-block mb-2">Copyright © {{ date('Y') }} Fantasy Computerworks Ltd</span><br>
        <span><a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> - <a href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></span>
    </div>
</section>
