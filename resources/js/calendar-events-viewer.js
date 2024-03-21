const calendar_events_viewer = {

	open: false,
	can_edit: false,
	era: false,
	user_can_comment: false,
	can_comment_on_event: false,
	loading_comments: true,
	comment_editor: undefined,
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
        let event_index = $event.detail.event_id;

        if ($event.detail.event_db_id !== undefined) {
            event_index = events.findIndex((item) => item.id === $event.detail.event_db_id);
        }

		this.id = event_index;
		this.era = $event.detail.era ?? false;
		this.epoch = $event.detail.epoch;

		if(this.era){
			this.data = clone(static_data.eras[this.id]);
		}else{
			this.data = clone(events[this.id]);
			this.db_id = this.data.id !== undefined ? this.data.id : false;
		}
		if(this.data.description == ""){
			this.data.description = "<i>No description.</i>"
		}

		this.open = true;
		this.user_can_comment = Perms.user_can_comment();
		this.can_comment_on_event = this.db_id !== false;
		this.can_edit = Perms.can_modify_event(this.id);

		if (!this.comment_editor){
			this.comment_editor = $(this.$refs.trumbowyg_comment_input);
			this.comment_editor.trumbowyg({
				btns: [
					['strong', 'em', 'del'],
					['superscript', 'subscript'],
					['link'],
					['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					['unorderedList', 'orderedList'],
					['removeformat']
				]
			});
		}

		if (this.user_can_comment && this.can_comment_on_event){
			this.comment_editor.trumbowyg('html', '');
		}

		if(this.db_id) {
			this.get_event_comments();
		}else{
			this.loading_comments = false;
		}

	},

	get_event_comments(){

		if(this.era){
			return;
		}

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
			editor: undefined
		})
	},

	submit_comment() {
		let comment_content = this.comment_editor.trumbowyg('html');
		submit_new_comment(comment_content, this.db_id, function(comment){
			window.dispatchEvent(new CustomEvent('event-viewer-modal-add-comment', { detail: { comment: comment } }));
		});
		this.comment_editor.trumbowyg('html', '');
	},

	start_edit_comment(comment) {
		this.cancel_edit_comment();
		comment.editing = true;
        const element = $(document.getElementById(`comment-editor-${comment.index}`))
		element.trumbowyg({
			btns: [
				['strong', 'em', 'del'],
				['superscript', 'subscript'],
				['link'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
				['unorderedList', 'orderedList'],
				['removeformat']
			]
		}).trumbowyg('html', comment.content);
        comment.editor = element;
    },

	submit_edit_comment(comment) {

        let comment_content = comment.editor.trumbowyg('html');

		if(comment_content == "" || comment_content == "<p><br></p>"){
			$.notify("Comment cannot be empty.");
			return;
		}

        axios.patch(window.apiurl+"/eventcomment/"+comment.id, {
            content: comment_content
        })
            .then(function (result){
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
            if(this.comments[entry].editor){
				this.comments[entry].editor.trumbowyg('destroy');
				this.comments[entry].editor = undefined;
			};
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

	confirm_clone: function() {

		if (this.user_can_comment && this.can_comment_on_event) {
			let comment_content = this.comment_editor.trumbowyg('html');
			if (comment_content != "" && comment_content != "<p><br></p>") {
				swal.fire(this.swal_content).then((result) => {
					if (!result.dismiss) {
						this.dispatch_clone();
					}
				});
			} else {
				this.dispatch_clone();
			}
		}else{
			this.dispatch_clone();
		}

	},

    dispatch_clone(){
	    window.dispatchEvent(new CustomEvent('event-editor-modal-clone-event', { detail: { event_id: this.id, epoch: this.epoch } }));
        this.close();
    },

	confirm_edit: function() {

		if (this.user_can_comment && this.can_comment_on_event) {
			let comment_content = this.comment_editor.trumbowyg('html');
			if (comment_content != "" && comment_content != "<p><br></p>") {
				swal.fire(this.swal_content).then((result) => {
					if (!result.dismiss) {
						this.dispatch_edit();
					}
				});
			} else {
				this.dispatch_edit();
			}
		}else{
			this.dispatch_edit();
		}

	},

	dispatch_edit: function(){
		if (this.era) {
			window.dispatchEvent(new CustomEvent('html-editor-modal-edit-html', { detail: { era_id: this.id } }));
		} else {
			window.dispatchEvent(new CustomEvent('event-editor-modal-edit-event', { detail: { event_id: this.id, epoch: this.epoch } }));
		}
		this.close();
	},

	confirm_close: function($event) {
        const possibleTrumbowyg = [$event.target.id, $event.target.parentElement?.id].concat(
            Array.from($event.target?.classList),
            Array.from($event.target?.parentElement?.classList ?? []),
            Array.from($event.target?.parentElement?.parentElement?.classList ?? []),
        );

        if(possibleTrumbowyg.some(entry => entry.startsWith('trumbowyg-'))) return false;

        // Don't do anything if a swal is open.
        if(swal.isVisible()) {
            return false;
        }

        if (this.user_can_comment && this.can_comment_on_event) {
			let comment_content = this.comment_editor.trumbowyg('html');
			if (comment_content != "" && comment_content != "<p><br></p>") {
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
		if(this.user_can_comment && this.can_comment_on_event) {
			this.comment_editor.trumbowyg('html');
		}

	}

}

export default calendar_events_viewer;
