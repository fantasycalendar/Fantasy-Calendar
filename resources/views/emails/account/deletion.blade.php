@component('mail::message')
# Account Deletion Request Receieved

On **{{ $delete_requested_at }}** we recieved a request to delete your account. It'll be fully deleted on **{{ $deleting_at }}**. You can cancel your request any time between now and then by logging in or by clicking this button:

@component('mail::button', ['url' => URL::route('cancel-account-deletion')])
Cancel Deletion Request
@endcomponent

If you believe this is a mistake, please contact the Fantasy Calendar team as soon as possible:
[contact@fantasy-calendar.com](mailto:contact@fantasy-calendar.com)

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent
