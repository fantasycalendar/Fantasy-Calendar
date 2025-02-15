import axios from "axios";
import { get_calendar_users } from "./calendar_ajax_functions"
import Swal from "sweetalert2";

export default () => ({
    reordering: false,
    users: [],
    invite_email: "",
    invite_status: "",
    invite_enabled: true,

    load: function(static_data) {
        this.loadUsers();
    },

    loadUsers() {
        axios.get(this.$store.calendar.api_url("/calendar/:hash/users"))
            .then(function(response) {
                this.users = response.data;
            }.bind(this))
            .catch(function(error) {
                this.$dispatch('notify', {
                    title: 'Oops!',
                    body: 'An error occurred, please try again later.',
                    icon: 'fa-exclamation-triangle',
                    icon_color: 'text-red-500'
                });
            });
    },

    inviteUser() {
        this.invite_enabled = false;

        axios.post(this.$store.calendar.api_url("/calendar/:hash/inviteUser"), {
            email: this.invite_email
        }).then(result => {
            this.invite_status = `Sent email to ${this.invite_email}!`;
            this.invite_email = "";
        }).catch(error => {
            console.log(error);

            this.invite_status = error.response.data.errors.email[0];
        }).finally(() => {
            setTimeout(() => {
                this.invite_status = "";
                this.invite_enabled = true;
            }, 2000);

            this.loadUsers();
        });
    },

    removeInvite(invited_email) {
        Swal.fire({
            title: "Removing User",
            html: `<p>Are you sure you want to cancel your invitation to <strong>${invited_email}</strong>?</p>`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel',
            icon: "warning"
        }).then((result) => {
            if (result.dismiss) {
                return;
            }

            axios.post(this.$store.calendar.api_url("/calendar/:hash/removeUser"), {
                email: invited_email,
            }).then((response) => {
                this.loadUsers();
            }).catch(function(error) {
                this.$dispatch('notify', {
                    title: 'Oops!',
                    body: 'An error occurred, please try again later.',
                    icon: 'fa-exclamation-triangle',
                    icon_color: 'text-red-500'
                });
            });
        });
    },

    removeUser(user_id) {
        let user_name = this.users.find(user => user.id == user_id).username;

        Swal.fire({
            title: "Removing User",
            html: `<p>Are you sure you want to remove <strong>${user_name}</strong> from this calendar?</p>`,
            input: 'checkbox',
            inputPlaceholder: 'Remove all of their contributions as well',
            inputClass: "form-control",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel',
            icon: "warning"
        }).then((result) => {
            if (result.dismiss) {
                return;
            }

            axios.post(this.$store.calendar.api_url("/calendar/:hash/removeUser"), {
                user_id,
                remove_all: result.value == 1,
            }).then((response) => {
                this.loadUsers();
            }).catch(function(error) {
                this.$dispatch('notify', {
                    title: 'Oops!',
                    body: 'An error occurred, please try again later.',
                    icon: 'fa-exclamation-triangle',
                    icon_color: 'text-red-500'
                });
            });
        });

    },

    updateUserRole(user_id, user_role, output) {
        axios.post(
            this.$store.calendar.api_url("/calendar/:hash/changeUserRole"),
            { user_role, user_id },
        ).then(function(result) {
            output(true, 'Updated permissions!');
        }).catch(function(error) {
            output(false, error.response.data.message);
        });
    }
})
