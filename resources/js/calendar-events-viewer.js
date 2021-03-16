const calendar_events_viewer = {

	open: false,
	can_edit: false,
	era: false,
	user_can_comment: false,
	can_comment_on_event: false,
	loading_comments: true,
	comment_content: "",
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

	view_event($event){

		this.id = $event.detail.id;
		this.era = $event.detail.era;

		if(this.era){
			this.data = static_data.eras[this.id];
		}else{
			this.data = events[this.id];
			this.db_id = this.data.id !== undefined ? this.data.id : false;
		}

		this.open = true;
		this.user_can_comment = Perms.user_can_comment();
		this.can_comment_on_event = this.db_id !== false;
		this.can_edit = Perms.can_modify_event(this.id);

		if (this.user_can_comment && this.can_comment_on_event){
			document.querySelectorAll('#event_comment_input_container .ProseMirror')[0].innerHTML = "";
		}

		if(this.db_id) {
			this.get_event_comments();
		}else{
			this.loading_comments = false;
		}

	},

	get_event_comments(){

		get_event_comments(this.db_id, function(comments){
			if (comments) {
				window.dispatchEvent(new CustomEvent('event-viewer-modal-load-comments', { detail: { comments: comments }}));
				this.loading_comments = false;
			} else {
				this.loading_comments = false;
			}
		});

	},

	load_comments($event) {
		let comments = $event.detail.comments;
		this.comments = []
		for(let index in comments){
			let comment = comments[index];
			this.comments.push({
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
			id: comment.id,
			date: comment.date,
			comment_owner: comment.comment_owner,
			calendar_owner: comment.calendar_owner,
			content: comment.content,
			username: `${comment.username}${comment.comment_owner ? " (you)" : (comment.calendar_owner ? " (owner)" : "")}`,
			editing: false
		})
	},

	submit_comment() {
		let comment_content = this.comment_content;
		submit_new_comment(comment_content, this.db_id, function(comment){
			window.dispatchEvent(new CustomEvent('event-viewer-modal-add-comment', { detail: { comment: comment } }));
		});
		this.comment_content = "";
	},

	start_edit_comment(comment) {
		this.cancel_edit_comment();

		comment.editing = true;
	},

	submit_edit_comment(comment) {
        let comment_content = comment.content;

		if(comment_content == "" || comment_content == "<p><br></p>"){
			$.notify("Comment cannot be empty.");
			return;
		}

        axios.patch(window.baseurl+"api/eventcomment/"+comment.id, {
            content: comment_content
        })
            .then(function (result){
                console.log(result)
                if(result.data.success && result.data != "") {
                    $.notify(
                        "Comment edited.",
                        "success"
                    );
                } else if(result.data === ""){
                    $.notify(
                        "Error editing comment."
                    );
                } else {
                    $.notify(
                        result.data.message
                    );
                }
            }).then(() => { this.edit_comment_success(comment, comment_content) });
	},

    edit_comment_success(comment, comment_content) {
        comment.content = comment_content;
        this.cancel_edit_comment();
    },

	cancel_edit_comment() {
        for (let entry in this.comments){
            this.comments[entry].editing = false;
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

	callback_do_edit: function() {

		if (!this.user_can_comment) {
			window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id } }));
			this.close();
		}else{
			if(this.comment_content != "" && this.comment_content != "<p><br></p>") {
				swal.fire(this.swal_content).then((result) => {
					if (!result.dismiss) {
						window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id } }));
						this.close();
					}
				});
			}else{
				window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id } }));
				this.close();
			}
		}

	},

	callback_do_close: function() {

		if (!this.user_can_comment) {
			this.close();
		}else{
			if (this.comment_content != "" && this.comment_content != "<p><br></p>") {
				swal.fire(this.swal_content).then((result) => {
					if (!result.dismiss) {
						this.close();
					}
				});
			} else {
				this.close();
			}
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
		this.comment_content = "";

	}

}

module.exports = calendar_events_viewer;
