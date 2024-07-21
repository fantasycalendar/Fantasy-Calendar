import Quill from "quill";
import { submit_new_comment, submit_delete_comment, get_event_comments } from "./calendar/calendar_ajax_functions";
import { clone } from "./calendar/calendar_functions";

export default () => ({

    open: false,
    can_edit: false,
    era: false,
    user_can_comment: false,
    can_comment_on_event: false,
    loading_comments: true,
    editing_comment_content: '',
    new_comment_content: '',
    event_editor: null,
    id: -1,
    db_id: false,
    data: {},
    comments: [],

    swal_content: {
        title: "Cancel comment?",
        text: "You haven't posted your comment yet, are you sure you want to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'OK',
    },

    view_event($event) {
        let event_index = $event.detail.event_id;

        if ($event.detail.event_db_id !== undefined) {
            event_index = window.events.findIndex((item) => item.id === $event.detail.event_db_id);
        }

        this.id = event_index;
        this.era = $event.detail.era ?? false;
        this.epoch = $event.detail.epoch;

        if (this.era) {
            this.data = clone(window.static_data.eras[this.id]);
        } else {
            this.data = clone(window.events[this.id]);
            this.db_id = this.data.id !== undefined ? this.data.id : false;
        }
        if (this.data.description == "") {
            this.data.description = "<i>No description.</i>"
        }

        this.open = true;
        this.user_can_comment = Perms.user_can_comment();
        this.can_comment_on_event = this.db_id !== false;
        this.can_edit = Perms.can_modify_event(this.id);

        // if (!this.comment_editor) {
        // }

        if (this.user_can_comment && this.can_comment_on_event) {
            // this.comment_editor.trumbowyg('html', '');
        }

        if (this.db_id) {
            this.get_event_comments();
        } else {
            this.loading_comments = false;
        }

    },

    get_event_comments() {

        if (this.era) {
            return;
        }

        get_event_comments(this.db_id, function(comments) {
            if (comments) {
                this.$dispatch('event-viewer-modal-load-comments', { comments: comments } );
            }

            this.loading_comments = false;
        }.bind(this));

    },

    load_comments($event) {
        let comments = $event.detail.comments;
        this.comments = []
        for (let index in comments) {
            let comment = comments[index];
            this.comments.push({
                index: index,
                id: comment.id,
                date: comment.date,
                comment_owner: comment.comment_owner,
                calendar_owner: comment.calendar_owner,
                content: comment.content,
                username: `${comment.username}${comment.comment_owner ? " (you)" : (comment.calendar_owner ? " (owner)" : "")}`,
                editing: false,
                can_delete: Perms.user_can_delete_comment(comment)
            })
        }
        this.loading_comments = false;
    },

    add_comment($event) {
        let comment = $event.detail.comment;
        this.comments.push({
            index: this.comments.length,
            id: comment.id,
            date: comment.date,
            comment_owner: comment.comment_owner,
            calendar_owner: comment.calendar_owner,
            content: comment.content,
            username: `${comment.username}${comment.comment_owner ? " (you)" : (comment.calendar_owner ? " (owner)" : "")}`,
            editing: false,
            editor: undefined,
            can_delete: true,
        })
    },

    submit_comment() {
        submit_new_comment(this.new_comment_content, this.db_id, function(comment) {
            this.$dispatch('event-viewer-modal-add-comment', { comment: comment });
        }.bind(this));

        this.new_comment_content = '';
    },

    start_edit_comment(comment) {
        this.cancel_edit_comment();
        comment.editing = true;

        this.event_editor = new Quill(
            document.querySelector(`#comment-editor-${comment.index} > div`),
            {
                theme: 'snow',
                placeholder: 'Compose an epic...',
            },
        );

        this.event_editor.root.innerHTML = comment.content;

        this.event_editor.on('text-change', () => {
            this.editing_comment_content = this.event_editor.root.innerHTML;
        })
    },

    submit_edit_comment(comment) {

        if (this.editing_comment_content == "" || this.editing_comment_content == "<p><br></p>") {
            this.delete_comment(comment);

            return;
        }

        axios.patch(window.apiurl + "/eventcomment/" + comment.id, {
            content: this.editing_comment_content
        })
            .then(function(result) {
                if (result.data.success && result.data != "") {
                    $.notify(
                        "Comment edited.",
                        "success"
                    );
                } else if (result.data === "") {
                    $.notify(
                        "Error editing comment."
                    );
                } else {
                    $.notify(
                        result.data.message
                    );
                }
            }).then(() => { this.edit_comment_success(comment, this.editing_comment_content) });
    },

    edit_comment_success(comment, editing_comment_content) {
        comment.content = editing_comment_content;
        this.cancel_edit_comment();
    },

    cancel_edit_comment() {
        this.event_editor = null;

        for (let entry in this.comments) {
            this.comments[entry].editing = false;
            document.querySelector(`#comment-editor-${this.comments[entry].index}`).innerHTML = "<div></div>";
        }
    },

    delete_comment(comment) {
        let index = this.comments.indexOf(comment);
        let event_viewer_ui = this;
        swal.fire({
            title: "Delete comment?",
            text: "Are you sure you want to delete this comment? This is irreversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then((result) => {
            if (!result.dismiss) {
                submit_delete_comment(comment.id, function() {
                    $.notify(
                        "Removed comment.",
                        "success"
                    );
                    event_viewer_ui.comments.splice(index, 1);
                });
            }
        });
    },

    confirm_clone: function() {

        if (this.user_can_comment && this.can_comment_on_event) {
            if (this.new_comment_content != "" && this.new_comment_content != "<p><br></p>" && this.edit_comment_content != "" && this.edit_comment_content != "<p><br></p>") {
                swal.fire(this.swal_content).then((result) => {
                    if (!result.dismiss) {
                        this.dispatch_clone();
                    }
                });
            } else {
                this.dispatch_clone();
            }
        } else {
            this.dispatch_clone();
        }

    },

    dispatch_clone() {
        this.$dispatch('event-editor-modal-clone-event', { event_id: this.id, epoch: this.epoch });
        this.close();
    },

    confirm_edit: function() {

        if (this.user_can_comment && this.can_comment_on_event) {
            if (this.new_comment_content != "" && this.new_comment_content != "<p><br></p>" && this.edit_comment_content != "" && this.edit_comment_content != "<p><br></p>") {
                swal.fire(this.swal_content).then((result) => {
                    if (!result.dismiss) {
                        this.dispatch_edit();
                    }
                });
            } else {
                this.dispatch_edit();
            }
        } else {
            this.dispatch_edit();
        }

    },

    dispatch_edit: function() {
        if (this.era) {
            this.$dispatch('html-editor-modal-edit-html', { era_id: this.id } );
        } else {
            this.$dispatch('event-editor-modal-edit-event', { event_id: this.id, epoch: this.epoch } );
        }
        this.close();
    },

    confirm_close: function($event) {
        const possibleTrumbowyg = [$event.target.id, $event.target.parentElement?.id].concat(
            Array.from($event.target?.classList),
            Array.from($event.target?.parentElement?.classList ?? []),
            Array.from($event.target?.parentElement?.parentElement?.classList ?? []),
        );

        if (possibleTrumbowyg.some(entry => entry.startsWith('trumbowyg-'))) return false;

        // Don't do anything if a swal is open.
        if (swal.isVisible()) {
            return false;
        }

        if (this.user_can_comment && this.can_comment_on_event) {
            if (this.new_comment_content != "" && this.new_comment_content != "<p><br></p>" && this.edit_comment_content != "" && this.edit_comment_content != "<p><br></p>") {
                swal.fire(this.swal_content).then((result) => {
                    if (!result.dismiss) {
                        this.close();
                    }
                });
            } else {
                this.close();
            }
        } else {
            this.close();
        }

    },

    close() {

        this.open = false;
        this.era = false;
        this.id = -1;
        this.db_id = false;
        this.data = {};
        this.comments = [];
        this.loading_comments = true;
        if (this.user_can_comment && this.can_comment_on_event) {
            // this.comment_editor.trumbowyg('html');
        }

    }

})
