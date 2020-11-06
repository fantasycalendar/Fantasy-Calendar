@component('mail::message')
# Account Deletion Last Warning

On **{{ $delete_requested_at }}** we recieved a request to delete your account. At midnight on the {{ $deleting_at }}, which is **tomorrow**, your account will be **permanently deleted** along with all of your data.

You can still cancel your request by pressing this button:

@component('mail::button', ['url' => URL::route('cancel-account-deletion')])
Cancel Deletion Request
@endcomponent

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent
