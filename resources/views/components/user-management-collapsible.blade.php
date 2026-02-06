@props(['calendar' => null])

@if(Auth::user()->can('add-users', $calendar))
<div class="flex flex-col space-y-4">
    <p class='m-0'>Invite your friends to collaborate!</p>
    <p><small>Once they accept your invite, you'll be able to assign them a role.</small></p>

    <div class='flex input-group'>
        <input type='text'
            class='form-control'
            id='email_input'
            x-model='invite_email'
            placeholder='Email'
            :disabled="inviting"
            @keydown.enter="inviteUser"
        >
        <div class="input-group-append">
            <button type='button'
                class='btn w-full btn-primary'
                :disabled="!invite_email || !invite_enabled || inviting"
                @click="inviteUser"
            ><span x-text="inviting ? 'Sending...' : 'Invite'" ></span></button>
        </div>
    </div>

    <div class='flex mb-2 alert alert-success' x-cloak x-show="!!invite_status" x-transition x-text="invite_status"></div>
    <div class='flex mb-1 alert alert-danger' x-cloak x-show="!!invite_error" x-transition x-text="invite_error"></div>

    <div class='sortable' x-ref="users-sortable" x-show="users.length">
        <template x-for="(user, index) in users" x-index='user.id' :key="user.id">
            <x-sortable-item deleteFunction="removeUser(user.id)"
                x-data="{
                    role: user.user_role,
                    success_message: '',
                    error_message: '',
                    success(message) {
                        this.success_message = message;

                        setTimeout(() => this.success_message = null, 1500)
                    },
                    error(message) {
                        this.error_message = message;

                        setTimeout(() => this.error_message = null, 2500)
                    }
                }">
                <x-slot:inputs>
                    <div class="my-1.5" x-text="user.username"></div>
                </x-slot:inputs>

                <div class='separator'></div>

                <p x-show="user.user_role != 'invited'">Permissions:</p>

                <div class='flex mb-1' x-show="user.user_role != 'invited'">
                    <div class='input-group'>
                        <select x-model="role" class='form-control'>
                            <option value='observer'>Observer</option>
                            <option value='player'>Player</option>
                            <option value='co-owner'>CO-GM</option>
                        </select>

                        <div class="input-group-append">
                            <button type='button'
                                class='btn btn btn-primary'
                                :disabled="user.user_role == role"
                                @click="updateUserRole(user.id, role, (succeeded, message) => { if (succeeded) { success(message); user.user_role = role; } else { error(message) } })"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                <div x-show="user.user_role == 'invited'">We've sent them an invitation to your calendar, and now we're just waiting for them to accept it!</div>
                <button x-show="user.user_role == 'invited'" type="button" class="btn btn-primary" @click.prevent='resendCalendarInvite(user.username, (succeeded, message) => { if (succeeded) { success(message) } else { error(message) } })'>Resend invitation email</button>
                <div x-show="user.user_role == 'invited'" class='m-0 user_permissions_text'></div>

                <div class='flex my-1 alert alert-success' x-show="success_message" x-transition x-text="success_message"></div>
                <div class='flex my-1 alert alert-danger' x-show="error_message" x-transition x-text="error_message"></div>
            </x-sortable-item>
        </template>
    </div>

    <button type='button'
        class='btn btn-sm btn-secondary w-full'
        @click="loadUsers"
        :disabled="loadingUsers"
         x-text="loadingUsers ? 'Loading...' : 'Refresh'">
    </button>
</div>
@else
    <div class='flex my-1'>
        <p>Invite your friends to collaborate on this calendar!</p>
        <p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe
                now</a> to unlock this feature!</p>
    </div>
@endif
