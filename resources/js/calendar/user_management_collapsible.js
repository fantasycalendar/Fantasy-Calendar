import axios from "axios";
import { get_calendar_users } from "./calendar_ajax_functions"

export default () => ({
    reordering: false,
    users: [],

    load: function(static_data) {
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

    removeUser(id) {
        console.log("Would remove user " + id);
    },

    updateUserRole(id, role) {
        console.log("Would updateuser id")
    }
})
