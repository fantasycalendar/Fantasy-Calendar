@component('mail::message')
# Account Deleted

On **{{ $delete_requested_at }}** we recieved a request to delete your account.

This has now fully taken effect.

Thank you for using Fantasy Calendar, and we hope to see you again in the future.

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent
