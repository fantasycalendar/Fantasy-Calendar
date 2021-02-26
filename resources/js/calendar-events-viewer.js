const calendar_events_editor = require("./calendar-events-editor");

const calendar_events_viewer = {

	open: false,
	era: false,
	user_can_comment: false,
	can_comment_on_event: false,
	loading_comments: true,
	id: -1,
	db_id: false,
	data: {},
	comments: [],
    comment_editor_content: "",

	has_initialized: false,
	swal_content: {
		title: "Cancel comment?",
		text: "You haven't posted your comment yet, are you sure you want to continue?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'OK',
	},
	init() {

		/* Some scripts are loaded after Alpine, so we need to set everything up when the UI is first opened */
		if (!this.has_initialized) {

			this.comment_input = $(this.$refs.comment_input);

			this.comment_input.trumbowyg({
				btns: [
					['strong', 'em', 'del'],
					['superscript', 'subscript'],
					['link'],
					['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					['unorderedList', 'orderedList'],
					['removeformat']
				]
			});


			this.has_initialized = true;

		}

	},

	view_event($event){

		this.init();

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
		console.log(JSON.parse(JSON.stringify(this.comments)));
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
		this.comment_input.trumbowyg('html', '')
	},

	submit_comment(){
		let comment_content = this.comment_input.trumbowyg('html');
		submit_new_comment(comment_content, this.db_id, function(comment){
			window.dispatchEvent(new CustomEvent('event-viewer-modal-add-comment', { detail: { comment: comment } }));
		});
	},

	start_edit_comment(comment) {

		this.cancel_edit_comment();

		this.comment_editor_content = comment.content;
		comment.editing = true;

		console.log(JSON.parse(JSON.stringify(comment)));
	},

	submit_edit_comment(comment) {
		if(comment.content === ""){
			$.notify("Comment cannot be empty.");
			return;
		}

		console.log(JSON.parse(JSON.stringify(comment)));

        axios.patch(window.baseurl+"api/eventcomment/"+comment.id, {
            content: this.comment_editor_content
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
            }).then(() => { this.edit_comment_success(comment) });
	},

    edit_comment_success(comment) {
        comment.content = this.comment_editor_content;
        this.cancel_edit_comment();
    },

	cancel_edit_comment() {
        for (let entry in this.comments){
            this.comments[entry].editing = false;
        }
    },

	delete_comment(index) {
		let comment = this.comments[index];
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

		if (this.comment_input.trumbowyg('html').length > 0) {
			swal.fire(swal_content).then((result) => {
				if (!result.dismiss) {
					window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id } }));
					this.close();
				}
			});
		} else {
			window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id } }));
			this.close();
		}

	},

	callback_do_close: function() {

		if (this.comment_input.trumbowyg('html').length > 0) {
			swal.fire(swal_content).then((result) => {
				if (!result.dismiss) {
					this.close();
				}
			});
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
		this.comment_input.trumbowyg('html', '');
		this.loading_comments = true;

	},

}

module.exports = calendar_events_viewer;
