@props(['calendar'])

@push('head')
    <script lang="js">

        function userSection($data){

            return {

                alertText: "",
                alertSuccess: "",

                newUserEmail: "",
                users: [],
                opened: false,

                refreshUserList(){
                    get_calendar_users((userList) => {
                        this.users = clone(userList).map(user => {
                            user.alertText = "";
                            user.alertSuccess = true;
                            user.previous_role = user.user_role;
                            return user;
                        });
                        this.opened = true;
                    });
                },

                remove(user){

                    if(user.user_role !== "invited") {

                        swal.fire({
                            title: "Removing User",
                            html: `<p>Are you sure you want to remove <strong>${user.username}</strong> from this calendar?</p>`,
                            input: 'checkbox',
                            inputPlaceholder: 'Remove all of their contributions (events, comments, etc) as well',
                            inputClass: "form-control",
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, remove',
                            cancelButtonText: 'Cancel',
                            icon: "warning"
                        })
                        .then((result) => {
                            if (!result.dismiss) {
                                let remove_all = result.value === 1;
                                remove_calendar_user(user.id, remove_all, function () {
                                    window.dispatchEvent(new CustomEvent('refresh-user-list'));
                                });
                            }
                        });

                        return;

                    }

                    swal.fire({
                        title: "Cancel Invititation",
                        html: `<p>Are you sure you want to cancel the invitation for <strong>${user.username}</strong>?</p>`,
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, cancel it',
                        cancelButtonText: 'Nah, leave it',
                        icon: "warning"
                    })
                    .then((result) => {
                        if(!result.dismiss) {
                            remove_calendar_user(user.id, false, function(){
                                window.dispatchEvent(new CustomEvent('refresh-user-list'));
                            }, user.username);
                        }
                    });

                },

                updateUserRole(user){

                    user.alertSuccess = true;
                    user.alertText = "Updating user permissions...";

                    update_calendar_user(user.id, user.user_role, (success, text) => {

                        user.alertSuccess = success;
                        user.alertText = text;
                        user.previous_role = user.user_role;

                        setTimeout(() => {
                            user.alertText = "";
                        }, 5000);

                    });

                },

                resendInvite(user){

                    resend_calendar_invite(user.username, (success, text) => {

                        this.alertSuccess = success;
                        this.alertText = text;

                        setTimeout(() => {
                            this.alertText = "";
                        }, 5000);

                    });

                },

                disableSendButton: false,

                add(email){

                    this.disableSendButton = true;
                    const validEmail = validateEmail(email);

                    if(!validEmail){

                        this.disableSendButton = false;

                        this.alertSuccess = false;
                        this.alertText = "This email is invalid!";

                        setTimeout(() => {
                            this.alertText = "";
                        }, 5000);

                        return;
                    }

                    this.alertSuccess = true;
                    this.alertText = "Sending invitation...";

                    add_calendar_user(email, (success, text) => {

                        this.disableSendButton = false;
                        this.alertSuccess = success;
                        this.alertText = text;

                        setTimeout(() => {
                            this.alertText = "";
                        }, 5000);

                        if(success){
                            this.refreshUserList();
                        }
                    });

                }
            }
        }

    </script>
@endpush

<x-sidebar.collapsible
    class="settings-users"
    name="users"
    title="User Management"
    icon="fas fa-user"
    tooltip-title="More Info: User Management"
    helplink="user_management"
    @click.once="$dispatch('refresh-user-list')"
>

    @if(!Auth::user()->can('add-users', $calendar))

        <div
            x-data="userSection($data)"
            @refresh-user-list.window="refreshUserList()"
        >

            <div class='row no-gutters'>
                <p class='m-0'>Invite your friends to collaborate!</p>
                <p><small>Once they accept your invite, you'll be able to assign them a role.</small></p>
            </div>

            <div class='my-1 input-group'>
                <input type='text' class='form-control' placeholder='Email' x-model="newUserEmail" @keydown.enter="add(newUserEmail)">
                <div class="input-group-append">
                    <button type='button' class='btn btn-primary' :disable="disableSendButton" @click="add(newUserEmail)">Send Invite</button>
                </div>
            </div>

            <div class='row no-gutters mb-2' x-show="alertText" x-transition.duration.150ms>
                <p class='m-0 text-center full alert' :class="alertSuccess ? 'alert-success' : 'alert-danger'" x-text="alertText"></p>
            </div>

            <div class="sortable list-group">

                <template x-for="(user, index) in users">

                    <div class='sortable-container list-group-item'>

                        <div class='collapse-container container mb-2'>

                            <div class='row no-gutters my-2'>
                                <div class='col-md'>
                                    <h4 class='m-0' x-text="user.username"></h4>
                                </div>
                                <div class='col-md-auto'>
                                    <button type='button' class='btn btn-sm btn-danger full' @click="remove(user)"><i class='fas fa-trash'></i></button>
                                </div>
                            </div>

                            <div class='row no-gutters my-2'>
                                <div class='col'>
                                    <div class='separator'></div>
                                </div>
                            </div>

                            <template x-if="user.user_role != 'invited'">

                                <div>
                                    <div class='row no-gutters mt-1'>
                                        <p class='m-0'>Permissions:</p>
                                    </div>

                                    <div class='row no-gutters mb-1 input-group' x-model="user.user_role">
                                        <select class='form-control'>
                                            <option :selected="user.user_role == 'observer'" value='observer'>Observer</option>
                                            <option :selected="user.user_role == 'player'" value='player'>Player</option>
                                            <option :selected="user.user_role == 'co-owner'" value='co-owner'>CO-GM</option>
                                        </select>
                                        <div class='input-group-append'>
                                            <button type='button' class='btn btn btn-primary' :disabled="user.previous_role == user.user_role" @click='updateUserRole(user)'>Update</button>
                                        </div>
                                    </div>
                                </div>

                            </template>

                            <template x-if="user.user_role == 'invited'">

                                <div>

                                    <div class='row no-gutters my-1'>
                                        <p class='m-0'>We've sent them an invitation to your calendar, and now we're just waiting for them to accept it!</p>
                                    </div>

                                    <div class='row no-gutters my-2'>
                                        <button type="button" class="btn btn-primary" @click="resendInvite(user)">Resend invitation email</button>
                                    </div>

                                </div>

                            </template>

                            <div class='row no-gutters mb-2' x-show="user.alertText" x-transition.duration.150ms>
                                <p class='m-0 text-center full alert' :class="user.alertSuccess ? 'alert-success' : 'alert-danger'" x-text="user.alertText"></p>
                            </div>

                        </div>

                    </div>
                </template>
            </div>


            <div class='row no-gutters my-1' x-show="users.length">
                <button type='button' class='btn btn-sm btn-secondary full'>Refresh</button>
            </div>

        </div>

    @else

        <div class='row no-gutters my-1'>
            <p>Invite your friends to collaborate on this calendar!</p>
            <p class='m-0'><a href="{{ route('subscription.pricing') }}" target="_blank">Subscribe now</a> to unlock this feature!</p>
        </div>

    @endif

</x-sidebar.collapsible>