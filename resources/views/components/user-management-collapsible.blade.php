@props(['calendar' => null])

@if(Auth::user()->can('add-users', $calendar))
    <div class='row no-gutters'>
        <p class='m-0'>Invite your friends to collaborate!</p>
        <p><small>Once they accept your invite, you'll be able to assign them a role.</small></p>
    </div>

    <div class='row no-gutters my-1 input-group' x-data="{ email: '' }">
        <input type='text' class='form-control' id='email_input' x-model='email' placeholder='Email'>
        <div class="input-group-append">
            <button type='button' class='btn full btn-primary' id='btn_send_invite' :disabled="!email">Invite</button>
        </div>
    </div>

    <div class='row no-gutters mb-2 hidden'>
        <p class='m-0 email_text alert alert-success'></p>
    </div>

    <div class='sortable' id='calendar_user_list'></div>

    <div class='row no-gutters my-1'>
        <button type='button' class='btn btn-sm btn-secondary full' id='refresh_calendar_users'>
            Refresh
        </button>
    </div>
@else
    <div class='row no-gutters my-1'>
        <p>Invite your friends to collaborate on this calendar!</p>
        <p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe
                now</a> to unlock this feature!</p>
    </div>
@endif
