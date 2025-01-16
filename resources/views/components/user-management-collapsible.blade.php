@props(['calendar' => null])

@if(Auth::user()->can('add-users', $calendar))
    <div class='row no-gutters'>
        <p class='m-0'>Invite your friends to collaborate!</p>
        <p><small>Once they accept your invite, you'll be able to assign them a role.</small></p>
    </div>

    <div class='row no-gutters my-1 input-group'>
        <input type='text' class='form-control' id='email_input' x-model='invite_email' placeholder='Email'>
        <div class="input-group-append">
            <button type='button' class='btn full btn-primary' :disabled="!invite_email && invite_enabled" @click="inviteUser">Invite</button>
        </div>
    </div>

    <div class='row no-gutters mb-2' x-cloak x-show="!!invite_status" x-transition>
        <p class='m-0 alert alert-success' x-text="invite_status"></p>
    </div>

    <div class='sortable'>
        <template x-for="user in users" x-index='user.email'>
            <div class='sortable-container list-group-item'>
                <div class='collapse-container container mb-2'>

                    <div class='row no-gutters my-2'>
                        <div class='col-md'>
                            <h4 class='m-0' x-text="user.username"></h4>
                        </div>
                        <div class='col-md-auto'>
                            <button class="btn btn-sm btn-danger full" @click="removeUser(user.id)">
                                <i class='fas fa-trash'></i>
                            </button>
                        </div>
                    </div>

                    <div class='row no-gutters my-2'>
                        <div class='col'>
                            <div class='separator'></div>
                        </div>
                    </div>

                    <div class='row no-gutters mt-1' x-show="user.user_role != 'invited'">
                        <p class='m-0'>Permissions:</p>
                    </div>

                    <div class='row no-gutters mb-1' x-data="{ role: user.user_role }" x-show="user.user_role != 'invited'">
                        <div class='input-group'>
                            <select x-model="role" class='form-control'>
                                <option value='observer'>Observer</option>
                                <option value='player'>Player</option>
                                <option value='co-owner'>CO-GM</option>
                            </select>

                            <div class="input-group-append">
                                <button type='button' class='btn btn btn-primary' :disabled="user.user_role == role" @click="updateUserRole(user.id, role)">Update</button>
                            </div>
                        </div>
                    </div>

                    <div class='row no-gutters my-1' x-show="user.user_role == 'invited'">
                        <p class='m-0'>We've sent them an invitation to your calendar, and now we're just waiting for them to accept it!</p>
                    </div>

                    <div class='row no-gutters my-2' x-show="user.user_role == 'invited'">
                        <button type="button" class="btn btn-primary resend_invitation" user_email='${user.username}'>Resend invitation email</button>
                    </div>

                    <div class='row no-gutters my-1 hidden' x-show="user.user_role == 'invited'">
                        <p class='m-0 user_permissions_text'></p>
                    </div>

                </div>

            </div>
        </template>

    </div>

    <div class='row no-gutters my-1'>
        <button type='button' class='btn btn-sm btn-secondary full' @click="loadUsers">
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
